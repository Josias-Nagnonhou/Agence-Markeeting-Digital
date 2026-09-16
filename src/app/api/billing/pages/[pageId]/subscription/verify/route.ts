import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { PageNotFoundError } from "@/modules/page-builder/page.service";
import { verifyKkiapaySubscription } from "@/modules/billing/billing.service";

export async function POST(request: Request, { params }: { params: Promise<{ pageId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { pageId } = await params;
  try {
    const body = await request.json();
    const result = await verifyKkiapaySubscription(session.user.id, pageId, body.transactionId);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof PageNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ error: "La vérification du paiement a échoué." }, { status: 502 });
  }
}
