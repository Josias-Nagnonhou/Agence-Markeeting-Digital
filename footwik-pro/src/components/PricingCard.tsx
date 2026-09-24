import { Check, Sparkles } from "lucide-react";
import { PricingPlan, SubscriptionRegion } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { FOUNDER_PRICE_FCFA, FOUNDER_PRICE_EUR } from "@/lib/data/pricing";

export function PricingCard({
  plan,
  region,
  onSelect,
  founderSeatsRemaining,
  vipSeatsRemaining,
}: {
  plan: PricingPlan;
  region: SubscriptionRegion;
  onSelect?: (plan: PricingPlan) => void;
  founderSeatsRemaining?: number;
  vipSeatsRemaining?: number;
}) {
  const isFounderEligible = plan.id === "mois" && (founderSeatsRemaining ?? 0) > 0;
  const isVipFull = plan.id === "vip" && (vipSeatsRemaining ?? 1) <= 0;

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border p-6",
        plan.highlight
          ? "border-grass bg-pitch-800 shadow-glow"
          : plan.id === "vip"
            ? "border-gold/50 bg-pitch-800"
            : "border-pitch-600 bg-pitch-800",
      )}
    >
      {plan.badge && (
        <span
          className={cn(
            "mb-3 inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold",
            plan.highlight ? "bg-grass/15 text-grass" : "bg-gold/15 text-gold",
          )}
        >
          {plan.badge}
        </span>
      )}
      <h3 className="font-display text-xl font-bold uppercase text-ink">{plan.name}</h3>

      {isFounderEligible ? (
        <div className="mt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-gold">
              {formatPrice(FOUNDER_PRICE_FCFA, FOUNDER_PRICE_EUR, region)}
            </span>
            <span className="text-sm text-ink-faint line-through">
              {formatPrice(plan.fcfa, plan.eur, region)}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs font-medium text-gold">
            <Sparkles size={13} /> Prix fondateur à vie · Plus que {founderSeatsRemaining} place
            {founderSeatsRemaining !== 1 ? "s" : ""}
          </div>
        </div>
      ) : (
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-display text-3xl font-bold text-ink">
            {formatPrice(plan.fcfa, plan.eur, region)}
          </span>
          {plan.fcfa > 0 && <span className="text-sm text-ink-faint">/ {plan.period}</span>}
        </div>
      )}

      {plan.id === "vip" && (
        <div className="mt-1 text-xs text-ink-faint">
          {isVipFull
            ? "Toutes les places VIP sont prises"
            : `${vipSeatsRemaining} place${vipSeatsRemaining !== 1 ? "s" : ""} restante${vipSeatsRemaining !== 1 ? "s" : ""} sur 200`}
        </div>
      )}

      <ul className="mt-5 flex-1 space-y-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-ink-muted">
            <Check size={16} className="mt-0.5 shrink-0 text-grass" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => onSelect?.(plan)}
        className={cn(
          "mt-6 rounded-lg px-4 py-2.5 text-sm font-semibold transition",
          plan.highlight
            ? "bg-grass text-pitch-950 hover:bg-grass-light"
            : plan.id === "vip"
              ? "bg-gold text-pitch-950 hover:bg-gold/90"
              : "border border-pitch-400 text-ink hover:bg-pitch-600",
        )}
      >
        {plan.fcfa === 0
          ? "Commencer gratuitement"
          : isVipFull
            ? "Rejoindre la liste d'attente"
            : "Choisir ce plan"}
      </button>
    </div>
  );
}
