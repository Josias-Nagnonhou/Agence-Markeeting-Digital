import { MatchAnalysis } from "@/lib/types";

// Générateur d'odds déterministe (pas de vrais bookmakers tant que les
// matchs ne sont pas de vraies fixtures API-Football synchronisées —
// voir la contrainte technique #9 : une fois les fixtures réelles en
// base, ce module sera remplacé par un appel à l'endpoint /odds
// d'API-Football et les noms ci-dessous par les vrais bookmakers
// retournés par l'API).
const BOOKMAKERS = ["Bookmaker A", "Bookmaker B", "Bookmaker C", "Bookmaker D"];

export interface GeneratedOdd {
  matchId: string;
  bookmaker: string;
  market: string;
  pick: string;
  odd: number;
}

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

function seededOdd(seed: number, min: number, max: number): number {
  const x = Math.sin(seed) * 10000;
  const frac = x - Math.floor(x);
  return Math.round((min + frac * (max - min)) * 100) / 100;
}

export function generateOddsForMatch(match: MatchAnalysis): GeneratedOdd[] {
  const markets: { market: string; picks: string[] }[] = [
    { market: "1X2", picks: [match.home.shortName, "Nul", match.away.shortName] },
    { market: "Plus/Moins 2,5 buts", picks: ["Plus de 2,5", "Moins de 2,5"] },
    { market: "Les deux équipes marquent", picks: ["Oui", "Non"] },
  ];

  const odds: GeneratedOdd[] = [];
  for (const bookmaker of BOOKMAKERS) {
    for (const { market, picks } of markets) {
      for (const pick of picks) {
        const seed = hashString(`${match.id}|${bookmaker}|${market}|${pick}`);
        odds.push({
          matchId: match.id,
          bookmaker,
          market,
          pick,
          odd: seededOdd(seed, 1.4, 4.2),
        });
      }
    }
  }
  return odds;
}
