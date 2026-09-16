import { NextResponse } from "next/server";
import { verifyStripeWebhookSignature } from "@/modules/billing/providers/stripe.provider";
import { handleStripeCheckoutCompleted } from "@/modules/billing/billing.service";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  const rawBody = await request.text();

  let event;
  try {
    event = verifyStripeWebhookSignature(rawBody, signature);
  } catch (error) {
    console.error("Signature Stripe invalide", error);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await handleStripeCheckoutCompleted({
      id: session.id,
      mode: session.mode,
      metadata: session.metadata,
    });
  }

  return NextResponse.json({ received: true });
}
