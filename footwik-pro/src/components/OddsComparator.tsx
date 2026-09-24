import { cn } from "@/lib/utils";

interface OddRow {
  bookmaker: string;
  market: string;
  pick: string;
  odd: number;
}

export function OddsComparator({ odds }: { odds: OddRow[] }) {
  if (odds.length === 0) {
    return (
      <p className="text-sm text-ink-faint">
        Les cotes de ce match ne sont pas encore disponibles.
      </p>
    );
  }

  const bookmakers = Array.from(new Set(odds.map((o) => o.bookmaker))).sort();
  const markets = Array.from(new Set(odds.map((o) => o.market)));

  return (
    <div className="space-y-6">
      {markets.map((market) => {
        const picks = Array.from(new Set(odds.filter((o) => o.market === market).map((o) => o.pick)));
        return (
          <div key={market}>
            <h3 className="mb-2 text-sm font-semibold text-ink">{market}</h3>
            <div className="overflow-x-auto rounded-lg border border-pitch-600">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead className="bg-pitch-600/50 text-xs uppercase text-ink-faint">
                  <tr>
                    <th className="px-3 py-2 font-medium">Sélection</th>
                    {bookmakers.map((b) => (
                      <th key={b} className="px-3 py-2 font-medium">{b}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-pitch-600">
                  {picks.map((pick) => {
                    const rowOdds = bookmakers.map(
                      (b) => odds.find((o) => o.market === market && o.pick === pick && o.bookmaker === b)?.odd,
                    );
                    const best = Math.max(...rowOdds.filter((v): v is number => typeof v === "number"));
                    return (
                      <tr key={pick} className="bg-pitch-800">
                        <td className="px-3 py-2 text-ink">{pick}</td>
                        {rowOdds.map((odd, i) => (
                          <td
                            key={i}
                            className={cn(
                              "px-3 py-2",
                              odd === best ? "font-bold text-gold" : "text-ink-muted",
                            )}
                          >
                            {odd?.toFixed(2) ?? "—"}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      <p className="text-xs text-ink-faint">
        Cotes à titre indicatif, sans lien d&apos;affiliation. La meilleure
        cote de chaque sélection est mise en évidence.
      </p>
    </div>
  );
}
