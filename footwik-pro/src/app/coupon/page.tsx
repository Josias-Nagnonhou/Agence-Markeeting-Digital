import { redirect } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { getCurrentUser } from "@/lib/account";
import { createClient } from "@/lib/supabase/server";
import { hasFeature, couponQuota } from "@/lib/entitlements";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/Badge";
import { FeatureGate } from "@/components/FeatureGate";
import { CouponAnalyzer } from "@/components/coupon/CouponAnalyzer";

export const dynamic = "force-dynamic";
export const metadata = { title: "Analyse mon coupon — Footwik Pro" };

export default async function CouponPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/coupon");

  const allowed = hasFeature(user.plan, "coupon_analysis");
  const supabase = createClient();

  let remaining: number | null = null;
  let history: { id: string; created_at: string; overall_risk: string; summary: string; selections: unknown[] }[] = [];

  if (allowed) {
    const quota = couponQuota(user.plan);
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("coupon_analyses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth.toISOString());
    remaining = quota === Infinity ? null : Math.max(0, quota - (count ?? 0));

    const { data } = await supabase
      .from("coupon_analyses")
      .select("id, created_at, overall_risk, summary, selections")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);
    history = data ?? [];
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-2">
        <ClipboardList className="text-grass" size={22} />
        <h1 className="font-display text-3xl font-bold uppercase text-ink">Analyse mon coupon</h1>
      </div>
      <p className="mt-1 text-sm text-ink-faint">
        Envoyez une capture d&apos;écran de votre ticket ou saisissez vos
        sélections à la main : Footwik évalue chaque pari (solide, moyen,
        risqué) et le risque global de votre coupon.
      </p>

      <div className="mt-8">
        {allowed ? (
          <CouponAnalyzer initialRemaining={remaining} />
        ) : (
          <FeatureGate
            feature="coupon_analysis"
            plan={user.plan}
            message="Analyse mon coupon est réservée aux forfaits Mois, 3 mois, 1 an et VIP."
          >
            <CouponAnalyzer initialRemaining={0} />
          </FeatureGate>
        )}
      </div>

      {allowed && history.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold uppercase text-ink">
            Historique de mes coupons
          </h2>
          <div className="mt-4 space-y-2">
            {history.map((h) => (
              <div key={h.id} className="rounded-lg border border-pitch-600 bg-pitch-800 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-ink-faint">{formatDate(h.created_at)}</span>
                  <Badge variant={h.overall_risk === "solide" ? "win" : h.overall_risk === "risque" ? "loss" : "gold"}>
                    {h.overall_risk}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-ink-muted">{h.summary}</p>
                <p className="mt-1 text-xs text-ink-faint">
                  {Array.isArray(h.selections) ? h.selections.length : 0} sélection
                  {Array.isArray(h.selections) && h.selections.length > 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
