import { Sparkles, Lock } from "lucide-react";

export const metadata = { title: "Assistant IA — Footwik Pro" };

export default function AssistantPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-grass/15 text-grass">
        <Sparkles size={26} />
      </div>
      <h1 className="mt-5 font-display text-3xl font-bold uppercase text-ink">
        Pose ta question à l&apos;IA
      </h1>
      <p className="mt-3 text-sm text-ink-faint">
        Bientôt disponible pour les abonnés Mois et VIP : demande par exemple
        &laquo; PSG-Lens ce soir ? &raquo; et reçois une analyse complète en
        français simple, basée sur les données du match.
      </p>

      <div className="mx-auto mt-8 max-w-md rounded-xl border border-pitch-600 bg-pitch-800 p-5 text-left">
        <div className="rounded-lg bg-pitch-600/40 px-4 py-3 text-sm text-ink-muted">
          PSG-Lens ce soir ?
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-pitch-400 px-4 py-3 text-sm text-ink-faint">
          <Lock size={14} /> Réponse de l&apos;assistant disponible prochainement
        </div>
      </div>

      <a
        href="/abonnement"
        className="mt-8 inline-block rounded-lg bg-grass px-6 py-3 font-semibold text-pitch-950 hover:bg-grass-light"
      >
        Être prévenu du lancement — s&apos;abonner
      </a>
    </div>
  );
}
