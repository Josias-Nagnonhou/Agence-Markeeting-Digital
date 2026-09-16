import { prisma } from "@/lib/db/prisma";
import type { DiagnosticTargetType } from "@/generated/prisma/enums";
import type { DiagnosticResponse } from "@/modules/cro-diagnostic/cro-diagnostic.types";

export async function createDiagnosticWithFindings(params: {
  userId: string;
  targetType: DiagnosticTargetType;
  pageId?: string;
  externalUrl?: string;
  result: DiagnosticResponse;
}) {
  const diagnostic = await prisma.diagnostic.create({
    data: {
      userId: params.userId,
      targetType: params.targetType,
      pageId: params.pageId,
      externalUrl: params.externalUrl,
      score: params.result.score,
      summary: params.result.summary,
      findings: {
        create: params.result.findings.map((finding, position) => ({
          category: finding.category,
          severity: finding.severity,
          title: finding.title,
          recommendation: finding.recommendation,
          position,
        })),
      },
    },
    include: { findings: { orderBy: { position: "asc" } } },
  });

  return diagnostic;
}

export function listDiagnosticsByUser(userId: string) {
  return prisma.diagnostic.findMany({
    where: { userId },
    include: { page: { select: { id: true, title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export function findDiagnosticByIdForUser(userId: string, diagnosticId: string) {
  return prisma.diagnostic.findFirst({
    where: { id: diagnosticId, userId },
    include: {
      findings: { orderBy: { position: "asc" } },
      page: { select: { id: true, title: true, slug: true } },
    },
  });
}
