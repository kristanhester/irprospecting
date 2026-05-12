import { useApp } from '../store';

function formatAum(m: number) {
  if (m >= 1000) return `$${(m / 1000).toFixed(1)}B`;
  return `$${Math.round(m)}M`;
}

export function StatsFooter() {
  const { filteredLPs, region } = useApp();

  const total = filteredLPs.length;
  const targets = filteredLPs.filter((l) => l.warmIntros > 0 || l.aumUsd >= 1000).length;
  const avgAum = total ? filteredLPs.reduce((s, l) => s + l.aumUsd, 0) / total : 0;
  const warmIntros = filteredLPs.reduce((s, l) => s + l.warmIntros, 0);

  const cells = region
    ? [
        { label: 'LPs in DB', value: total.toLocaleString() },
        { label: 'Targets', value: targets.toLocaleString() },
        { label: 'Avg AUM', value: total ? formatAum(avgAum) : '—' },
        { label: 'Warm intros', value: warmIntros.toLocaleString() },
      ]
    : [
        { label: 'LPs in DB', value: '—' },
        { label: 'Targets', value: '—' },
        { label: 'Avg AUM', value: '—' },
        { label: 'Warm intros', value: '—' },
      ];

  return (
    <div className="h-9 border-t border-slate-200 bg-white px-4 flex items-center gap-6 text-xs">
      {cells.map((c) => (
        <div key={c.label} className="flex items-center gap-1.5">
          <span className="text-slate-500">{c.label}:</span>
          <span className="font-semibold text-slate-900 tabular-nums">{c.value}</span>
        </div>
      ))}
    </div>
  );
}
