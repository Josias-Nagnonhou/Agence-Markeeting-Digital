"use client";

import { useRef, useState } from "react";
import { Plus, Trash2, Loader2, ImageUp } from "lucide-react";
import { CouponResult } from "@/lib/coupon/analyze";
import { CouponResultView } from "@/components/coupon/CouponResultView";
import { cn } from "@/lib/utils";

type Row = { matchLabel: string; market: string; odds: string };

function emptyRow(): Row {
  return { matchLabel: "", market: "", odds: "" };
}

export function CouponAnalyzer({
  initialRemaining,
}: {
  initialRemaining: number | null;
}) {
  const [mode, setMode] = useState<"manuel" | "image">("manuel");
  const [rows, setRows] = useState<Row[]>([emptyRow()]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CouponResult | null>(null);
  const [remaining, setRemaining] = useState<number | null>(initialRemaining);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function updateRow(i: number, patch: Partial<Row>) {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }

  function addRow() {
    setRows((r) => [...r, emptyRow()]);
  }

  function removeRow(i: number) {
    setRows((r) => r.filter((_, idx) => idx !== i));
  }

  async function fileToBase64(file: File): Promise<string> {
    const buf = await file.arrayBuffer();
    let binary = "";
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  async function submit() {
    setError(null);
    if (remaining !== null && remaining <= 0) {
      setError("Vous avez atteint votre quota d'analyses de coupon pour ce mois.");
      return;
    }

    setLoading(true);
    try {
      let body: Record<string, unknown>;
      if (mode === "image") {
        if (!imageFile) {
          setError("Choisissez une image de votre coupon.");
          setLoading(false);
          return;
        }
        const base64 = await fileToBase64(imageFile);
        body = { mode: "image", imageBase64: base64, mimeType: imageFile.type };
      } else {
        const validRows = rows.filter((r) => r.matchLabel && r.market);
        if (validRows.length === 0) {
          setError("Ajoutez au moins une sélection (match + type de pari).");
          setLoading(false);
          return;
        }
        body = {
          mode: "manuel",
          selections: validRows.map((r) => ({
            matchLabel: r.matchLabel,
            market: r.market,
            odds: r.odds ? Number(r.odds) : undefined,
          })),
        };
      }

      const res = await fetch("/api/coupon/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "L'analyse a échoué.");
      setResult(data);
      if (typeof data.remaining === "number") setRemaining(data.remaining);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setMode("manuel")}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-medium",
              mode === "manuel" ? "border-grass bg-grass/10 text-grass" : "border-pitch-400 text-ink-muted",
            )}
          >
            Saisie manuelle
          </button>
          <button
            onClick={() => setMode("image")}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-medium",
              mode === "image" ? "border-grass bg-grass/10 text-grass" : "border-pitch-400 text-ink-muted",
            )}
          >
            Capture d&apos;écran
          </button>
        </div>
        {remaining !== null && (
          <span className="text-xs text-ink-faint">{remaining} analyse{remaining !== 1 ? "s" : ""} restante{remaining !== 1 ? "s" : ""} ce mois</span>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-pitch-600 bg-pitch-800 p-4">
        {mode === "manuel" ? (
          <div className="space-y-3">
            {rows.map((row, i) => (
              <div key={i} className="flex flex-col gap-2 sm:flex-row">
                <input
                  placeholder="Match (ex : PSG vs Lens)"
                  value={row.matchLabel}
                  onChange={(e) => updateRow(i, { matchLabel: e.target.value })}
                  className="flex-1 rounded-lg border border-pitch-400 bg-pitch-600/40 px-3 py-2 text-sm text-ink placeholder:text-ink-faint"
                />
                <input
                  placeholder="Type de pari (ex : 1X2 - Victoire PSG)"
                  value={row.market}
                  onChange={(e) => updateRow(i, { market: e.target.value })}
                  className="flex-1 rounded-lg border border-pitch-400 bg-pitch-600/40 px-3 py-2 text-sm text-ink placeholder:text-ink-faint"
                />
                <input
                  placeholder="Cote"
                  value={row.odds}
                  onChange={(e) => updateRow(i, { odds: e.target.value })}
                  className="w-24 rounded-lg border border-pitch-400 bg-pitch-600/40 px-3 py-2 text-sm text-ink placeholder:text-ink-faint"
                />
                <button
                  onClick={() => removeRow(i)}
                  className="flex items-center justify-center rounded-lg border border-pitch-400 px-3 text-ink-faint hover:text-red-300"
                  aria-label="Retirer cette sélection"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={addRow}
              className="flex items-center gap-1.5 text-sm font-medium text-grass hover:underline"
            >
              <Plus size={14} /> Ajouter une sélection
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <ImageUp className="text-ink-faint" size={28} />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="text-sm text-ink-muted file:mr-3 file:rounded-lg file:border-0 file:bg-grass file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-pitch-950"
            />
            {imageFile && <p className="text-xs text-ink-faint">{imageFile.name}</p>}
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

        <button
          onClick={submit}
          disabled={loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-grass px-4 py-2.5 text-sm font-semibold text-pitch-950 hover:bg-grass-light disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Analyser mon coupon
        </button>
      </div>

      {result && (
        <div className="mt-6">
          <CouponResultView result={result} />
        </div>
      )}
    </div>
  );
}
