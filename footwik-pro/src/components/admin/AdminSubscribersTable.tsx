"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { PlanId } from "@/lib/types";
import { PLAN_LABELS } from "@/lib/entitlements";
import { formatShortDate } from "@/lib/utils";
import { Badge } from "@/components/Badge";

export interface AdminProfileRow {
  id: string;
  email: string | null;
  plan: PlanId;
  isFounder: boolean;
  isAdmin: boolean;
  createdAt: string;
}

const PLAN_OPTIONS: PlanId[] = ["gratuit", "semaine", "mois", "trimestre", "an", "vip"];

function Row({ row }: { row: AdminProfileRow }) {
  const [plan, setPlan] = useState(row.plan);
  const [isFounder, setIsFounder] = useState(row.isFounder);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/set-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: row.id, plan, isFounder }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec de la mise à jour.");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }

  return (
    <tr className="bg-pitch-800">
      <td className="whitespace-nowrap px-4 py-3 text-ink-faint">{row.email ?? "—"}</td>
      <td className="whitespace-nowrap px-4 py-3 text-ink-faint">{formatShortDate(row.createdAt)}</td>
      <td className="px-4 py-3">
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value as PlanId)}
          className="rounded-lg border border-pitch-400 bg-pitch-600/40 px-2 py-1.5 text-xs text-ink"
        >
          {PLAN_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {PLAN_LABELS[p]}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        <label className="flex items-center gap-1.5 text-xs text-ink-muted">
          <input type="checkbox" checked={isFounder} onChange={(e) => setIsFounder(e.target.checked)} />
          Fondateur
        </label>
      </td>
      <td className="px-4 py-3">
        {row.isAdmin && <Badge variant="gold">admin</Badge>}
      </td>
      <td className="px-4 py-3">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-1.5 rounded-lg border border-grass/40 px-3 py-1.5 text-xs font-medium text-grass hover:bg-grass/10 disabled:opacity-50"
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : saved ? <Check size={12} /> : null}
          {saved ? "Enregistré" : "Enregistrer"}
        </button>
        {error && <div className="mt-1 text-xs text-red-300">{error}</div>}
      </td>
    </tr>
  );
}

export function AdminSubscribersTable({ rows }: { rows: AdminProfileRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-pitch-600">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-pitch-600/50 text-xs uppercase text-ink-faint">
          <tr>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Inscrit le</th>
            <th className="px-4 py-3 font-medium">Formule</th>
            <th className="px-4 py-3 font-medium">Fondateur</th>
            <th className="px-4 py-3 font-medium">Rôle</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody className="divide-y divide-pitch-600">
          {rows.map((r) => (
            <Row key={r.id} row={r} />
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-ink-faint">
                Aucun abonné pour l&apos;instant.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
