import { callClaudeJson } from "@/lib/ai/claude-client";
import { CRO_DIAGNOSTIC_SYSTEM_PROMPT, buildDiagnosticPrompt } from "@/lib/ai/prompts/cro-diagnostic";
import { getOwnedPage } from "@/modules/page-builder/page.service";
import {
  diagnosticInputSchema,
  diagnosticResponseSchema,
  type DiagnosticInput,
} from "@/modules/cro-diagnostic/cro-diagnostic.types";
import { serializeSectionsToText, fetchExternalPageText } from "@/modules/cro-diagnostic/content-extractor";
import {
  createDiagnosticWithFindings,
  listDiagnosticsByUser,
  findDiagnosticByIdForUser,
} from "@/modules/cro-diagnostic/cro-diagnostic.repository";

export class DiagnosticNotFoundError extends Error {
  constructor() {
    super("Diagnostic introuvable.");
  }
}

export class EmptyPageContentError extends Error {
  constructor() {
    super("Cette page n'a pas encore de contenu à analyser.");
  }
}

async function runDiagnostic(sourceLabel: string, content: string) {
  return callClaudeJson(
    {
      system: CRO_DIAGNOSTIC_SYSTEM_PROMPT,
      prompt: buildDiagnosticPrompt(sourceLabel, content),
      maxTokens: 4096,
    },
    (raw) => diagnosticResponseSchema.parse(raw),
  );
}

export async function createDiagnostic(userId: string, input: DiagnosticInput) {
  const data = diagnosticInputSchema.parse(input);

  if (data.targetType === "INTERNAL_PAGE") {
    const page = await getOwnedPage(userId, data.pageId);
    if (page.sections.length === 0) throw new EmptyPageContentError();

    const content = serializeSectionsToText(page.sections);
    const result = await runDiagnostic(`Page interne — ${page.title}`, content);

    return createDiagnosticWithFindings({
      userId,
      targetType: "INTERNAL_PAGE",
      pageId: page.id,
      result,
    });
  }

  const content = await fetchExternalPageText(data.url);
  const result = await runDiagnostic(data.url, content);

  return createDiagnosticWithFindings({
    userId,
    targetType: "EXTERNAL_URL",
    externalUrl: data.url,
    result,
  });
}

export function getDiagnosticsForUser(userId: string) {
  return listDiagnosticsByUser(userId);
}

export async function getDiagnosticForUser(userId: string, diagnosticId: string) {
  const diagnostic = await findDiagnosticByIdForUser(userId, diagnosticId);
  if (!diagnostic) throw new DiagnosticNotFoundError();
  return diagnostic;
}
