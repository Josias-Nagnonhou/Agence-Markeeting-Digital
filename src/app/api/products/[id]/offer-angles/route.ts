import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { ProductNotFoundError } from "@/modules/product/product.service";
import { generateOfferAngles, getOfferAngles } from "@/modules/offer-engine/offer-engine.service";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;
  try {
    const angles = await getOfferAngles(session.user.id, id);
    return NextResponse.json({ angles });
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;
  try {
    const angles = await generateOfferAngles(session.user.id, id);
    return NextResponse.json({ angles }, { status: 201 });
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json(
      { error: "La génération des angles d'offre a échoué. Réessaie dans un instant." },
      { status: 502 },
    );
  }
}
