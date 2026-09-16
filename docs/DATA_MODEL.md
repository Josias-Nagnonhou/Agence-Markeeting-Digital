# Modèle de données — OfferLab

Schéma complet : [`prisma/schema.prisma`](../prisma/schema.prisma).
Les modules MVP ont un modèle complet ; les modules V2/V3 ont un schéma
minimal déjà posé pour éviter une migration structurante plus tard.

## Vue d'ensemble

```
User ──< Product ──< OfferAngle
  │           │
  │           ├──< ProductImage
  │           ├──< Testimonial            (2.13)
  │           ├──< OrderBump              (2.5)
  │           └──< Page ──< PageSection
  │                    ├──< PageVersion
  │                    ├──< Diagnostic ──< DiagnosticFinding
  │                    ├──1─1 HostingSubscription
  │                    ├──< Lead                (2.4)
  │                    ├──< AnalyticsEvent       (2.3)
  │                    ├──< ABTest ──< ABTestVariant   (2.2)
  │                    └──< Affiliate ──< AffiliateReferral (2.8)
  ├──< Order
  ├──< CreditLedgerEntry
  └──< Diagnostic (auteur)
```

## Entités MVP

- **User** — compte vendeur. `creditBalance` est un cache dénormalisé du
  solde de crédits IA ; la vérité vient de `CreditLedgerEntry` (audit).
- **Product** — ce que décrit le vendeur à l'onboarding (1.1) : cible,
  problème résolu, prix, lien de paiement externe, catégorie/niche.
- **OfferAngle** — les 2-3 variantes de positionnement proposées par l'IA
  (1.2). Une seule peut être `SELECTED` par produit à un instant donné ;
  la sélection détermine l'angle utilisé par le copywriting.
- **Template** — direction visuelle disponible pour la landing page (1.4,
  2.1). `structure` (JSON) décrit l'ordre et la config par défaut des
  sections pour ce template.
- **Page** — une page de vente générée. Un produit peut avoir plusieurs
  pages (multi-langue 2.10, variantes). `slug` est l'URL publique
  (`/p/[slug]`). `status` pilote le cycle brouillon → publiée → en pause
  (2.7).
- **PageSection** — bloc de copy éditable (headline, bénéfices, objections,
  CTA...). `content` est un JSON typé côté application par `type`, ce qui
  permet d'ajouter de nouveaux types de section sans migration.
- **PageVersion** — snapshot complet de la page à un instant donné, pour
  l'historique de versions (2.12, posé dès le MVP car peu coûteux).
- **Diagnostic** / **DiagnosticFinding** — résultat de l'analyse CRO (1.6),
  sur une page interne ou une URL externe. Les findings sont classés par
  catégorie (clarté/confiance/désir/friction/SEO) et sévérité, pour piloter
  l'ordre d'affichage des recommandations.
- **CreditLedgerEntry** — grand livre des crédits de retouches IA (1.7) :
  chaque génération/régénération consomme une entrée `CONSUME`, chaque
  achat/offre une entrée `GRANT`/`PURCHASE`.
- **Order** — paiement ponctuel côté app (création de page, pack de
  crédits...). **HostingSubscription** — abonnement récurrent
  d'hébergement, un par page publiée (1.8/1.9).

## Entités V2 (posées, non branchées en MVP)

- **Lead** (2.4), **AnalyticsEvent** (2.3), **ABTest**/**ABTestVariant**
  (2.2).

## Entités V3 (posées, non branchées en MVP)

- **OrderBump** (2.5), **Affiliate**/**AffiliateReferral** (2.8),
  **Testimonial** (2.13).

## Décisions de modélisation

- **Enums Prisma** plutôt que tables de référence : les valeurs (catégorie
  produit, provider de paiement, statut...) sont fermées et connues à la
  conception ; un enum évite une jointure pour un gain de flexibilité qui
  n'est pas nécessaire ici.
- **JSON pour le contenu éditable** (`PageSection.content`,
  `Template.structure`, `PageVersion.snapshot`) : la forme du contenu varie
  par type de section/template et évolue vite en V1 ; la validation se fait
  côté application (Zod) plutôt que par le schéma SQL.
- **Devise par défaut `XOF`** (franc CFA) pour le marché ouest-africain
  ciblé, `Decimal(12,2)` pour tous les montants afin d'éviter les erreurs
  d'arrondi flottant.
