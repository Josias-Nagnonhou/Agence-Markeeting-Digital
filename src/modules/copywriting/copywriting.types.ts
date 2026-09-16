import { z } from "zod";
import { SectionType } from "@/generated/prisma/enums";

export const headlineContentSchema = z.object({ text: z.string().min(5) });
export const subheadlineContentSchema = z.object({ text: z.string().min(5) });
export const problemAgitationContentSchema = z.object({
  title: z.string().min(3),
  body: z.string().min(10),
});
export const benefitsContentSchema = z.object({
  title: z.string().min(3),
  items: z.array(z.string().min(3)).min(3).max(8),
});
export const testimonialSchema = z.object({
  author: z.string().min(1),
  role: z.string().optional().default(""),
  quote: z.string().min(1),
});
export const socialProofContentSchema = z.object({
  title: z.string().min(3),
  testimonials: z.array(testimonialSchema).min(1).max(6),
});
export const objectionItemSchema = z.object({
  question: z.string().min(3),
  answer: z.string().min(3),
});
export const objectionsContentSchema = z.object({
  title: z.string().min(3),
  items: z.array(objectionItemSchema).min(2).max(6),
});
export const ctaContentSchema = z.object({
  text: z.string().min(2),
  subtext: z.string().optional().default(""),
});

/** Schéma de contenu attendu par type de section, pour valider aussi bien
 * la génération IA que les modifications manuelles du vendeur. */
export const sectionContentSchemaByType = {
  HEADLINE: headlineContentSchema,
  SUBHEADLINE: subheadlineContentSchema,
  PROBLEM_AGITATION: problemAgitationContentSchema,
  BENEFITS: benefitsContentSchema,
  SOCIAL_PROOF: socialProofContentSchema,
  OBJECTIONS: objectionsContentSchema,
  CTA: ctaContentSchema,
} satisfies Partial<Record<SectionType, z.ZodType>>;

export type GeneratableSectionType = keyof typeof sectionContentSchemaByType;

export const generatedCopyResponseSchema = z.object({
  headline: headlineContentSchema,
  subheadline: subheadlineContentSchema,
  problemAgitation: problemAgitationContentSchema,
  benefits: benefitsContentSchema,
  socialProof: socialProofContentSchema,
  objections: objectionsContentSchema,
  cta: ctaContentSchema,
});

export type GeneratedCopyResponse = z.infer<typeof generatedCopyResponseSchema>;

export const sectionOrder: GeneratableSectionType[] = [
  "HEADLINE",
  "SUBHEADLINE",
  "PROBLEM_AGITATION",
  "BENEFITS",
  "SOCIAL_PROOF",
  "OBJECTIONS",
  "CTA",
];

export function toSectionRecords(copy: GeneratedCopyResponse) {
  return [
    { type: SectionType.HEADLINE, content: copy.headline },
    { type: SectionType.SUBHEADLINE, content: copy.subheadline },
    { type: SectionType.PROBLEM_AGITATION, content: copy.problemAgitation },
    { type: SectionType.BENEFITS, content: copy.benefits },
    { type: SectionType.SOCIAL_PROOF, content: copy.socialProof },
    { type: SectionType.OBJECTIONS, content: copy.objections },
    { type: SectionType.CTA, content: copy.cta },
  ];
}
