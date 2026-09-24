import { redirect } from "next/navigation";
import { Users, Wallet, TrendingUp, ShieldCheck, Sparkles, Crown, ClipboardList } from "lucide-react";
import {
  pendingAnalyses,
  pendingResults,
  adminTransactions,
  revenueByMonth,
  adminOverview,
} from "@/lib/data/admin";
import { getCurrentUser, getFounderSeatsRemaining, getVipSeatsRemaining } from "@/lib/account";
import { createClient } from "@/lib/supabase/server";
import { FOUNDER_TOTAL_SEATS, VIP_TOTAL_SEATS } from "@/lib/data/pricing";
import { formatShortDate } from "@/lib/utils";
import { Badge } from "@/components/Badge";
import { AccountTabs } from "@/components/AccountTabs";
import { ValidationQueue } from "@/components/admin/ValidationQueue";
import { ResultsQueue } from "@/components/admin/ResultsQueue";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { VipPublisher } from "@/components/admin/VipPublisher";
import { AdminSubscribersTable } from "@/components/admin/AdminSubscribersTable";
import { AdminVipLivesManager } from "@/components/admin/AdminVipLivesManager";
import { AdminAlertsManager } from "@/components/admin/AdminAlertsManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Panneau d'administration — Footwik Pro" };

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/admin");
  if (!user.isAdmin) redirect("/compte");

  const supabase = createClient();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    { data: profiles },
    { data: vipContents },
    { data: vipLives },
    { data: alerts },
    founderSeatsRemaining,
    vipSeatsRemaining,
    { count: couponUsage },
    { data: planCounts },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, plan, is_founder, is_admin, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("vip_contents").select("id, title, content_type, published_at").order("published_at", { ascending: false }),
    supabase.from("vip_lives").select("id, title, scheduled_at, access_url").order("scheduled_at", { ascending: false }),
    supabase.from("alerts").select("id, alert_type, competition, message, created_at").order("created_at", { ascending: false }).limit(20),
    getFounderSeatsRemaining(),
    getVipSeatsRemaining(),
    supabase.from("coupon_analyses").select("id", { count: "exact", head: true }).gte("created_at", startOfMonth.toISOString()),
    supabase.from("profiles").select("plan"),
  ]);

  const byPlan: Record<string, number> = {};
  for (const p of planCounts ?? []) {
    byPlan[p.plan] = (byPlan[p.plan] ?? 0) + 1;
  }

  const overview = (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-grass/30 bg-grass/5 p-5">
          <div className="flex items-center gap-2 text-grass">
            <Users size={16} /> <span className="text-xs uppercase tracking-wide">Abonnés actifs (démo)</span>
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-ink">{adminOverview.activeSubscribers}</div>
        </div>
        <div className="rounded-xl border border-pitch-600 bg-pitch-800 p-5">
          <div className="flex items-center gap-2 text-ink-faint">
            <TrendingUp size={16} /> <span className="text-xs uppercase tracking-wide">Taux de conversion (démo)</span>
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-ink">{adminOverview.conversionRate}%</div>
        </div>
        <div className="rounded-xl border border-gold/30 bg-gold-darker/30 p-5">
          <div className="flex items-center gap-2 text-gold">
            <Wallet size={16} /> <span className="text-xs uppercase tracking-wide">Revenus du mois (démo)</span>
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-ink">
            {adminOverview.monthlyRevenue.toLocaleString("fr-FR")} FCFA
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-pitch-600 bg-pitch-800 p-4">
          <div className="flex items-center gap-2 text-gold"><Sparkles size={15} /> <span className="text-xs uppercase text-ink-faint">Places fondateur</span></div>
          <div className="mt-1 font-display text-xl font-bold text-ink">{FOUNDER_TOTAL_SEATS - founderSeatsRemaining} / {FOUNDER_TOTAL_SEATS}</div>
        </div>
        <div className="rounded-xl border border-pitch-600 bg-pitch-800 p-4">
          <div className="flex items-center gap-2 text-gold"><Crown size={15} /> <span className="text-xs uppercase text-ink-faint">Membres VIP</span></div>
          <div className="mt-1 font-display text-xl font-bold text-ink">{VIP_TOTAL_SEATS - vipSeatsRemaining} / {VIP_TOTAL_SEATS}</div>
        </div>
        <div className="rounded-xl border border-pitch-600 bg-pitch-800 p-4">
          <div className="flex items-center gap-2 text-grass"><ClipboardList size={15} /> <span className="text-xs uppercase text-ink-faint">Coupons analysés (mois)</span></div>
          <div className="mt-1 font-display text-xl font-bold text-ink">{couponUsage ?? 0}</div>
        </div>
        <div className="rounded-xl border border-pitch-600 bg-pitch-800 p-4">
          <div className="text-xs uppercase text-ink-faint">Abonnés par formule</div>
          <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-ink-muted">
            {Object.entries(byPlan).map(([plan, count]) => (
              <span key={plan} className="rounded-full border border-pitch-400 px-2 py-0.5">{plan}: {count}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-pitch-600 bg-pitch-800 p-5">
        <h3 className="mb-4 font-display text-base font-bold uppercase text-ink">
          Revenus &amp; abonnés actifs (6 derniers mois, démo)
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
    <AdminSubscribersTable
      rows={(profiles ?? []).map((p) => ({
        id: p.id,
        email: p.email,
        plan: p.plan,
        isFounder: p.is_founder,
        isAdmin: p.is_admin,
        createdAt: p.created_at,
      }))}
    />
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
      <p className="border-t border-pitch-600 px-4 py-2 text-xs text-ink-faint">
        Données de démonstration en attendant l&apos;intégration du webhook
        de confirmation de paiement FedaPay/KkiaPay.
      </p>
    </div>
  );

  const vip = (
    <VipPublisher
      initial={(vipContents ?? []).map((c) => ({
        id: c.id,
        title: c.title,
        content_type: c.content_type,
        published_at: c.published_at,
      }))}
    />
  );

  const lives = (
    <AdminVipLivesManager
      initial={(vipLives ?? []).map((l) => ({
        id: l.id,
        title: l.title,
        scheduled_at: l.scheduled_at,
        access_url: l.access_url,
      }))}
    />
  );

  const alertsTab = (
    <AdminAlertsManager
      initial={(alerts ?? []).map((a) => ({
        id: a.id,
        alert_type: a.alert_type,
        competition: a.competition,
        message: a.message,
        created_at: a.created_at,
      }))}
    />
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center gap-2">
        <ShieldCheck className="text-grass" size={22} />
        <h1 className="font-display text-3xl font-bold uppercase text-ink">
          Panneau d&apos;administration
        </h1>
      </div>
      <p className="mt-1 text-sm text-ink-faint">
        Réservé à l&apos;équipe Footwik. Validation des analyses IA, gestion
        des formules, publication VIP et alertes.
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
            { id: "lives", label: "Lives VIP", content: lives },
            { id: "alerts", label: "Alertes", content: alertsTab },
          ]}
        />
      </div>
    </div>
  );
}
