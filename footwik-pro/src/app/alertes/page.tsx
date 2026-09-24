import { redirect } from "next/navigation";
import { Bell, UserRound, ShieldAlert, TrendingUp } from "lucide-react";
import { getCurrentUser } from "@/lib/account";
import { createClient } from "@/lib/supabase/server";
import { FeatureGate } from "@/components/FeatureGate";
import { AlertPreferences } from "@/components/alerts/AlertPreferences";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/Badge";

export const dynamic = "force-dynamic";
export const metadata = { title: "Alertes — Footwik Pro" };

const ALERT_ICONS = {
  composition: UserRound,
  blessure: ShieldAlert,
  cote: TrendingUp,
};

const ALERT_LABELS: Record<string, string> = {
  composition: "Composition officielle",
  blessure: "Blessure / forfait",
  cote: "Mouvement de cote",
};

export default async function AlertesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/alertes");

  const supabase = createClient();
  const [{ data: preferences }, { data: alertsRaw }] = await Promise.all([
    supabase.from("followed_competitions").select("competition").eq("user_id", user.id),
    supabase
      .from("alerts")
      .select("id, alert_type, competition, team_name, message, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const selected = (preferences ?? []).map((p) => p.competition);
  const alerts = (alertsRaw ?? []).filter(
    (a) => selected.length === 0 || !a.competition || selected.includes(a.competition),
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-2">
        <Bell className="text-grass" size={22} />
        <h1 className="font-display text-3xl font-bold uppercase text-ink">Alertes de dernière minute</h1>
      </div>
      <p className="mt-1 text-sm text-ink-faint">
        Compositions officielles, blessures de dernière minute et
        mouvements de cotes importants, en direct.
      </p>

      <div className="mt-8">
        <FeatureGate feature="last_minute_alerts" plan={user.plan}>
          <AlertPreferences initialSelected={selected} />

          <div className="mt-6 space-y-2">
            {alerts.length === 0 ? (
              <p className="text-sm text-ink-faint">Aucune alerte pour l&apos;instant.</p>
            ) : (
              alerts.map((a) => {
                const Icon = ALERT_ICONS[a.alert_type as keyof typeof ALERT_ICONS] ?? Bell;
                return (
                  <div key={a.id} className="flex gap-3 rounded-lg border border-pitch-600 bg-pitch-800 px-4 py-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pitch-600 text-grass">
                      <Icon size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{ALERT_LABELS[a.alert_type] ?? a.alert_type}</Badge>
                        {a.competition && <span className="text-xs text-ink-faint">{a.competition}</span>}
                      </div>
                      <p className="mt-1 text-sm text-ink">{a.message}</p>
                      <p className="mt-1 text-xs text-ink-faint">{formatDate(a.created_at)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </FeatureGate>
      </div>
    </div>
  );
}
