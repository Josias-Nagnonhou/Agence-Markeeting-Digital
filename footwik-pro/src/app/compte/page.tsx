import { Share2, Gift, CreditCard, Star, Users2, CalendarClock } from "lucide-react";
import { currentSubscriber } from "@/lib/data/account";
import { matches } from "@/lib/data/matches";
import { teams } from "@/lib/data/teams";
import { formatShortDate } from "@/lib/utils";
import { MatchCard } from "@/components/MatchCard";
import { Badge } from "@/components/Badge";
import { AccountTabs } from "@/components/AccountTabs";
import { ClubCrest } from "@/components/ClubCrest";

export const metadata = { title: "Mon espace abonné — Footwik Pro" };

export default function ComptePage() {
  const sub = currentSubscriber;
  const favorites = matches.filter((m) => sub.favoriteMatchIds.includes(m.id));
  const followed = sub.followedTeamIds.map((id) => teams[id]).filter(Boolean);

  const overview = (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-grass/30 bg-grass/5 p-5">
        <div className="flex items-center gap-2 text-grass">
          <Star size={16} />
          <span className="text-xs uppercase tracking-wide">Abonnement actif</span>
        </div>
        <div className="mt-2 font-display text-2xl font-bold text-ink">{sub.plan}</div>
        <div className="mt-1 flex items-center gap-1 text-xs text-ink-faint">
          <CalendarClock size={12} /> Renouvellement le {formatShortDate(sub.planExpiry)}
        </div>
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
          <span className="text-xs uppercase tracking-wide">Parrainages</span>
        </div>
        <div className="mt-2 font-display text-2xl font-bold text-ink">{sub.referralCount}</div>
        <div className="mt-1 text-xs text-ink-faint">1 semaine offerte par ami abonné</div>
      </div>
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
        <p className="text-sm text-ink-faint">Aucun match favori pour le moment.</p>
      )}
    </div>
  );

  const teamsSection = (
    <div className="flex flex-wrap gap-3">
      {followed.map((t) => (
        <div key={t.id} className="flex items-center gap-2 rounded-full border border-pitch-400 bg-pitch-800 px-3 py-1.5">
          <ClubCrest team={t} size={22} />
          <span className="text-sm text-ink-muted">{t.name}</span>
        </div>
      ))}
    </div>
  );

  const subscriptionSection = (
    <div className="rounded-xl border border-pitch-600 bg-pitch-800 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm text-ink-faint">Plan actuel</div>
          <div className="font-display text-xl font-bold text-ink">{sub.plan}</div>
        </div>
        <div className="flex gap-2">
          <a
            href="/abonnement"
            className="rounded-lg bg-grass px-4 py-2 text-sm font-semibold text-pitch-950 hover:bg-grass-light"
          >
            Changer de plan
          </a>
          <button className="rounded-lg border border-pitch-400 px-4 py-2 text-sm font-medium text-ink-muted hover:bg-pitch-600">
            Annuler l&apos;abonnement
          </button>
        </div>
      </div>

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
          footwikpro.com/r/{sub.referralCode}
        </div>
      </div>
    </div>
  );

  const paymentsSection = (
    <div className="overflow-x-auto rounded-xl border border-pitch-600">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-pitch-600/50 text-xs uppercase text-ink-faint">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Plan</th>
            <th className="px-4 py-3 font-medium">Montant</th>
            <th className="px-4 py-3 font-medium">Méthode</th>
            <th className="px-4 py-3 font-medium">Statut</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-pitch-600">
          {sub.payments.map((p) => (
            <tr key={p.id} className="bg-pitch-800">
              <td className="whitespace-nowrap px-4 py-3 text-ink-faint">{formatShortDate(p.date)}</td>
              <td className="px-4 py-3 text-ink">{p.plan}</td>
              <td className="px-4 py-3 font-semibold text-ink">{p.amount}</td>
              <td className="px-4 py-3 text-ink-muted">
                <span className="inline-flex items-center gap-1">
                  <CreditCard size={13} /> {p.method}
                </span>
              </td>
              <td className="px-4 py-3">
                <Badge variant={p.status === "payé" ? "win" : "loss"}>{p.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold uppercase text-ink">
        Bonjour {sub.name.split(" ")[0]}
      </h1>
      <p className="mt-1 text-sm text-ink-faint">{sub.email} · {sub.phone}</p>

      <div className="mt-8">
        <AccountTabs
          tabs={[
            { id: "apercu", label: "Vue d'ensemble", content: overview },
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
