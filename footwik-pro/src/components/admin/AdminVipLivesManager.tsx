"use client";

import { useState } from "react";
import { Send, Loader2, Video } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface VipLiveRow {
  id: string;
  title: string;
  scheduled_at: string;
  access_url: string | null;
}

export function AdminVipLivesManager({ initial }: { initial: VipLiveRow[] }) {
  const [lives, setLives] = useState(initial);
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [accessUrl, setAccessUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function publish() {
    if (!title.trim() || !scheduledAt) {
      setError("Titre et date/heure requis.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const iso = new Date(scheduledAt).toISOString();
      const res = await fetch("/api/admin/vip-lives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, scheduledAt: iso, accessUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec de la publication.");
      setLives((l) => [{ id: crypto.randomUUID(), title, scheduled_at: iso, access_url: accessUrl || null }, ...l]);
      setTitle("");
      setScheduledAt("");
      setAccessUrl("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="rounded-xl border border-pitch-600 bg-pitch-800 p-4">
        <div className="grid gap-2 sm:grid-cols-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du live"
            className="rounded-lg border border-pitch-400 bg-pitch-600/40 px-3 py-2 text-sm text-ink placeholder:text-ink-faint sm:col-span-1"
          />
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="rounded-lg border border-pitch-400 bg-pitch-600/40 px-3 py-2 text-sm text-ink"
          />
          <input
            value={accessUrl}
            onChange={(e) => setAccessUrl(e.target.value)}
            placeholder="Lien d'accès (optionnel)"
            className="rounded-lg border border-pitch-400 bg-pitch-600/40 px-3 py-2 text-sm text-ink placeholder:text-ink-faint"
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
        <button
          onClick={publish}
          disabled={loading}
          className="mt-3 flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-pitch-950 hover:bg-gold/90 disabled:opacity-50"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Programmer le live
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {lives.map((l) => (
          <div key={l.id} className="flex items-center gap-2 rounded-lg border border-pitch-600 bg-pitch-800 px-4 py-3 text-sm">
            <Video size={14} className="text-gold" />
            <span className="flex-1 text-ink">{l.title}</span>
            <span className="text-xs text-ink-faint">{formatDate(l.scheduled_at)}</span>
          </div>
        ))}
        {lives.length === 0 && <p className="text-sm text-ink-faint">Aucun live programmé.</p>}
      </div>
    </div>
  );
}
