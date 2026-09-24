"use client";

import { useState } from "react";
import { Mic, Video, MessageSquare, Send, Loader2 } from "lucide-react";
import { cn, formatShortDate } from "@/lib/utils";

export interface VipContentRow {
  id: string;
  title: string;
  content_type: "audio" | "video" | "message";
  published_at: string;
}

const types: { id: VipContentRow["content_type"]; label: string; icon: typeof Mic }[] = [
  { id: "audio", label: "Audio", icon: Mic },
  { id: "video", label: "Vidéo", icon: Video },
  { id: "message", label: "Message", icon: MessageSquare },
];

export function VipPublisher({ initial }: { initial: VipContentRow[] }) {
  const [contents, setContents] = useState(initial);
  const [type, setType] = useState<VipContentRow["content_type"]>("message");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function publish() {
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/vip-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, contentType: type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec de la publication.");
      setContents((c) => [
        { id: crypto.randomUUID(), title, content_type: type, published_at: new Date().toISOString() },
        ...c,
      ]);
      setTitle("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="rounded-xl border border-pitch-600 bg-pitch-800 p-4">
        <div className="flex gap-2">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium",
                type === t.id ? "border-gold bg-gold/10 text-gold" : "border-pitch-400 text-ink-muted",
              )}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du contenu VIP à publier..."
            className="flex-1 rounded-lg border border-pitch-400 bg-pitch-600/40 px-3 py-2 text-sm text-ink placeholder:text-ink-faint"
          />
          <button
            onClick={publish}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-pitch-950 hover:bg-gold/90 disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Publier
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
      </div>

      <div className="mt-4 space-y-2">
        {contents.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-lg border border-pitch-600 bg-pitch-800 px-4 py-3 text-sm">
            <div className="flex items-center gap-2">
              {c.content_type === "audio" && <Mic size={14} className="text-gold" />}
              {c.content_type === "video" && <Video size={14} className="text-gold" />}
              {c.content_type === "message" && <MessageSquare size={14} className="text-gold" />}
              <span className="text-ink">{c.title}</span>
            </div>
            <span className="text-xs text-ink-faint">{formatShortDate(c.published_at)}</span>
          </div>
        ))}
        {contents.length === 0 && (
          <p className="text-sm text-ink-faint">Aucun contenu VIP publié pour l&apos;instant.</p>
        )}
      </div>
    </div>
  );
}
