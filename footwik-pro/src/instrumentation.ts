// One-shot startup task: resolve official API-Football ids/logos for the
// mock teams in src/lib/data/teams.ts. The sandbox that authors this app
// cannot reach the deployed URL directly, so the lookup runs here (on
// server boot, on Render's own network) and the result is written to the
// server logs instead of returned over HTTP.
// TEMPORARY — remove once src/lib/data/teams.ts has the resolved logo URLs.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (!process.env.API_FOOTBALL_KEY) return;

  const { searchTeam } = await import("@/lib/football/apiFootball");

  const queries: { q: string; country?: string }[] = [
    { q: "Lens", country: "France" },
    { q: "Inter", country: "Italy" },
    { q: "Bayern", country: "Germany" },
    { q: "Senegal" },
    { q: "Ivory Coast" },
    { q: "Cameroon" },
    { q: "Benin" },
    { q: "ASEC Mimosas" },
    { q: "Africa Sports" },
    { q: "Jaraaf" },
    { q: "Casa Sports" },
    { q: "Coton Sport" },
    { q: "Buffles du Borgou" },
  ];

  const results: Record<string, unknown> = {};
  for (const { q, country } of queries) {
    try {
      results[q] = await searchTeam(q, { country });
    } catch (err) {
      results[q] = { error: err instanceof Error ? err.message : "lookup failed" };
    }
    await new Promise((r) => setTimeout(r, 7000));
  }

  console.log("TEAM_LOOKUP_RESULT_START");
  console.log(JSON.stringify(results));
  console.log("TEAM_LOOKUP_RESULT_END");
}
