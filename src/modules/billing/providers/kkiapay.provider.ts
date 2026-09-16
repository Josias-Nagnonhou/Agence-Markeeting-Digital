import { nanoid } from "nanoid";
import type {
  AppBillingProvider,
  CheckoutResult,
  OrderCheckoutContext,
  SubscriptionCheckoutContext,
} from "@/modules/billing/billing.types";

/**
 * Kkiapay fonctionne par widget côté client (pas de session hébergée côté
 * serveur) : on renvoie la config nécessaire pour l'ouvrir, le vendeur
 * paie dans le widget, puis le frontend transmet l'ID de transaction à
 * `verifyKkiapayTransaction` pour confirmation côté serveur.
 *
 * Kkiapay ne propose pas d'abonnement récurrent natif dans son API de
 * base : `createSubscriptionCheckout` déclenche donc un paiement unique
 * représentant l'échéance du mois — une vraie récurrence automatique
 * nécessiterait un rechargement périodique via leur API, non implémenté
 * ici.
 */
export class KkiapayProvider implements AppBillingProvider {
  id = "KKIAPAY" as const;

  async createOrderCheckout(context: OrderCheckoutContext): Promise<CheckoutResult> {
    return this.buildWidgetConfig(context.amount, context.currency);
  }

  async createSubscriptionCheckout(context: SubscriptionCheckoutContext): Promise<CheckoutResult> {
    return this.buildWidgetConfig(context.amountPerMonth, context.currency);
  }

  private buildWidgetConfig(amount: number, currency: string): CheckoutResult {
    const publicKey = process.env.KKIAPAY_PUBLIC_KEY;
    if (!publicKey) throw new Error("KKIAPAY_PUBLIC_KEY n'est pas configurée.");

    return {
      mode: "widget",
      publicKey,
      amount,
      currency,
      providerRef: nanoid(16),
    };
  }
}

export async function verifyKkiapayTransaction(transactionId: string): Promise<{
  isSuccessful: boolean;
  amount: number;
}> {
  const privateKey = process.env.KKIAPAY_PRIVATE_KEY;
  if (!privateKey) throw new Error("KKIAPAY_PRIVATE_KEY n'est pas configurée.");

  const response = await fetch("https://api.kkiapay.me/api/v1/transactions/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-private-key": privateKey,
    },
    body: JSON.stringify({ transactionId }),
  });

  if (!response.ok) {
    throw new Error("Impossible de vérifier la transaction Kkiapay.");
  }

  const data = await response.json();
  return { isSuccessful: data.status === "SUCCESS", amount: data.amount };
}
