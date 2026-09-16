import { callAiJson } from "@/lib/ai/ai-client";
import { OFFER_ANGLES_SYSTEM_PROMPT, buildOfferAnglesPrompt } from "@/lib/ai/prompts/offer-angles";
import { getOwnedProduct } from "@/modules/product/product.service";
import { offerAnglesResponseSchema } from "@/modules/offer-engine/offer-engine.types";
import {
  listOfferAngles,
  replaceProposedAngles,
  selectAngle,
} from "@/modules/offer-engine/offer-engine.repository";

export class OfferAngleNotFoundError extends Error {
  constructor() {
    super("Angle d'offre introuvable.");
  }
}

export async function getOfferAngles(userId: string, productId: string) {
  await getOwnedProduct(userId, productId);
  return listOfferAngles(productId);
}

export async function generateOfferAngles(userId: string, productId: string) {
  const product = await getOwnedProduct(userId, productId);

  const angles = await callAiJson(
    {
      system: OFFER_ANGLES_SYSTEM_PROMPT,
      prompt: buildOfferAnglesPrompt(product),
    },
    (raw) => offerAnglesResponseSchema.parse(raw),
  );

  return replaceProposedAngles(productId, angles);
}

export async function selectOfferAngle(userId: string, productId: string, angleId: string) {
  const product = await getOwnedProduct(userId, productId);
  const angleExists = await listOfferAngles(product.id).then((angles) =>
    angles.some((angle) => angle.id === angleId),
  );
  if (!angleExists) throw new OfferAngleNotFoundError();

  return selectAngle(productId, angleId);
}
