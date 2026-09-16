import type { OfferAngle, Product } from "@/generated/prisma/client";
import type { SectionType } from "@/generated/prisma/enums";

export type RetouchTone = "STANDARD" | "DIRECT" | "CHALEUREUX" | "PREMIUM" | "URGENT";
export type RetouchLength = "STANDARD" | "PLUS_COURT" | "PLUS_LONG";

export const retouchToneOptions: { value: RetouchTone; label: string }[] = [
  { value: "STANDARD", label: "Ton actuel" },
  { value: "DIRECT", label: "Plus direct" },
  { value: "CHALEUREUX", label: "Plus chaleureux" },
  { value: "PREMIUM", label: "Plus premium" },
  { value: "URGENT", label: "Plus urgent" },
];

export const retouchLengthOptions: { value: RetouchLength; label: string }[] = [
  { value: "STANDARD", label: "Longueur actuelle" },
  { value: "PLUS_COURT", label: "Plus court" },
  { value: "PLUS_LONG", label: "Plus long" },
];

const toneInstructions: Record<RetouchTone, string> = {
  STANDARD: "Garde le ton actuel.",
  DIRECT: "Rends le ton plus direct et incisif, phrases courtes, sans détour.",
  CHALEUREUX: "Rends le ton plus chaleureux et proche, comme si tu parlais à un ami.",
  PREMIUM: "Rends le ton plus premium et sophistiqué, vocabulaire soigné, sans jargon marketing lourd.",
  URGENT: "Renforce le sentiment d'urgence et l'envie d'agir maintenant, sans mentir sur des délais inventés.",
};

const lengthInstructions: Record<RetouchLength, string> = {
  STANDARD: "Garde une longueur similaire à l'original.",
  PLUS_COURT: "Réduis significativement la longueur, va à l'essentiel.",
  PLUS_LONG: "Développe davantage, ajoute du détail et de la profondeur.",
};

export function buildSectionRetouchSystemPrompt(sectionType: SectionType): string {
  return `Tu es un copywriter direct-response spécialisé dans les pages de vente de
produits digitaux, pour un public francophone.

Tu vas retoucher UNIQUEMENT le bloc "${sectionType}" d'une page de vente déjà
générée, en respectant la structure JSON exacte fournie en exemple (mêmes
clés, même forme). Ne change pas la structure, seulement le texte. Reste
cohérent avec la promesse et l'angle d'offre du produit.

Réponds UNIQUEMENT en français, avec un objet JSON valide correspondant à
la structure de l'exemple fourni, sans texte avant ou après.`;
}

export function buildSectionRetouchPrompt(
  product: Product,
  angle: OfferAngle,
  sectionType: SectionType,
  currentContent: unknown,
  tone: RetouchTone,
  length: RetouchLength,
): string {
  return `Produit : ${product.name}
Promesse (angle validé) : ${angle.promise}
Différenciant : ${angle.differentiator}

Contenu actuel du bloc ${sectionType} (structure à respecter) :
${JSON.stringify(currentContent)}

Consigne de ton : ${toneInstructions[tone]}
Consigne de longueur : ${lengthInstructions[length]}

Réécris ce bloc en respectant strictement la même structure JSON.`;
}
