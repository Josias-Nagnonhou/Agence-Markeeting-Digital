import { NextRequest, NextResponse } from "next/server";
import { createFedaPayTransaction } from "@/lib/payments/fedapay";
import { createKkiapayTransaction } from "@/lib/payments/kkiapay";
import { pricingPlans } from "@/lib/data/pricing";

interface CheckoutBody {
  planId: string;
  region: "afrique" | "diaspora";
  paymentMethod: "mobile_money" | "card";
  operator?: "mtn" | "moov" | "wave" | "orange";
  provider?: "fedapay" | "kkiapay";
  phone?: string;
  email?: string;
}

export async function POST(req: NextRequest) {
  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const plan = pricingPlans.find((p) => p.id === body.planId);
  if (!plan) {
    return NextResponse.json({ error: "Plan d'abonnement inconnu." }, { status: 404 });
  }
  if (plan.fcfa === 0) {
    return NextResponse.json({ error: "Le plan gratuit ne nécessite aucun paiement." }, { status: 400 });
  }

  const amount = body.region === "diaspora" ? plan.eur : plan.fcfa;
  const origin = req.nextUrl.origin;
  const callbackUrl = `${origin}/compte/paiement/retour`;
  const description = `Footwik Pro — Abonnement ${plan.name}`;

  try {
    if (body.paymentMethod === "mobile_money") {
      if (!body.phone) {
        return NextResponse.json({ error: "Numéro de téléphone requis pour le Mobile Money." }, { status: 400 });
      }
      const provider = body.provider ?? "fedapay";
      const result =
        provider === "kkiapay"
          ? await createKkiapayTransaction({ amount, description, customerPhone: body.phone, callbackUrl })
          : await createFedaPayTransaction({ amount, description, customerPhone: body.phone, callbackUrl });

      return NextResponse.json({ ...result, provider });
    }

    // Paiement par carte bancaire (diaspora) : FedaPay gère aussi les cartes.
    const result = await createFedaPayTransaction({
      amount,
      description,
      customerEmail: body.email,
      callbackUrl,
    });
    return NextResponse.json({ ...result, provider: "fedapay" });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Le paiement a échoué." },
      { status: 502 },
    );
  }
}
