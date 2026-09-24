import { formatPercent } from "@/lib/utils";

export function RateBar({ label, won, total }: { label: string; won: number; total: number }) {
  const rate = total === 0 ? 0 : (won / total) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-muted">{label}</span>
        <span className="font-semibold text-ink">
          {formatPercent(rate)} <span className="font-normal text-ink-faint">({won}/{total})</span>
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-pitch-600">
        <div className="h-full bg-grass" style={{ width: `${rate}%` }} />
      </div>
    </div>
  );
}
