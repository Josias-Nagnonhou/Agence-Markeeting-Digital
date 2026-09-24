export interface BetRow {
  id: string;
  match_label: string;
  market: string;
  odds: number;
  stake: number;
  result: "gagne" | "perdu" | "en_attente" | "annule";
  placed_at: string;
  settled_at: string | null;
}

export interface BetStats {
  totalStaked: number;
  totalReturns: number;
  net: number;
  winRate: number;
  settledCount: number;
  pendingCount: number;
  bestMarket: { market: string; winRate: number; count: number } | null;
  monthlyEvolution: { date: string; net: number }[];
}

export function computeBetStats(bets: BetRow[]): BetStats {
  const settled = bets.filter((b) => b.result === "gagne" || b.result === "perdu");
  const totalStaked = settled.reduce((sum, b) => sum + b.stake, 0);
  const totalReturns = settled
    .filter((b) => b.result === "gagne")
    .reduce((sum, b) => sum + b.stake * b.odds, 0);
  const net = totalReturns - totalStaked;
  const won = settled.filter((b) => b.result === "gagne").length;
  const winRate = settled.length === 0 ? 0 : (won / settled.length) * 100;

  const byMarket: Record<string, { won: number; total: number }> = {};
  for (const b of settled) {
    byMarket[b.market] = byMarket[b.market] || { won: 0, total: 0 };
    byMarket[b.market].total += 1;
    if (b.result === "gagne") byMarket[b.market].won += 1;
  }
  let bestMarket: BetStats["bestMarket"] = null;
  for (const [market, s] of Object.entries(byMarket)) {
    const rate = (s.won / s.total) * 100;
    if (!bestMarket || rate > bestMarket.winRate) {
      bestMarket = { market, winRate: rate, count: s.total };
    }
  }

  const sorted = [...settled].sort(
    (a, b) => new Date(a.settled_at ?? a.placed_at).getTime() - new Date(b.settled_at ?? b.placed_at).getTime(),
  );
  let running = 0;
  const monthlyEvolution = sorted.map((b) => {
    running += b.result === "gagne" ? b.stake * b.odds - b.stake : -b.stake;
    return {
      date: new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" }).format(
        new Date(b.settled_at ?? b.placed_at),
      ),
      net: Math.round(running),
    };
  });

  return {
    totalStaked,
    totalReturns,
    net,
    winRate,
    settledCount: settled.length,
    pendingCount: bets.filter((b) => b.result === "en_attente").length,
    bestMarket,
    monthlyEvolution,
  };
}
