import { Calendar, Plane, Users } from 'lucide-react';

const ROADSHOWS = [
  { name: 'West Coast PE Tour', dates: 'Mar 2–6, 2026', cities: ['San Francisco', 'Los Angeles', 'Seattle'], meetings: 14, status: 'Planning' },
  { name: 'European LP Sweep', dates: 'Apr 13–24, 2026', cities: ['London', 'Paris', 'Zurich', 'Frankfurt', 'Amsterdam'], meetings: 22, status: 'Booked' },
  { name: 'Middle East GCC', dates: 'Sep 8–11, 2026', cities: ['Abu Dhabi', 'Dubai', 'Doha'], meetings: 9, status: 'Draft' },
];

export function RoadshowsView() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-1">Roadshows</h2>
            <p className="text-sm text-slate-500">Plan multi-city LP meeting tours.</p>
          </div>
          <button className="text-sm bg-brand-600 text-white hover:bg-brand-700 px-3 h-9 rounded-md font-medium inline-flex items-center gap-2">
            <Plane size={14} /> New roadshow
          </button>
        </div>
        <div className="panel divide-y divide-slate-100">
          {ROADSHOWS.map((r) => (
            <div key={r.name} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-700 grid place-items-center">
                <Plane size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-900">{r.name}</div>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={12} />
                    {r.dates}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users size={12} />
                    {r.meetings} meetings
                  </span>
                  <span className="truncate">{r.cities.join(' → ')}</span>
                </div>
              </div>
              <span
                className={
                  'chip ' +
                  (r.status === 'Booked'
                    ? 'bg-emerald-50 text-emerald-700'
                    : r.status === 'Planning'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-slate-100 text-slate-600')
                }
              >
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
