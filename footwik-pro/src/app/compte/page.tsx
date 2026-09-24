import { redirect } from "next/navigation";
import {
  Share2,
  Gift,
  CreditCard,
  Star,
  Users2,
  CalendarClock,
  Clock,
  Eye,
  Heart,
  LogIn,
  UserPlus,
} from "lucide-react";
import { getCurrentUser } from "@/lib/account";
import { createClient } from "@/lib/supabase/server";
import { getMatchById } from "@/lib/data/matches";
import { teams } from "@/lib/data/teams";
import { PLAN_LABELS } from "@/lib/entitlements";
import { formatShortDate, formatDate } from "@/lib/utils";
import { MatchCard } from "@/components/MatchCard";
import { Badge } from "@/components/Badge";
import { AccountTabs } from "@/components/AccountTabs";
import { ClubCrest } from "@/components/ClubCrest";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mon espace abonné — Footwik Pro" };

const ACTIVITY_ICONS: Record<string, typeof Eye> = {
  vue_fiche: Eye,
  favori_ajout: Heart,
  favori_retrait: Heart,
  connexion: LogIn,
  inscription: UserPlus,
};

export default async function ComptePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/connexion?next=/compte");
  }

  const supabase = createClient();

  const [{ data: activity }, { data: favoriteRows }, { data: followedRows }, { data: payments }] =
    await Promise.all([
      supabase
        .from("activity_log")
        .select("id, activity_type, label, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50),
      supabase.from("favorites").select("match_id").eq("user_id", user.id),
      supabase.from("followed_teams").select("team_id").eq("user_id", user.id),
      supabase
        .from("payments")
        .select("id, created_at, amount, currency, payment_method, status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

  const favorites = (favoriteRows ?? [])
    .map((f) => getMatchById(f.match_id))
    .filter((m): m is NonNullable<typeof m> => !!m);
  const followed = (followedRows ?? [])
    .map((f) => teams[f.team_id])
    .filter((t): t is NonNullable<typeof t> => !!t);

  const overview = (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-grass/30 bg-grass/5 p-5">
        <div className="flex items-center gap-2 text-grass">
          <Star size={16} />
          <span className="text-xs uppercase tracking-wide">Formule actuelle</span>
        </div>
        <div className="mt-2 font-display text-2xl font-bold text-ink">
          {PLAN_LABELS[user.plan]}
          {user.isFounder && (
            <span className="ml-2 align-middle text-xs font-semibold text-gold">FONDATEUR</span>
          )}
        </div>
        {user.planExpiresAt ? (
          <div className="mt-1 flex items-center gap-1 text-xs text-ink-faint">
            <CalendarClock size={12} /> Renouvellement le {formatShortDate(user.planExpiresAt)}
          </div>
        ) : (
          <div className="mt-1 text-xs text-ink-faint">
            {user.plan === "gratuit" ? "Passez premium à tout moment" : "Sans date d'expiration"}
          </div>
        )}
      </div>
      <div className="rounded-xl border border-pitch-600 bg-pitch-800 p-5">
        <div className="flex items-center gap-2 text-ink-faint">
          <Users2 size={16} />
          <span className="text-xs uppercase tracking-wide">Équipes suivies</span>
        </div>
        <div className="mt-2 font-display text-2xl font-bold text-ink">{followed.length}</div>
      </div>
      <div className="rounded-xl border border-gold/30 bg-gold-darker/30 p-5">
        <div className="flex items-center gap-2 text-gold">
          <Gift size={16} />
          <span className="text-xs uppercase tracking-wide">Favoris</span>
        </div>
        <div className="mt-2 font-display text-2xl font-bold text-ink">{favorites.length}</div>
        <div className="mt-1 text-xs text-ink-faint">Matchs enregistrés</div>
      </div>
    </div>
  );

  const activitySection = (
    <div className="space-y-2">
      {(activity ?? []).length === 0 && (
        <p className="text-sm text-ink-faint">
          Aucune activité pour l&apos;instant. Consultez une fiche de match ou
          ajoutez un favori pour commencer votre historique.
        </p>
      )}
      {(activity ?? []).map((a) => {
        const Icon = ACTIVITY_ICONS[a.activity_type] ?? Clock;
        return (
          <div
            key={a.id}
            className="flex items-center gap-3 rounded-lg border border-pitch-600 bg-pitch-800 px-4 py-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pitch-600 text-grass">
              <Icon size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm text-ink">{a.label}</div>
              <div className="text-xs text-ink-faint">{formatDate(a.created_at)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const favoritesSection = (
    <div>
      {favorites.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink-faint">
          Aucun match favori pour le moment. Ouvrez une fiche d&apos;analyse
          et cliquez sur &laquo; Ajouter aux favoris &raquo;.
        </p>
      )}
    </div>
  );

  const teamsSection = (
    <div className="flex flex-wrap gap-3">
      {followed.length > 0 ? (
        followed.map((t) => (
          <div key={t.id} className="flex items-center gap-2 rounded-full border border-pitch-400 bg-pitch-800 px-3 py-1.5">
            <ClubCrest team={t} size={22} />
            <span className="text-sm text-ink-muted">{t.name}</span>
          </div>
        ))
      ) : (
        <p className="text-sm text-ink-faint">
          Vous ne suivez aucune équipe pour l&apos;instant.
        </p>
      )}
    </div>
  );

  const subscriptionSection = (
    <div className="rounded-xl border border-pitch-600 bg-pitch-800 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm text-ink-faint">Formule actuelle</div>
          <div className="font-display text-xl font-bold text-ink">{PLAN_LABELS[user.plan]}</div>
        </div>
        <a
          href="/abonnement"
          className="rounded-lg bg-grass px-4 py-2 text-sm font-semibold text-pitch-950 hover:bg-grass-light"
        >
          {user.plan === "gratuit" ? "Passer premium" : "Changer de formule"}
        </a>
      </div>

      {user.referralCode && (
        <div className="mt-6 rounded-lg border border-gold/30 bg-gold-darker/20 p-4">
          <div className="flex items-center gap-2 text-gold">
            <Share2 size={16} />
            <span className="text-sm font-semibold">Mon lien de parrainage</span>
          </div>
          <p className="mt-1 text-xs text-ink-faint">
            Partagez ce lien : chaque ami qui s&apos;abonne vous offre 1 semaine
            gratuite.
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-pitch-400 bg-pitch-600/40 px-3 py-2 text-sm text-ink">
            footwikpro.com/r/{user.referralCode}
          </div>
        </div>
      )}
    </div>
  );

  const paymentsSection = (
    <div>
      {(payments ?? []).length === 0 ? (
        <p className="text-sm text-ink-faint">
          Aucun paiement enregistré pour l&apos;instant.{" "}
          <a href="/abonnement" className="text-grass hover:underline">
            Voir les abonnements
          </a>
          .
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-pitch-600">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-pitch-600/50 text-xs uppercase text-ink-faint">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Montant</th>
                <th className="px-4 py-3 font-medium">Méthode</th>
                <th className="px-4 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pitch-600">
              {(payments ?? []).map((p) => (
                <tr key={p.id} className="bg-pitch-800">
                  <td className="whitespace-nowrap px-4 py-3 text-ink-faint">{formatShortDate(p.created_at)}</td>
                  <td className="px-4 py-3 font-semibold text-ink">
                    {p.amount.toLocaleString("fr-FR")} {p.currency === "XOF" ? "FCFA" : "€"}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    <span className="inline-flex items-center gap-1">
                      <CreditCard size={13} /> {p.payment_method}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={p.status === "paye" ? "win" : p.status === "echoue" ? "loss" : "gold"}>
                      {p.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold uppercase text-ink">Mon espace abonné</h1>
      <p className="mt-1 text-sm text-ink-faint">{user.email}</p>

      <div className="mt-8">
        <AccountTabs
          tabs={[
            { id: "apercu", label: "Vue d'ensemble", content: overview },
            { id: "activite", label: "Mon activité", content: activitySection },
            { id: "favoris", label: "Mes favoris", content: favoritesSection },
            { id: "equipes", label: "Équipes suivies", content: teamsSection },
            { id: "abonnement", label: "Abonnement", content: subscriptionSection },
            { id: "paiements", label: "Historique paiements", content: paymentsSection },
          ]}
        />
      </div>
    </div>
  );
}
