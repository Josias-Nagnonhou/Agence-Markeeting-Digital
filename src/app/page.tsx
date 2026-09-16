import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { Button } from "@/components/ui/button";

const steps = [
  { n: "1", title: "Produit", body: "Décris ce que tu vends, à qui, et colle ton lien de paiement." },
  { n: "2", title: "Offre", body: "L'IA reformule ta promesse et propose 3 angles différenciants." },
  { n: "3", title: "Copy", body: "Headline, bénéfices, preuves, objections, CTA — générés et 100% éditables." },
  { n: "4", title: "Design", body: "Choisis une direction visuelle, prévisualise en mobile et desktop." },
  { n: "5", title: "Checkout", body: "Chaque bouton redirige vers ton lien de paiement, retour automatique." },
  { n: "6", title: "Publication", body: "Une URL propre, en ligne immédiatement." },
];

const features = [
  { title: "Positionnement d'offre IA", body: "Une promesse reformulée et un angle difficile à comparer à la concurrence." },
  { title: "Copywriting orienté conversion", body: "Chaque bloc généré par l'IA reste éditable manuellement." },
  { title: "Diagnostic CRO", body: "Colle une URL ou une de tes pages : l'IA priorise ce qui bloque la conversion." },
  { title: "Retouches IA", body: "Régénère un bloc avec un autre ton ou une autre longueur, en un clic." },
  { title: "Hébergement inclus", body: "Ta page reste en ligne à une URL dédiée, sans configuration." },
  { title: "Mobile Money & carte", body: "Pensé pour le marché ouest-africain : Kkiapay et Stripe intégrés." },
];

export default async function HomePage() {
  const session = await auth();
  const primaryHref = session?.user ? "/dashboard" : "/register";

  return (
    <main className="flex-1 bg-white">
      <section className="px-6 py-20 text-center sm:py-28">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Transforme ton offre en page de vente premium, en un après-midi.
          </h1>
          <p className="mt-4 text-base text-gray-600 sm:text-xl">
            OfferLab reformule ta promesse, écrit ton copywriting, assemble ta page et te dit
            précisément ce qui freine la conversion — pour les vendeurs de formations, ebooks,
            coaching et communautés payantes.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={primaryHref}>
              <Button size="lg">{session?.user ? "Accéder à mon dashboard" : "Créer mon compte"}</Button>
            </Link>
            {!session?.user && (
              <Link href="/login" className="text-sm font-medium text-gray-600 underline">
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-semibold sm:text-3xl">Comment ça marche</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n} className="rounded-xl border border-gray-200 bg-white p-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                  {step.n}
                </span>
                <p className="mt-3 font-semibold">{step.title}</p>
                <p className="mt-1 text-sm text-gray-500">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-semibold sm:text-3xl">Ce que tu obtiens</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-gray-200 p-5">
                <p className="font-semibold">{feature.title}</p>
                <p className="mt-1 text-sm text-gray-500">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-900 px-6 py-16 text-center sm:py-20">
        <div className="mx-auto max-w-xl">
          <p className="text-xl font-semibold text-white sm:text-2xl">
            Prêt à transformer ton offre ?
          </p>
          <Link href={primaryHref} className="mt-6 inline-block">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              {session?.user ? "Accéder à mon dashboard" : "Créer mon compte gratuitement"}
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
