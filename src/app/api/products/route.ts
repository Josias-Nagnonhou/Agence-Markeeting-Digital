import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@/lib/auth/auth";
import { createProduct, getProductsForUser } from "@/modules/product/product.service";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const products = await getProductsForUser(session.user.id);
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const product = await createProduct(session.user.id, body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}
