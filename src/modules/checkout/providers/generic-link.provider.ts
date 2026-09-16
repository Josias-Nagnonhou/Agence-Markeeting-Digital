import type { CheckoutContext, CheckoutProvider } from "@/modules/checkout/checkout.types";

/**
 * Provider par défaut pour tout lien de paiement externe dont on ne
 * connaît pas la convention de retour. On ne modifie pas l'URL — le
 * vendeur doit configurer lui-même l'URL de confirmation dans son outil.
 */
export class GenericLinkProvider implements CheckoutProvider {
  supportsAutoReturn = false;

  buildRedirectUrl({ paymentLinkUrl }: CheckoutContext): string {
    return paymentLinkUrl;
  }
}
