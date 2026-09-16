import { z } from "zod";
import { DiagnosticCategory, DiagnosticSeverity } from "@/generated/prisma/enums";

export const diagnosticFindingSchema = z.object({
  category: z.nativeEnum(DiagnosticCategory),
  severity: z.nativeEnum(DiagnosticSeverity),
  title: z.string().min(5),
  recommendation: z.string().min(10),
});

export const diagnosticResponseSchema = z.object({
  score: z.number().int().min(0).max(100),
  summary: z.string().min(10),
  findings: z.array(diagnosticFindingSchema).min(3).max(10),
});

export type DiagnosticResponse = z.infer<typeof diagnosticResponseSchema>;

export const diagnosticInputSchema = z.discriminatedUnion("targetType", [
  z.object({ targetType: z.literal("INTERNAL_PAGE"), pageId: z.string().min(1) }),
  z.object({ targetType: z.literal("EXTERNAL_URL"), url: z.string().url("Colle une URL valide (https://...).") }),
]);

export type DiagnosticInput = z.infer<typeof diagnosticInputSchema>;

export const severityOrder: Record<DiagnosticSeverity, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

export const categoryLabels: Record<DiagnosticCategory, string> = {
  CLARITY: "Compréhension",
  TRUST: "Confiance",
  DESIRE: "Désir d'achat",
  FRICTION: "Friction",
  SEO: "SEO",
};

export const severityLabels: Record<DiagnosticSeverity, string> = {
  CRITICAL: "Critique",
  HIGH: "Élevée",
  MEDIUM: "Moyenne",
  LOW: "Faible",
};
