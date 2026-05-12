import { Users } from 'lucide-react';

const TEAM = [
  { name: 'Olivia Chen Jr.', role: 'IR Analyst',  region: 'United States — Tri-State', accounts: 28, intros: 6,  initials: 'OC-JR' },
  { name: 'Sarah Lee',       role: 'IR Director', region: 'United States — Northeast/SE/WC', accounts: 64, intros: 14, initials: 'SL' },
  { name: 'Olivia Chen',     role: 'IR Director', region: 'United States — Midwest', accounts: 42, intros: 7,  initials: 'OC' },
  { name: 'Brian Miller',    role: 'IR Manager',  region: 'United States — Southwest / Mexico', accounts: 38, intros: 5,  initials: 'BM' },
  { name: 'Sam Krause',      role: 'IR Manager',  region: 'Canada', accounts: 22, intros: 4,  initials: 'SK' },
  { name: 'Lucas Pereira',   role: 'IR Associate',region: 'Latin America', accounts: 28, intros: 3,  initials: 'LP' },
  { name: 'Anna Park-Rivera',role: 'Head of EMEA',region: 'EMEA', accounts: 88, intros: 18, initials: 'AP-RM' },
  { name: 'Catherine Chow',  role: 'Head of APAC',region: 'APAC', accounts: 71, intros: 11, initials: 'CC' },
];

export function CoverageView() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold text-slate-900 mb-1">Coverage</h2>
        <p className="text-sm text-slate-500 mb-6">
          Who covers which LPs across your IR team.
        </p>
        <div className="panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="text-left px-4 py-2 font-semibold">Member</th>
                <th className="text-left px-4 py-2 font-semibold">Region</th>
                <th className="text-right px-4 py-2 font-semibold">Accounts</th>
                <th className="text-right px-4 py-2 font-semibold">Warm intros</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TEAM.map((t) => (
                <tr key={t.name}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 grid place-items-center text-xs font-semibold">
                        {t.name
                          .split(' ')
                          .map((s) => s[0])
                          .join('')}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{t.name}</div>
                        <div className="text-xs text-slate-500">{t.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    <span className="inline-flex items-center gap-1.5">
                      <Users size={12} className="text-slate-400" />
                      {t.region}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-900">{t.accounts}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-900">{t.intros}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
