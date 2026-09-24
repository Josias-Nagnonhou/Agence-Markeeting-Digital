import { redirect } from "next/navigation";
import Link from "next/link";
import { Crown, Video, Mic, Send } from "lucide-react";
import { getCurrentUser } from "@/lib/account";
import { createClient } from "@/lib/supabase/server";
import { FeatureGate } from "@/components/FeatureGate";

export const dynamic = "force-dynamic";
export const metadata = { title: "Espace VIP — Footwik Pro" };

export default async function VipHubPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/vip");

  let inviteCode = user.telegramInviteCode;
  if (user.plan === "vip" && !inviteCode) {
    inviteCode = Math.random().toString(36).slice(2, 10).toUpperCase();
    try {
      const supabase = createClient();
      await supabase.from("profiles").update({ telegram_invite_code: inviteCode }).eq("id", user.id);
    } catch {
      // best-effort
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-2">
        <Crown className="text-gold" size={22} />
        <h1 className="font-display text-3xl font-bold uppercase text-ink">Espace VIP</h1>
      </div>
      <p className="mt-1 text-sm text-ink-faint">
        Lives privés, contenus exclusifs et groupe Telegram réservés aux
        membres VIP.
      </p>

      <div className="mt-8">
        <FeatureGate feature="vip_lives" plan={user.plan}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/vip/lives"
              className="flex items-center gap-3 rounded-xl border border-gold/30 bg-pitch-800 p-5 hover:border-gold/60"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold">
                <Video size={20} />
              </div>
              <div>
                <div className="font-display text-base font-bold uppercase text-ink">Lives privés</div>
                <div className="text-xs text-ink-faint">Calendrier des lives hebdomadaires</div>
              </div>
            </Link>
            <Link
              href="/vip/exclusivites"
              className="flex items-center gap-3 rounded-xl border border-gold/30 bg-pitch-800 p-5 hover:border-gold/60"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold">
                <Mic size={20} />
              </div>
              <div>
                <div className="font-display text-base font-bold uppercase text-ink">Exclusivités</div>
                <div className="text-xs text-ink-faint">Analyses vocales et vidéos, 24h avant YouTube</div>
              </div>
            </Link>
          </div>

          <div className="mt-6 rounded-xl border border-pitch-600 bg-pitch-800 p-5">
            <div className="flex items-center gap-2 text-gold">
              <Send size={16} />
              <h2 className="font-display text-base font-bold uppercase text-ink">Groupe Telegram privé</h2>
            </div>
            {inviteCode ? (
              <>
                <p className="mt-2 text-sm text-ink-muted">
                  Votre code d&apos;invitation personnel :
                </p>
                <div className="mt-2 rounded-lg border border-pitch-400 bg-pitch-600/40 px-3 py-2 text-sm text-ink">
                  {inviteCode}
                </div>
                <p className="mt-2 text-xs text-ink-faint">
                  Envoyez ce code sur notre bot Telegram Footwik Pro pour
                  rejoindre automatiquement le groupe privé.
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-ink-faint">
                Réservé aux membres VIP actifs.
              </p>
            )}
          </div>
        </FeatureGate>
      </div>
    </div>
  );
}
