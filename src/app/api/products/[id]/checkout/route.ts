import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@/lib/auth/auth";
import { ProductNotFoundError, updateProductPayment } from "@/modules/product/product.service";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const product = await updateProductPayment(session.user.id, id, body);
    return NextResponse.json({ product });
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}
