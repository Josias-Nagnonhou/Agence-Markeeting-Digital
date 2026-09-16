# OfferLab

SaaS qui aide les vendeurs de produits digitaux (formations, ebooks,
coaching, templates, communautés payantes) à transformer une simple
description de produit en page de vente premium : offre repositionnée,
copywriting orienté conversion, diagnostic CRO, checkout connecté.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — stack, découpage en
  modules, flux principal, organisation des dossiers.
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — modèle de données, décisions
  de modélisation.
- [`prisma/schema.prisma`](prisma/schema.prisma) — schéma de base de
  données complet.

## Démarrage local

```bash
cp .env.example .env       # renseigner DATABASE_URL, ANTHROPIC_API_KEY...
npm install
npm run db:push            # applique le schéma sur la base configurée
npm run dev
```

## Priorisation

- **MVP (v1)** — onboarding produit, positionnement d'offre IA,
  copywriting, générateur de landing page, checkout externe, diagnostic
  CRO, crédits de retouches IA, hébergement, paiement de l'app
  (Stripe + Mobile Money), multi-produits/multi-pages, SEO de base.
- **V2** — bibliothèque de templates par niche, A/B testing, analytics &
  tunnel de conversion, capture d'e-mail, multi-langue, éditeur visuel
  drag & drop.
- **V3** — order bump/upsell, preuve sociale dynamique, affiliation,
  historique de versions avancé, espace preuves & avis.

Chaque fonctionnalité du MVP est développée et présentée module par
module (voir `docs/ARCHITECTURE.md`).
