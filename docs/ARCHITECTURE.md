# Architecture — OfferLab

OfferLab transforme une description de produit digital en page de vente
premium (offre repositionnée, copywriting, diagnostic CRO, checkout).

## Stack

| Couche          | Choix                                              |
|-----------------|-----------------------------------------------------|
| Frontend/Backend| Next.js 16 (App Router, `src/`), TypeScript strict  |
| UI              | Tailwind CSS v4, composants dans `src/components/ui`|
| Base de données | PostgreSQL (Neon/Supabase) via Prisma 7             |
| Auth            | Auth.js (NextAuth v5) — credentials + Google, JWT   |
| IA              | Claude (Anthropic SDK), voir `src/lib/ai`           |
| Paiement app    | Stripe (carte) + Kkiapay/FedaPay/PayDunya (Mobile Money) |
| Paiement vendeur| lien externe générique (Chariow ou autre)           |
| Hébergement pages| Next.js dynamic route `/p/[slug]`, CDN via Vercel/Cloudflare |

## Principe directeur : architecture modulaire par domaine

Le code métier ne vit pas dans `src/app` (qui ne contient que du routing et
de la composition UI). Chaque capacité produit est un **module** sous
`src/modules/<domaine>/`, avec un contrat stable :

```
src/modules/<domaine>/
  <domaine>.types.ts      # types du domaine, entrées/sorties
  <domaine>.service.ts    # logique métier, orchestration
  <domaine>.repository.ts # accès Prisma (si nécessaire)
  providers/               # implémentations interchangeables (paiement, IA...)
```

Règle : une route API (`src/app/api/**/route.ts`) ou une Server Action
appelle un `service`, jamais Prisma directement. Cela permet de :
- tester la logique métier sans dépendre du framework HTTP ;
- remplacer un provider (ex. Chariow → autre lien de paiement, Stripe →
  autre PSP) sans toucher au reste de l'app ;
- ajouter un nouveau module (V2/V3) sans modifier les modules existants.

### Modules prévus

| Module              | Rôle                                             | Statut |
|----------------------|--------------------------------------------------|--------|
| `product`            | Onboarding produit (1.1)                         | MVP |
| `offer-engine`        | Positionnement d'offre IA (1.2)                  | MVP |
| `copywriting`         | Génération de copy (1.3)                         | MVP |
| `page-builder`        | Assemblage de la landing page + templates (1.4)  | MVP |
| `checkout`            | Redirection vers le lien de paiement vendeur (1.5)| MVP |
| `cro-diagnostic`      | Diagnostic CRO d'une page (1.6)                  | MVP |
| `credits`             | Crédits de retouches IA (1.7)                    | MVP |
| `hosting`             | Publication + abonnement d'hébergement (1.8/1.9) | MVP |
| `billing`             | Paiement de l'app (Stripe + Mobile Money) (1.9)  | MVP |
| `analytics`           | Tunnel de conversion, événements (2.3)           | V2 |
| `leads`               | Capture d'e-mail (2.4)                           | V2 |
| `ab-testing`          | Variantes A/B (2.2)                              | V2 |
| `affiliation`         | Liens d'affiliation, commissions (2.8)           | V3 |
| `testimonials`        | Collecte d'avis post-achat (2.13)                | V3 |

Chaque module est développé et présenté indépendamment (voir le plan de
priorisation dans le README), pour permettre une revue à chaque étape.

## Flux principal (MVP)

```
Onboarding (1.1) → offer-engine (1.2, 2-3 angles) → copywriting (1.3,
blocs éditables) → page-builder (1.4, templates + aperçu) → publication
→ hosting (1.8/1.9, URL + abonnement) → page publique /p/[slug]
→ checkout (1.5, redirection vers lien de paiement vendeur)
→ confirmation

En parallèle : cro-diagnostic (1.6) sur une page existante, credits (1.7)
pour les retouches.
```

## Organisation des dossiers

```
prisma/schema.prisma       Schéma de données (voir docs/DATA_MODEL.md)
src/
  app/
    (marketing)/            Landing page de l'app elle-même
    (auth)/login, register  Authentification
    (dashboard)/            Espace vendeur : produits, wizard, éditeur,
                             diagnostic, analytics, affiliation, facturation
    p/[slug]/                Page de vente publique générée
    api/                     Routes API (auth, IA, checkout, webhooks...)
  modules/                  Logique métier par domaine (voir ci-dessus)
  lib/
    db/prisma.ts             Singleton Prisma
    auth/                    Config Auth.js
    ai/                      Client Claude + prompts
    utils/                   Helpers partagés
  components/
    ui/                      Design system (boutons, inputs, cards...)
    wizard/                  Étapes du wizard de création
    editor/                  Éditeur post-génération
    landing/                 Rendu des templates de page de vente
  types/                     Types transverses (non liés à un module)
```

## Pages de l'application

Voir la section "Structure des pages" du README pour la liste complète ;
chaque page du dashboard consomme un ou plusieurs modules via API routes /
Server Actions.
