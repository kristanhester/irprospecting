import { useState } from 'react';
import { ChevronRight, LayoutGrid, MapPin, Sparkles, X } from 'lucide-react';
import { useApp } from '../store';
import type { LP } from '../data/lps';

function formatAum(m: number) {
  if (m >= 1000) return `$${(m / 1000).toFixed(1)}B`;
  return `$${m}M`;
}

export function LPList() {
  const { filteredLPs, region, setView } = useApp();
  const [selected, setSelected] = useState<LP | null>(null);

  if (!region) return null;

  return (
    <div className="absolute top-3 left-3 z-10 panel w-80 max-h-[calc(100%-1.5rem)] flex flex-col">
      <div className="px-4 h-11 flex items-center justify-between border-b border-slate-100">
        <div>
          <div className="text-sm font-semibold text-slate-900">Matching LPs</div>
          <div className="text-[11px] text-slate-500">{filteredLPs.length} results</div>
        </div>
        <button
          onClick={() => setView('cards')}
          disabled={filteredLPs.length === 0}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 hover:bg-brand-50 px-2.5 h-7 rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <LayoutGrid size={12} />
          View LPs in region
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredLPs.slice(0, 50).map((lp) => (
          <button
            key={lp.id}
            onClick={() => setSelected(lp)}
            className="w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 grid place-items-center text-xs font-semibold shrink-0">
              {lp.contact
                .split(' ')
                .map((s) => s[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-slate-900 truncate">{lp.name}</div>
              <div className="text-xs text-slate-500 truncate">
                {lp.contact} · {lp.role}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                <span className="inline-flex items-center gap-0.5">
                  <MapPin size={10} />
                  {lp.city}, {lp.country}
                </span>
                <span>·</span>
                <span>{formatAum(lp.aumUsd)} AUM</span>
                {lp.warmIntros > 0 && (
                  <>
                    <span>·</span>
                    <span className="inline-flex items-center gap-0.5 text-emerald-700">
                      <Sparkles size={10} /> {lp.warmIntros} intro{lp.warmIntros === 1 ? '' : 's'}
                    </span>
                  </>
                )}
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-300 mt-1" />
          </button>
        ))}
        {filteredLPs.length === 0 && (
          <div className="p-6 text-center text-sm text-slate-500">
            No LPs match the current filters.
          </div>
        )}
        {filteredLPs.length > 50 && (
          <div className="px-4 py-2 text-[11px] text-slate-400 border-t border-slate-100">
            Showing 50 of {filteredLPs.length}. Refine filters to narrow further.
          </div>
        )}
      </div>

      {selected && <LPDrawer lp={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function LPDrawer({ lp, onClose }: { lp: LP; onClose: () => void }) {
  return (
    <div className="absolute inset-0 bg-white rounded-lg flex flex-col">
      <div className="px-4 h-11 flex items-center justify-between border-b border-slate-100">
        <div className="text-sm font-semibold text-slate-900 truncate">{lp.name}</div>
        <button onClick={onClose} className="p-1 rounded hover:bg-slate-100 text-slate-500">
          <X size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Contact</div>
          <div className="text-slate-900 font-medium">{lp.contact}</div>
          <div className="text-slate-500 text-xs">{lp.role}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Location" value={`${lp.city}, ${lp.country}`} />
          <Stat label="AUM" value={formatAum(lp.aumUsd)} />
          <Stat label="Warm intros" value={String(lp.warmIntros)} />
          <Stat label="Region" value={lp.region.replace('-', ' ')} />
        </div>
        {Object.entries(lp.tags).map(([k, v]) => (
          <div key={k}>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              {k}
            </div>
            <div className="flex flex-wrap gap-1">
              {(v as string[]).map((t) => (
                <span key={t} className="chip bg-slate-100 text-slate-700">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-slate-100 flex gap-2">
        <button className="flex-1 h-8 text-xs rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium">
          Add to roadshow
        </button>
        <button className="flex-1 h-8 text-xs rounded-md bg-brand-600 text-white hover:bg-brand-700 font-medium">
          Request intro
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">{label}</div>
      <div className="text-slate-900 capitalize">{value}</div>
    </div>
  );
}
