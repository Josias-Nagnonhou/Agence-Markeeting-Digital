import type { PaymentProvider } from "@/generated/prisma/enums";

export interface CheckoutContext {
  paymentLinkUrl: string;
  confirmationUrl: string;
}

/**
 * Un provider de checkout sait construire l'URL externe vers laquelle
 * rediriger l'acheteur, à partir du lien de paiement brut fourni par le
 * vendeur. Chaque provider décide s'il peut (et comment) faire revenir
 * l'acheteur automatiquement vers la page de confirmation.
 */
export interface CheckoutProvider {
  /** true si ce provider peut injecter une URL de retour automatique. */
  supportsAutoReturn: boolean;
  buildRedirectUrl(context: CheckoutContext): string;
}

export type PaymentProviderId = PaymentProvider;
