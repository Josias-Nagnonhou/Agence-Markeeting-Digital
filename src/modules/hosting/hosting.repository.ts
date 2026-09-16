import { prisma } from "@/lib/db/prisma";
import type { PageStatus } from "@/generated/prisma/enums";

const TRIAL_PERIOD_DAYS = 30;

export function updatePageStatus(pageId: string, status: PageStatus, publishedAt?: Date) {
  return prisma.page.update({
    where: { id: pageId },
    data: { status, ...(publishedAt ? { publishedAt } : {}) },
    include: { subscription: true },
  });
}

export function findSubscriptionByPageId(pageId: string) {
  return prisma.hostingSubscription.findUnique({ where: { pageId } });
}

export function createTrialSubscription(pageId: string) {
  const currentPeriodEnd = new Date();
  currentPeriodEnd.setDate(currentPeriodEnd.getDate() + TRIAL_PERIOD_DAYS);

  return prisma.hostingSubscription.create({
    data: { pageId, status: "TRIALING", currentPeriodEnd },
  });
}
