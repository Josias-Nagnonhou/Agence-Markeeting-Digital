"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  matchId,
  initialFavorited,
  isLoggedIn,
}: {
  matchId: string;
  initialFavorited: boolean;
  isLoggedIn: boolean;
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!isLoggedIn) {
      window.location.href = `/connexion?next=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/favorites", {
        method: favorited ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId }),
      });
      if (res.ok) setFavorited((v) => !v);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50",
        favorited
          ? "border-gold/40 bg-gold/10 text-gold"
          : "border-pitch-400 text-ink-muted hover:bg-pitch-600",
      )}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Heart size={14} className={favorited ? "fill-gold" : ""} />
      )}
      {favorited ? "Dans mes favoris" : "Ajouter aux favoris"}
    </button>
  );
}
