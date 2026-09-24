"use client";

import { useState } from "react";
import { Check, X, Clock } from "lucide-react";
import { PendingAnalysis } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/Badge";
import { ConfidenceStars } from "@/components/ConfidenceStars";
import { Confidence } from "@/lib/types";

export function ValidationQueue({ items }: { items: PendingAnalysis[] }) {
  const [queue, setQueue] = useState(
    items.map((i) => ({ ...i, decision: null as "approuvé" | "rejeté" | null })),
  );

  function decide(id: string, decision: "approuvé" | "rejeté") {
    setQueue((q) => q.map((item) => (item.id === id ? { ...item, decision } : item)));
  }

  return (
    <div className="space-y-3">
      {queue.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-3 rounded-xl border border-pitch-600 bg-pitch-800 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-ink">{item.match}</span>
              <Badge variant="outline">{item.competition}</Badge>
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs text-ink-faint">
              <span className="flex items-center gap-1">
                <Clock size={12} /> Généré {formatDate(item.generatedAt)}
              </span>
              <ConfidenceStars confidence={item.confidence as Confidence} size={12} />
            </div>
          </div>

          {item.decision ? (
            <Badge variant={item.decision === "approuvé" ? "win" : "loss"}>
              Fiche {item.decision}
            </Badge>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => decide(item.id, "rejeté")}
                className="flex items-center gap-1.5 rounded-lg border border-loss/40 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-loss/10"
              >
                <X size={14} /> Rejeter
              </button>
              <button
                onClick={() => decide(item.id, "approuvé")}
                className="flex items-center gap-1.5 rounded-lg bg-grass px-3 py-1.5 text-xs font-semibold text-pitch-950 hover:bg-grass-light"
              >
                <Check size={14} /> Valider et publier
              </button>
            </div>
          )}
        </div>
      ))}
      {queue.length === 0 && (
        <p className="text-sm text-ink-faint">Aucune fiche en attente de validation.</p>
      )}
    </div>
  );
}
