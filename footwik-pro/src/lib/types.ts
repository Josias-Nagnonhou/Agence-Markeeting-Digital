export type Confidence = 1 | 2 | 3 | 4 | 5;

export type PredictionOutcome = "gagne" | "perdu" | "en_attente" | "annule";

export type Competition =
  | "Ligue des Champions"
  | "Premier League"
  | "Liga"
  | "Ligue 1"
  | "Serie A"
  | "Bundesliga"
  | "CAN"
  | "Qualif. CAN"
  | "Ligue 1 Côte d'Ivoire"
  | "Ligue 1 Sénégal"
  | "Ligue Pro Bénin"
  | "Elite One Cameroun";

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  country: string;
  primaryColor: string;
  accentColor: string;
  lightText: boolean;
  logoUrl?: string;
}

export interface FormResult {
  opponent: string;
  result: "V" | "N" | "D";
  score: string;
  date: string;
  home: boolean;
}

export interface H2HMatch {
  date: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
  competition: string;
}

export interface AdvancedStats {
  xg: number;
  possession: number;
  shotsOnTarget: number;
  goalsScoredHome: number;
  goalsScoredAway: number;
  goalsConcededHome: number;
  goalsConcededAway: number;
}

export interface MarketPrediction {
  market: string;
  pick: string;
  probability: number;
}

export interface MatchAnalysis {
  id: string;
  competition: Competition;
  kickoff: string;
  venue: string;
  home: Team;
  away: Team;
  homeForm: FormResult[];
  awayForm: FormResult[];
  homeInjuries: string[];
  awayInjuries: string[];
  homeLineup: string[];
  awayLineup: string[];
  h2h: H2HMatch[];
  homeStats: AdvancedStats;
  awayStats: AdvancedStats;
  hiddenFactors: string[];
  confidence: Confidence;
  markets: MarketPrediction[];
  summary: string[];
  isFree: boolean;
  status: "a_venir" | "termine" | "en_cours";
  finalScore?: string;
  outcome?: PredictionOutcome;
  mainPick: string;
}

export interface PredictionHistoryEntry {
  id: string;
  date: string;
  competition: Competition;
  match: string;
  pick: string;
  confidence: Confidence;
  outcome: PredictionOutcome;
  finalScore: string;
}

export interface Testimonial {
  name: string;
  city: string;
  quote: string;
  since: string;
}

export type SubscriptionRegion = "afrique" | "diaspora";

export type PlanId = "gratuit" | "semaine" | "mois" | "trimestre" | "an" | "vip";

export interface PricingPlan {
  id: PlanId;
  name: string;
  fcfa: number;
  eur: number;
  period: string;
  badge?: string;
  highlight?: boolean;
  features: string[];
}
