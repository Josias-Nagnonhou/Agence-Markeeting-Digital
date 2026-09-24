import { PredictionHistoryEntry } from "@/lib/types";

function iso(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(20, 0, 0, 0);
  return d.toISOString();
}

export const predictionHistory: PredictionHistoryEntry[] = [
  { id: "h1", date: iso(1), competition: "Bundesliga", match: "Bayern Munich vs Dortmund", pick: "Victoire Bayern Munich", confidence: 5, outcome: "gagne", finalScore: "3-1" },
  { id: "h2", date: iso(2), competition: "Premier League", match: "Liverpool vs Chelsea", pick: "Plus de 2,5 buts", confidence: 4, outcome: "gagne", finalScore: "3-2" },
  { id: "h3", date: iso(2), competition: "Ligue 1", match: "Monaco vs Lyon", pick: "Les deux équipes marquent", confidence: 3, outcome: "perdu", finalScore: "1-0" },
  { id: "h4", date: iso(3), competition: "Serie A", match: "Inter Milan vs Juventus", pick: "Double chance Inter ou nul", confidence: 4, outcome: "gagne", finalScore: "1-1" },
  { id: "h5", date: iso(4), competition: "Liga", match: "Atletico vs Sevilla", pick: "Victoire Atletico", confidence: 3, outcome: "gagne", finalScore: "2-0" },
  { id: "h6", date: iso(5), competition: "CAN", match: "Cameroun vs Nigeria", pick: "Moins de 2,5 buts", confidence: 4, outcome: "gagne", finalScore: "1-0" },
  { id: "h7", date: iso(6), competition: "Ligue 1 Sénégal", match: "Jaraaf vs Casa Sports", pick: "Victoire Jaraaf", confidence: 3, outcome: "perdu", finalScore: "0-1" },
  { id: "h8", date: iso(7), competition: "Premier League", match: "Manchester City vs Tottenham", pick: "Victoire Manchester City", confidence: 5, outcome: "gagne", finalScore: "4-1" },
  { id: "h9", date: iso(8), competition: "Ligue des Champions", match: "Real Madrid vs Napoli", pick: "Plus de 2,5 buts", confidence: 4, outcome: "gagne", finalScore: "3-1" },
  { id: "h10", date: iso(9), competition: "Serie A", match: "AC Milan vs Roma", pick: "Les deux équipes marquent", confidence: 3, outcome: "gagne", finalScore: "2-1" },
  { id: "h11", date: iso(10), competition: "Ligue 1", match: "Lille vs Nice", pick: "Moins de 2,5 buts", confidence: 3, outcome: "perdu", finalScore: "2-2" },
  { id: "h12", date: iso(11), competition: "Bundesliga", match: "Leverkusen vs Leipzig", pick: "Victoire Leverkusen", confidence: 4, outcome: "gagne", finalScore: "2-0" },
  { id: "h13", date: iso(12), competition: "Elite One Cameroun", match: "Coton Sport vs Fovu Baham", pick: "Victoire Coton Sport", confidence: 4, outcome: "gagne", finalScore: "2-0" },
  { id: "h14", date: iso(13), competition: "Ligue Pro Bénin", match: "Buffles du Borgou vs ASPAC", pick: "Plus de 2,5 buts", confidence: 2, outcome: "perdu", finalScore: "1-0" },
  { id: "h15", date: iso(14), competition: "Premier League", match: "Arsenal vs Newcastle", pick: "Victoire Arsenal", confidence: 4, outcome: "gagne", finalScore: "2-1" },
  { id: "h16", date: iso(15), competition: "Liga", match: "FC Barcelone vs Betis", pick: "Victoire FC Barcelone", confidence: 5, outcome: "gagne", finalScore: "3-0" },
  { id: "h17", date: iso(16), competition: "Qualif. CAN", match: "Bénin vs Sénégal", pick: "Double chance Sénégal ou nul", confidence: 3, outcome: "gagne", finalScore: "1-1" },
  { id: "h18", date: iso(17), competition: "Ligue 1 Côte d'Ivoire", match: "ASEC Mimosas vs Africa Sports", pick: "Victoire ASEC Mimosas", confidence: 4, outcome: "gagne", finalScore: "2-0" },
  { id: "h19", date: iso(18), competition: "Serie A", match: "Napoli vs Fiorentina", pick: "Les deux équipes marquent", confidence: 3, outcome: "perdu", finalScore: "1-0" },
  { id: "h20", date: iso(19), competition: "Ligue des Champions", match: "Manchester City vs PSG", pick: "Plus de 2,5 buts", confidence: 4, outcome: "gagne", finalScore: "2-2" },
  { id: "h21", date: iso(20), competition: "Ligue 1", match: "Marseille vs Rennes", pick: "Victoire Marseille", confidence: 3, outcome: "gagne", finalScore: "2-1" },
  { id: "h22", date: iso(21), competition: "Bundesliga", match: "Dortmund vs Stuttgart", pick: "Plus de 2,5 buts", confidence: 3, outcome: "perdu", finalScore: "1-1" },
  { id: "h23", date: iso(22), competition: "CAN", match: "Côte d'Ivoire vs Mali", pick: "Victoire Côte d'Ivoire", confidence: 4, outcome: "gagne", finalScore: "2-0" },
  { id: "h24", date: iso(23), competition: "Premier League", match: "Chelsea vs Brighton", pick: "Les deux équipes marquent", confidence: 2, outcome: "perdu", finalScore: "1-0" },
  { id: "h25", date: iso(24), competition: "Liga", match: "Real Madrid vs Girona", pick: "Victoire Real Madrid", confidence: 5, outcome: "gagne", finalScore: "3-1" },
  { id: "h26", date: iso(25), competition: "Ligue 1 Sénégal", match: "Casa Sports vs Teungueth FC", pick: "Moins de 2,5 buts", confidence: 3, outcome: "gagne", finalScore: "1-0" },
  { id: "h27", date: iso(26), competition: "Serie A", match: "Juventus vs Atalanta", pick: "Double chance Juventus ou nul", confidence: 4, outcome: "gagne", finalScore: "1-1" },
  { id: "h28", date: iso(27), competition: "Ligue des Champions", match: "Bayern Munich vs Arsenal", pick: "Victoire Bayern Munich", confidence: 4, outcome: "perdu", finalScore: "1-2" },
  { id: "h29", date: iso(28), competition: "Ligue 1", match: "PSG vs Toulouse", pick: "Plus de 2,5 buts", confidence: 5, outcome: "gagne", finalScore: "4-0" },
  { id: "h30", date: iso(29), competition: "Premier League", match: "Aston Villa vs West Ham", pick: "Victoire Aston Villa", confidence: 3, outcome: "gagne", finalScore: "2-1" },
];

