import { HistoryExplorer } from "@/components/HistoryExplorer";
import {
  predictionHistory,
  computeStats,
  computeStatsByConfidence,
  computeStatsByCompetition,
  computeStatsByMonth,
} from "@/lib/data/history";
import { RateBar } from "@/components/RateBar";
import { formatPercent } from "@/lib/utils";

export const metadata = {
  title: "Historique public des pronostics — Footwik Pro",
};

export default function HistoriquePage() {
  const stats = computeStats();
  const byConfidence = computeStatsByConfidence();
  const byCompetition = computeStatsByCompetition();
  const byMonth = computeStatsByMonth();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold uppercase text-ink sm:text-4xl">
        Historique public des pronostics
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-faint">
        La transparence est notre différence : chaque pronostic publié est
        listé ici, gagné comme perdu, avec le résultat réel du match.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-grass/30 bg-grass/5 p-5 text-center">
          <div className="text-xs uppercase tracking-wide text-ink-faint">Taux de réussite global</div>
          <div className="mt-1 font-display text-4xl font-bold text-grass">
            {formatPercent(stats.rate)}
          </div>
          <div className="mt-1 text-xs text-ink-faint">
            {stats.won} gagnés / {stats.total} pronostics
          </div>
        </div>

        <div className="rounded-xl border border-pitch-600 bg-pitch-800 p-5">
          <div className="mb-3 text-xs uppercase tracking-wide text-ink-faint">Par indice de confiance</div>
          <div className="space-y-2.5">
            {[5, 4, 3, 2, 1].map((c) =>
              byConfidence[c] ? (
                <RateBar key={c} label={`${c} étoile${c > 1 ? "s" : ""}`} won={byConfidence[c].won} total={byConfidence[c].total} />
              ) : null,
            )}
          </div>
        </div>

        <div className="rounded-xl border border-pitch-600 bg-pitch-800 p-5">
          <div className="mb-3 text-xs uppercase tracking-wide text-ink-faint">Par mois</div>
          <div className="space-y-2.5">
            {Object.entries(byMonth).map(([month, s]) => (
              <RateBar key={month} label={month} won={s.won} total={s.total} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-pitch-600 bg-pitch-800 p-5">
        <div className="mb-3 text-xs uppercase tracking-wide text-ink-faint">Par compétition</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(byCompetition).map(([comp, s]) => (
            <RateBar key={comp} label={comp} won={s.won} total={s.total} />
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-bold uppercase text-ink">
          Tous les pronostics
        </h2>
        <HistoryExplorer entries={predictionHistory} />
      </div>
    </div>
  );
}
