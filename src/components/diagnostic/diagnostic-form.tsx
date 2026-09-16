"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { DiagnosticResult, type DiagnosticResultData } from "@/components/diagnostic/diagnostic-result";

export interface PageOption {
  id: string;
  title: string;
  slug: string;
  productName: string;
}

export function DiagnosticForm({
  pages,
  onCompleted,
}: {
  pages: PageOption[];
  onCompleted?: () => void;
}) {
  const [mode, setMode] = useState<"INTERNAL_PAGE" | "EXTERNAL_URL">(pages.length > 0 ? "INTERNAL_PAGE" : "EXTERNAL_URL");
  const [pageId, setPageId] = useState(pages[0]?.id ?? "");
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosticResultData | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    setResult(null);

    try {
      const body =
        mode === "INTERNAL_PAGE" ? { targetType: mode, pageId } : { targetType: mode, url };
      const response = await fetch("/api/diagnostics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const responseBody = await response.json();
      if (!response.ok) throw new Error(responseBody.error ?? "Le diagnostic a échoué.");
      setResult(responseBody.diagnostic);
      onCompleted?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Le diagnostic a échoué.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-1 rounded-lg border border-gray-200 p-1 sm:w-fit">
            <button
              type="button"
              onClick={() => setMode("INTERNAL_PAGE")}
              disabled={pages.length === 0}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium",
                mode === "INTERNAL_PAGE" ? "bg-gray-900 text-white" : "text-gray-500 disabled:opacity-40",
              )}
            >
              Une de mes pages
            </button>
            <button
              type="button"
              onClick={() => setMode("EXTERNAL_URL")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium",
                mode === "EXTERNAL_URL" ? "bg-gray-900 text-white" : "text-gray-500",
              )}
            >
              URL externe
            </button>
          </div>

          {mode === "INTERNAL_PAGE" ? (
            <div>
              <Label htmlFor="pageId">Page à analyser</Label>
              <Select id="pageId" value={pageId} onChange={(e) => setPageId(e.target.value)}>
                {pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.productName}
                  </option>
                ))}
              </Select>
            </div>
          ) : (
            <div>
              <Label htmlFor="url">URL de la page à analyser</Label>
              <Input
                id="url"
                placeholder="https://exemple.com/ma-page-de-vente"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" isLoading={isSubmitting}>
            Lancer le diagnostic
          </Button>
        </form>
      </Card>

      {result && <DiagnosticResult result={result} />}
    </div>
  );
}
