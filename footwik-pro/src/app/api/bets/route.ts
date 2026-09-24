import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return { supabase, user: data.user };
}

export async function POST(req: NextRequest) {
  const { supabase, user } = await requireUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const { matchLabel, market, odds, stake } = body;
  if (!matchLabel || !market || !odds || !stake) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
  }

  const { error } = await supabase.from("bets").insert({
    user_id: user.id,
    match_label: matchLabel,
    market,
    odds: Number(odds),
    stake: Number(stake),
    result: "en_attente",
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 502 });

  await supabase.from("activity_log").insert({
    user_id: user.id,
    activity_type: "pari_enregistre",
    label: `Pari enregistré : ${matchLabel} (${market})`,
    metadata: { stake, odds },
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const { supabase, user } = await requireUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id, result } = await req.json();
  if (!id || !result) return NextResponse.json({ error: "id et result requis." }, { status: 400 });

  const { error } = await supabase
    .from("bets")
    .update({ result, settled_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 502 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { supabase, user } = await requireUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id requis." }, { status: 400 });

  const { error } = await supabase.from("bets").delete().eq("id", id).eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 502 });

  return NextResponse.json({ ok: true });
}
