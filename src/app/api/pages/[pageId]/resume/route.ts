import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { PageNotFoundError } from "@/modules/page-builder/page.service";
import { PageNotPublishedError, resumePage } from "@/modules/hosting/hosting.service";

export async function POST(_request: Request, { params }: { params: Promise<{ pageId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { pageId } = await params;
  try {
    const result = await resumePage(session.user.id, pageId);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof PageNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof PageNotPublishedError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}
