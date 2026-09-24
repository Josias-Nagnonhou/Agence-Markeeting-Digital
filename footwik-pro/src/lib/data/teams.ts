import { Team } from "@/lib/types";

function team(id: string, name: string, shortName: string, country: string): Team {
  return { id, name, shortName, country, logo: shortName.slice(0, 3).toUpperCase() };
}

export const teams: Record<string, Team> = {
  psg: team("psg", "Paris Saint-Germain", "PSG", "France"),
  lens: team("lens", "RC Lens", "Lens", "France"),
  real: team("real", "Real Madrid", "Real", "Espagne"),
  barca: team("barca", "FC Barcelone", "Barça", "Espagne"),
  city: team("city", "Manchester City", "City", "Angleterre"),
  arsenal: team("arsenal", "Arsenal", "Arsenal", "Angleterre"),
  inter: team("inter", "Inter Milan", "Inter", "Italie"),
  milan: team("milan", "AC Milan", "Milan", "Italie"),
  bayern: team("bayern", "Bayern Munich", "Bayern", "Allemagne"),
  dortmund: team("dortmund", "Borussia Dortmund", "Dortmund", "Allemagne"),
  senegal: team("senegal", "Sénégal", "Sénégal", "Sénégal"),
  cotedivoire: team("cotedivoire", "Côte d'Ivoire", "CIV", "Côte d'Ivoire"),
  cameroun: team("cameroun", "Cameroun", "Cameroun", "Cameroun"),
  benin: team("benin", "Bénin", "Bénin", "Bénin"),
  asec: team("asec", "ASEC Mimosas", "ASEC", "Côte d'Ivoire"),
  africasports: team("africasports", "Africa Sports", "Africa", "Côte d'Ivoire"),
  jaraaf: team("jaraaf", "Jaraaf de Dakar", "Jaraaf", "Sénégal"),
  casasport: team("casasport", "Casa Sports", "Casa", "Sénégal"),
  coton: team("coton", "Coton Sport", "Coton", "Cameroun"),
  buffles: team("buffles", "Buffles du Borgou", "Buffles", "Bénin"),
};
