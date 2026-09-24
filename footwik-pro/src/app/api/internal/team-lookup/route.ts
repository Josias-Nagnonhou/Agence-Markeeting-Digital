import { NextRequest, NextResponse } from "next/server";
import { searchTeam } from "@/lib/football/apiFootball";

// Outil temporaire pour résoudre les IDs/logos officiels API-Football des
// équipes de la V1. Protégé par la clé API elle-même en query param pour
// éviter un usage public non désiré du quota. À retirer une fois les logos
// figés dans src/lib/data/teams.ts.
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key || key !== process.env.API_FOOTBALL_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const name = req.nextUrl.searchParams.get("name");
  const all = req.nextUrl.searchParams.get("all");

  if (all) {
    const queries = [
      "Paris Saint Germain",
      "RC Lens",
      "Real Madrid",
      "Barcelona",
      "Manchester City",
      "Arsenal",
      "Inter",
      "AC Milan",
      "Bayern Munich",
      "Borussia Dortmund",
      "Senegal",
      "Ivory Coast",
      "Cameroon",
      "Benin",
      "ASEC Mimosas",
      "Africa Sports",
      "Jaraaf",
      "Casa Sports",
      "Coton Sport",
      "Buffles du Borgou",
    ];
    const results = [];
    for (const q of queries) {
      try {
        const team = await searchTeam(q);
        results.push({ query: q, team });
      } catch (err) {
        results.push({ query: q, error: err instanceof Error ? err.message : "lookup failed" });
      }
    }
    return NextResponse.json({ results });
  }

  if (!name) {
    return NextResponse.json({ error: "missing name" }, { status: 400 });
  }

  try {
    const team = await searchTeam(name);
    return NextResponse.json({ query: name, team });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "lookup failed" },
      { status: 502 },
    );
  }
}
