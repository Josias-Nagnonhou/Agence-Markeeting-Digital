"use client";

import { useState } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";

export function WaitlistModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit() {
    if (!email) {
      setError("Merci de renseigner votre email.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/vip-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Une erreur est survenue.");
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gold/40 bg-pitch-800 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold uppercase text-ink">
            Liste d&apos;attente VIP
          </h2>
          <button onClick={onClose} className="text-ink-faint hover:text-ink" aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        {done ? (
          <div className="mt-5 flex flex-col items-center gap-2 text-center">
            <CheckCircle2 className="text-grass" size={32} />
            <p className="text-sm text-ink-muted">
              Vous êtes inscrit·e. Nous vous préviendrons dès qu&apos;une place
              VIP se libère.
            </p>
          </div>
        ) : (
          <>
            <p className="mt-1 text-sm text-ink-faint">
              Les 200 places VIP sont actuellement toutes prises. Laissez
              votre email pour être averti·e en priorité dès qu&apos;une
              place se libère.
            </p>
            <input
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-4 w-full rounded-lg border border-pitch-400 bg-pitch-600/40 px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint"
            />
            {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
            <button
              onClick={submit}
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-pitch-950 hover:bg-gold/90 disabled:opacity-50"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Rejoindre la liste d&apos;attente
            </button>
          </>
        )}
      </div>
    </div>
  );
}
