import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { Button } from "@/components/ui/button";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { BrowserMockup } from "@/components/marketing/browser-mockup";
import { Sparkles, PenLine, Gauge, Wand2, Globe, Smartphone, ArrowRight } from "lucide-react";

const steps = [
  { n: "1", title: "Produit", body: "Décris ce que tu vends, à qui, et colle ton lien de paiement." },
  { n: "2", title: "Offre", body: "L'IA reformule ta promesse et propose 3 angles différenciants." },
  { n: "3", title: "Copy", body: "Headline, bénéfices, preuves, objections, CTA — générés et 100% éditables." },
  { n: "4", title: "Design", body: "Choisis une direction visuelle, prévisualise en mobile et desktop." },
  { n: "5", title: "Checkout", body: "Chaque bouton redirige vers ton lien de paiement, retour automatique." },
  { n: "6", title: "Publication", body: "Une URL propre, en ligne immédiatement." },
];

const features = [
  { icon: Sparkles, title: "Positionnement d'offre IA", body: "Une promesse reformulée et un angle difficile à comparer à la concurrence." },
  { icon: PenLine, title: "Copywriting orienté conversion", body: "Chaque bloc généré par l'IA reste éditable manuellement." },
  { icon: Gauge, title: "Diagnostic CRO", body: "Colle une URL ou une de tes pages : l'IA priorise ce qui bloque la conversion." },
  { icon: Wand2, title: "Retouches IA", body: "Régénère un bloc avec un autre ton ou une autre longueur, en un clic." },
  { icon: Globe, title: "Hébergement inclus", body: "Ta page reste en ligne à une URL dédiée, sans configuration." },
  { icon: Smartphone, title: "Mobile Money & carte", body: "Pensé pour le marché ouest-africain : Kkiapay et Stripe intégrés." },
];

export default async function HomePage() {
  const session = await auth();
  const primaryHref = session?.user ? "/dashboard" : "/register";

  return (
    <main className="flex-1 bg-white">
      <section className="relative overflow-hidden bg-gray-950 px-6 pb-20 pt-32 sm:pb-28 sm:pt-40">
        <MarketingNav isAuthenticated={Boolean(session?.user)} />

        {/* Décor : voile mesh-gradient + grille + halos flous */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,#1e1b4b_0%,#312e81_30%,#4c1d95_55%,#1e1b4b_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
        <div className="pointer-events-none absolute -top-24 right-[-10%] h-96 w-96 rounded-full bg-amber-400/30 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 left-[-10%] h-96 w-96 rounded-full bg-fuchsia-500/20 blur-[110px]" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-100 ring-1 ring-white/20 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Propulsé par l&apos;IA
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Transforme ton offre en{" "}
              <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                page de vente premium
              </span>
              , en un après-midi.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-indigo-100/80 sm:text-lg lg:mx-0">
              OfferLab reformule ta promesse, écrit ton copywriting, assemble ta page et te dit
              précisément ce qui freine la conversion — pour les vendeurs de formations, ebooks,
              coaching et communautés payantes.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 lg:items-start">
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <Link href={primaryHref}>
                  <Button variant="accent" size="lg" className="gap-2">
                    {session?.user ? "Accéder à mon dashboard" : "Créer mon compte gratuitement"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                {!session?.user && (
                  <Link href="/login" className="text-sm font-medium text-indigo-100 underline underline-offset-4 hover:text-white">
                    Se connecter
                  </Link>
                )}
              </div>
              <p className="text-xs text-indigo-200/60">
                Aucune carte bancaire requise · Positionnement, copy et design générés par l&apos;IA
              </p>
            </div>
          </div>

          <div className="[perspective:1200px]">
            <div className="[transform:rotateY(-6deg)_rotateX(2deg)]">
              <BrowserMockup />
            </div>
          </div>
        </div>
      </section>

      <section id="comment-ca-marche" className="bg-gray-50 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-indigo-600">Le parcours</p>
          <h2 className="mt-2 text-center text-2xl font-semibold sm:text-3xl">Comment ça marche</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.n}
                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white shadow-sm shadow-indigo-600/30">
                  {step.n}
                </span>
                <p className="mt-4 font-semibold">{step.title}</p>
                <p className="mt-1 text-sm text-gray-500">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="fonctionnalites" className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-indigo-600">La boîte à outils</p>
          <h2 className="mt-2 text-center text-2xl font-semibold sm:text-3xl">Ce que tu obtiens</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-gray-200 p-5 transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <feature.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 font-semibold">{feature.title}</p>
                <p className="mt-1 text-sm text-gray-500">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gray-950 px-6 py-20 text-center sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,#1e1b4b_0%,#312e81_40%,#4c1d95_100%)]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-400/25 blur-[100px]" />
        <div className="relative mx-auto max-w-xl">
          <p className="text-2xl font-semibold text-white sm:text-3xl">
            Prêt à transformer ton offre ?
          </p>
          <p className="mt-3 text-indigo-100/80">
            Crée ton compte et génère ta première page de vente aujourd&apos;hui.
          </p>
          <Link href={primaryHref} className="mt-7 inline-block">
            <Button variant="accent" size="lg" className="gap-2">
              {session?.user ? "Accéder à mon dashboard" : "Créer mon compte gratuitement"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-white px-6 py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} OfferLab. Fait pour les vendeurs de produits digitaux.
      </footer>
    </main>
  );
}
