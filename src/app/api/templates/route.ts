import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getAvailableTemplates } from "@/modules/page-builder/page.service";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const templates = await getAvailableTemplates();
  return NextResponse.json({ templates });
}
