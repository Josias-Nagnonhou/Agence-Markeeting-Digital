"use client";

import { useState } from "react";
import { RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";
import { PendingResult } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/Badge";

export function ResultsQueue({ items }: { items: PendingResult[] }) {
  const [queue, setQueue] = useState(
    items.map((i) => ({ ...i, outcome: null as "gagne" | "perdu" | null })),
  );

  function set(id: string, outcome: "gagne" | "perdu") {
    setQueue((q) => q.map((item) => (item.id === id ? { ...item, outcome } : item)));
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-xs text-ink-faint">
        <RefreshCw size={13} /> Mise à jour automatique via API-Football à la fin de chaque match — validation manuelle possible ci-dessous.
      </div>
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
              <div className="mt-1 text-xs text-ink-faint">
                {formatDate(item.kickoff)} · Pronostic : {item.pick}
              </div>
            </div>

            {item.outcome ? (
              <Badge variant={item.outcome === "gagne" ? "win" : "loss"}>
                Marqué {item.outcome === "gagne" ? "gagné" : "perdu"}
              </Badge>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => set(item.id, "perdu")}
                  className="flex items-center gap-1.5 rounded-lg border border-loss/40 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-loss/10"
                >
                  <ThumbsDown size={14} /> Perdu
                </button>
                <button
                  onClick={() => set(item.id, "gagne")}
                  className="flex items-center gap-1.5 rounded-lg bg-grass px-3 py-1.5 text-xs font-semibold text-pitch-950 hover:bg-grass-light"
                >
                  <ThumbsUp size={14} /> Gagné
                </button>
              </div>
            )}
          </div>
        ))}
        {queue.length === 0 && (
          <p className="text-sm text-ink-faint">Aucun résultat en attente de mise à jour.</p>
        )}
      </div>
    </div>
  );
}
