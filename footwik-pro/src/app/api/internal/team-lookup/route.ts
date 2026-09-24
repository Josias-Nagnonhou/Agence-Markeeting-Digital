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
