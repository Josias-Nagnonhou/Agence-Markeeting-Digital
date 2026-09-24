import { notFound } from "next/navigation";
import { AlertTriangle, Users, History, BarChart3, Eye, Target, CheckCircle2 } from "lucide-react";
import { matches, getMatchById } from "@/lib/data/matches";
import { formatDate, formatShortDate } from "@/lib/utils";
import { Badge } from "@/components/Badge";
import { ConfidenceStars } from "@/components/ConfidenceStars";
import { StatBar } from "@/components/StatBar";
import { FormRow } from "@/components/FormBadge";
import { FeatureGate } from "@/components/FeatureGate";
import { ClubCrest } from "@/components/ClubCrest";
import { getCurrentUser } from "@/lib/account";
import { hasFeature } from "@/lib/entitlements";
import { createClient } from "@/lib/supabase/server";
import { FavoriteButton } from "@/components/FavoriteButton";
import { OddsComparator } from "@/components/OddsComparator";

// Rendu dynamique obligatoire : la fiche dépend de l'abonnement de
// l'utilisateur connecté (verrouillage par formule) et journalise sa
// consultation dans l'activité du compte.
export const dynamic = "force-dynamic";

export default async function MatchPage({ params }: { params: { id: string } }) {
  const match = getMatchById(params.id);
  if (!match) notFound();

  const user = await getCurrentUser();
  const plan = user?.plan ?? "gratuit";
  const locked = !match.isFree && !hasFeature(plan, "full_analyses");

  let isFavorited = false;
  let odds: { bookmaker: string; market: string; pick: string; odd: number }[] = [];

  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("odds")
      .select("bookmaker, market, pick, odd")
      .eq("match_id", match.id);
    odds = data ?? [];
  } catch {
    // pas grave : la section cotes affichera "non disponibles"
  }

  if (user) {
    try {
      const supabase = createClient();
      await supabase.from("activity_log").insert({
        user_id: user.id,
        activity_type: "vue_fiche",
        label: `Consultation : ${match.home.shortName} vs ${match.away.shortName}`,
        metadata: { matchId: match.id },
      });
      const { data: favorite } = await supabase
        .from("favorites")
        .select("match_id")
        .eq("user_id", user.id)
        .eq("match_id", match.id)
        .maybeSingle();
      isFavorited = !!favorite;
    } catch {
      // best-effort, ne bloque jamais l'affichage de la fiche
    }
  }

  const Section = ({
    icon: Icon,
    title,
    children,
  }: {
    icon: typeof Users;
    title: string;
    children: React.ReactNode;
  }) => (
    <section className="rounded-xl border border-pitch-600 bg-pitch-800 p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon size={18} className="text-grass" />
        <h2 className="font-display text-lg font-bold uppercase text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center gap-2">
        <Badge variant="outline">{match.competition}</Badge>
        {match.status === "termine" && match.outcome && (
          <Badge variant={match.outcome === "gagne" ? "win" : "loss"}>
            {match.outcome === "gagne" ? "Pronostic gagné" : "Pronostic perdu"}
          </Badge>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-pitch-600 bg-pitch-800 p-6">
        <div className="flex items-center justify-between text-xs text-ink-faint">
          <span>{formatDate(match.kickoff)}</span>
          <span>{match.venue}</span>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6 sm:gap-10">
          <div className="flex flex-1 flex-col items-center gap-2">
            <ClubCrest team={match.home} size={64} />
            <span className="text-center font-medium text-ink">{match.home.name}</span>
          </div>
          <div className="font-display text-2xl text-ink-faint">
            {match.status === "termine" ? match.finalScore : "VS"}
          </div>
          <div className="flex flex-1 flex-col items-center gap-2">
            <ClubCrest team={match.away} size={64} />
            <span className="text-center font-medium text-ink">{match.away.name}</span>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-center gap-2">
          <span className="text-sm text-ink-faint">Indice de confiance :</span>
          <ConfidenceStars confidence={match.confidence} size={18} />
        </div>
        <div className="mt-4 flex justify-center">
          <FavoriteButton matchId={match.id} initialFavorited={isFavorited} isLoggedIn={!!user} />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-grass/30 bg-grass/5 p-5">
        <div className="mb-2 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-grass" />
          <h2 className="font-display text-lg font-bold uppercase text-ink">
            Ce qu&apos;il faut retenir
          </h2>
        </div>
        <ul className="space-y-1.5 text-sm text-ink-muted">
          {match.summary.map((s, i) => (
            <li key={i}>• {s}</li>
          ))}
        </ul>
        <div className="mt-3 text-sm font-semibold text-gold">
          Pronostic principal : {match.mainPick}
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <Section icon={Users} title="Forme récente (5 derniers matchs)">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-2 text-sm font-medium text-ink">{match.home.shortName}</div>
              <FormRow results={match.homeForm} />
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-ink">{match.away.shortName}</div>
              <FormRow results={match.awayForm} />
            </div>
          </div>
        </Section>

        {locked ? (
          <FeatureGate feature="full_analyses" plan={plan}>
            <FicheDetails match={match} />
          </FeatureGate>
        ) : (
          <FicheDetails match={match} />
        )}

        <Section icon={Target} title="Cotes">
          <FeatureGate feature="odds_comparator" plan={plan}>
            <OddsComparator odds={odds} />
          </FeatureGate>
        </Section>
      </div>
    </div>
  );
}

function FicheDetails({ match }: { match: (typeof matches)[number] }) {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-pitch-600 bg-pitch-800 p-5">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle size={18} className="text-grass" />
          <h2 className="font-display text-lg font-bold uppercase text-ink">
            Compositions probables, blessés et suspendus
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <div className="mb-2 text-sm font-medium text-ink">{match.home.shortName} — XI probable</div>
            <p className="text-sm text-ink-faint">{match.homeLineup.join(" · ")}</p>
            {match.homeInjuries.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm text-red-300">
                {match.homeInjuries.map((i) => (
                  <li key={i}>⚠ {i}</li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <div className="mb-2 text-sm font-medium text-ink">{match.away.shortName} — XI probable</div>
            <p className="text-sm text-ink-faint">{match.awayLineup.join(" · ")}</p>
            {match.awayInjuries.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm text-red-300">
                {match.awayInjuries.map((i) => (
                  <li key={i}>⚠ {i}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-pitch-600 bg-pitch-800 p-5">
        <div className="mb-4 flex items-center gap-2">
          <History size={18} className="text-grass" />
          <h2 className="font-display text-lg font-bold uppercase text-ink">
            Historique des confrontations directes
          </h2>
        </div>
        <div className="space-y-2">
          {match.h2h.map((h, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg bg-pitch-600/40 px-3 py-2 text-sm"
            >
              <span className="text-ink-faint">{formatShortDate(h.date)}</span>
              <span className="text-ink">
                {h.homeTeam} <span className="font-bold">{h.score}</span> {h.awayTeam}
              </span>
              <span className="text-xs text-ink-faint">{h.competition}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-pitch-600 bg-pitch-800 p-5">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-grass" />
          <h2 className="font-display text-lg font-bold uppercase text-ink">
            Statistiques avancées (moyenne / match)
          </h2>
        </div>
        <div className="mb-3 flex items-center justify-between text-xs font-semibold text-ink-faint">
          <span>{match.home.shortName}</span>
          <span>{match.away.shortName}</span>
        </div>
        <div className="space-y-4">
          <StatBar label="xG (buts attendus)" home={match.homeStats.xg} away={match.awayStats.xg} format={(v) => v.toFixed(1)} />
          <StatBar label="Possession moyenne" home={match.homeStats.possession} away={match.awayStats.possession} format={(v) => `${v}%`} />
          <StatBar label="Tirs cadrés" home={match.homeStats.shotsOnTarget} away={match.awayStats.shotsOnTarget} format={(v) => v.toFixed(1)} />
          <StatBar label="Buts marqués (domicile / ext.)" home={match.homeStats.goalsScoredHome} away={match.awayStats.goalsScoredAway} format={(v) => v.toFixed(1)} />
          <StatBar label="Buts encaissés (domicile / ext.)" home={match.homeStats.goalsConcededHome} away={match.awayStats.goalsConcededAway} format={(v) => v.toFixed(1)} />
        </div>
      </section>

      <section className="rounded-xl border border-pitch-600 bg-pitch-800 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Eye size={18} className="text-grass" />
          <h2 className="font-display text-lg font-bold uppercase text-ink">Facteurs cachés</h2>
        </div>
        <ul className="space-y-2 text-sm text-ink-muted">
          {match.hiddenFactors.map((f, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-gold">→</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gold/30 bg-gold-darker/30 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Target size={18} className="text-gold" />
          <h2 className="font-display text-lg font-bold uppercase text-ink">Marchés analysés</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {match.markets.map((m) => (
            <div key={m.market} className="rounded-lg border border-pitch-400 bg-pitch-800 p-3">
              <div className="text-xs text-ink-faint">{m.market}</div>
              <div className="mt-1 font-semibold text-ink">{m.pick}</div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-pitch-600">
                <div className="h-full bg-gold" style={{ width: `${m.probability}%` }} />
              </div>
              <div className="mt-1 text-right text-xs text-gold">{m.probability}% de confiance</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
