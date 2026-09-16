import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5";

export type ClaudeJsonCallArgs = {
  system: string;
  prompt: string;
  maxTokens?: number;
};

/**
 * Appelle Claude et force une réponse JSON, en la validant avec le schéma
 * Zod fourni. Chaque module IA (offer-engine, copywriting, cro-diagnostic)
 * passe son propre schéma pour garantir un contrat de sortie stable.
 */
export async function callClaudeJson<T>(
  args: ClaudeJsonCallArgs,
  parse: (raw: unknown) => T,
): Promise<T> {
  const response = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: args.maxTokens ?? 4096,
    system: args.system,
    messages: [{ role: "user", content: args.prompt }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Réponse IA vide ou invalide.");
  }

  const jsonMatch = textBlock.text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Aucun JSON trouvé dans la réponse IA.");
  }

  const raw = JSON.parse(jsonMatch[0]);
  return parse(raw);
}

export { anthropic, DEFAULT_MODEL };
