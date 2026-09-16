import { prisma } from "@/lib/db/prisma";
import type { BillingProvider as BillingProviderId } from "@/generated/prisma/enums";
import { getOwnedPage } from "@/modules/page-builder/page.service";
import { PAGE_CREATION_PRICE, HOSTING_MONTHLY_PRICE } from "@/modules/billing/pricing";
import type { AppBillingProvider } from "@/modules/billing/billing.types";
import { StripeProvider } from "@/modules/billing/providers/stripe.provider";
import { KkiapayProvider, verifyKkiapayTransaction } from "@/modules/billing/providers/kkiapay.provider";
import { UnimplementedProvider } from "@/modules/billing/providers/unimplemented.provider";
import {
  createOrder,
  updateOrderStatus,
  findOrderByIdForUser,
  findOrderByProviderRef,
  listOrdersForUser,
  listSubscriptionsForUser,
  updateSubscriptionBilling,
  findSubscriptionByProviderRef,
} from "@/modules/billing/billing.repository";

function getProvider(providerId: BillingProviderId): AppBillingProvider {
  switch (providerId) {
    case "STRIPE":
      return new StripeProvider();
    case "KKIAPAY":
      return new KkiapayProvider();
    default:
      return new UnimplementedProvider(providerId);
  }
}

function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export class OrderNotFoundError extends Error {
  constructor() {
    super("Commande introuvable.");
  }
}

export async function createPageCreationOrder(
  userId: string,
  providerId: BillingProviderId,
  pageId?: string,
) {
  const provider = getProvider(providerId);
  const price = providerId === "STRIPE" ? PAGE_CREATION_PRICE.STRIPE : PAGE_CREATION_PRICE.KKIAPAY;

  const order = await createOrder({
    userId,
    type: "PAGE_CREATION",
    pageId,
    amount: price.amount,
    currency: price.currency,
    provider: providerId,
  });

  const checkout = await provider.createOrderCheckout({
    orderId: order.id,
    amount: price.amount,
    currency: price.currency,
    description: "Création de page OfferLab",
    successUrl: `${getAppUrl()}/dashboard/billing?order=${order.id}`,
    cancelUrl: `${getAppUrl()}/dashboard/billing`,
  });

  if (checkout.providerRef) {
    await updateOrderStatus(order.id, { status: "PENDING", providerRef: checkout.providerRef });
  }

  return { order, checkout };
}

export async function createHostingSubscriptionCheckout(
  userId: string,
  pageId: string,
  providerId: BillingProviderId,
) {
  const page = await getOwnedPage(userId, pageId);
  const provider = getProvider(providerId);
  const price = providerId === "STRIPE" ? HOSTING_MONTHLY_PRICE.STRIPE : HOSTING_MONTHLY_PRICE.KKIAPAY;

  const subscription = await prisma.hostingSubscription.upsert({
    where: { pageId },
    update: {},
    create: { pageId, status: "TRIALING" },
  });

  const checkout = await provider.createSubscriptionCheckout({
    subscriptionId: subscription.id,
    amountPerMonth: price.amount,
    currency: price.currency,
    description: `Hébergement OfferLab — ${page.title}`,
    successUrl: `${getAppUrl()}/dashboard/billing?subscription=${subscription.id}`,
    cancelUrl: `${getAppUrl()}/dashboard/billing`,
  });

  if (checkout.providerRef) {
    await updateSubscriptionBilling(pageId, { status: subscription.status, providerRef: checkout.providerRef });
  }

  return { subscription, checkout };
}

export async function verifyKkiapayOrder(userId: string, orderId: string, transactionId: string) {
  const order = await findOrderByIdForUser(userId, orderId);
  if (!order) throw new OrderNotFoundError();

  const result = await verifyKkiapayTransaction(transactionId);
  await updateOrderStatus(orderId, {
    status: result.isSuccessful ? "PAID" : "FAILED",
    providerRef: transactionId,
    paidAt: result.isSuccessful ? new Date() : undefined,
  });

  return result;
}

export async function verifyKkiapaySubscription(userId: string, pageId: string, transactionId: string) {
  await getOwnedPage(userId, pageId);
  const result = await verifyKkiapayTransaction(transactionId);

  if (result.isSuccessful) {
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);
    await updateSubscriptionBilling(pageId, {
      status: "ACTIVE",
      provider: "KKIAPAY",
      providerRef: transactionId,
      currentPeriodEnd,
    });
  }

  return result;
}

/**
 * Traite un événement Stripe `checkout.session.completed` déjà vérifié
 * (signature validée par l'appelant). Ne couvre pas encore le
 * renouvellement automatique des abonnements (`invoice.paid`) : chaque
 * mois nécessiterait de gérer cet événement séparément, laissé pour une
 * itération ultérieure.
 */
export async function handleStripeCheckoutCompleted(session: {
  id: string;
  mode: string;
  metadata: Record<string, string> | null;
}) {
  if (session.mode === "payment" && session.metadata?.orderId) {
    const order = await findOrderByProviderRef(session.id);
    if (order) {
      await updateOrderStatus(order.id, { status: "PAID", paidAt: new Date() });
    }
    return;
  }

  if (session.mode === "subscription" && session.metadata?.subscriptionId) {
    const subscription = await findSubscriptionByProviderRef(session.id);
    if (subscription) {
      const currentPeriodEnd = new Date();
      currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);
      await updateSubscriptionBilling(subscription.pageId, {
        status: "ACTIVE",
        provider: "STRIPE",
        providerRef: session.id,
        currentPeriodEnd,
      });
    }
  }
}

export function getOrdersForUser(userId: string) {
  return listOrdersForUser(userId);
}

export function getSubscriptionsForUser(userId: string) {
  return listSubscriptionsForUser(userId);
}
