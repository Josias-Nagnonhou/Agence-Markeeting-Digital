"use client";

import { useState } from "react";
import { Send, Loader2, Bell } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ALL_COMPETITIONS } from "@/lib/data/competitions";

export interface AlertRow {
  id: string;
  alert_type: string;
  competition: string | null;
  message: string;
  created_at: string;
}

const TYPES = [
  { id: "composition", label: "Composition" },
  { id: "blessure", label: "Blessure / forfait" },
  { id: "cote", label: "Mouvement de cote" },
];

export function AdminAlertsManager({ initial }: { initial: AlertRow[] }) {
  const [alerts, setAlerts] = useState(initial);
  const [alertType, setAlertType] = useState("composition");
  const [competition, setCompetition] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function publish() {
    if (!message.trim()) {
      setError("Le message est requis.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertType, competition, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec de la publication.");
      setAlerts((a) => [
        { id: crypto.randomUUID(), alert_type: alertType, competition: competition || null, message, created_at: new Date().toISOString() },
        ...a,
      ]);
      setMessage("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="rounded-xl border border-pitch-600 bg-pitch-800 p-4">
        <div className="grid gap-2 sm:grid-cols-2">
          <select
            value={alertType}
            onChange={(e) => setAlertType(e.target.value)}
            className="rounded-lg border border-pitch-400 bg-pitch-600/40 px-3 py-2 text-sm text-ink"
          >
            {TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
          <select
            value={competition}
            onChange={(e) => setCompetition(e.target.value)}
            className="rounded-lg border border-pitch-400 bg-pitch-600/40 px-3 py-2 text-sm text-ink"
          >
            <option value="">Toutes compétitions</option>
            {ALL_COMPETITIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message de l'alerte..."
          rows={2}
          className="mt-2 w-full rounded-lg border border-pitch-400 bg-pitch-600/40 px-3 py-2 text-sm text-ink placeholder:text-ink-faint"
        />
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
        <button
          onClick={publish}
          disabled={loading}
          className="mt-3 flex items-center gap-1.5 rounded-lg bg-grass px-4 py-2 text-sm font-semibold text-pitch-950 hover:bg-grass-light disabled:opacity-50"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Publier l&apos;alerte
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {alerts.map((a) => (
          <div key={a.id} className="flex items-start gap-2 rounded-lg border border-pitch-600 bg-pitch-800 px-4 py-3 text-sm">
            <Bell size={14} className="mt-0.5 text-grass" />
            <div className="flex-1">
              <p className="text-ink">{a.message}</p>
              <p className="text-xs text-ink-faint">
                {a.competition ? `${a.competition} · ` : ""}
                {formatDate(a.created_at)}
              </p>
            </div>
          </div>
        ))}
        {alerts.length === 0 && <p className="text-sm text-ink-faint">Aucune alerte publiée.</p>}
      </div>
    </div>
  );
}
