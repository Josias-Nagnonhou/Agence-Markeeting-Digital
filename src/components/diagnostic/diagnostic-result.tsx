import { cn } from "@/lib/utils/cn";
import { categoryLabels, severityLabels } from "@/modules/cro-diagnostic/cro-diagnostic.types";
import type { DiagnosticCategory, DiagnosticSeverity } from "@/generated/prisma/enums";
import { Card } from "@/components/ui/card";

export interface DiagnosticResultData {
  score: number | null;
  summary: string | null;
  findings: {
    id: string;
    category: DiagnosticCategory;
    severity: DiagnosticSeverity;
    title: string;
    recommendation: string;
  }[];
}

const severityBadgeClass: Record<DiagnosticSeverity, string> = {
  CRITICAL: "bg-red-100 text-red-700",
  HIGH: "bg-orange-100 text-orange-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  LOW: "bg-gray-100 text-gray-600",
};

export function DiagnosticResult({ result }: { result: DiagnosticResultData }) {
  return (
    <div className="space-y-4">
      <Card className="flex items-center gap-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xl font-semibold text-white">
          {result.score ?? "–"}
        </div>
        <p className="text-sm text-gray-600">{result.summary}</p>
      </Card>

      <div className="space-y-3">
        {result.findings.map((finding) => (
          <Card key={finding.id} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", severityBadgeClass[finding.severity])}>
                {severityLabels[finding.severity]}
              </span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                {categoryLabels[finding.category]}
              </span>
            </div>
            <p className="font-medium">{finding.title}</p>
            <p className="text-sm text-gray-600">{finding.recommendation}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
