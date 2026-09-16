import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { ProviderNotImplementedError } from "@/modules/billing/billing.types";
import { createPageCreationOrder } from "@/modules/billing/billing.service";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = await createPageCreationOrder(session.user.id, body.provider, body.pageId);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof ProviderNotImplementedError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json(
      { error: "La création de la commande a échoué. Vérifie la configuration du paiement." },
      { status: 502 },
    );
  }
}
