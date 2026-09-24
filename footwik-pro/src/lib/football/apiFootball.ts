const API_FOOTBALL_BASE_URL = "https://v3.football.api-sports.io";

export interface ApiFootballTeam {
  id: number;
  name: string;
  logo: string;
  country: string;
}

export async function searchTeam(name: string): Promise<ApiFootballTeam | null> {
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
  const first = data?.response?.[0]?.team;
  if (!first) return null;

  return { id: first.id, name: first.name, logo: first.logo, country: first.country };
}
