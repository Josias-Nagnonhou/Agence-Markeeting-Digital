import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function PaiementRetourPage({
  searchParams,
}: {
  searchParams: { demo?: string; provider?: string; amount?: string };
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-grass/15 text-grass">
        <CheckCircle2 size={28} />
      </div>
      <h1 className="mt-4 font-display text-2xl font-bold uppercase text-ink">
        Paiement en cours de confirmation
      </h1>
      <p className="mt-2 text-sm text-ink-faint">
        {searchParams.demo
          ? "Ceci est une simulation de paiement (mode démo, aucune clé de paiement n'est configurée)."
          : "Votre transaction a été transmise à votre prestataire de paiement."}{" "}
        Dès que le paiement est confirmé, votre abonnement est activé
        automatiquement et vous recevez une notification.
      </p>
      <Link
        href="/compte"
        className="mt-6 rounded-lg bg-grass px-5 py-2.5 text-sm font-semibold text-pitch-950 hover:bg-grass-light"
      >
        Aller à mon espace abonné
      </Link>
    </div>
  );
}
