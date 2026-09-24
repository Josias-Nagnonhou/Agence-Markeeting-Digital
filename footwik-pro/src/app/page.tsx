import Link from "next/link";
import { ArrowRight, TrendingUp, PlaySquare, Quote } from "lucide-react";
import { getUpcomingMatches } from "@/lib/data/matches";
import { computeStats } from "@/lib/data/history";
import { testimonials } from "@/lib/data/testimonials";
import { MatchCard } from "@/components/MatchCard";
import { formatPercent } from "@/lib/utils";

export default function Home() {
  const upcoming = getUpcomingMatches().slice(0, 6);
  const stats = computeStats();

  return (
    <div>
      <section className="border-b border-pitch-600 px-4 py-16 text-center sm:py-24">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full border border-grass/30 bg-grass/10 px-4 py-1.5 text-xs font-medium text-grass">
            Analyse IA · Transparence totale · Football francophone
          </span>
          <h1 className="mt-6 font-display text-4xl font-black uppercase leading-[1.05] text-ink sm:text-6xl">
            Comprends chaque match
            <br />
            <span className="text-grass">mieux que tout le monde</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-ink-muted sm:text-lg">
            Footwik Pro analyse chaque match par intelligence artificielle :
            forme, statistiques avancées, facteurs cachés. Et on affiche
            tout, même nos pronostics perdus.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/abonnement"
              className="flex items-center gap-2 rounded-lg bg-grass px-6 py-3 font-semibold text-pitch-950 transition hover:bg-grass-light"
            >
              S&apos;abonner maintenant <ArrowRight size={18} />
            </Link>
            <Link
              href="/historique"
              className="rounded-lg border border-pitch-400 px-6 py-3 font-semibold text-ink transition hover:bg-pitch-600"
            >
              Voir notre historique public
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-pitch-600 bg-pitch-800/60 px-4 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 rounded-xl border border-grass/30 bg-pitch-800 p-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-grass/15 text-grass">
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="text-sm text-ink-faint">Notre taux de réussite (30 derniers pronostics)</div>
              <div className="font-display text-3xl font-bold text-ink">
                {formatPercent(stats.rate)}{" "}
                <span className="text-base font-normal text-ink-faint">
                  ({stats.won}/{stats.total} gagnés)
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/historique"
            className="text-sm font-medium text-grass hover:underline"
          >
            Consulter le détail public →
          </Link>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-bold uppercase text-ink sm:text-3xl">
              Matchs du jour
            </h2>
            <Link href="/historique" className="text-sm font-medium text-grass hover:underline">
              Toutes les compétitions →
            </Link>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-ink-faint">
            Aperçu gratuit disponible chaque jour. Débloquez l&apos;analyse
            complète (compositions, statistiques avancées, pronostic IA) avec
            un abonnement.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-pitch-600 bg-pitch-800/40 px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-2xl font-bold uppercase text-ink sm:text-3xl">
            Ce que disent nos abonnés
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl border border-pitch-600 bg-pitch-800 p-5">
                <Quote size={20} className="text-gold" />
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  &laquo; {t.quote} &raquo;
                </p>
                <div className="mt-4 text-sm font-semibold text-ink">{t.name}</div>
                <div className="text-xs text-ink-faint">
                  {t.city} · {t.since}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 rounded-2xl border border-gold/30 bg-gold-darker/40 p-8 text-center sm:flex-row sm:text-left">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
            <PlaySquare size={28} />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-xl font-bold uppercase text-ink">
              La chaîne YouTube Footwik, 60 000 abonnés
            </h3>
            <p className="mt-1 text-sm text-ink-faint">
              Retrouvez nos décryptages vidéo, nos débats et nos analyses en
              profondeur avant chaque grande affiche.
            </p>
          </div>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-lg bg-gold px-5 py-2.5 font-semibold text-pitch-950 hover:bg-gold/90"
          >
            S&apos;abonner à Footwik
          </a>
        </div>
      </section>
    </div>
  );
}
