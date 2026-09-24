export type Verdict = "solide" | "moyen" | "risque";

export interface CouponSelectionInput {
  matchLabel: string;
  market: string;
  odds?: number;
}

export interface CouponSelectionResult extends CouponSelectionInput {
  verdict: Verdict;
  explanation: string;
  keyFacts: string[];
}

export interface CouponResult {
  selections: CouponSelectionResult[];
  overallRisk: Verdict;
  summary: string;
  demo: boolean;
}

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

const VERDICTS: Verdict[] = ["solide", "moyen", "risque"];

const DEMO_FACTS: Record<Verdict, string[]> = {
  solide: [
    "Forme récente stable pour le favori de cette sélection",
    "Aucune absence majeure connue à ce jour",
  ],
  moyen: [
    "Écart de niveau modéré entre les deux équipes",
    "Historique des confrontations directes équilibré",
  ],
  risque: [
    "Enjeu ou calendrier chargé pouvant peser sur la performance",
    "Marché sensible aux imprévus (cartons, exclusions, buts tardifs)",
  ],
};

const DEMO_EXPLANATIONS: Record<Verdict, (match: string, market: string) => string> = {
  solide: (match, market) =>
    `Sur "${market}" pour ${match}, les indicateurs disponibles vont dans le sens de cette sélection. Ce n'est jamais une certitude, mais le niveau de risque statistique paraît faible.`,
  moyen: (match, market) =>
    `Pour ${match}, le marché "${market}" est plausible mais sans avantage statistique marqué d'un côté ou de l'autre. À prendre avec un montant maîtrisé.`,
  risque: (match, market) =>
    `"${market}" sur ${match} comporte une part d'incertitude notable : ce type de sélection se vérifie moins souvent statistiquement. À revoir si votre coupon est déjà chargé en risque.`,
};

function demoVerdictFor(input: CouponSelectionInput): Verdict {
  const h = hashString(`${input.matchLabel}|${input.market}`);
  return VERDICTS[h % 3];
}

export function analyzeManualSelectionsDemo(selections: CouponSelectionInput[]): CouponResult {
  const results = selections.map((s) => {
    const verdict = demoVerdictFor(s);
    return {
      ...s,
      verdict,
      explanation: DEMO_EXPLANATIONS[verdict](s.matchLabel, s.market),
      keyFacts: DEMO_FACTS[verdict],
    };
  });
  return summarize(results, true);
}

function summarize(selections: CouponSelectionResult[], demo: boolean): CouponResult {
  const riskyCount = selections.filter((s) => s.verdict === "risque").length;
  const solidCount = selections.filter((s) => s.verdict === "solide").length;
  const overallRisk: Verdict =
    riskyCount >= 2 || riskyCount > solidCount ? "risque" : riskyCount === 1 ? "moyen" : "solide";

  const toReview = selections.filter((s) => s.verdict !== "solide");
  const summary =
    toReview.length === 0
      ? "Toutes les sélections de ce coupon paraissent statistiquement solides."
      : `${toReview.length} sélection${toReview.length > 1 ? "s" : ""} à revoir : ${toReview
          .map((s) => s.matchLabel)
          .join(", ")}.`;

  return { selections, overallRisk, summary, demo };
}

const ANTHROPIC_MODEL = "claude-sonnet-5";

async function callClaude(content: unknown[]): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 2000,
      messages: [{ role: "user", content }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic a renvoyé ${response.status}`);
  }
  const data = await response.json();
  const text = data?.content?.[0]?.text;
  if (!text) throw new Error("Réponse IA vide.");
  return text;
}

function parseCouponJson(text: string, demo: boolean): CouponResult {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Format de réponse IA invalide.");
  const parsed = JSON.parse(match[0]);
  const selections: CouponSelectionResult[] = (parsed.selections ?? []).map(
    (s: { matchLabel?: string; match?: string; market: string; verdict: Verdict; explanation: string; keyFacts?: string[] }) => ({
      matchLabel: s.matchLabel ?? s.match ?? "Match",
      market: s.market,
      verdict: s.verdict,
      explanation: s.explanation,
      keyFacts: s.keyFacts ?? [],
    }),
  );
  return summarize(selections, demo);
}

const PROMPT_INSTRUCTIONS = `Tu es un analyste football pour Footwik Pro. Analyse chaque sélection d'un coupon de pari sportif et réponds UNIQUEMENT en JSON strict de la forme :
{"selections":[{"matchLabel":"...","market":"...","verdict":"solide|moyen|risque","explanation":"phrase courte en français simple","keyFacts":["fait clé 1","fait clé 2"]}]}
"verdict" reflète le niveau de risque statistique de la sélection (solide = faible risque, moyen, risque = incertain). N'invente jamais de blessure ou d'information factuelle précise que tu ne connais pas avec certitude : reste général si tu n'as pas l'information. N'affirme jamais qu'un résultat est garanti.`;

export async function analyzeManualSelections(
  selections: CouponSelectionInput[],
): Promise<CouponResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return analyzeManualSelectionsDemo(selections);
  }
  try {
    const text = await callClaude([
      {
        type: "text",
        text: `${PROMPT_INSTRUCTIONS}\n\nSélections à analyser :\n${selections
          .map((s, i) => `${i + 1}. ${s.matchLabel} — ${s.market}${s.odds ? ` (cote ${s.odds})` : ""}`)
          .join("\n")}`,
      },
    ]);
    return parseCouponJson(text, false);
  } catch {
    return analyzeManualSelectionsDemo(selections);
  }
}

export async function analyzeImage(base64: string, mimeType: string): Promise<CouponResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      demo: true,
      overallRisk: "moyen",
      summary:
        "Exemple de résultat (mode démo) : l'analyse d'image nécessite une clé IA configurée côté serveur.",
      selections: [
        {
          matchLabel: "PSG vs Lens",
          market: "1X2 — Victoire PSG",
          verdict: "solide",
          explanation: DEMO_EXPLANATIONS.solide("PSG vs Lens", "1X2 — Victoire PSG"),
          keyFacts: DEMO_FACTS.solide,
        },
        {
          matchLabel: "Real Madrid vs Barcelone",
          market: "Plus de 2,5 buts",
          verdict: "moyen",
          explanation: DEMO_EXPLANATIONS.moyen("Real Madrid vs Barcelone", "Plus de 2,5 buts"),
          keyFacts: DEMO_FACTS.moyen,
        },
        {
          matchLabel: "Sénégal vs Côte d'Ivoire",
          market: "Les deux équipes marquent",
          verdict: "risque",
          explanation: DEMO_EXPLANATIONS.risque("Sénégal vs Côte d'Ivoire", "Les deux équipes marquent"),
          keyFacts: DEMO_FACTS.risque,
        },
      ],
    };
  }

  const text = await callClaude([
    {
      type: "image",
      source: { type: "base64", media_type: mimeType, data: base64 },
    },
    {
      type: "text",
      text: `${PROMPT_INSTRUCTIONS}\n\nCette image est une capture d'écran d'un coupon de pari. Identifie chaque match et chaque sélection visible, puis analyse-les.`,
    },
  ]);
  return parseCouponJson(text, false);
}
