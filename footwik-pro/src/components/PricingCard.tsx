import { Check } from "lucide-react";
import { PricingPlan, SubscriptionRegion } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

export function PricingCard({
  plan,
  region,
  onSelect,
}: {
  plan: PricingPlan;
  region: SubscriptionRegion;
  onSelect?: (plan: PricingPlan) => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border p-6",
        plan.highlight
          ? "border-grass bg-pitch-800 shadow-glow"
          : "border-pitch-600 bg-pitch-800",
      )}
    >
      {plan.highlight && (
        <span className="mb-3 inline-block w-fit rounded-full bg-grass/15 px-3 py-1 text-xs font-semibold text-grass">
          Le plus choisi
        </span>
      )}
      <h3 className="font-display text-xl font-bold uppercase text-ink">{plan.name}</h3>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-display text-3xl font-bold text-ink">
          {formatPrice(plan.fcfa, plan.eur, region)}
        </span>
        {plan.fcfa > 0 && <span className="text-sm text-ink-faint">/ {plan.period}</span>}
      </div>
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
            : "border border-pitch-400 text-ink hover:bg-pitch-600",
        )}
      >
        {plan.fcfa === 0 ? "Commencer gratuitement" : "Choisir ce plan"}
      </button>
    </div>
  );
}
