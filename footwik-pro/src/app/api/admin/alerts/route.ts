import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

export async function POST(req: NextRequest) {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { alertType, competition, teamName, message } = await req.json();
  if (!alertType || !message) {
    return NextResponse.json({ error: "Type et message requis." }, { status: 400 });
  }

  const { error } = await supabase.from("alerts").insert({
    alert_type: alertType,
    competition: competition || null,
    team_name: teamName || null,
    message,
    created_by: user.id,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 502 });

  return NextResponse.json({ ok: true });
}
