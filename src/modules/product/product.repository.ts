import { prisma } from "@/lib/db/prisma";
import type { CreateProductInput } from "@/modules/product/product.types";
import type { PaymentProvider } from "@/generated/prisma/enums";

export function createProductRecord(userId: string, input: CreateProductInput) {
  return prisma.product.create({
    data: {
      userId,
      name: input.name,
      category: input.category,
      targetAudience: input.targetAudience,
      problemSolved: input.problemSolved,
      price: input.price,
      currency: input.currency,
      paymentProvider: input.paymentProvider,
      paymentLinkUrl: input.paymentLinkUrl,
      images: {
        create: input.imageUrls.map((url, position) => ({ url, position })),
      },
    },
    include: { images: true },
  });
}

export function listProductsByUser(userId: string) {
  return prisma.product.findMany({
    where: { userId },
    include: {
      images: { orderBy: { position: "asc" } },
      pages: { select: { id: true, slug: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function findProductByIdForUser(userId: string, productId: string) {
  return prisma.product.findFirst({
    where: { id: productId, userId },
    include: { images: { orderBy: { position: "asc" } }, offerAngles: true, pages: true },
  });
}

export function updateProductPaymentRecord(
  productId: string,
  data: { paymentProvider: PaymentProvider; paymentLinkUrl: string },
) {
  return prisma.product.update({ where: { id: productId }, data });
}
