import type { CheckoutProvider, PaymentProviderId } from "@/modules/checkout/checkout.types";
import { ChariowProvider } from "@/modules/checkout/providers/chariow.provider";
import { GenericLinkProvider } from "@/modules/checkout/providers/generic-link.provider";
import { getPageBySlug } from "@/modules/page-builder/page.service";

const genericProvider = new GenericLinkProvider();

function getProvider(paymentProvider: PaymentProviderId): CheckoutProvider {
  if (paymentProvider === "CHARIOW") return new ChariowProvider();
  return genericProvider;
}

export function buildConfirmationUrl(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${baseUrl}/p/${slug}/merci`;
}

/**
 * Construit l'URL externe finale vers laquelle rediriger l'acheteur pour
 * une page donnée (utilisée par la route publique `/p/[slug]/go`).
 */
export async function getCheckoutRedirectForSlug(slug: string) {
  const page = await getPageBySlug(slug);
  const provider = getProvider(page.product.paymentProvider);
  const confirmationUrl = buildConfirmationUrl(slug);

  const redirectUrl = provider.buildRedirectUrl({
    paymentLinkUrl: page.product.paymentLinkUrl,
    confirmationUrl,
  });

  return { redirectUrl, confirmationUrl, page };
}
