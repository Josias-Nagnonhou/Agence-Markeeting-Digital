import type { BillingProvider as BillingProviderId } from "@/generated/prisma/enums";

export type CheckoutResult =
  | { mode: "redirect"; url: string; providerRef: string }
  | { mode: "widget"; publicKey: string; amount: number; currency: string; providerRef: string };

export interface OrderCheckoutContext {
  orderId: string;
  amount: number;
  currency: string;
  description: string;
  successUrl: string;
  cancelUrl: string;
}

export interface SubscriptionCheckoutContext {
  subscriptionId: string;
  amountPerMonth: number;
  currency: string;
  description: string;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Un provider de facturation sait créer une session de paiement (unique
 * ou récurrente) et vérifier qu'un paiement a bien eu lieu. Deux familles
 * de providers coexistent : redirection hébergée (Stripe) et widget
 * client (Mobile Money type Kkiapay) — voir `CheckoutResult`.
 */
export interface AppBillingProvider {
  id: BillingProviderId;
  createOrderCheckout(context: OrderCheckoutContext): Promise<CheckoutResult>;
  createSubscriptionCheckout(context: SubscriptionCheckoutContext): Promise<CheckoutResult>;
}

export class ProviderNotImplementedError extends Error {
  constructor(provider: string) {
    super(`Le provider de paiement "${provider}" n'est pas encore connecté.`);
  }
}
