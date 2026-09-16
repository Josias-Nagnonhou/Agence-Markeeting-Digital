import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { getDiagnosticForUser, DiagnosticNotFoundError } from "@/modules/cro-diagnostic/cro-diagnostic.service";
import { DiagnosticResult } from "@/components/diagnostic/diagnostic-result";

export default async function DiagnosticDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const diagnostic = await getDiagnosticForUser(session!.user.id, id).catch((error) => {
    if (error instanceof DiagnosticNotFoundError) return null;
    throw error;
  });
  if (!diagnostic) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/diagnostic" className="text-sm text-gray-500 underline">
          ← Retour au diagnostic
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          {diagnostic.page?.title ?? diagnostic.externalUrl}
        </h1>
      </div>

      <DiagnosticResult result={diagnostic} />
    </div>
  );
}
