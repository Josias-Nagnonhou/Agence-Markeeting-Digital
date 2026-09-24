"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, ThumbsUp, ThumbsDown, Loader2, ShieldAlert } from "lucide-react";
import { BetRow, computeBetStats } from "@/lib/bets/stats";
import { BetsChart } from "@/components/bets/BetsChart";
import { Badge } from "@/components/Badge";
import { formatShortDate } from "@/lib/utils";

export function BetsManager({
  initialBets,
  initialBudget,
}: {
  initialBets: BetRow[];
  initialBudget: number | null;
}) {
  const [bets, setBets] = useState(initialBets);
  const [budget, setBudget] = useState<number | null>(initialBudget);
  const [budgetInput, setBudgetInput] = useState(initialBudget?.toString() ?? "");
  const [form, setForm] = useState({ matchLabel: "", market: "", odds: "", stake: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo(() => computeBetStats(bets), [bets]);

  const thisMonthStake = useMemo(() => {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return bets
      .filter((b) => new Date(b.placed_at) >= start)
      .reduce((sum, b) => sum + b.stake, 0);
  }, [bets]);

  async function addBet() {
    setError(null);
    if (!form.matchLabel || !form.market || !form.odds || !form.stake) {
      setError("Merci de remplir match, type de pari, cote et mise.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/bets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Impossible d'enregistrer ce pari.");
      setBets((b) => [
        {
          id: crypto.randomUUID(),
          match_label: form.matchLabel,
          market: form.market,
          odds: Number(form.odds),
          stake: Number(form.stake),
          result: "en_attente",
          placed_at: new Date().toISOString(),
          settled_at: null,
        },
        ...b,
      ]);
      setForm({ matchLabel: "", market: "", odds: "", stake: "" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  async function setResult(id: string, result: "gagne" | "perdu") {
    setBets((b) => b.map((x) => (x.id === id ? { ...x, result, settled_at: new Date().toISOString() } : x)));
    await fetch("/api/bets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, result }),
    });
  }

  async function removeBet(id: string) {
    setBets((b) => b.filter((x) => x.id !== id));
    await fetch("/api/bets", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  async function saveBudget() {
    const value = Number(budgetInput);
    if (!value || value < 0) return;
    setBudget(value);
    await fetch("/api/budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monthlyLimit: value }),
    });
  }

  const budgetRatio = budget ? Math.min(100, (thisMonthStake / budget) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-pitch-600 bg-pitch-800 p-4">
          <div className="text-xs uppercase tracking-wide text-ink-faint">Total misé</div>
          <div className="mt-1 font-display text-xl font-bold text-ink">{stats.totalStaked.toLocaleString("fr-FR")} FCFA</div>
        </div>
        <div className="rounded-xl border border-pitch-600 bg-pitch-800 p-4">
          <div className="text-xs uppercase tracking-wide text-ink-faint">Bilan net</div>
          <div className={`mt-1 font-display text-xl font-bold ${stats.net >= 0 ? "text-grass" : "text-red-300"}`}>
            {stats.net >= 0 ? "+" : ""}
            {stats.net.toLocaleString("fr-FR")} FCFA
          </div>
        </div>
        <div className="rounded-xl border border-pitch-600 bg-pitch-800 p-4">
          <div className="text-xs uppercase tracking-wide text-ink-faint">Taux de réussite</div>
          <div className="mt-1 font-display text-xl font-bold text-ink">{stats.winRate.toFixed(0)}%</div>
        </div>
        <div className="rounded-xl border border-pitch-600 bg-pitch-800 p-4">
          <div className="text-xs uppercase tracking-wide text-ink-faint">Meilleur marché</div>
          <div className="mt-1 truncate font-display text-sm font-bold text-ink">
            {stats.bestMarket ? `${stats.bestMarket.market} (${stats.bestMarket.winRate.toFixed(0)}%)` : "—"}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-pitch-600 bg-pitch-800 p-5">
        <h3 className="font-display text-base font-bold uppercase text-ink">Évolution du bilan</h3>
        <div className="mt-3">
          <BetsChart data={stats.monthlyEvolution} />
        </div>
      </div>

      <div className="rounded-xl border border-gold/30 bg-gold-darker/20 p-5">
        <div className="flex items-center gap-2 text-gold">
          <ShieldAlert size={16} />
          <h3 className="font-display text-base font-bold uppercase text-ink">Budget mensuel responsable</h3>
        </div>
        <div className="mt-3 flex gap-2">
          <input
            type="number"
            placeholder="Budget max (FCFA)"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            className="flex-1 rounded-lg border border-pitch-400 bg-pitch-600/40 px-3 py-2 text-sm text-ink placeholder:text-ink-faint"
          />
          <button
            onClick={saveBudget}
            className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-pitch-950 hover:bg-gold/90"
          >
            Enregistrer
          </button>
        </div>
        {budget !== null && (
          <div className="mt-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-pitch-600">
              <div
                className={`h-full ${budgetRatio >= 100 ? "bg-loss" : budgetRatio >= 80 ? "bg-gold" : "bg-grass"}`}
                style={{ width: `${budgetRatio}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-ink-faint">
              {thisMonthStake.toLocaleString("fr-FR")} / {budget.toLocaleString("fr-FR")} FCFA misés ce mois
              {budgetRatio >= 80 && (
                <span className="ml-1 font-medium text-gold">
                  — vous approchez de votre budget.{" "}
                  <a href="/jeu-responsable" className="underline">
                    Jeu responsable
                  </a>
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-pitch-600 bg-pitch-800 p-5">
        <h3 className="font-display text-base font-bold uppercase text-ink">Enregistrer un pari</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-4">
          <input
            placeholder="Match"
            value={form.matchLabel}
            onChange={(e) => setForm((f) => ({ ...f, matchLabel: e.target.value }))}
            className="rounded-lg border border-pitch-400 bg-pitch-600/40 px-3 py-2 text-sm text-ink placeholder:text-ink-faint sm:col-span-2"
          />
          <input
            placeholder="Type de pari"
            value={form.market}
            onChange={(e) => setForm((f) => ({ ...f, market: e.target.value }))}
            className="rounded-lg border border-pitch-400 bg-pitch-600/40 px-3 py-2 text-sm text-ink placeholder:text-ink-faint sm:col-span-2"
          />
          <input
            placeholder="Cote"
            value={form.odds}
            onChange={(e) => setForm((f) => ({ ...f, odds: e.target.value }))}
            className="rounded-lg border border-pitch-400 bg-pitch-600/40 px-3 py-2 text-sm text-ink placeholder:text-ink-faint"
          />
          <input
            placeholder="Mise (FCFA)"
            value={form.stake}
            onChange={(e) => setForm((f) => ({ ...f, stake: e.target.value }))}
            className="rounded-lg border border-pitch-400 bg-pitch-600/40 px-3 py-2 text-sm text-ink placeholder:text-ink-faint"
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
        <button
          onClick={addBet}
          disabled={loading}
          className="mt-3 flex items-center gap-2 rounded-lg bg-grass px-4 py-2 text-sm font-semibold text-pitch-950 hover:bg-grass-light disabled:opacity-50"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          Ajouter
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-pitch-600">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-pitch-600/50 text-xs uppercase text-ink-faint">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Match</th>
              <th className="px-4 py-3 font-medium">Pari</th>
              <th className="px-4 py-3 font-medium">Cote</th>
              <th className="px-4 py-3 font-medium">Mise</th>
              <th className="px-4 py-3 font-medium">Résultat</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-pitch-600">
            {bets.map((b) => (
              <tr key={b.id} className="bg-pitch-800">
                <td className="whitespace-nowrap px-4 py-3 text-ink-faint">{formatShortDate(b.placed_at)}</td>
                <td className="px-4 py-3 text-ink">{b.match_label}</td>
                <td className="px-4 py-3 text-ink-muted">{b.market}</td>
                <td className="px-4 py-3 text-ink-muted">{b.odds}</td>
                <td className="px-4 py-3 text-ink-muted">{b.stake.toLocaleString("fr-FR")}</td>
                <td className="px-4 py-3">
                  {b.result === "en_attente" ? (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setResult(b.id, "gagne")}
                        className="rounded-full border border-grass/40 p-1.5 text-grass hover:bg-grass/10"
                        aria-label="Marquer gagné"
                      >
                        <ThumbsUp size={13} />
                      </button>
                      <button
                        onClick={() => setResult(b.id, "perdu")}
                        className="rounded-full border border-loss/40 p-1.5 text-red-300 hover:bg-loss/10"
                        aria-label="Marquer perdu"
                      >
                        <ThumbsDown size={13} />
                      </button>
                    </div>
                  ) : (
                    <Badge variant={b.result === "gagne" ? "win" : "loss"}>{b.result}</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => removeBet(b.id)} className="text-ink-faint hover:text-red-300" aria-label="Supprimer">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {bets.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink-faint">
                  Aucun pari enregistré pour l&apos;instant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
