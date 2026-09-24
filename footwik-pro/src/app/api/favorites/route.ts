import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMatchById } from "@/lib/data/matches";

async function requireUser() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return { supabase, user: data.user };
}

export async function POST(req: NextRequest) {
  const { matchId } = await req.json();
  const match = matchId ? getMatchById(matchId) : undefined;
  if (!match) return NextResponse.json({ error: "Match inconnu." }, { status: 400 });

  const { supabase, user } = await requireUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("favorites")
    .upsert({ user_id: user.id, match_id: matchId }, { onConflict: "user_id,match_id" });
  if (error) return NextResponse.json({ error: error.message }, { status: 502 });

  await supabase.from("activity_log").insert({
    user_id: user.id,
    activity_type: "favori_ajout",
    label: `Ajout aux favoris : ${match.home.shortName} vs ${match.away.shortName}`,
    metadata: { matchId },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { matchId } = await req.json();
  const match = matchId ? getMatchById(matchId) : undefined;
  if (!matchId) return NextResponse.json({ error: "Match inconnu." }, { status: 400 });

  const { supabase, user } = await requireUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("match_id", matchId);
  if (error) return NextResponse.json({ error: error.message }, { status: 502 });

  await supabase.from("activity_log").insert({
    user_id: user.id,
    activity_type: "favori_retrait",
    label: match
      ? `Retrait des favoris : ${match.home.shortName} vs ${match.away.shortName}`
      : "Retrait d'un favori",
    metadata: { matchId },
  });

  return NextResponse.json({ ok: true });
}
