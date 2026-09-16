import Stripe from "stripe";
import type {
  AppBillingProvider,
  CheckoutResult,
  OrderCheckoutContext,
  SubscriptionCheckoutContext,
} from "@/modules/billing/billing.types";

function getStripeClient(): Stripe {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) throw new Error("STRIPE_SECRET_KEY n'est pas configurée.");
  return new Stripe(apiKey);
}

export class StripeProvider implements AppBillingProvider {
  id = "STRIPE" as const;

  async createOrderCheckout(context: OrderCheckoutContext): Promise<CheckoutResult> {
    const stripe = getStripeClient();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: context.currency.toLowerCase(),
            unit_amount: Math.round(context.amount * 100),
            product_data: { name: context.description },
          },
          quantity: 1,
        },
      ],
      success_url: context.successUrl,
      cancel_url: context.cancelUrl,
      metadata: { orderId: context.orderId },
    });

    if (!session.url) throw new Error("Stripe n'a pas renvoyé d'URL de paiement.");
    return { mode: "redirect", url: session.url, providerRef: session.id };
  }

  async createSubscriptionCheckout(context: SubscriptionCheckoutContext): Promise<CheckoutResult> {
    const stripe = getStripeClient();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: context.currency.toLowerCase(),
            unit_amount: Math.round(context.amountPerMonth * 100),
            recurring: { interval: "month" },
            product_data: { name: context.description },
          },
          quantity: 1,
        },
      ],
      success_url: context.successUrl,
      cancel_url: context.cancelUrl,
      metadata: { subscriptionId: context.subscriptionId },
    });

    if (!session.url) throw new Error("Stripe n'a pas renvoyé d'URL de paiement.");
    return { mode: "redirect", url: session.url, providerRef: session.id };
  }
}

export function verifyStripeWebhookSignature(rawBody: string, signature: string): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET n'est pas configurée.");

  const stripe = getStripeClient();
  return stripe.webhooks.constructEvent(rawBody, signature, secret);
}
