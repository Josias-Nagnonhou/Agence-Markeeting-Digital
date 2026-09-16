import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { PageNotFoundError, NoSelectedOfferAngleError } from "@/modules/page-builder/page.service";
import {
  SectionNotFoundError,
  UnsupportedSectionTypeError,
  regenerateSection,
} from "@/modules/copywriting/copywriting.service";

export async function POST(
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
    const section = await regenerateSection(session.user.id, pageId, sectionId, {
      tone: body.tone ?? "STANDARD",
      length: body.length ?? "STANDARD",
    });
    return NextResponse.json({ section });
  } catch (error) {
    if (error instanceof PageNotFoundError || error instanceof SectionNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof NoSelectedOfferAngleError || error instanceof UnsupportedSectionTypeError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json(
      { error: "La retouche IA a échoué. Réessaie dans un instant." },
      { status: 502 },
    );
  }
}
