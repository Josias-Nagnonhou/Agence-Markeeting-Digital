import { redirect } from "next/navigation";
import { Mic, Video, MessageSquare, Clock } from "lucide-react";
import { getCurrentUser } from "@/lib/account";
import { createClient } from "@/lib/supabase/server";
import { FeatureGate } from "@/components/FeatureGate";
import { Badge } from "@/components/Badge";
import { formatShortDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Exclusivités VIP — Footwik Pro" };

const TYPE_ICON = { audio: Mic, video: Video, message: MessageSquare };

export default async function VipExclusivitesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/vip/exclusivites");

  const supabase = createClient();
  const { data: contents } = await supabase
    .from("vip_contents")
    .select("id, title, content_type, published_at")
    .order("published_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-2">
        <Mic className="text-gold" size={22} />
        <h1 className="font-display text-3xl font-bold uppercase text-ink">Exclusivités VIP</h1>
      </div>
      <p className="mt-1 text-sm text-ink-faint">
        Analyses vocales et vidéos de Footwik, disponibles 24h avant leur
        sortie sur YouTube.
      </p>

      <div className="mt-8">
        <FeatureGate feature="vip_exclusives" plan={user.plan}>
          <div className="space-y-3">
            {(contents ?? []).length === 0 && (
              <p className="text-sm text-ink-faint">Aucun contenu exclusif pour l&apos;instant.</p>
            )}
            {(contents ?? []).map((c) => {
              const Icon = TYPE_ICON[c.content_type as keyof typeof TYPE_ICON] ?? MessageSquare;
              return (
                <div key={c.id} className="flex items-center gap-3 rounded-xl border border-pitch-600 bg-pitch-800 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                    <Icon size={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-ink">{c.title}</div>
                    <div className="text-xs text-ink-faint">{formatShortDate(c.published_at)}</div>
                  </div>
                  <Badge variant="gold">
                    <Clock size={11} /> 24h avant YouTube
                  </Badge>
                </div>
              );
            })}
          </div>
        </FeatureGate>
      </div>
    </div>
  );
}
