"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

declare global {
  interface Window {
    openKkiapayWidget?: (config: {
      amount: number;
      key: string;
      sandbox?: boolean;
      currency?: string;
    }) => void;
  }
}

type Provider = "STRIPE" | "KKIAPAY";

function loadKkiapayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.openKkiapayWidget) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.kkiapay.me/k.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Impossible de charger le widget Kkiapay."));
    document.body.appendChild(script);
  });
}

export function BillingCheckoutButton({
  endpoint,
  kind,
  pageId,
  label,
}: {
  /** Route qui crée la session/checkout, ex. `/api/billing/orders`. */
  endpoint: string;
  /** Détermine comment construire l'URL de vérification Kkiapay après coup. */
  kind: "order" | "subscription";
  /** Requis si kind === "subscription". */
  pageId?: string;
  label: string;
}) {
  const router = useRouter();
  const [provider, setProvider] = useState<Provider>("STRIPE");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Le paiement a échoué.");

      if (body.checkout.mode === "redirect") {
        window.location.href = body.checkout.url;
        return;
      }

      // Widget Kkiapay — l'appel exact au SDK doit être revérifié contre
      // leur documentation à jour avant mise en production.
      await loadKkiapayScript();
      window.openKkiapayWidget?.({
        amount: body.checkout.amount,
        key: body.checkout.publicKey,
        currency: body.checkout.currency,
      });

      const verifyEndpoint =
        kind === "order"
          ? `/api/billing/orders/${body.order.id}/verify`
          : `/api/billing/pages/${pageId}/subscription/verify`;

      const handleSuccess = async (event: Event) => {
        const detail = (event as CustomEvent<{ transactionId: string }>).detail;
        if (!detail?.transactionId) return;

        const verifyResponse = await fetch(verifyEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactionId: detail.transactionId }),
        });
        const verifyBody = await verifyResponse.json();
        if (!verifyResponse.ok) {
          setError(verifyBody.error ?? "La vérification du paiement a échoué.");
          return;
        }
        router.refresh();
      };
      window.addEventListener("success", handleSuccess, { once: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Le paiement a échoué.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
      <Select
        value={provider}
        onChange={(e) => setProvider(e.target.value as Provider)}
        className="h-9 w-auto text-sm"
      >
        <option value="STRIPE">Carte bancaire (Stripe)</option>
        <option value="KKIAPAY">Mobile Money (Kkiapay)</option>
      </Select>
      <Button size="sm" onClick={handleClick} isLoading={isLoading}>
        {label}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
