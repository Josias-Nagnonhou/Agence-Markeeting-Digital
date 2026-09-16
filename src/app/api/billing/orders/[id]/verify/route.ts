import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { OrderNotFoundError, verifyKkiapayOrder } from "@/modules/billing/billing.service";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const result = await verifyKkiapayOrder(session.user.id, id, body.transactionId);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof OrderNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ error: "La vérification du paiement a échoué." }, { status: 502 });
  }
}
