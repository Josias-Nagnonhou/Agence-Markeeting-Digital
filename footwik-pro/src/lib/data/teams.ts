import { Team } from "@/lib/types";

function team(
  id: string,
  name: string,
  shortName: string,
  country: string,
  primaryColor: string,
  accentColor: string,
  lightText = true,
  logoUrl?: string,
): Team {
  return {
    id,
    name,
    shortName,
    country,
    logo: shortName.slice(0, 3).toUpperCase(),
    primaryColor,
    accentColor,
    lightText,
    logoUrl,
  };
}

export const teams: Record<string, Team> = {
  psg: team("psg", "Paris Saint-Germain", "PSG", "France", "#113369", "#E30613", true, "https://media.api-sports.io/football/teams/85.png"),
  lens: team("lens", "RC Lens", "Lens", "France", "#FFD100", "#C8102E", false),
  real: team("real", "Real Madrid", "Real", "Espagne", "#1B3A8A", "#F5C542", true, "https://media.api-sports.io/football/teams/541.png"),
  barca: team("barca", "FC Barcelone", "Barça", "Espagne", "#A50044", "#004D98", true, "https://media.api-sports.io/football/teams/529.png"),
  city: team("city", "Manchester City", "City", "Angleterre", "#6CABDD", "#1C2C5B", false, "https://media.api-sports.io/football/teams/50.png"),
  arsenal: team("arsenal", "Arsenal", "Arsenal", "Angleterre", "#EF0107", "#063672", true, "https://media.api-sports.io/football/teams/42.png"),
  inter: team("inter", "Inter Milan", "Inter", "Italie", "#0B1F4B", "#000000"),
  milan: team("milan", "AC Milan", "Milan", "Italie", "#FB090B", "#000000", true, "https://media.api-sports.io/football/teams/489.png"),
  bayern: team("bayern", "Bayern Munich", "Bayern", "Allemagne", "#DC052D", "#0066B2"),
  dortmund: team("dortmund", "Borussia Dortmund", "Dortmund", "Allemagne", "#FDE100", "#000000", false, "https://media.api-sports.io/football/teams/165.png"),
  senegal: team("senegal", "Sénégal", "Sénégal", "Sénégal", "#00853F", "#FDEF42"),
  cotedivoire: team("cotedivoire", "Côte d'Ivoire", "CIV", "Côte d'Ivoire", "#F77F00", "#009A44", false),
  cameroun: team("cameroun", "Cameroun", "Cameroun", "Cameroun", "#007A33", "#CE1126"),
  benin: team("benin", "Bénin", "Bénin", "Bénin", "#008751", "#FCD116"),
  asec: team("asec", "ASEC Mimosas", "ASEC", "Côte d'Ivoire", "#FCD116", "#000000", false),
  africasports: team("africasports", "Africa Sports", "Africa", "Côte d'Ivoire", "#DA291C", "#007A33"),
  jaraaf: team("jaraaf", "Jaraaf de Dakar", "Jaraaf", "Sénégal", "#00A650", "#FFFFFF"),
  casasport: team("casasport", "Casa Sports", "Casa", "Sénégal", "#1D428A", "#FCD116"),
  coton: team("coton", "Coton Sport", "Coton", "Cameroun", "#C8102E", "#007A33"),
  buffles: team("buffles", "Buffles du Borgou", "Buffles", "Bénin", "#003DA5", "#FCD116"),
};
