import { z } from "zod";

export const offerAngleSchema = z.object({
  promise: z
    .string()
    .min(10, "La promesse doit être plus détaillée.")
    .describe("La promesse reformulée, orientée résultat concret pour l'acheteur."),
  differentiator: z
    .string()
    .min(10)
    .describe("Ce qui rend cette offre difficile à comparer à une alternative générique."),
  benefits: z
    .array(z.string().min(3))
    .min(3)
    .max(6)
    .describe("3 à 6 bénéfices clés, formulés du point de vue de l'acheteur."),
  rationale: z
    .string()
    .min(10)
    .describe("Pourquoi cet angle fonctionne pour cette cible précise."),
});

export const offerAnglesResponseSchema = z.array(offerAngleSchema).min(2).max(3);

export type OfferAngleInput = z.infer<typeof offerAngleSchema>;
