import { auth } from "@/lib/auth/auth";
import { getOrdersForUser, getSubscriptionsForUser } from "@/modules/billing/billing.service";
import { Card } from "@/components/ui/card";
import { BillingCheckoutButton } from "@/components/billing/billing-checkout-button";

const subscriptionStatusLabels: Record<string, string> = {
  TRIALING: "Essai gratuit",
  ACTIVE: "Actif",
  PAST_DUE: "Paiement en retard",
  CANCELED: "Annulé",
};

const orderStatusLabels: Record<string, string> = {
  PENDING: "En attente",
  PAID: "Payée",
  FAILED: "Échouée",
  REFUNDED: "Remboursée",
};

const orderTypeLabels: Record<string, string> = {
  PAGE_CREATION: "Création de page",
  CREDIT_PACK: "Pack de crédits",
  ADDON: "Option",
};

export default async function BillingPage() {
  const session = await auth();
  const [orders, subscriptions] = await Promise.all([
    getOrdersForUser(session!.user.id),
    getSubscriptionsForUser(session!.user.id),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Facturation</h1>
        <p className="mt-1 text-sm text-gray-500">
          Abonnements d&apos;hébergement de tes pages et historique de tes paiements.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold">Abonnements d&apos;hébergement</h2>
        {subscriptions.length === 0 ? (
          <Card className="text-sm text-gray-500">Aucune page publiée pour l&apos;instant.</Card>
        ) : (
          subscriptions.map((subscription) => (
            <Card key={subscription.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{subscription.page.title}</p>
                <p className="text-sm text-gray-500">
                  {subscriptionStatusLabels[subscription.status]}
                  {subscription.currentPeriodEnd && (
                    <>
                      {" "}
                      jusqu&apos;au{" "}
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </>
                  )}
                </p>
              </div>
              {subscription.status !== "ACTIVE" && (
                <BillingCheckoutButton
                  endpoint={`/api/billing/pages/${subscription.page.id}/subscription`}
                  kind="subscription"
                  pageId={subscription.page.id}
                  label="Activer l'abonnement"
                />
              )}
            </Card>
          ))
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Frais de création de page</h2>
        </div>
        <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">Paiement unique pour la création d&apos;une nouvelle page.</p>
          <BillingCheckoutButton endpoint="/api/billing/orders" kind="order" label="Payer" />
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold">Historique</h2>
        {orders.length === 0 ? (
          <Card className="text-sm text-gray-500">Aucune commande pour l&apos;instant.</Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{orderTypeLabels[order.type]}</p>
                <p className="text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {order.amount.toString()} {order.currency}
                </p>
                <p className="text-gray-500">{orderStatusLabels[order.status]}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
