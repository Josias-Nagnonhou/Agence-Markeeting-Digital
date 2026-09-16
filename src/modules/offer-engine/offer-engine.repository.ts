import { prisma } from "@/lib/db/prisma";
import type { OfferAngleInput } from "@/modules/offer-engine/offer-engine.types";

export function listOfferAngles(productId: string) {
  return prisma.offerAngle.findMany({
    where: { productId },
    orderBy: { createdAt: "asc" },
  });
}

export async function replaceProposedAngles(productId: string, angles: OfferAngleInput[]) {
  await prisma.$transaction([
    prisma.offerAngle.deleteMany({ where: { productId, status: "PROPOSED" } }),
    ...angles.map((angle) =>
      prisma.offerAngle.create({
        data: {
          productId,
          promise: angle.promise,
          differentiator: angle.differentiator,
          benefits: angle.benefits,
          rationale: angle.rationale,
        },
      }),
    ),
  ]);

  return listOfferAngles(productId);
}

export function selectAngle(productId: string, angleId: string) {
  return prisma.$transaction(async (tx) => {
    await tx.offerAngle.updateMany({
      where: { productId, id: { not: angleId } },
      data: { status: "DISCARDED" },
    });
    return tx.offerAngle.update({
      where: { id: angleId },
      data: { status: "SELECTED" },
    });
  });
}
