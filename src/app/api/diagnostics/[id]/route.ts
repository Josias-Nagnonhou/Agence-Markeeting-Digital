import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { DiagnosticNotFoundError, getDiagnosticForUser } from "@/modules/cro-diagnostic/cro-diagnostic.service";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;
  try {
    const diagnostic = await getDiagnosticForUser(session.user.id, id);
    return NextResponse.json({ diagnostic });
  } catch (error) {
    if (error instanceof DiagnosticNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}
