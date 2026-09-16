"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { PageStatus } from "@/generated/prisma/enums";

const statusLabels: Record<PageStatus, string> = {
  DRAFT: "Brouillon",
  PUBLISHED: "Publiée",
  PAUSED: "En pause",
};

const statusBadgeClass: Record<PageStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  PUBLISHED: "bg-green-100 text-green-700",
  PAUSED: "bg-amber-100 text-amber-700",
};

export function PublishStep({
  pageId,
  initialStatus,
  publicUrl,
  isReady,
  trialEndsAt,
}: {
  pageId: string;
  initialStatus: PageStatus;
  publicUrl: string;
  isReady: boolean;
  trialEndsAt: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function callAction(action: "publish" | "pause" | "resume") {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/pages/${pageId}/${action}`, { method: "POST" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Une erreur est survenue.");
      setStatus(body.page.status);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isReady) {
    return (
      <Card className="flex flex-col items-center gap-3 py-16 text-center">
        <h2 className="font-semibold">Ta page n&apos;est pas encore prête</h2>
        <p className="max-w-md text-sm text-gray-500">
          Génère le copywriting et choisis une direction visuelle avant de publier.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Statut</h2>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass[status]}`}>
            {statusLabels[status]}
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          <code className="flex-1 truncate text-sm text-gray-700">{publicUrl}</code>
          {status === "PUBLISHED" && (
            <a href={publicUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-gray-900 underline">
              Voir
            </a>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2">
          {status === "DRAFT" && (
            <Button onClick={() => callAction("publish")} isLoading={isLoading}>
              Publier la page
            </Button>
          )}
          {status === "PUBLISHED" && (
            <Button variant="secondary" onClick={() => callAction("pause")} isLoading={isLoading}>
              Mettre en pause
            </Button>
          )}
          {status === "PAUSED" && (
            <Button onClick={() => callAction("resume")} isLoading={isLoading}>
              Republier
            </Button>
          )}
        </div>
      </Card>

      {trialEndsAt && (
        <Card className="bg-gray-50 text-sm text-gray-600">
          Hébergement en essai gratuit jusqu&apos;au{" "}
          <span className="font-medium text-gray-900">
            {new Date(trialEndsAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
          </span>
          . L&apos;abonnement récurrent d&apos;hébergement sera géré dans la facturation de l&apos;app.
        </Card>
      )}
    </div>
  );
}
