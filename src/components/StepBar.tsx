import { ChevronDown, Globe, MapPin, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { REGIONS } from '../data/regions';
import { groupedSubRegions, getSubRegion } from '../data/subregions';
import { useApp } from '../store';

export function StepBar() {
  const { region, setRegion, subRegion, setSubRegion, selectedCountries, clearCountries } = useApp();
  const [open, setOpen] = useState(false);

  const sub = getSubRegion(subRegion);
  const allGroups = useMemo(() => groupedSubRegions(null), []);
  // Group collapsed state — by default everything is expanded
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const triggerLabel = sub
    ? sub.label
    : region
    ? REGIONS.find((r) => r.id === region)?.label ?? 'Select coverage region'
    : 'Select coverage region';

  return (
    <div className="bg-white border-b border-slate-200 px-4 h-12 flex items-center gap-3">
      <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Step 1</div>
      <span className="text-slate-300">/</span>
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className={
            'inline-flex items-center gap-2 px-3 h-8 rounded-md text-sm font-medium border transition ' +
            (sub || region
              ? 'bg-brand-50 text-brand-700 border-brand-200'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50')
          }
        >
          <MapPin size={14} />
          {triggerLabel}
          <ChevronDown size={14} />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-full mt-1 z-20 w-[320px] bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
              <div className="px-3 h-10 flex items-center justify-between bg-slate-50 border-b border-slate-100">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  Coverage region
                </span>
                <button
                  onClick={() => {
                    setRegion('global');
                    setSubRegion(null);
                    setOpen(false);
                    clearCountries();
                  }}
                  className={
                    'inline-flex items-center gap-1 text-xs font-medium px-2 h-6 rounded ' +
                    (region === 'global' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-white border border-transparent hover:border-slate-200')
                  }
                >
                  <Globe size={12} /> World
                </button>
              </div>
              <div className="max-h-[440px] overflow-y-auto py-1">
                {allGroups.map((g) => {
                  const isCollapsed = collapsed[g.groupId];
                  return (
                    <div key={g.groupId}>
                      <button
                        onClick={() => setCollapsed((c) => ({ ...c, [g.groupId]: !c[g.groupId] }))}
                        className="w-full px-3 h-8 flex items-center justify-between text-left hover:bg-slate-50"
                      >
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                          {g.groupLabel}
                        </span>
                        <ChevronDown
                          size={12}
                          className={'text-slate-400 transition ' + (isCollapsed ? '-rotate-90' : '')}
                        />
                      </button>
                      {!isCollapsed && (
                        <ul className="pb-1">
                          {g.items.map((s) => {
                            const selected = subRegion === s.id;
                            return (
                              <li key={s.id}>
                                <button
                                  onClick={() => {
                                    setRegion(s.parent);
                                    setSubRegion(s.id);
                                    setOpen(false);
                                    clearCountries();
                                  }}
                                  className={
                                    'w-full pl-5 pr-3 py-1.5 text-left flex items-center gap-2.5 hover:bg-slate-50 ' +
                                    (selected ? 'bg-brand-50/60' : '')
                                  }
                                >
                                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                                  <span className={'flex-1 text-sm ' + (selected ? 'text-brand-700 font-medium' : 'text-slate-700')}>
                                    {s.label}
                                  </span>
                                  {s.owner && (
                                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 tabular-nums">
                                      {s.owner}
                                    </span>
                                  )}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
              {(region || subRegion) && (
                <button
                  onClick={() => {
                    setRegion(null);
                    setSubRegion(null);
                    clearCountries();
                    setOpen(false);
                  }}
                  className="w-full px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 border-t border-slate-100 text-left"
                >
                  Clear coverage region
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {sub && (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
          <span className={`w-1.5 h-1.5 rounded-full ${sub.dot}`} />
          {sub.groupLabel}
          {sub.owner && <span className="text-slate-400">· {sub.owner}</span>}
        </span>
      )}

      {region && !sub && (
        <>
          <span className="text-slate-300">/</span>
          <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Step 2</div>
          <span className="text-slate-300">/</span>
          <div className="text-sm text-slate-600">
            {selectedCountries.length === 0
              ? 'Drill down to a sub-region or click countries on the map'
              : `${selectedCountries.length} ${selectedCountries.length === 1 ? 'country' : 'countries'} selected`}
          </div>
          {selectedCountries.length > 0 && (
            <button
              onClick={clearCountries}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 px-2 h-7 rounded hover:bg-slate-100"
            >
              <X size={12} /> Clear
            </button>
          )}
        </>
      )}

      <div className="ml-auto flex items-center gap-2">
        {region && (
          <button
            onClick={() => {
              setRegion(null);
              setSubRegion(null);
              clearCountries();
            }}
            className="text-xs text-slate-500 hover:text-slate-900 px-2 h-7 rounded hover:bg-slate-100 inline-flex items-center gap-1"
          >
            <Globe size={12} /> Reset
          </button>
        )}
        {!region && <span className="text-sm text-slate-400">Select a region to begin</span>}
      </div>
    </div>
  );
}
