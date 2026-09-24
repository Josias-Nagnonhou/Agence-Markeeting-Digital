"use client";

import { useState } from "react";
import { Settings2, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_COMPETITIONS } from "@/lib/data/competitions";

export function AlertPreferences({ initialSelected }: { initialSelected: string[] }) {
  const [open, setOpen] = useState(initialSelected.length === 0);
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function toggle(c: string) {
    setSelected((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/alerts/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competitions: selected }),
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-pitch-600 bg-pitch-800 p-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-sm font-semibold text-ink"
      >
        <span className="flex items-center gap-2">
          <Settings2 size={16} className="text-grass" /> Mes compétitions suivies
        </span>
        <span className="text-xs text-ink-faint">
          {selected.length === 0 ? "Toutes" : `${selected.length} sélectionnée${selected.length > 1 ? "s" : ""}`}
        </span>
      </button>

      {open && (
        <div className="mt-3">
          <p className="text-xs text-ink-faint">
            Sans sélection, vous recevez toutes les alertes. Cochez des
            compétitions pour ne voir que celles qui vous intéressent.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ALL_COMPETITIONS.map((c) => (
              <button
                key={c}
                onClick={() => toggle(c)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium",
                  selected.includes(c)
                    ? "border-grass bg-grass/10 text-grass"
                    : "border-pitch-400 text-ink-muted",
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="mt-3 flex items-center gap-2 rounded-lg bg-grass px-4 py-2 text-sm font-semibold text-pitch-950 hover:bg-grass-light disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
            {saved ? "Enregistré" : "Enregistrer mes préférences"}
          </button>
        </div>
      )}
    </div>
  );
}
