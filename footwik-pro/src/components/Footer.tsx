import Link from "next/link";
import { PlaySquare, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-pitch-600 bg-pitch-900">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="font-display text-lg font-bold uppercase text-ink">
              Footwik <span className="text-gold">Pro</span>
            </div>
            <p className="mt-2 text-sm text-ink-faint">
              L&apos;analyse de matchs par IA, pour comprendre le football
              avant qu&apos;il ne se joue.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://www.youtube.com/@Footwik"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-pitch-400 text-ink-muted hover:border-grass hover:text-grass"
                aria-label="Chaîne YouTube Footwik"
              >
                <PlaySquare size={18} />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-pitch-400 text-ink-muted hover:border-grass hover:text-grass"
                aria-label="Telegram Footwik Pro"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-ink">Produit</div>
            <ul className="mt-3 space-y-2 text-sm text-ink-faint">
              <li><Link href="/historique" className="hover:text-grass">Historique public</Link></li>
              <li><Link href="/abonnement" className="hover:text-grass">Abonnements</Link></li>
              <li><Link href="/assistant" className="hover:text-grass">Assistant IA</Link></li>
              <li><Link href="/compte" className="hover:text-grass">Espace abonné</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-ink">Légal</div>
            <ul className="mt-3 space-y-2 text-sm text-ink-faint">
              <li><Link href="/conditions" className="hover:text-grass">Conditions d&apos;utilisation</Link></li>
              <li><Link href="/confidentialite" className="hover:text-grass">Politique de confidentialité</Link></li>
              <li><Link href="/jeu-responsable" className="hover:text-grass">Jeu responsable</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-ink">Footwik sur YouTube</div>
            <p className="mt-3 text-sm text-ink-faint">
              Retrouvez nos décryptages de matchs chaque semaine sur la
              chaîne YouTube Footwik.
            </p>
            <a
              href="https://www.youtube.com/@Footwik"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block rounded-lg border border-gold/40 bg-gold/10 px-3 py-1.5 text-sm font-medium text-gold hover:bg-gold/20"
            >
              S&apos;abonner à la chaîne
            </a>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-pitch-400 bg-pitch-800 p-4 text-xs leading-relaxed text-ink-faint">
          Les analyses proposées par Footwik Pro sont des aides à la décision
          basées sur des données statistiques. Aucun résultat n&apos;est
          garanti. Le pari sportif comporte des risques : pariez de manière
          responsable. Service réservé aux personnes majeures (18 ans et
          plus).
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 text-xs text-ink-faint md:flex-row">
          <span>© {new Date().getFullYear()} Footwik Pro. Tous droits réservés.</span>
          <span>Fait avec passion pour le football africain et francophone.</span>
        </div>
      </div>
    </footer>
  );
}
