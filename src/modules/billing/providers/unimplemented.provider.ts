import type { BillingProvider as BillingProviderId } from "@/generated/prisma/enums";
import { ProviderNotImplementedError } from "@/modules/billing/billing.types";
import type { AppBillingProvider, CheckoutResult } from "@/modules/billing/billing.types";

/**
 * FedaPay et PayDunya sont prévus dans l'architecture (couverture Mobile
 * Money ouest-africaine) mais pas encore connectés — ce stub respecte
 * l'interface pour ne pas bloquer le reste du module quand on les
 * branchera, sans faire semblant de gérer un vrai paiement.
 */
export class UnimplementedProvider implements AppBillingProvider {
  constructor(public id: BillingProviderId) {}

  async createOrderCheckout(): Promise<CheckoutResult> {
    throw new ProviderNotImplementedError(this.id);
  }

  async createSubscriptionCheckout(): Promise<CheckoutResult> {
    throw new ProviderNotImplementedError(this.id);
  }
}
