"use client";

import { useState } from "react";
import { Mic, Video, MessageSquare, Send } from "lucide-react";
import { VipContent } from "@/lib/data/admin";
import { cn, formatShortDate } from "@/lib/utils";

const types: { id: VipContent["type"]; label: string; icon: typeof Mic }[] = [
  { id: "audio", label: "Audio", icon: Mic },
  { id: "video", label: "Vidéo", icon: Video },
  { id: "message", label: "Message", icon: MessageSquare },
];

export function VipPublisher({ initial }: { initial: VipContent[] }) {
  const [contents, setContents] = useState(initial);
  const [type, setType] = useState<VipContent["type"]>("message");
  const [title, setTitle] = useState("");

  function publish() {
    if (!title.trim()) return;
    setContents((c) => [
      { id: `v${Date.now()}`, title, type, publishedAt: new Date().toISOString() },
      ...c,
    ]);
    setTitle("");
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
            className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-pitch-950 hover:bg-gold/90"
          >
            <Send size={14} /> Publier
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {contents.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-lg border border-pitch-600 bg-pitch-800 px-4 py-3 text-sm">
            <div className="flex items-center gap-2">
              {c.type === "audio" && <Mic size={14} className="text-gold" />}
              {c.type === "video" && <Video size={14} className="text-gold" />}
              {c.type === "message" && <MessageSquare size={14} className="text-gold" />}
              <span className="text-ink">{c.title}</span>
            </div>
            <span className="text-xs text-ink-faint">{formatShortDate(c.publishedAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
