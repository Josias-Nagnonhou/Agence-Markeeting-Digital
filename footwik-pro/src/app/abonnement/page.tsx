"use client";

import { useEffect, useState } from "react";
import { Globe2, Sparkles } from "lucide-react";
import { pricingPlans, FOUNDER_TOTAL_SEATS, VIP_TOTAL_SEATS } from "@/lib/data/pricing";
import { PricingCard } from "@/components/PricingCard";
import { CheckoutModal } from "@/components/CheckoutModal";
import { WaitlistModal } from "@/components/WaitlistModal";
import { PricingPlan, SubscriptionRegion } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function AbonnementPage() {
  const [region, setRegion] = useState<SubscriptionRegion>("afrique");
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [founderSeatsRemaining, setFounderSeatsRemaining] = useState(FOUNDER_TOTAL_SEATS);
  const [vipSeatsRemaining, setVipSeatsRemaining] = useState(VIP_TOTAL_SEATS);

  useEffect(() => {
    fetch("/api/plan-availability")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.founderSeatsRemaining === "number") setFounderSeatsRemaining(data.founderSeatsRemaining);
        if (typeof data.vipSeatsRemaining === "number") setVipSeatsRemaining(data.vipSeatsRemaining);
      })
      .catch(() => {});
  }, []);

  function handleSelect(plan: PricingPlan) {
    if (plan.fcfa === 0) return;
    if (plan.id === "vip" && vipSeatsRemaining <= 0) {
      setShowWaitlist(true);
      return;
    }
    setSelectedPlan(plan);
  }

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

        {founderSeatsRemaining > 0 && (
          <div className="mx-auto mt-5 flex max-w-md items-center justify-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-medium text-gold">
            <Sparkles size={16} />
            Offre Membre fondateur : plus que {founderSeatsRemaining} place
            {founderSeatsRemaining !== 1 ? "s" : ""} au forfait Mois à prix bloqué à vie
          </div>
        )}

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

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            region={region}
            onSelect={handleSelect}
            founderSeatsRemaining={founderSeatsRemaining}
            vipSeatsRemaining={vipSeatsRemaining}
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
      {showWaitlist && <WaitlistModal onClose={() => setShowWaitlist(false)} />}
    </div>
  );
}
