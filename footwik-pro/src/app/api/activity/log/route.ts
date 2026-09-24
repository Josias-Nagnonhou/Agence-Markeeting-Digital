import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  let body: { activityType?: string; label?: string; metadata?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  if (!body.activityType || !body.label) {
    return NextResponse.json({ error: "activityType et label requis." }, { status: 400 });
  }

  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    await supabase.from("activity_log").insert({
      user_id: data.user.id,
      activity_type: body.activityType,
      label: body.label,
      metadata: body.metadata ?? {},
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Impossible de journaliser l'activité." },
      { status: 502 },
    );
  }
}
