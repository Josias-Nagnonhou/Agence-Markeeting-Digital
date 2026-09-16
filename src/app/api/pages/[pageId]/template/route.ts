import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import {
  PageNotFoundError,
  TemplateNotFoundError,
  selectTemplateForPage,
} from "@/modules/page-builder/page.service";

export async function PATCH(request: Request, { params }: { params: Promise<{ pageId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { pageId } = await params;
  try {
    const body = await request.json();
    const page = await selectTemplateForPage(session.user.id, pageId, body.templateId);
    return NextResponse.json({ page });
  } catch (error) {
    if (error instanceof PageNotFoundError || error instanceof TemplateNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}
