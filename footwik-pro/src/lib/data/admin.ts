export interface AdminSubscriber {
  id: string;
  name: string;
  email: string;
  plan: "Gratuit" | "Semaine" | "Mois" | "VIP";
  status: "actif" | "expiré" | "annulé";
  joinedAt: string;
  country: string;
}

export interface AdminTransaction {
  id: string;
  date: string;
  subscriber: string;
  plan: string;
  amount: string;
  method: string;
  status: "payé" | "échoué" | "en_attente";
}

export interface PendingAnalysis {
  id: string;
  match: string;
  competition: string;
  generatedAt: string;
  confidence: number;
}

export interface PendingResult {
  id: string;
  match: string;
  competition: string;
  kickoff: string;
  pick: string;
}

export interface VipContent {
  id: string;
  title: string;
  type: "audio" | "video" | "message";
  publishedAt: string;
}

export const pendingAnalyses: PendingAnalysis[] = [
  { id: "gen-1", match: "Inter Milan vs Juventus", competition: "Serie A", generatedAt: new Date().toISOString(), confidence: 4 },
  { id: "gen-2", match: "Coton Sport vs Union de Douala", competition: "Elite One Cameroun", generatedAt: new Date().toISOString(), confidence: 3 },
  { id: "gen-3", match: "Liverpool vs Chelsea", competition: "Premier League", generatedAt: new Date().toISOString(), confidence: 5 },
];

export const pendingResults: PendingResult[] = [
  { id: "res-1", match: "Bayern Munich vs Dortmund", competition: "Bundesliga", kickoff: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), pick: "Victoire Bayern Munich" },
  { id: "res-2", match: "Jaraaf vs Casa Sports", competition: "Ligue 1 Sénégal", kickoff: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), pick: "Victoire Jaraaf" },
];

export const adminSubscribers: AdminSubscriber[] = [
  { id: "u1", name: "Josias N.", email: "josiasnagnonhou021@gmail.com", plan: "Mois", status: "actif", joinedAt: "2025-11-02", country: "Bénin" },
  { id: "u2", name: "Fabrice K.", email: "fabrice.k@example.com", plan: "VIP", status: "actif", joinedAt: "2025-09-14", country: "Côte d'Ivoire" },
  { id: "u3", name: "Aïcha D.", email: "aicha.d@example.com", plan: "Semaine", status: "actif", joinedAt: "2026-01-05", country: "Sénégal" },
  { id: "u4", name: "Junior A.", email: "junior.a@example.com", plan: "VIP", status: "actif", joinedAt: "2025-06-20", country: "France" },
  { id: "u5", name: "Sandrine M.", email: "sandrine.m@example.com", plan: "Mois", status: "expiré", joinedAt: "2025-12-01", country: "Bénin" },
  { id: "u6", name: "Mamadou S.", email: "mamadou.s@example.com", plan: "Gratuit", status: "actif", joinedAt: "2026-02-10", country: "Sénégal" },
];

export const adminTransactions: AdminTransaction[] = [
  { id: "t1", date: "2026-02-18", subscriber: "Josias N.", plan: "Mois", amount: "3 500 FCFA", method: "MTN Mobile Money", status: "payé" },
  { id: "t2", date: "2026-02-17", subscriber: "Fabrice K.", plan: "VIP", amount: "10 000 FCFA", method: "Orange Money", status: "payé" },
  { id: "t3", date: "2026-02-16", subscriber: "Aïcha D.", plan: "Semaine", amount: "1 000 FCFA", method: "Wave", status: "payé" },
  { id: "t4", date: "2026-02-15", subscriber: "Junior A.", plan: "VIP", amount: "15 €", method: "Carte bancaire", status: "payé" },
  { id: "t5", date: "2026-02-14", subscriber: "Sandrine M.", plan: "Mois", amount: "3 500 FCFA", method: "Moov Money", status: "échoué" },
];

export const revenueByMonth = [
  { month: "Sept.", revenue: 420000, subscribers: 210 },
  { month: "Oct.", revenue: 510000, subscribers: 248 },
  { month: "Nov.", revenue: 605000, subscribers: 289 },
  { month: "Déc.", revenue: 690000, subscribers: 316 },
  { month: "Janv.", revenue: 745000, subscribers: 340 },
  { month: "Fév.", revenue: 812000, subscribers: 365 },
];

export const vipContents: VipContent[] = [
  { id: "v1", title: "Débrief audio — Journée 24 de Ligue 1", type: "audio", publishedAt: "2026-02-17" },
  { id: "v2", title: "Vidéo exclusive : décryptage CAN demi-finale", type: "video", publishedAt: "2026-02-15" },
  { id: "v3", title: "Message VIP : notre approche du money management", type: "message", publishedAt: "2026-02-10" },
];

export const adminOverview = {
  activeSubscribers: adminSubscribers.filter((s) => s.status === "actif").length * 61,
  conversionRate: 8.4,
  monthlyRevenue: revenueByMonth[revenueByMonth.length - 1].revenue,
};
