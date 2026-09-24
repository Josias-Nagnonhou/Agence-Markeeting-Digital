"use client";

import { useState } from "react";
import { Globe2 } from "lucide-react";
import { pricingPlans } from "@/lib/data/pricing";
import { PricingCard } from "@/components/PricingCard";
import { CheckoutModal } from "@/components/CheckoutModal";
import { PricingPlan, SubscriptionRegion } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function AbonnementPage() {
  const [region, setRegion] = useState<SubscriptionRegion>("afrique");
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold uppercase text-ink sm:text-4xl">
          Choisis ton abonnement
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-ink-faint">
          Débloque les fiches d&apos;analyse complètes, l&apos;assistant IA et
          les contenus VIP de Footwik.
        </p>

        <div className="mt-6 inline-flex items-center gap-1 rounded-full border border-pitch-400 bg-pitch-800 p-1">
          <button
            onClick={() => setRegion("afrique")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition",
              region === "afrique" ? "bg-grass text-pitch-950" : "text-ink-muted",
            )}
          >
            Afrique (FCFA)
          </button>
          <button
            onClick={() => setRegion("diaspora")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition",
              region === "diaspora" ? "bg-grass text-pitch-950" : "text-ink-muted",
            )}
          >
            <Globe2 size={14} /> Diaspora (€)
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {pricingPlans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            region={region}
            onSelect={(p) => (p.fcfa > 0 ? setSelectedPlan(p) : undefined)}
          />
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-pitch-600 bg-pitch-800 p-6 text-sm text-ink-faint">
        <h2 className="font-display text-base font-bold uppercase text-ink">
          Moyens de paiement
        </h2>
        <p className="mt-2">
          Mobile Money : MTN, Moov, Wave et Orange Money via FedaPay ou
          KkiaPay. Carte bancaire disponible pour les abonnés de la diaspora.
          Tous les paiements sont sécurisés et vous recevez une confirmation
          immédiate.
        </p>
      </div>

      {selectedPlan && (
        <CheckoutModal
          plan={selectedPlan}
          region={region}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
}
