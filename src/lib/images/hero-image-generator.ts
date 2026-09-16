import { GoogleGenAI, Modality } from "@google/genai";
import type { ProductCategory } from "@/generated/prisma/enums";
import { uploadGeneratedImage } from "@/modules/storage/storage.service";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-3.1-flash-image";

/** Décrit le sujet à illustrer par catégorie de produit, pour un prompt
 * cohérent avec le type d'offre vendue. */
const CATEGORY_SUBJECT: Record<ProductCategory, string> = {
  FORMATION: "someone learning from an online video course on a laptop",
  EBOOK: "a person reading a digital ebook on a tablet",
  COACHING: "a coach mentoring a client during a business meeting",
  TEMPLATE: "a designer using a creative template on a computer screen",
  COMMUNAUTE: "a group of people connected and collaborating online",
  SAAS: "a modern software dashboard on a computer screen",
  SERVICE: "a professional consultant advising a client",
  AUTRE: "someone using a digital product on a laptop",
};

/**
 * Génère un visuel illustratif pour le hero d'une page de vente avec le
 * modèle image de Gemini (même clé API que le copywriting, sans nouvelle
 * inscription). Échoue silencieusement (retourne null) si la clé n'est pas
 * configurée ou si la génération échoue, pour ne jamais bloquer la
 * génération de copy à cause d'un visuel manquant.
 */
export async function generateHeroImageUrl(
  category: ProductCategory,
  productName: string,
): Promise<string | null> {
  if (!genAI) return null;

  try {
    const prompt = `Photo-realistic marketing illustration for a landing page, showing ${CATEGORY_SUBJECT[category]}. Context: a digital product called "${productName}". Clean, professional, natural lighting, no text or logo overlay, 16:9 landscape composition.`;

    const response = await genAI.models.generateContent({
      model: IMAGE_MODEL,
      contents: prompt,
      config: { responseModalities: [Modality.IMAGE] },
    });

    const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
    const inlineData = part?.inlineData;
    if (!inlineData?.data) return null;

    const uploaded = await uploadGeneratedImage(inlineData.data, inlineData.mimeType ?? "image/png");
    return uploaded.url;
  } catch {
    return null;
  }
}
