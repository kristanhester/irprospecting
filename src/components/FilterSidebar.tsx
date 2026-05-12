import { useState } from 'react';
import { ChevronDown, Filter, Plug, RotateCcw } from 'lucide-react';
import { FILTER_GROUPS, type FilterGroupId } from '../data/filters';
import { useApp } from '../store';
import { IntegrationsPanel } from './IntegrationsPanel';

export function FilterSidebar() {
  const { sidebarTab, setSidebarTab, filters, toggleFilter, clearFilters, totalActiveFilters } = useApp();
  const [open, setOpen] = useState<Record<FilterGroupId, boolean>>({
    companyType: true,
    strategy: true,
    geoInterest: false,
    role: false,
    aum: false,
    ticket: false,
    pacing: false,
    altsAllocation: false,
    directDeals: false,
    managerPreference: false,
    meetingPreference: false,
  });

  return (
    <aside className="w-80 shrink-0 bg-white border-l border-slate-200 flex flex-col h-full">
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setSidebarTab('filters')}
          className={
            'flex-1 inline-flex items-center justify-center gap-2 h-11 text-sm font-medium border-b-2 ' +
            (sidebarTab === 'filters'
              ? 'text-brand-700 border-brand-600'
              : 'text-slate-500 border-transparent hover:text-slate-800')
          }
        >
          <Filter size={14} /> Filters
          {totalActiveFilters > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-100 text-brand-700">
              {totalActiveFilters}
            </span>
          )}
        </button>
        <button
          onClick={() => setSidebarTab('integrations')}
          className={
            'flex-1 inline-flex items-center justify-center gap-2 h-11 text-sm font-medium border-b-2 ' +
            (sidebarTab === 'integrations'
              ? 'text-brand-700 border-brand-600'
              : 'text-slate-500 border-transparent hover:text-slate-800')
          }
        >
          <Plug size={14} /> Integrations
        </button>
      </div>

      {sidebarTab === 'filters' ? (
        <>
          <div className="flex items-center justify-between px-4 h-10 border-b border-slate-200 bg-slate-50">
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-500">
              {totalActiveFilters} active
            </div>
            <button
              onClick={clearFilters}
              disabled={totalActiveFilters === 0}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {FILTER_GROUPS.map((g) => {
              const isOpen = open[g.id];
              const selected = filters[g.id];
              return (
                <div key={g.id} className="border-b border-slate-100">
                  <button
                    onClick={() => setOpen({ ...open, [g.id]: !isOpen })}
                    className="w-full flex items-center justify-between px-4 h-11 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                        {g.label}
                      </span>
                      {selected.length > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-100 text-brand-700">
                          {selected.length}
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      size={14}
                      className={'text-slate-400 transition ' + (isOpen ? 'rotate-180' : '')}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-3 space-y-1">
                      {g.options.map((opt) => {
                        const checked = selected.includes(opt);
                        return (
                          <label
                            key={opt}
                            className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer py-1 hover:text-slate-900"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleFilter(g.id, opt)}
                              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <IntegrationsPanel />
      )}
    </aside>
  );
}
