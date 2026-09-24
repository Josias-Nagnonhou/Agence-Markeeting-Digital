import { PricingPlan } from "@/lib/types";

export const FOUNDER_TOTAL_SEATS = 100;
export const FOUNDER_PRICE_FCFA = 3500;
export const FOUNDER_PRICE_EUR = 6;
export const VIP_TOTAL_SEATS = 200;

export const pricingPlans: PricingPlan[] = [
  {
    id: "gratuit",
    name: "Gratuit",
    fcfa: 0,
    eur: 0,
    period: "toujours",
    features: [
      "1 analyse partielle par jour",
      "Accès à l'historique public",
    ],
  },
  {
    id: "semaine",
    name: "Semaine",
    fcfa: 1500,
    eur: 3,
    period: "semaine",
    features: [
      "Toutes les fiches d'analyse de la semaine",
      "Tous les marchés analysés (1X2, +/-2,5, BTTS)",
      "Alertes Telegram avant chaque match",
    ],
  },
  {
    id: "mois",
    name: "Mois",
    fcfa: 5000,
    eur: 9,
    period: "mois",
    badge: "POPULAIRE",
    highlight: true,
    features: [
      "Tout le forfait Semaine",
      "Analyse mon coupon (10 par mois)",
      "Alertes de dernière minute",
      "Comparateur de cotes",
      "Suivi personnel de mes paris",
      "Questions à l'assistant IA",
    ],
  },
  {
    id: "trimestre",
    name: "3 mois",
    fcfa: 12000,
    eur: 22,
    period: "3 mois",
    badge: "ÉCONOMISE 20 %",
    features: [
      "Tout le forfait Mois",
      "20 % moins cher que 3 mois payés séparément",
    ],
  },
  {
    id: "an",
    name: "1 an",
    fcfa: 40000,
    eur: 70,
    period: "an",
    badge: "MEILLEURE OFFRE",
    features: [
      "Tout le forfait Mois",
      "Le tarif le plus avantageux à l'année",
    ],
  },
  {
    id: "vip",
    name: "VIP mensuel",
    fcfa: 15000,
    eur: 25,
    period: "mois",
    badge: "PLACES LIMITÉES",
    features: [
      "Tout le forfait Mois inclus",
      "Analyse mon coupon illimitée",
      "Lives privés hebdomadaires",
      "Analyses vocales exclusives de Footwik",
      "Groupe Telegram privé",
      "Contenus 24h avant leur sortie YouTube",
    ],
  },
];

export function getPlan(id: string) {
  return pricingPlans.find((p) => p.id === id);
}
