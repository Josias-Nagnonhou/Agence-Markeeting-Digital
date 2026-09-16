import { callAiJson } from "@/lib/ai/ai-client";
import { fetchStockPhotoUrl } from "@/lib/images/stock-photo-client";
import { COPYWRITING_SYSTEM_PROMPT, buildCopywritingPrompt } from "@/lib/ai/prompts/copywriting";
import {
  buildSectionRetouchSystemPrompt,
  buildSectionRetouchPrompt,
  type RetouchTone,
  type RetouchLength,
} from "@/lib/ai/prompts/section-retouch";
import {
  getOrCreateDraftPageForProduct,
  getExistingPageForProduct,
  getOwnedPage,
  setPageHeroImage,
  NoSelectedOfferAngleError,
} from "@/modules/page-builder/page.service";
import {
  generatedCopyResponseSchema,
  toSectionRecords,
  sectionContentSchemaByType,
  type GeneratableSectionType,
} from "@/modules/copywriting/copywriting.types";
import {
  replaceSections,
  listSections,
  findSection,
  updateSectionContent,
} from "@/modules/copywriting/copywriting.repository";

export class SectionNotFoundError extends Error {
  constructor() {
    super("Bloc de contenu introuvable.");
  }
}

export class UnsupportedSectionTypeError extends Error {
  constructor() {
    super("Ce type de bloc n'est pas éditable.");
  }
}

export async function generateCopyForProduct(userId: string, productId: string) {
  const { page, product, selectedAngle } = await getOrCreateDraftPageForProduct(userId, productId);

  const copy = await callAiJson(
    {
      system: COPYWRITING_SYSTEM_PROMPT,
      prompt: buildCopywritingPrompt(product, selectedAngle),
      maxTokens: 4096,
    },
    (raw) => generatedCopyResponseSchema.parse(raw),
  );

  const sections = await replaceSections(page.id, toSectionRecords(copy));

  if (!page.ogImageUrl) {
    const heroImageUrl = product.images[0]?.url ?? (await fetchStockPhotoUrl(product.category));
    if (heroImageUrl) await setPageHeroImage(page.id, heroImageUrl);
  }

  return { page, sections };
}

export async function getCopyForProduct(userId: string, productId: string) {
  const page = await getExistingPageForProduct(userId, productId);
  if (!page) return { page: null, sections: [] };

  const sections = await listSections(page.id);
  return { page, sections };
}

export async function updateSection(
  userId: string,
  pageId: string,
  sectionId: string,
  content: unknown,
) {
  const page = await getOwnedPage(userId, pageId);
  const section = page.sections.find((s) => s.id === sectionId) ?? (await findSection(pageId, sectionId));
  if (!section) throw new SectionNotFoundError();

  const schema = sectionContentSchemaByType[section.type as GeneratableSectionType];
  if (!schema) throw new UnsupportedSectionTypeError();

  const parsedContent = schema.parse(content);
  return updateSectionContent(sectionId, parsedContent);
}

/**
 * Retouche IA d'un seul bloc (1.7) : régénère son contenu en ajustant le
 * ton et/ou la longueur, en restant cohérent avec le produit et l'angle
 * d'offre validé. Le résultat reste ensuite modifiable manuellement
 * comme n'importe quel bloc généré (1.3).
 */
export async function regenerateSection(
  userId: string,
  pageId: string,
  sectionId: string,
  options: { tone: RetouchTone; length: RetouchLength },
) {
  const page = await getOwnedPage(userId, pageId);
  const section = page.sections.find((s) => s.id === sectionId) ?? (await findSection(pageId, sectionId));
  if (!section) throw new SectionNotFoundError();
  if (!page.offerAngle) throw new NoSelectedOfferAngleError();

  const schema = sectionContentSchemaByType[section.type as GeneratableSectionType];
  if (!schema) throw new UnsupportedSectionTypeError();

  const newContent = await callAiJson(
    {
      system: buildSectionRetouchSystemPrompt(section.type),
      prompt: buildSectionRetouchPrompt(
        page.product,
        page.offerAngle,
        section.type,
        section.content,
        options.tone,
        options.length,
      ),
      maxTokens: 2048,
    },
    (raw) => schema.parse(raw),
  );

  return updateSectionContent(sectionId, newContent);
}
