import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { registerUser, EmailAlreadyUsedError } from "@/modules/auth/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await registerUser(body);
    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
    }
    if (error instanceof EmailAlreadyUsedError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}
