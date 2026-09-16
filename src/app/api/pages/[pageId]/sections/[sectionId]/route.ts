import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@/lib/auth/auth";
import { PageNotFoundError } from "@/modules/page-builder/page.service";
import {
  SectionNotFoundError,
  UnsupportedSectionTypeError,
  updateSection,
} from "@/modules/copywriting/copywriting.service";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ pageId: string; sectionId: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { pageId, sectionId } = await params;
  try {
    const body = await request.json();
    const section = await updateSection(session.user.id, pageId, sectionId, body.content);
    return NextResponse.json({ section });
  } catch (error) {
    if (error instanceof PageNotFoundError || error instanceof SectionNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof UnsupportedSectionTypeError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Contenu invalide." }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}
