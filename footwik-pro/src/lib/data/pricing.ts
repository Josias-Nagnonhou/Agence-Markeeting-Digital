import { PricingPlan } from "@/lib/types";

export const pricingPlans: PricingPlan[] = [
  {
    id: "gratuit",
    name: "Gratuit",
    fcfa: 0,
    eur: 0,
    period: "toujours",
    features: [
      "1 analyse partielle par jour",
      "Accès à l'historique public complet",
      "Aperçu des matchs du jour",
    ],
  },
  {
    id: "semaine",
    name: "Semaine",
    fcfa: 1000,
    eur: 2,
    period: "semaine",
    features: [
      "Toutes les fiches d'analyse de la semaine",
      "Tous les marchés analysés (1X2, +/-2,5, BTTS)",
      "Facteurs cachés et statistiques avancées",
    ],
  },
  {
    id: "mois",
    name: "Mois",
    fcfa: 3500,
    eur: 8,
    period: "mois",
    highlight: true,
    features: [
      "Toutes les fiches d'analyse du mois",
      "Notifications Telegram avant chaque match",
      "Historique détaillé et statistiques personnalisées",
      "Support prioritaire",
    ],
  },
  {
    id: "vip",
    name: "VIP mensuel",
    fcfa: 10000,
    eur: 15,
    period: "mois",
    features: [
      "Tout le plan Mois inclus",
      "Analyses live pendant les matchs",
      "Accès au groupe privé Footwik",
      "Contenus audio exclusifs de Footwik",
    ],
  },
];
