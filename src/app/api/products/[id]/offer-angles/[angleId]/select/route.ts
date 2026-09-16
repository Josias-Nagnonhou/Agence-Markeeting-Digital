import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { ProductNotFoundError } from "@/modules/product/product.service";
import {
  OfferAngleNotFoundError,
  selectOfferAngle,
} from "@/modules/offer-engine/offer-engine.service";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string; angleId: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id, angleId } = await params;
  try {
    const angle = await selectOfferAngle(session.user.id, id, angleId);
    return NextResponse.json({ angle });
  } catch (error) {
    if (error instanceof ProductNotFoundError || error instanceof OfferAngleNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}
