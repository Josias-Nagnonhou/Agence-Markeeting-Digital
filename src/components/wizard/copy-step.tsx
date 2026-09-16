"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionEditor, type SectionData } from "@/components/wizard/section-editor";

export function CopyStep({
  productId,
  pageId: initialPageId,
  initialSections,
  hasSelectedAngle,
}: {
  productId: string;
  pageId: string | null;
  initialSections: SectionData[];
  hasSelectedAngle: boolean;
}) {
  const router = useRouter();
  const [pageId, setPageId] = useState(initialPageId);
  const [sections, setSections] = useState(initialSections);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch(`/api/products/${productId}/copy`, { method: "POST" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "La génération a échoué.");
      setPageId(body.page.id);
      setSections(body.sections);
    } catch (err) {
      setError(err instanceof Error ? err.message : "La génération a échoué.");
    } finally {
      setIsGenerating(false);
    }
  }

  if (!hasSelectedAngle) {
    return (
      <Card className="flex flex-col items-center gap-3 py-16 text-center">
        <h2 className="font-semibold">Choisis d&apos;abord un angle d&apos;offre</h2>
        <p className="max-w-md text-sm text-gray-500">
          Le copywriting s&apos;appuie sur l&apos;angle d&apos;offre validé à l&apos;étape précédente.
        </p>
        <Button onClick={() => router.push(`/dashboard/products/${productId}/offer`)}>
          Retour à l&apos;étape Offre
        </Button>
      </Card>
    );
  }

  if (sections.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-4 py-16 text-center">
        <div>
          <h2 className="font-semibold">Générer le copywriting</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
            L&apos;IA va rédiger le headline, le sous-titre, la section problème/agitation, les
            bénéfices, les preuves sociales, la gestion des objections et l&apos;appel à l&apos;action
            — chaque bloc restera modifiable ensuite.
          </p>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button size="lg" onClick={handleGenerate} isLoading={isGenerating}>
          Générer le copywriting
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {sections.map((section) => (
          <SectionEditor key={section.id} section={section} pageId={pageId!} />
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={handleGenerate} isLoading={isGenerating}>
          Tout régénérer
        </Button>
        <Button onClick={() => router.push(`/dashboard/products/${productId}/design`)}>
          Continuer vers le design
        </Button>
      </div>
    </div>
  );
}