export function computeStats(entries: PredictionHistoryEntry[] = predictionHistory) {
  const decided = entries.filter((e) => e.outcome === "gagne" || e.outcome === "perdu");
  const won = decided.filter((e) => e.outcome === "gagne").length;
  const total = decided.length;
  const rate = total === 0 ? 0 : (won / total) * 100;
  return { won, total, rate };
}

export function computeStatsByConfidence(entries: PredictionHistoryEntry[] = predictionHistory) {
  const byConfidence: Record<number, { won: number; total: number }> = {};
  for (const e of entries) {
    if (e.outcome !== "gagne" && e.outcome !== "perdu") continue;
    byConfidence[e.confidence] = byConfidence[e.confidence] || { won: 0, total: 0 };
    byConfidence[e.confidence].total += 1;
    if (e.outcome === "gagne") byConfidence[e.confidence].won += 1;
  }
  return byConfidence;
}

export function computeStatsByMonth(entries: PredictionHistoryEntry[] = predictionHistory) {
  const byMonth: Record<string, { won: number; total: number }> = {};
  for (const e of entries) {
    if (e.outcome !== "gagne" && e.outcome !== "perdu") continue;
    const key = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(new Date(e.date));
    byMonth[key] = byMonth[key] || { won: 0, total: 0 };
    byMonth[key].total += 1;
    if (e.outcome === "gagne") byMonth[key].won += 1;
  }
  return byMonth;
}

export function computeStatsByCompetition(entries: PredictionHistoryEntry[] = predictionHistory) {
  const byCompetition: Record<string, { won: number; total: number }> = {};
  for (const e of entries) {
    if (e.outcome !== "gagne" && e.outcome !== "perdu") continue;
    byCompetition[e.competition] = byCompetition[e.competition] || { won: 0, total: 0 };
    byCompetition[e.competition].total += 1;
    if (e.outcome === "gagne") byCompetition[e.competition].won += 1;
  }
  return byCompetition;
}
