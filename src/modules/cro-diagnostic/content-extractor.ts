const MAX_CONTENT_LENGTH = 8000;

interface SectionLike {
  type: string;
  content: unknown;
}

/**
 * Sérialise les sections structurées d'une page interne en texte brut
 * lisible par l'IA, sans dépendre du rendu visuel.
 */
export function serializeSectionsToText(sections: SectionLike[]): string {
  const parts = sections.map((section) => {
    const content = section.content as Record<string, unknown>;
    switch (section.type) {
      case "HEADLINE":
      case "SUBHEADLINE":
        return `[${section.type}] ${content.text}`;
      case "PROBLEM_AGITATION":
        return `[PROBLEME] ${content.title}\n${content.body}`;
      case "BENEFITS":
        return `[BENEFICES] ${content.title}\n- ${(content.items as string[]).join("\n- ")}`;
      case "SOCIAL_PROOF":
        return `[PREUVES SOCIALES] ${content.title}\n${(
          content.testimonials as { author: string; quote: string }[]
        )
          .map((t) => `"${t.quote}" — ${t.author}`)
          .join("\n")}`;
      case "OBJECTIONS":
        return `[OBJECTIONS] ${content.title}\n${(
          content.items as { question: string; answer: string }[]
        )
          .map((item) => `Q: ${item.question}\nR: ${item.answer}`)
          .join("\n")}`;
      case "CTA":
        return `[CTA] ${content.text}${content.subtext ? ` (${content.subtext})` : ""}`;
      default:
        return `[${section.type}] ${JSON.stringify(content)}`;
    }
  });

  return parts.join("\n\n").slice(0, MAX_CONTENT_LENGTH);
}

export class ExternalPageFetchError extends Error {
  constructor() {
    super("Impossible de récupérer le contenu de cette URL. Vérifie qu'elle est publiquement accessible.");
  }
}

/**
 * Récupère le HTML d'une URL externe et en extrait un texte brut
 * approximatif (suppression des scripts/styles/balises) pour l'analyse
 * IA. Pas de parsing HTML complet : suffisant pour un diagnostic CRO qui
 * ne dépend pas de la structure DOM exacte.
 */
export async function fetchExternalPageText(url: string): Promise<string> {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { "User-Agent": "OfferLab-CRO-Diagnostic/1.0" },
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new ExternalPageFetchError();
  }

  if (!response.ok) throw new ExternalPageFetchError();

  const html = await response.text();

  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) throw new ExternalPageFetchError();

  return text.slice(0, MAX_CONTENT_LENGTH);
}
