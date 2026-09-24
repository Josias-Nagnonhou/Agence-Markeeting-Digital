"use client";

import { useMemo, useState } from "react";
import { PredictionHistoryEntry } from "@/lib/types";
import { formatShortDate } from "@/lib/utils";
import { Badge } from "@/components/Badge";
import { ConfidenceStars } from "@/components/ConfidenceStars";

export function HistoryExplorer({ entries }: { entries: PredictionHistoryEntry[] }) {
  const [competition, setCompetition] = useState("Toutes");
  const [confidence, setConfidence] = useState("Toutes");
  const [outcome, setOutcome] = useState("Tous");

  const competitions = useMemo(
    () => ["Toutes", ...Array.from(new Set(entries.map((e) => e.competition)))],
    [entries],
  );

  const filtered = entries.filter((e) => {
    if (competition !== "Toutes" && e.competition !== competition) return false;
    if (confidence !== "Toutes" && String(e.confidence) !== confidence) return false;
    if (outcome !== "Tous" && e.outcome !== outcome) return false;
    return true;
  });

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-3">
        <select
          value={competition}
          onChange={(e) => setCompetition(e.target.value)}
          className="rounded-lg border border-pitch-400 bg-pitch-800 px-3 py-2 text-sm text-ink"
        >
          {competitions.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={confidence}
          onChange={(e) => setConfidence(e.target.value)}
          className="rounded-lg border border-pitch-400 bg-pitch-800 px-3 py-2 text-sm text-ink"
        >
          <option>Toutes</option>
          {[5, 4, 3, 2, 1].map((c) => (
            <option key={c} value={c}>
              {c} étoile{c > 1 ? "s" : ""}
            </option>
          ))}
        </select>

        <select
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          className="rounded-lg border border-pitch-400 bg-pitch-800 px-3 py-2 text-sm text-ink"
        >
          <option value="Tous">Tous les résultats</option>
          <option value="gagne">Gagnés</option>
          <option value="perdu">Perdus</option>
        </select>

        <span className="ml-auto self-center text-xs text-ink-faint">
          {filtered.length} pronostic{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-pitch-600">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-pitch-600/50 text-xs uppercase text-ink-faint">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Compétition</th>
              <th className="px-4 py-3 font-medium">Match</th>
              <th className="px-4 py-3 font-medium">Pronostic</th>
              <th className="px-4 py-3 font-medium">Confiance</th>
              <th className="px-4 py-3 font-medium">Score final</th>
              <th className="px-4 py-3 font-medium">Résultat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pitch-600">
            {filtered.map((e) => (
              <tr key={e.id} className="bg-pitch-800">
                <td className="whitespace-nowrap px-4 py-3 text-ink-faint">{formatShortDate(e.date)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-ink-faint">{e.competition}</td>
                <td className="whitespace-nowrap px-4 py-3 text-ink">{e.match}</td>
                <td className="px-4 py-3 text-ink-muted">{e.pick}</td>
                <td className="px-4 py-3">
                  <ConfidenceStars confidence={e.confidence} size={13} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-ink">{e.finalScore}</td>
                <td className="px-4 py-3">
                  <Badge variant={e.outcome === "gagne" ? "win" : "loss"}>
                    {e.outcome === "gagne" ? "Gagné" : "Perdu"}
                  </Badge>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink-faint">
                  Aucun pronostic ne correspond à ces filtres.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
