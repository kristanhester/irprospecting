import { Calendar, MapPin, Users } from 'lucide-react';

const EVENTS = [
  { name: 'iConnections Global Alts Miami', date: 'Jan 27–29, 2026', city: 'Miami, FL', attendees: 2400, type: 'Cap Intro' },
  { name: 'Berkshire Hathaway AGM', date: 'May 2, 2026', city: 'Omaha, NE', attendees: 40000, type: 'Conference' },
  { name: 'SuperReturn International', date: 'Jun 2–5, 2026', city: 'Berlin, DE', attendees: 5500, type: 'Conference' },
  { name: 'Milken Global Conference', date: 'May 4–7, 2026', city: 'Los Angeles, CA', attendees: 4500, type: 'Conference' },
  { name: 'AVCJ Private Equity Forum', date: 'Nov 11–13, 2026', city: 'Hong Kong', attendees: 1100, type: 'Conference' },
  { name: 'iConnections Funds for Food', date: 'Jun 17, 2026', city: 'New York, NY', attendees: 900, type: 'Cap Intro' },
];

export function EventsView() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold text-slate-900 mb-1">Upcoming events</h2>
        <p className="text-sm text-slate-500 mb-6">
          Cap intro conferences and industry events your LP targets are likely to attend.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {EVENTS.map((e) => (
            <div key={e.name} className="panel p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-slate-900">{e.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} />
                      {e.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} />
                      {e.city}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users size={12} />
                      {e.attendees.toLocaleString()}
                    </span>
                  </div>
                </div>
                <span className="chip bg-brand-50 text-brand-700">{e.type}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="text-xs px-2.5 h-7 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700">
                  View attendees
                </button>
                <button className="text-xs px-2.5 h-7 rounded-md bg-brand-600 text-white hover:bg-brand-700">
                  Track event
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
