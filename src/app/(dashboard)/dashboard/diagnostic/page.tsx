import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { getPagesForUser } from "@/modules/page-builder/page.service";
import { getDiagnosticsForUser } from "@/modules/cro-diagnostic/cro-diagnostic.service";
import { DiagnosticForm } from "@/components/diagnostic/diagnostic-form";
import { Card } from "@/components/ui/card";

export default async function DiagnosticPage() {
  const session = await auth();
  const [pages, diagnostics] = await Promise.all([
    getPagesForUser(session!.user.id),
    getDiagnosticsForUser(session!.user.id),
  ]);

  const pageOptions = pages.map((page) => ({
    id: page.id,
    title: page.title,
    slug: page.slug,
    productName: page.product.name,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Diagnostic CRO</h1>
        <p className="mt-1 text-sm text-gray-500">
          Colle une URL ou choisis une de tes pages : l&apos;IA identifie et priorise ce qui
          affaiblit la compréhension, la confiance ou le désir d&apos;achat.
        </p>
      </div>

      <DiagnosticForm pages={pageOptions} />

      {diagnostics.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold">Historique</h2>
          {diagnostics.map((diagnostic) => (
            <Link key={diagnostic.id} href={`/dashboard/diagnostic/${diagnostic.id}`}>
              <Card className="flex items-center gap-4 transition-shadow hover:shadow-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                  {diagnostic.score ?? "–"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {diagnostic.page?.title ?? diagnostic.externalUrl}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(diagnostic.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
