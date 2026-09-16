import type { ProductCategory } from "@/generated/prisma/enums";

const apiKey = process.env.PEXELS_API_KEY;

/** Termes de recherche (en anglais, Pexels donne de meilleurs résultats
 * ainsi) par catégorie de produit, pour choisir une photo pertinente
 * quand le vendeur n'a pas lui-même uploadé de visuel. */
const CATEGORY_QUERY: Record<ProductCategory, string> = {
  FORMATION: "online course education laptop",
  EBOOK: "reading ebook digital book",
  COACHING: "coaching mentoring business meeting",
  TEMPLATE: "design template creative workspace",
  COMMUNAUTE: "community people connection",
  SAAS: "software dashboard technology",
  SERVICE: "professional service consulting",
  AUTRE: "digital product online business",
};

/**
 * Cherche une photo libre de droits pertinente pour illustrer une page de
 * vente sans visuel produit. Échoue silencieusement (retourne null) si la
 * clé n'est pas configurée ou si l'appel échoue, pour ne jamais bloquer la
 * génération de copy à cause d'un visuel manquant.
 */
export async function fetchStockPhotoUrl(category: ProductCategory): Promise<string | null> {
  if (!apiKey) return null;

  try {
    const query = encodeURIComponent(CATEGORY_QUERY[category]);
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${query}&per_page=1&orientation=landscape`,
      { headers: { Authorization: apiKey } },
    );
    if (!response.ok) return null;

    const data = await response.json();
    const photo = data.photos?.[0];
    return photo?.src?.large ?? null;
  } catch {
    return null;
  }
}
