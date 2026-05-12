import { useEffect, useMemo, useRef, useState } from 'react';
import { geoPath, geoIdentity, geoNaturalEarth1 } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import type { Topology } from 'topojson-specification';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { getRegion } from '../data/regions';
import { getSubRegion } from '../data/subregions';
import { numToAlpha2 } from '../data/iso';
import { CITY_COORDS, STATE_FIPS_TO_POSTAL } from '../data/cityCoords';
import { useApp } from '../store';

const WORLD_TOPO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
// Unprojected GeoJSON of US states (FIPS string ids + name)
const US_STATES_GEOJSON_URL = 'https://cdn.jsdelivr.net/gh/PublicaMundi/MappingAPI@master/data/geojson/us-states.json';

interface CountryFeature {
  type: 'Feature';
  id: string;
  properties: { name: string };
  geometry: Geometry;
}

interface StateFeature {
  type: 'Feature';
  id: string; // FIPS
  properties: { name: string };
  geometry: Geometry;
}

export function WorldMap() {
  const { region, subRegion, selectedCountries, toggleCountry, filteredLPs } = useApp();
  const [countries, setCountries] = useState<CountryFeature[] | null>(null);
  const [usStates, setUsStates] = useState<StateFeature[] | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [hoverState, setHoverState] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1000, h: 600 });

  useEffect(() => {
    setZoom(1);
  }, [subRegion]);

  // Load world topology
  useEffect(() => {
    let cancelled = false;
    fetch(WORLD_TOPO_URL)
      .then((r) => r.json())
      .then((topo: Topology) => {
        if (cancelled) return;
        const fc = feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry, { name: string }>;
        setCountries(fc.features as CountryFeature[]);
      })
      .catch((e) => console.error('Failed to load world atlas', e));
    return () => {
      cancelled = true;
    };
  }, []);

  // Determine whether a US sub-region is active (need state-level shapes)
  const subRegionDef = getSubRegion(subRegion);
  const isUSSubRegion = !!subRegionDef && subRegionDef.groupId === 'us';

  // Lazy-load US states GeoJSON the first time a US sub-region is selected
  useEffect(() => {
    if (!isUSSubRegion || usStates) return;
    let cancelled = false;
    fetch(US_STATES_GEOJSON_URL)
      .then((r) => r.json())
      .then((fc: FeatureCollection<Geometry, { name: string }>) => {
        if (cancelled) return;
        setUsStates(fc.features as StateFeature[]);
      })
      .catch((e) => console.error('Failed to load US states GeoJSON', e));
    return () => {
      cancelled = true;
    };
  }, [isUSSubRegion, usStates]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ w: width, h: height });
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const regionDef = getRegion(region);

  // LP counts per country (alpha-2) and per city
  const lpByCountry = useMemo(() => {
    const m = new Map<string, number>();
    for (const lp of filteredLPs) m.set(lp.country, (m.get(lp.country) ?? 0) + 1);
    return m;
  }, [filteredLPs]);

  const lpByCity = useMemo(() => {
    const m = new Map<string, { city: string; count: number; lng: number; lat: number }>();
    for (const lp of filteredLPs) {
      const coords = CITY_COORDS[lp.city];
      if (!coords) continue;
      const existing = m.get(lp.city);
      if (existing) existing.count++;
      else m.set(lp.city, { city: lp.city, count: 1, lng: coords[0], lat: coords[1] });
    }
    return Array.from(m.values());
  }, [filteredLPs]);

  // Project (lng, lat) → screen coordinates using the current projection
  const { projection, pathFn, viewBox } = useMemo(() => {
    if (!countries) return { projection: null as any, pathFn: null as any, viewBox: '0 0 1000 600' };

    if (subRegionDef) {
      const [w, s, e, n] = subRegionDef.bbox;
      const padX = (e - w) * 0.08;
      const padY = (n - s) * 0.08;
      const bboxFeature: Feature = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'MultiPoint',
          coordinates: [
            [w - padX, s - padY],
            [e + padX, s - padY],
            [e + padX, n + padY],
            [w - padX, n + padY],
          ],
        },
      };
      // geoIdentity is planar (no spherical interpretation, no antimeridian clipping).
      // We invert the Y-axis so increasing latitude maps to decreasing screen Y (north up).
      const proj = (geoIdentity() as any).reflectY(true).fitSize([size.w, size.h], bboxFeature);
      // Apply zoom by scaling around viewport center
      if (zoom !== 1) {
        const [tx, ty] = proj.translate();
        const cx = size.w / 2;
        const cy = size.h / 2;
        proj.scale(proj.scale() * zoom).translate([cx + (tx - cx) * zoom, cy + (ty - cy) * zoom]);
      }
      return { projection: proj, pathFn: geoPath(proj), viewBox: `0 0 ${size.w} ${size.h}` };
    }

    const proj = geoNaturalEarth1().fitSize([size.w, size.h], {
      type: 'FeatureCollection',
      features: countries,
    } as FeatureCollection);
    proj.scale(proj.scale() * zoom);
    return { projection: proj, pathFn: geoPath(proj), viewBox: `0 0 ${size.w} ${size.h}` };
  }, [countries, size, zoom, subRegionDef]);

  const getCountryColor = (iso2: string | undefined): { fill: string; stroke: string } => {
    if (!iso2) return { fill: '#e2e8f0', stroke: '#cbd5e1' };
    const inRegion = !regionDef || regionDef.countries.length === 0 || regionDef.countries.includes(iso2);
    const inSubRegion = !subRegionDef || !subRegionDef.countries || subRegionDef.countries.length === 0
      ? subRegionDef ? inRegion : true
      : subRegionDef.countries.includes(iso2);
    const selected = selectedCountries.includes(iso2);
    const count = lpByCountry.get(iso2) ?? 0;
    if (selected) return { fill: '#2563eb', stroke: '#1d4ed8' };
    if (!region) return { fill: '#e2e8f0', stroke: '#cbd5e1' };
    if (isUSSubRegion) return { fill: '#e2e8f0', stroke: '#cbd5e1' }; // US-states layer handles fills inside US
    if (subRegionDef && !inSubRegion) return { fill: '#f1f5f9', stroke: '#e2e8f0' };
    if (!subRegionDef && !inRegion) return { fill: '#f1f5f9', stroke: '#e2e8f0' };
    if (count === 0) return { fill: '#dbeafe', stroke: '#bfdbfe' };
    if (count < 5) return { fill: '#93c5fd', stroke: '#60a5fa' };
    if (count < 15) return { fill: '#60a5fa', stroke: '#3b82f6' };
    return { fill: '#3b82f6', stroke: '#2563eb' };
  };

  const subRegionStates = subRegionDef?.usStates ?? [];
  const getStateColor = (postal: string | undefined): { fill: string; stroke: string } => {
    if (!postal) return { fill: '#f1f5f9', stroke: '#e2e8f0' };
    if (subRegionStates.includes(postal)) return { fill: '#2563eb', stroke: '#1d4ed8' };
    return { fill: '#e2e8f0', stroke: '#cbd5e1' };
  };

  // Radius scaling for LP dots
  const maxCityCount = lpByCity.reduce((mx, c) => Math.max(mx, c.count), 0);
  const radiusFor = (count: number) => {
    if (maxCityCount === 0) return 0;
    const minR = 4;
    const maxR = 18;
    return minR + (maxR - minR) * Math.sqrt(count / maxCityCount);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-slate-50">
      {!region && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="panel max-w-sm p-6 text-center pointer-events-auto">
            <div className="text-slate-900 font-semibold mb-1">Select a coverage region</div>
            <p className="text-sm text-slate-500">
              Use the <span className="text-brand-700 font-medium">Step 1 → Select coverage region</span> dropdown in the top bar to choose a coverage area. Then click countries within that region.
            </p>
            <div className="mt-3 text-brand-600">↑</div>
          </div>
        </div>
      )}

      <div className="absolute top-3 right-3 z-10 flex flex-col bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
        <button onClick={() => setZoom((z) => Math.min(z * 1.25, 4))} className="w-8 h-8 grid place-items-center hover:bg-slate-50 border-b border-slate-200">
          <Plus size={14} />
        </button>
        <button onClick={() => setZoom((z) => Math.max(z / 1.25, 0.6))} className="w-8 h-8 grid place-items-center hover:bg-slate-50 border-b border-slate-200">
          <Minus size={14} />
        </button>
        <button onClick={() => setZoom(1)} title="Reset zoom" className="w-8 h-8 grid place-items-center hover:bg-slate-50 text-slate-500">
          <RotateCcw size={12} />
        </button>
      </div>

      {subRegionDef && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 panel px-3 py-1.5 inline-flex items-center gap-2 text-xs">
          <span className={`w-2 h-2 rounded-full ${subRegionDef.dot}`} />
          <span className="font-semibold text-slate-900">{subRegionDef.label}</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500">{subRegionDef.groupLabel}</span>
          {subRegionDef.owner && (
            <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-slate-100 text-slate-600">
              {subRegionDef.owner}
            </span>
          )}
        </div>
      )}

      {region && (
        <div className="absolute bottom-3 left-3 z-10 panel px-3 py-2 text-xs text-slate-600">
          <div className="font-semibold text-slate-700 mb-1">LPs per city</div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-white border-2 border-brand-500" />1–2</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-white border-2 border-brand-500" />3–5</span>
            <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-white border-2 border-brand-500" />6+</span>
          </div>
        </div>
      )}

      {countries && pathFn ? (
        <svg className="absolute inset-0" width="100%" height="100%" viewBox={viewBox} preserveAspectRatio="xMidYMid meet" style={{ overflow: 'hidden' }}>
          {/* Country layer */}
          <g>
            {countries.map((c, idx) => {
              const iso2 = numToAlpha2(c.id);
              const { fill, stroke } = getCountryColor(iso2);
              const d = pathFn(c as any);
              if (!d) return null;
              const isHover = hover === c.id;
              const clickable = !!region && !isUSSubRegion && (!regionDef || regionDef.countries.length === 0 || (iso2 && regionDef.countries.includes(iso2)));
              return (
                <path
                  key={`country-${idx}`}
                  d={d}
                  fill={isHover && clickable ? '#1d4ed8' : fill}
                  stroke={stroke}
                  strokeWidth={0.5}
                  onMouseEnter={() => setHover(c.id)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => { if (clickable && iso2) toggleCountry(iso2); }}
                  style={{ cursor: clickable ? 'pointer' : 'default', transition: 'fill 100ms' }}
                />
              );
            })}
          </g>

          {/* US states overlay (only when a US sub-region is active) */}
          {isUSSubRegion && usStates && (
            <g>
              {usStates.map((s, idx) => {
                const postal = STATE_FIPS_TO_POSTAL[s.id];
                const { fill, stroke } = getStateColor(postal);
                const d = pathFn(s as any);
                if (!d) return null;
                return (
                  <path
                    key={`state-${idx}`}
                    d={d}
                    fill={hoverState === s.id ? '#1d4ed8' : fill}
                    stroke={stroke}
                    strokeWidth={0.6}
                    onMouseEnter={() => setHoverState(s.id)}
                    onMouseLeave={() => setHoverState(null)}
                    style={{ transition: 'fill 120ms' }}
                  />
                );
              })}
            </g>
          )}

          {/* LP city dots */}
          {region && projection && (
            <g pointerEvents="none">
              {lpByCity.map(({ city, count, lng, lat }) => {
                const pt = projection([lng, lat]);
                if (!pt) return null;
                const [x, y] = pt;
                if (!isFinite(x) || !isFinite(y)) return null;
                if (x < -50 || y < -50 || x > size.w + 50 || y > size.h + 50) return null;
                const r = radiusFor(count);
                return (
                  <g key={`dot-${city}`}>
                    <circle cx={x} cy={y} r={r + 2} fill="rgba(37, 99, 235, 0.25)" />
                    <circle cx={x} cy={y} r={r} fill="white" stroke="#2563eb" strokeWidth={2} />
                    {count > 1 && (
                      <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={Math.max(9, r * 0.8)} fontWeight={600} fill="#1e3a8a">
                        {count}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* Country hover tooltip — only in world / non-US view */}
          {hover && !isUSSubRegion && (() => {
            const c = countries.find((x) => x.id === hover);
            if (!c) return null;
            const iso2 = numToAlpha2(c.id);
            const count = iso2 ? lpByCountry.get(iso2) ?? 0 : 0;
            const centroid = pathFn.centroid(c as any);
            if (!centroid || isNaN(centroid[0])) return null;
            return (
              <g transform={`translate(${centroid[0]}, ${centroid[1]})`} pointerEvents="none">
                <rect x={-60} y={-32} width={120} height={26} rx={4} fill="#0f172a" opacity={0.92} />
                <text x={0} y={-15} textAnchor="middle" fontSize={11} fill="white" fontWeight={600}>{c.properties.name}</text>
                <text x={0} y={-2} textAnchor="middle" fontSize={10} fill="#cbd5e1">{count} {count === 1 ? 'LP' : 'LPs'}</text>
              </g>
            );
          })()}

          {/* State hover tooltip */}
          {hoverState && usStates && (() => {
            const s = usStates.find((x) => x.id === hoverState);
            if (!s) return null;
            const centroid = pathFn.centroid(s as any);
            if (!centroid || isNaN(centroid[0])) return null;
            return (
              <g transform={`translate(${centroid[0]}, ${centroid[1]})`} pointerEvents="none">
                <rect x={-50} y={-24} width={100} height={20} rx={4} fill="#0f172a" opacity={0.92} />
                <text x={0} y={-10} textAnchor="middle" fontSize={11} fill="white" fontWeight={600}>{s.properties.name}</text>
              </g>
            );
          })()}
        </svg>
      ) : (
        <div className="w-full h-full grid place-items-center text-slate-400 text-sm">Loading world map…</div>
      )}
    </div>
  );
}
