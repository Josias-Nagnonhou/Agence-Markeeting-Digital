import { redirect } from "next/navigation";
import { Video } from "lucide-react";
import { getCurrentUser } from "@/lib/account";
import { createClient } from "@/lib/supabase/server";
import { FeatureGate } from "@/components/FeatureGate";
import { AddToCalendarButton } from "@/components/vip/AddToCalendarButton";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Lives VIP — Footwik Pro" };

export default async function VipLivesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/vip/lives");

  const supabase = createClient();
  const { data: lives } = await supabase
    .from("vip_lives")
    .select("id, title, scheduled_at, access_url")
    .order("scheduled_at", { ascending: true });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-2">
        <Video className="text-gold" size={22} />
        <h1 className="font-display text-3xl font-bold uppercase text-ink">Lives privés</h1>
      </div>
      <p className="mt-1 text-sm text-ink-faint">
        Calendrier des lives hebdomadaires de Footwik, réservés aux membres VIP.
      </p>

      <div className="mt-8">
        <FeatureGate feature="vip_lives" plan={user.plan}>
          <div className="space-y-3">
            {(lives ?? []).length === 0 && (
              <p className="text-sm text-ink-faint">Aucun live programmé pour l&apos;instant.</p>
            )}
            {(lives ?? []).map((l) => (
              <div key={l.id} className="rounded-xl border border-pitch-600 bg-pitch-800 p-4">
                <div className="font-medium text-ink">{l.title}</div>
                <div className="mt-1 text-xs text-ink-faint">{formatDate(l.scheduled_at)}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <AddToCalendarButton title={l.title} scheduledAt={l.scheduled_at} />
                  {l.access_url && (
                    <a
                      href={l.access_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg bg-gold px-3 py-1.5 text-xs font-semibold text-pitch-950 hover:bg-gold/90"
                    >
                      Accéder au live
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </FeatureGate>
      </div>
    </div>
  );
}
