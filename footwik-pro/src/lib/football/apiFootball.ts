const API_FOOTBALL_BASE_URL = "https://v3.football.api-sports.io";

export interface ApiFootballTeam {
  id: number;
  name: string;
  logo: string;
  country: string;
}

const EXCLUDE_PATTERN = /\b(women|w|u1[0-9]|u2[0-9]|youth|reserves?|ii)\b/i;

export async function searchTeam(
  name: string,
  opts?: { country?: string },
): Promise<ApiFootballTeam | null> {
  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    throw new Error("API_FOOTBALL_KEY n'est pas configurée.");
  }

  const response = await fetch(
    `${API_FOOTBALL_BASE_URL}/teams?search=${encodeURIComponent(name)}`,
    { headers: { "x-apisports-key": apiKey } },
  );

  if (!response.ok) {
    throw new Error(`API-Football a renvoyé ${response.status}`);
  }

  const data = await response.json();
  const candidates: { team: ApiFootballTeam }[] = data?.response ?? [];
  if (candidates.length === 0) return null;

  const clean = candidates.filter((c) => !EXCLUDE_PATTERN.test(c.team.name));
  const pool = clean.length > 0 ? clean : candidates;

  const byCountry = opts?.country
    ? pool.find((c) => c.team.country?.toLowerCase() === opts.country!.toLowerCase())
    : undefined;

  const chosen = byCountry ?? pool[0];
  const t = chosen.team;
  return { id: t.id, name: t.name, logo: t.logo, country: t.country };
}
