import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { matches } from "@/lib/data/matches";
import { generateOddsForMatch } from "@/lib/odds/generate";

// Alimente la table `odds` une fois par jour (voir le Render Cron Job
// "sync-odds"). Jamais appelée par le navigateur : tous les utilisateurs
// lisent uniquement la table Supabase, jamais l'API directement.
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createClient();
  const upcoming = matches.filter((m) => m.status !== "termine");

  let inserted = 0;
  for (const match of upcoming) {
    await supabase.from("odds").delete().eq("match_id", match.id);
    const rows = generateOddsForMatch(match).map((o) => ({
      match_id: o.matchId,
      bookmaker: o.bookmaker,
      market: o.market,
      pick: o.pick,
      odd: o.odd,
    }));
    const { error } = await supabase.from("odds").insert(rows);
    if (!error) inserted += rows.length;
  }

  return NextResponse.json({ ok: true, matches: upcoming.length, oddsRows: inserted });
}
