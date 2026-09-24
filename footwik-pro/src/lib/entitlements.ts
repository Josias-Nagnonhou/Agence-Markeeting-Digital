import { PlanId } from "@/lib/types";

const PLAN_RANK: Record<PlanId, number> = {
  gratuit: 0,
  semaine: 1,
  mois: 2,
  trimestre: 2,
  an: 2,
  vip: 3,
};

export const PLAN_LABELS: Record<PlanId, string> = {
  gratuit: "Gratuit",
  semaine: "Semaine",
  mois: "Mois",
  trimestre: "3 mois",
  an: "1 an",
  vip: "VIP",
};

export type Feature =
  | "full_analyses"
  | "telegram_alerts"
  | "coupon_analysis"
  | "last_minute_alerts"
  | "odds_comparator"
  | "bet_tracking"
  | "ai_assistant"
  | "vip_lives"
  | "vip_exclusives"
  | "vip_telegram";

const FEATURE_MIN_RANK: Record<Feature, number> = {
  full_analyses: 1,
  telegram_alerts: 1,
  coupon_analysis: 2,
  last_minute_alerts: 2,
  odds_comparator: 2,
  bet_tracking: 2,
  ai_assistant: 2,
  vip_lives: 3,
  vip_exclusives: 3,
  vip_telegram: 3,
};

// Le plan le plus bas qui débloque chaque fonctionnalité — utilisé pour
// le message d'incitation ("Débloque avec le forfait X").
const FEATURE_UNLOCK_PLAN: Record<Feature, PlanId> = {
  full_analyses: "semaine",
  telegram_alerts: "semaine",
  coupon_analysis: "mois",
  last_minute_alerts: "mois",
  odds_comparator: "mois",
  bet_tracking: "mois",
  ai_assistant: "mois",
  vip_lives: "vip",
  vip_exclusives: "vip",
  vip_telegram: "vip",
};

export function planRank(plan: PlanId) {
  return PLAN_RANK[plan] ?? 0;
}

export function hasFeature(plan: PlanId, feature: Feature) {
  return planRank(plan) >= FEATURE_MIN_RANK[feature];
}

export function unlockPlanFor(feature: Feature): PlanId {
  return FEATURE_UNLOCK_PLAN[feature];
}

export function couponQuota(plan: PlanId): number {
  if (plan === "vip") return Infinity;
  if (plan === "mois" || plan === "trimestre" || plan === "an") return 10;
  return 0;
}
