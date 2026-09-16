"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OfferAngleCard, type OfferAngleData } from "@/components/wizard/offer-angle-card";

export function OfferStep({
  productId,
  initialAngles,
}: {
  productId: string;
  initialAngles: OfferAngleData[];
}) {
  const router = useRouter();
  const [angles, setAngles] = useState(initialAngles);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialAngles.find((angle) => angle.status === "SELECTED")?.id ?? initialAngles[0]?.id ?? null,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch(`/api/products/${productId}/offer-angles`, { method: "POST" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "La génération a échoué.");
      setAngles(body.angles);
      setSelectedId(body.angles[0]?.id ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "La génération a échoué.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleConfirm() {
    if (!selectedId) return;
    setIsConfirming(true);
    setError(null);
    try {
      const response = await fetch(`/api/products/${productId}/offer-angles/${selectedId}/select`, {
        method: "POST",
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "La sélection a échoué.");
      router.push(`/dashboard/products/${productId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "La sélection a échoué.");
      setIsConfirming(false);
    }
  }

  if (angles.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-4 py-16 text-center">
        <div>
          <h2 className="font-semibold">Générer le positionnement d&apos;offre</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
            L&apos;IA va reformuler ta promesse, identifier les bénéfices clés et proposer 3 angles
            différenciants à partir des informations de ton produit.
          </p>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button size="lg" onClick={handleGenerate} isLoading={isGenerating}>
          Générer 3 angles d&apos;offre
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {angles
          .filter((angle) => angle.status !== "DISCARDED")
          .map((angle) => (
            <OfferAngleCard
              key={angle.id}
              angle={angle}
              isSelected={angle.id === selectedId}
              onSelect={() => setSelectedId(angle.id)}
            />
          ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={handleGenerate} isLoading={isGenerating}>
          Régénérer 3 nouveaux angles
        </Button>
        <Button onClick={handleConfirm} isLoading={isConfirming} disabled={!selectedId}>
          Confirmer cet angle et continuer
        </Button>
      </div>
    </div>
  );
}
