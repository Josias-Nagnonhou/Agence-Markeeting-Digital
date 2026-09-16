import type { CheckoutContext, CheckoutProvider } from "@/modules/checkout/checkout.types";

/**
 * Chariow (comme la plupart des checkouts hébergés) accepte un paramètre
 * de requête `redirect_url` pour renvoyer l'acheteur vers une page choisie
 * après paiement. On l'ajoute au lien fourni par le vendeur s'il n'en
 * définit pas déjà un lui-même.
 */
export class ChariowProvider implements CheckoutProvider {
  supportsAutoReturn = true;

  buildRedirectUrl({ paymentLinkUrl, confirmationUrl }: CheckoutContext): string {
    try {
      const url = new URL(paymentLinkUrl);
      if (!url.searchParams.has("redirect_url")) {
        url.searchParams.set("redirect_url", confirmationUrl);
      }
      return url.toString();
    } catch {
      return paymentLinkUrl;
    }
  }
}
