"use client";

import { useState } from "react";
import { X, Smartphone, CreditCard, Loader2 } from "lucide-react";
import { PricingPlan, SubscriptionRegion } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

const operators = [
  { id: "mtn", label: "MTN Mobile Money" },
  { id: "moov", label: "Moov Money" },
  { id: "wave", label: "Wave" },
  { id: "orange", label: "Orange Money" },
] as const;

export function CheckoutModal({
  plan,
  region,
  onClose,
}: {
  plan: PricingPlan;
  region: SubscriptionRegion;
  onClose: () => void;
}) {
  const [method, setMethod] = useState<"mobile_money" | "card">(
    region === "diaspora" ? "card" : "mobile_money",
  );
  const [operator, setOperator] = useState<(typeof operators)[number]["id"]>("mtn");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ paymentUrl: string; demo?: boolean } | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          region,
          paymentMethod: method,
          operator: method === "mobile_money" ? operator : undefined,
          provider: "fedapay",
          phone: method === "mobile_money" ? phone : undefined,
          email: method === "card" ? email : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Le paiement a échoué.");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-2xl border border-pitch-400 bg-pitch-800 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold uppercase text-ink">
            Abonnement {plan.name}
          </h2>
          <button onClick={onClose} className="text-ink-faint hover:text-ink" aria-label="Fermer">
            <X size={20} />
          </button>
        </div>
        <p className="mt-1 text-sm text-ink-faint">
          Montant à payer : <span className="font-semibold text-gold">{formatPrice(plan.fcfa, plan.eur, region)}</span>
        </p>

        {result ? (
          <div className="mt-5 rounded-lg border border-grass/30 bg-grass/5 p-4 text-sm">
            {result.demo && (
              <p className="mb-2 text-xs text-gold">
                Mode démo : aucune clé FedaPay/KkiaPay n&apos;est configurée, ce
                paiement est simulé.
              </p>
            )}
            <p className="text-ink-muted">
              Vous allez être redirigé vers votre prestataire de paiement pour
              confirmer la transaction.
            </p>
            <a
              href={result.paymentUrl}
              className="mt-3 block w-full rounded-lg bg-grass px-4 py-2.5 text-center text-sm font-semibold text-pitch-950 hover:bg-grass-light"
            >
              Continuer le paiement →
            </a>
          </div>
        ) : (
          <>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setMethod("mobile_money")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium",
                  method === "mobile_money"
                    ? "border-grass bg-grass/10 text-grass"
                    : "border-pitch-400 text-ink-muted",
                )}
              >
                <Smartphone size={16} /> Mobile Money
              </button>
              <button
                onClick={() => setMethod("card")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium",
                  method === "card"
                    ? "border-grass bg-grass/10 text-grass"
                    : "border-pitch-400 text-ink-muted",
                )}
              >
                <CreditCard size={16} /> Carte bancaire
              </button>
            </div>

            {method === "mobile_money" ? (
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {operators.map((op) => (
                    <button
                      key={op.id}
                      onClick={() => setOperator(op.id)}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-xs font-medium",
                        operator === op.id
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-pitch-400 text-ink-muted",
                      )}
                    >
                      {op.label}
                    </button>
                  ))}
                </div>
                <input
                  type="tel"
                  placeholder="Numéro de téléphone (ex : 90000000)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-pitch-400 bg-pitch-600/40 px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint"
                />
              </div>
            ) : (
              <div className="mt-4">
                <input
                  type="email"
                  placeholder="Adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-pitch-400 bg-pitch-600/40 px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint"
                />
                <p className="mt-2 text-xs text-ink-faint">
                  Vous serez redirigé vers une page de paiement sécurisée par
                  carte bancaire.
                </p>
              </div>
            )}

            {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

            <button
              onClick={submit}
              disabled={loading || (method === "mobile_money" ? !phone : !email)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-grass px-4 py-2.5 text-sm font-semibold text-pitch-950 hover:bg-grass-light disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Payer maintenant
            </button>
          </>
        )}
      </div>
    </div>
  );
}
