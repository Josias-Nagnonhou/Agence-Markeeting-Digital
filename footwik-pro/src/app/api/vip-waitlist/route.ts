import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (!body.email) {
    return NextResponse.json({ error: "Email requis." }, { status: 400 });
  }

  try {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("vip_waitlist")
      .insert({ email: body.email, user_id: userData.user?.id ?? null });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Impossible d'ajouter à la liste d'attente." },
      { status: 502 },
    );
  }
}
