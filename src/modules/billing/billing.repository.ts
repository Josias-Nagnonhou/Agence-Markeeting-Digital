import { prisma } from "@/lib/db/prisma";
import type { OrderStatus, OrderType, BillingProvider, SubscriptionStatus } from "@/generated/prisma/enums";

export function createOrder(params: {
  userId: string;
  type: OrderType;
  pageId?: string;
  amount: number;
  currency: string;
  provider: BillingProvider;
  providerRef?: string;
}) {
  return prisma.order.create({ data: params });
}

export function updateOrderStatus(
  orderId: string,
  data: { status: OrderStatus; providerRef?: string; paidAt?: Date },
) {
  return prisma.order.update({ where: { id: orderId }, data });
}

export function findOrderById(orderId: string) {
  return prisma.order.findUnique({ where: { id: orderId } });
}

export function findOrderByIdForUser(userId: string, orderId: string) {
  return prisma.order.findFirst({ where: { id: orderId, userId } });
}

export function findOrderByProviderRef(providerRef: string) {
  return prisma.order.findFirst({ where: { providerRef } });
}

export function listOrdersForUser(userId: string) {
  return prisma.order.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export function listSubscriptionsForUser(userId: string) {
  return prisma.hostingSubscription.findMany({
    where: { page: { product: { userId } } },
    include: { page: { select: { id: true, title: true, slug: true, status: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export function updateSubscriptionBilling(
  pageId: string,
  data: {
    status: SubscriptionStatus;
    provider?: BillingProvider;
    providerRef?: string;
    currentPeriodEnd?: Date;
  },
) {
  return prisma.hostingSubscription.update({ where: { pageId }, data });
}

export function findSubscriptionByProviderRef(providerRef: string) {
  return prisma.hostingSubscription.findFirst({ where: { providerRef } });
}
