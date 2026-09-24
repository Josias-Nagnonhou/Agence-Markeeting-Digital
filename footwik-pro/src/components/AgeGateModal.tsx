"use client";

import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";

const STORAGE_KEY = "footwik_age_confirmed";

export function AgeGateModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const confirmed = window.localStorage.getItem(STORAGE_KEY);
      if (!confirmed) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function confirm() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // stockage indisponible, on laisse simplement fermer la modale
    }
    setVisible(false);
  }

  function leave() {
    window.location.href = "https://www.google.com";
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-2xl border border-pitch-400 bg-pitch-800 p-6 text-center shadow-glow">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
          <ShieldAlert size={24} />
        </div>
        <h2 className="mt-4 font-display text-xl font-bold uppercase text-ink">
          Accès réservé aux 18 ans et plus
        </h2>
        <p className="mt-2 text-sm text-ink-faint">
          Footwik Pro propose des analyses de matchs pouvant orienter des
          décisions de pari sportif. Ce contenu est réservé aux personnes
          majeures. En continuant, vous confirmez avoir 18 ans ou plus et
          acceptez de jouer de manière responsable.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={leave}
            className="flex-1 rounded-lg border border-pitch-400 px-4 py-2.5 text-sm font-medium text-ink-muted hover:bg-pitch-600"
          >
            J&apos;ai moins de 18 ans
          </button>
          <button
            onClick={confirm}
            className="flex-1 rounded-lg bg-grass px-4 py-2.5 text-sm font-semibold text-pitch-950 hover:bg-grass-light"
          >
            J&apos;ai 18 ans ou plus
          </button>
        </div>
      </div>
    </div>
  );
}
