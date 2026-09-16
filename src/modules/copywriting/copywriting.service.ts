import { callClaudeJson } from "@/lib/ai/claude-client";
import { COPYWRITING_SYSTEM_PROMPT, buildCopywritingPrompt } from "@/lib/ai/prompts/copywriting";
import {
  getOrCreateDraftPageForProduct,
  getExistingPageForProduct,
  getOwnedPage,
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

  const copy = await callClaudeJson(
    {
      system: COPYWRITING_SYSTEM_PROMPT,
      prompt: buildCopywritingPrompt(product, selectedAngle),
      maxTokens: 4096,
    },
    (raw) => generatedCopyResponseSchema.parse(raw),
  );

  const sections = await replaceSections(page.id, toSectionRecords(copy));
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
