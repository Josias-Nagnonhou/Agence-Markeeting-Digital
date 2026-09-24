import Link from "next/link";
import { Lock } from "lucide-react";

export function PremiumGate({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="blur-premium">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-pitch-900/70 p-6 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold">
          <Lock size={20} />
        </div>
        <p className="max-w-xs text-sm font-medium text-ink">
          Cette section est réservée aux abonnés Footwik Pro.
        </p>
        <Link
          href="/abonnement"
          className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-pitch-950 hover:bg-gold/90"
        >
          Débloquer avec un abonnement
        </Link>
      </div>
    </div>
  );
}
