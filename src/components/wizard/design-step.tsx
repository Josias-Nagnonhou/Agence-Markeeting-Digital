"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { SalesPageRenderer, type RenderableSection } from "@/components/landing/sales-page-renderer";

export interface TemplateOption {
  id: string;
  name: string;
  description: string | null;
  structure: unknown;
}

export function DesignStep({
  productId,
  pageId,
  sections,
  templates,
  initialTemplateId,
  ctaHref,
  heroImageUrl,
}: {
  productId: string;
  pageId: string;
  sections: RenderableSection[];
  templates: TemplateOption[];
  initialTemplateId: string | null;
  ctaHref: string;
  heroImageUrl?: string | null;
}) {
  const router = useRouter();
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId ?? templates[0]?.id ?? null);
  const [viewport, setViewport] = useState<"mobile" | "desktop">("mobile");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedTemplate = templates.find((template) => template.id === selectedTemplateId);
  const themeKey = (selectedTemplate?.structure as { themeKey?: string } | undefined)?.themeKey;

  async function handleSelectTemplate(templateId: string) {
    setSelectedTemplateId(templateId);
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/pages/${pageId}/template`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Échec de l'enregistrement.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'enregistrement.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => handleSelectTemplate(template.id)}
            className={cn(
              "rounded-2xl border p-4 text-left transition-colors",
              template.id === selectedTemplateId
                ? "border-gray-900 ring-2 ring-gray-900/10"
                : "border-gray-200 hover:border-gray-400",
            )}
          >
            <p className="font-semibold">{template.name}</p>
            <p className="mt-1 text-sm text-gray-500">{template.description}</p>
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          Aperçu en temps réel {isSaving && <span className="text-gray-400">(enregistrement...)</span>}
        </p>
        <div className="flex gap-1 rounded-lg border border-gray-200 p-1">
          <button
            type="button"
            onClick={() => setViewport("mobile")}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium",
              viewport === "mobile" ? "bg-gray-900 text-white" : "text-gray-500",
            )}
          >
            Mobile
          </button>
          <button
            type="button"
            onClick={() => setViewport("desktop")}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium",
              viewport === "desktop" ? "bg-gray-900 text-white" : "text-gray-500",
            )}
          >
            Desktop
          </button>
        </div>
      </div>

      <div className="flex justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 p-4">
        <div
          className={cn(
            "max-h-[720px] overflow-y-auto rounded-xl bg-white shadow-sm transition-all",
            viewport === "mobile" ? "w-full max-w-sm" : "w-full",
          )}
        >
          <SalesPageRenderer sections={sections} themeKey={themeKey} ctaHref={ctaHref} heroImageUrl={heroImageUrl} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => router.push(`/dashboard/products/${productId}/checkout`)}>
          Continuer vers le checkout
        </Button>
      </div>
    </div>
  );
}
