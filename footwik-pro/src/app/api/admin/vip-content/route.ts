import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

export async function POST(req: NextRequest) {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { title, contentType } = await req.json();
  if (!title || !["audio", "video", "message"].includes(contentType)) {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
  }

  const { error } = await supabase
    .from("vip_contents")
    .insert({ title, content_type: contentType, created_by: user.id });
  if (error) return NextResponse.json({ error: error.message }, { status: 502 });

  return NextResponse.json({ ok: true });
}
