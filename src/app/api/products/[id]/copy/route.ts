import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { ProductNotFoundError } from "@/modules/product/product.service";
import { NoSelectedOfferAngleError } from "@/modules/page-builder/page.service";
import { generateCopyForProduct, getCopyForProduct } from "@/modules/copywriting/copywriting.service";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;
  try {
    const result = await getCopyForProduct(session.user.id, id);
    return NextResponse.json(result);
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
    const result = await generateCopyForProduct(session.user.id, id);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof NoSelectedOfferAngleError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json(
      { error: "La génération du copywriting a échoué. Réessaie dans un instant." },
      { status: 502 },
    );
  }
}
