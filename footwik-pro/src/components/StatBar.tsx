export function StatBar({
  label,
  home,
  away,
  format = (v: number) => v.toString(),
}: {
  label: string;
  home: number;
  away: number;
  format?: (v: number) => string;
}) {
  const total = home + away || 1;
  const homePct = (home / total) * 100;

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-ink-muted">
        <span className="font-semibold text-ink">{format(home)}</span>
        <span className="text-ink-faint">{label}</span>
        <span className="font-semibold text-ink">{format(away)}</span>
      </div>
      <div className="mt-1.5 flex h-1.5 w-full overflow-hidden rounded-full bg-pitch-600">
        <div className="bg-grass" style={{ width: `${homePct}%` }} />
        <div className="bg-gold" style={{ width: `${100 - homePct}%` }} />
      </div>
    </div>
  );
}
