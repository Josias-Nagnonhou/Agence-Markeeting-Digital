import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

const DEFAULT_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";

export type AiJsonCallArgs = {
  system: string;
  prompt: string;
  maxTokens?: number;
};

/**
 * Appelle Gemini et force une réponse JSON, en la validant avec le schéma
 * Zod fourni. Chaque module IA (offer-engine, copywriting, cro-diagnostic,
 * section-retouch) passe son propre schéma pour garantir un contrat de
 * sortie stable.
 *
 * Gemini plutôt qu'un provider nécessitant une carte bancaire : le niveau
 * gratuit de Google AI Studio (aistudio.google.com/apikey) n'en demande pas
 * dans la plupart des pays.
 */
export async function callAiJson<T>(args: AiJsonCallArgs, parse: (raw: unknown) => T): Promise<T> {
  if (!genAI) throw new Error("GEMINI_API_KEY n'est pas configurée.");

  const response = await genAI.models.generateContent({
    model: DEFAULT_MODEL,
    contents: args.prompt,
    config: {
      systemInstruction: args.system,
      responseMimeType: "application/json",
      maxOutputTokens: args.maxTokens ?? 4096,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Réponse IA vide ou invalide.");
  }

  const raw = JSON.parse(text);
  return parse(raw);
}
