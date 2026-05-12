import { useMemo, useState } from 'react';
import { ArrowLeft, Download, Gem, Mail, MapPin, Phone, Plus, Save, X } from 'lucide-react';
import { useApp } from '../store';
import type { LP } from '../data/lps';

function formatAum(m: number) {
  if (m >= 1000) return `$${(m / 1000).toFixed(1)}B AUM`;
  return `$${m}M AUM`;
}

function initials(name: string) {
  return name
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
  'bg-sky-100 text-sky-700',
  'bg-teal-100 text-teal-700',
];

const colorFor = (id: string) => AVATAR_COLORS[(id.charCodeAt(id.length - 1) || 0) % AVATAR_COLORS.length];

export function LPGridView() {
  const { filteredLPs, setView, activeFilterChips, toggleFilter, selectedLPs, toggleLPSelection, clearLPSelection } = useApp();
  const [saveOpen, setSaveOpen] = useState(false);

  const groupedByCity = useMemo(() => {
    const groups = new Map<string, LP[]>();
    for (const lp of filteredLPs) {
      const key = `${lp.city}|${lp.country}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(lp);
    }
    return Array.from(groups.entries())
      .map(([k, lps]) => {
        const [city, country] = k.split('|');
        return { city, country, lps };
      })
      .sort((a, b) => b.lps.length - a.lps.length);
  }, [filteredLPs]);

  const exportCsv = () => {
    const subset = selectedLPs.size > 0 ? filteredLPs.filter((l) => selectedLPs.has(l.id)) : filteredLPs;
    const rows = [
      ['Company', 'Contact', 'Role', 'Email', 'Phone', 'Address', 'City', 'Country', 'AUM (USD M)', 'Warm intros', 'Company type'],
      ...subset.map((l) => [
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
    <div className="flex-1 overflow-y-auto bg-slate-50 min-h-0">
      <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur border-b border-slate-200">
        <div className="px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => setView('map')}
            className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 px-2.5 h-8 rounded-md hover:bg-slate-100"
          >
            <ArrowLeft size={14} /> Back to map
          </button>
          <div className="w-px h-5 bg-slate-200" />
          <div>
            <div className="text-sm font-semibold text-slate-900">
              {filteredLPs.length.toLocaleString()} LPs in region
            </div>
            <div className="text-xs text-slate-500">
              Grouped across {groupedByCity.length} {groupedByCity.length === 1 ? 'city' : 'cities'}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {selectedLPs.size > 0 && (
              <>
                <span className="text-xs text-slate-500">{selectedLPs.size} selected</span>
                <button
                  onClick={clearLPSelection}
                  className="text-xs text-slate-500 hover:text-slate-900 px-2 h-7 rounded hover:bg-slate-100"
                >
                  Clear
                </button>
              </>
            )}
            <button
              onClick={() => setSaveOpen(true)}
              className="text-sm text-slate-700 hover:text-slate-900 px-3 h-8 rounded-md border border-slate-200 hover:bg-slate-50 inline-flex items-center gap-1.5"
            >
              <Save size={14} /> Save search
            </button>
            <button
              onClick={exportCsv}
              className="text-sm bg-brand-600 text-white hover:bg-brand-700 px-3 h-8 rounded-md font-medium inline-flex items-center gap-1.5"
            >
              <Download size={14} />
              Export CSV
              {selectedLPs.size > 0 && (
                <span className="ml-0.5 px-1.5 rounded-full text-[10px] bg-white/20">{selectedLPs.size}</span>
              )}
            </button>
          </div>
        </div>

        {activeFilterChips.length > 0 && (
          <div className="px-6 pb-3 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
              Filters active
            </span>
            {activeFilterChips.map((c) => (
              <button
                key={`${c.group}-${c.option}`}
                onClick={() => toggleFilter(c.group, c.option)}
                className="inline-flex items-center gap-1 px-2.5 h-7 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-medium hover:bg-brand-100"
              >
                {c.option}
                <X size={12} />
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredLPs.length === 0 ? (
        <div className="p-12 text-center">
          <div className="text-slate-500 text-sm">No LPs match the current filters.</div>
          <button
            onClick={() => setView('map')}
            className="mt-3 text-sm text-brand-700 font-medium hover:underline"
          >
            Adjust filters
          </button>
        </div>
      ) : (
        <div className="p-6 space-y-8">
          {groupedByCity.map(({ city, country, lps }) => (
            <section key={`${city}-${country}`}>
              <header className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-brand-500" />
                <h2 className="text-base font-semibold text-slate-900">{city}</h2>
                <span className="text-xs text-slate-400">
                  · {country} · {lps.length} {lps.length === 1 ? 'LP' : 'LPs'}
                </span>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {lps.map((lp) => (
                  <LPCard
                    key={lp.id}
                    lp={lp}
                    selected={selectedLPs.has(lp.id)}
                    onToggle={() => toggleLPSelection(lp.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {saveOpen && <SaveSearchDialog onClose={() => setSaveOpen(false)} />}
    </div>
  );
}

function LPCard({ lp, selected, onToggle }: { lp: LP; selected: boolean; onToggle: () => void }) {
  const companyType = lp.tags.companyType?.[0];
  return (
    <div
      className={
        'panel p-4 transition ' + (selected ? 'ring-2 ring-brand-500 border-brand-300' : 'hover:border-slate-300')
      }
    >
      <div className="flex items-start gap-3">
        <div
          className={
            'w-10 h-10 rounded-full grid place-items-center text-sm font-semibold shrink-0 ' + colorFor(lp.id)
          }
        >
          {initials(lp.contact)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="font-semibold text-slate-900 truncate">{lp.contact}</div>
              <div className="text-xs text-slate-500 truncate">{lp.role}</div>
              <div className="text-xs text-slate-400 truncate">{lp.name}</div>
            </div>
            <label className="shrink-0 cursor-pointer p-1 -mr-1 -mt-1">
              <input
                type="checkbox"
                checked={selected}
                onChange={onToggle}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
            </label>
          </div>
          {lp.warmIntros > 0 && (
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100">
              <Gem size={11} />
              Warm intro
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
        <Row icon={<MapPin size={12} />} label="Address" value={lp.addressLine} />
        <div className="grid grid-cols-2 gap-2">
          <Row
            icon={<Mail size={12} />}
            label="Email"
            value={<a href={`mailto:${lp.email}`} className="text-brand-600 hover:underline truncate block">{lp.email}</a>}
          />
          <Row icon={<Phone size={12} />} label="Phone" value={lp.phone} />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {companyType && (
            <span className="chip bg-slate-100 text-slate-700">{companyType}</span>
          )}
          <span className="text-slate-500 font-medium">{formatAum(lp.aumUsd)}</span>
        </div>
        {lp.lastContactMonthsAgo !== null && (
          <span className="text-slate-400">Last: {lp.lastContactMonthsAgo} {lp.lastContactMonthsAgo === 1 ? 'month' : 'months'} ago</span>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
            Outreach history
          </div>
          <button className="text-xs text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-full px-2.5 h-6 inline-flex items-center gap-1">
            <Plus size={11} /> Log contact
          </button>
        </div>
        <div className="mt-2 text-xs text-slate-400">No contacts logged yet.</div>
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-slate-400 mt-0.5">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{label}</div>
        <div className="text-xs text-slate-700 truncate">{value}</div>
      </div>
    </div>
  );
}

function SaveSearchDialog({ onClose }: { onClose: () => void }) {
  const { saveSearch, region, selectedCountries, filters } = useApp();
  const activeFilterCount = Object.values(filters).reduce((s, v) => s + v.length, 0);
  const [name, setName] = useState(() => {
    const parts: string[] = [];
    if (region) parts.push(region.replace('-', ' '));
    if (selectedCountries.length) parts.push(`${selectedCountries.length} countries`);
    if (activeFilterCount) parts.push(`${activeFilterCount} filters`);
    return parts.length ? parts.join(' · ') : 'Untitled search';
  });

  return (
    <div className="fixed inset-0 z-30 bg-slate-900/30 grid place-items-center" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl border border-slate-200 w-[420px] p-5"
      >
        <div className="text-sm font-semibold text-slate-900 mb-1">Save search</div>
        <div className="text-xs text-slate-500 mb-4">
          Saves region, countries, and all active filters. Stored locally in your browser.
        </div>
        <label className="text-xs font-medium text-slate-600 block mb-1">Name</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 h-9 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="text-sm text-slate-600 px-3 h-8 rounded-md hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            disabled={!name.trim()}
            onClick={() => {
              saveSearch(name.trim());
              onClose();
            }}
            className="text-sm bg-brand-600 text-white px-3 h-8 rounded-md font-medium hover:bg-brand-700 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
