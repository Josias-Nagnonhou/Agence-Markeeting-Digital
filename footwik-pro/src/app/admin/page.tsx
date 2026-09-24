import { Users, Wallet, TrendingUp, ShieldCheck } from "lucide-react";
import {
  pendingAnalyses,
  pendingResults,
  adminSubscribers,
  adminTransactions,
  revenueByMonth,
  vipContents,
  adminOverview,
} from "@/lib/data/admin";
import { formatShortDate } from "@/lib/utils";
import { Badge } from "@/components/Badge";
import { AccountTabs } from "@/components/AccountTabs";
import { ValidationQueue } from "@/components/admin/ValidationQueue";
import { ResultsQueue } from "@/components/admin/ResultsQueue";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { VipPublisher } from "@/components/admin/VipPublisher";

export const metadata = { title: "Panneau d'administration — Footwik Pro" };

export default function AdminPage() {
  const overview = (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-grass/30 bg-grass/5 p-5">
          <div className="flex items-center gap-2 text-grass">
            <Users size={16} /> <span className="text-xs uppercase tracking-wide">Abonnés actifs</span>
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-ink">{adminOverview.activeSubscribers}</div>
        </div>
        <div className="rounded-xl border border-pitch-600 bg-pitch-800 p-5">
          <div className="flex items-center gap-2 text-ink-faint">
            <TrendingUp size={16} /> <span className="text-xs uppercase tracking-wide">Taux de conversion</span>
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-ink">{adminOverview.conversionRate}%</div>
        </div>
        <div className="rounded-xl border border-gold/30 bg-gold-darker/30 p-5">
          <div className="flex items-center gap-2 text-gold">
            <Wallet size={16} /> <span className="text-xs uppercase tracking-wide">Revenus du mois</span>
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-ink">
            {adminOverview.monthlyRevenue.toLocaleString("fr-FR")} FCFA
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-pitch-600 bg-pitch-800 p-5">
        <h3 className="mb-4 font-display text-base font-bold uppercase text-ink">
          Revenus &amp; abonnés actifs (6 derniers mois)
        </h3>
        <RevenueChart data={revenueByMonth} />
      </div>
    </div>
  );

  const validation = (
    <div>
      <p className="mb-4 text-sm text-ink-faint">
        Ces fiches ont été générées automatiquement par le modèle d&apos;IA à
        partir des données API-Football. Validez-les avant publication sur le
        site.
      </p>
      <ValidationQueue items={pendingAnalyses} />
    </div>
  );

  const results = (
    <div>
      <p className="mb-4 text-sm text-ink-faint">
        Matchs terminés dont le pronostic doit être confirmé gagné/perdu dans
        l&apos;historique public.
      </p>
      <ResultsQueue items={pendingResults} />
    </div>
  );

  const subscribers = (
    <div className="overflow-x-auto rounded-xl border border-pitch-600">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-pitch-600/50 text-xs uppercase text-ink-faint">
          <tr>
            <th className="px-4 py-3 font-medium">Nom</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Pays</th>
            <th className="px-4 py-3 font-medium">Plan</th>
            <th className="px-4 py-3 font-medium">Statut</th>
            <th className="px-4 py-3 font-medium">Inscrit le</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-pitch-600">
          {adminSubscribers.map((s) => (
            <tr key={s.id} className="bg-pitch-800">
              <td className="whitespace-nowrap px-4 py-3 text-ink">{s.name}</td>
              <td className="whitespace-nowrap px-4 py-3 text-ink-faint">{s.email}</td>
              <td className="whitespace-nowrap px-4 py-3 text-ink-muted">{s.country}</td>
              <td className="px-4 py-3 text-ink-muted">{s.plan}</td>
              <td className="px-4 py-3">
                <Badge variant={s.status === "actif" ? "win" : s.status === "expiré" ? "gold" : "loss"}>
                  {s.status}
                </Badge>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-ink-faint">{formatShortDate(s.joinedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const payments = (
    <div className="overflow-x-auto rounded-xl border border-pitch-600">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-pitch-600/50 text-xs uppercase text-ink-faint">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Abonné</th>
            <th className="px-4 py-3 font-medium">Plan</th>
            <th className="px-4 py-3 font-medium">Montant</th>
            <th className="px-4 py-3 font-medium">Méthode</th>
            <th className="px-4 py-3 font-medium">Statut</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-pitch-600">
          {adminTransactions.map((t) => (
            <tr key={t.id} className="bg-pitch-800">
              <td className="whitespace-nowrap px-4 py-3 text-ink-faint">{formatShortDate(t.date)}</td>
              <td className="px-4 py-3 text-ink">{t.subscriber}</td>
              <td className="px-4 py-3 text-ink-muted">{t.plan}</td>
              <td className="px-4 py-3 font-semibold text-ink">{t.amount}</td>
              <td className="px-4 py-3 text-ink-muted">{t.method}</td>
              <td className="px-4 py-3">
                <Badge variant={t.status === "payé" ? "win" : t.status === "échoué" ? "loss" : "gold"}>
                  {t.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const vip = <VipPublisher initial={vipContents} />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center gap-2">
        <ShieldCheck className="text-grass" size={22} />
        <h1 className="font-display text-3xl font-bold uppercase text-ink">
          Panneau d&apos;administration
        </h1>
      </div>
      <p className="mt-1 text-sm text-ink-faint">
        Réservé à l&apos;équipe Footwik. Validation des analyses IA, suivi des
        abonnés, des paiements et publication du contenu VIP.
      </p>

      <div className="mt-8">
        <AccountTabs
          tabs={[
            { id: "overview", label: "Vue d'ensemble", content: overview },
            { id: "validation", label: "Validation des analyses", content: validation },
            { id: "results", label: "Résultats à confirmer", content: results },
            { id: "subscribers", label: "Abonnés", content: subscribers },
            { id: "payments", label: "Paiements", content: payments },
            { id: "vip", label: "Contenu VIP", content: vip },
          ]}
        />
      </div>
    </div>
  );
}
