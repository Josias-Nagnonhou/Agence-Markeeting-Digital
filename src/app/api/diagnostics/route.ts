import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@/lib/auth/auth";
import { PageNotFoundError } from "@/modules/page-builder/page.service";
import {
  createDiagnostic,
  getDiagnosticsForUser,
  EmptyPageContentError,
} from "@/modules/cro-diagnostic/cro-diagnostic.service";
import { ExternalPageFetchError } from "@/modules/cro-diagnostic/content-extractor";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const diagnostics = await getDiagnosticsForUser(session.user.id);
  return NextResponse.json({ diagnostics });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const diagnostic = await createDiagnostic(session.user.id, body);
    return NextResponse.json({ diagnostic }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
    }
    if (error instanceof PageNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof EmptyPageContentError || error instanceof ExternalPageFetchError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json(
      { error: "Le diagnostic a échoué. Réessaie dans un instant." },
      { status: 502 },
    );
  }
}
