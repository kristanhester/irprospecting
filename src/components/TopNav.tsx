import { Bookmark, Briefcase, Calendar, Check, Download, Plane, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { useApp, type TabId } from '../store';

const TABS: Array<{ id: TabId; label: string; icon: React.ComponentType<{ size?: number }> }> = [
  { id: 'prospecting', label: 'IR Prospecting', icon: Briefcase },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'roadshows', label: 'Roadshows', icon: Plane },
  { id: 'coverage', label: 'Coverage', icon: Users },
];

export function TopNav() {
  const {
    activeTab,
    setActiveTab,
    filteredLPs,
    savedSearches,
    applySavedSearch,
    deleteSavedSearch,
    setView,
  } = useApp();
  const [savedOpen, setSavedOpen] = useState(false);

  const exportCsv = () => {
    if (!filteredLPs.length) return;
    const rows = [
      ['Company', 'Contact', 'Role', 'Email', 'Phone', 'Address', 'City', 'Country', 'AUM (USD M)', 'Warm intros', 'Company type'],
      ...filteredLPs.map((l) => [
        l.name,
        l.contact,
        l.role,
        l.email,
        l.phone,
        l.addressLine,
        l.city,
        l.country,
        String(l.aumUsd),
        String(l.warmIntros),
        (l.tags.companyType ?? []).join('; '),
      ]),
    ];
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lps-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="flex items-center gap-2 px-4 h-14">
        <div className="flex items-center gap-2 mr-4">
          <div className="w-7 h-7 rounded-md bg-brand-600 text-white grid place-items-center font-bold text-sm">IR</div>
          <span className="font-semibold text-slate-900">Prospect</span>
        </div>
        <nav className="flex items-center gap-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={
                  'inline-flex items-center gap-2 px-3 h-9 rounded-md text-sm font-medium transition ' +
                  (active
                    ? 'bg-brand-50 text-brand-700 border border-brand-200'
                    : 'text-slate-600 hover:bg-slate-100 border border-transparent')
                }
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setSavedOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 px-3 h-9 rounded-md hover:bg-slate-100"
            >
              <Bookmark size={14} />
              Saved searches
              {savedSearches.length > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                  {savedSearches.length}
                </span>
              )}
            </button>
            {savedOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSavedOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 w-80 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                  <div className="px-3 h-10 border-b border-slate-100 flex items-center">
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                      Saved searches
                    </span>
                  </div>
                  {savedSearches.length === 0 ? (
                    <div className="px-3 py-6 text-center text-sm text-slate-500">
                      No saved searches yet. Save a search from the LP list view to make it reusable.
                    </div>
                  ) : (
                    <ul className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {savedSearches.map((s) => (
                        <li key={s.id} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 group">
                          <button
                            onClick={() => {
                              applySavedSearch(s.id);
                              setActiveTab('prospecting');
                              setView('map');
                              setSavedOpen(false);
                            }}
                            className="flex-1 text-left min-w-0"
                          >
                            <div className="text-sm text-slate-900 font-medium truncate">{s.name}</div>
                            <div className="text-[11px] text-slate-500">
                              {new Date(s.createdAt).toLocaleDateString()} ·{' '}
                              {s.region ?? 'no region'}
                            </div>
                          </button>
                          <button
                            onClick={() => deleteSavedSearch(s.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                            aria-label="Delete saved search"
                          >
                            <Trash2 size={12} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
          <button
            onClick={exportCsv}
            disabled={filteredLPs.length === 0}
            className="inline-flex items-center gap-1.5 text-sm bg-brand-600 text-white hover:bg-brand-700 px-3 h-9 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={14} />
            Export list
            {filteredLPs.length > 0 && (
              <span className="ml-0.5 inline-flex items-center gap-0.5 px-1.5 rounded-full text-[10px] bg-white/20">
                <Check size={10} />
                {filteredLPs.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
