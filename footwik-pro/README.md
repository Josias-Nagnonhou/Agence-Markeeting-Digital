# Footwik Pro

Plateforme d'analyse de matchs de football par intelligence artificielle,
pour les passionnés et parieurs sportifs francophones d'Afrique et de la
diaspora. Liée à la chaîne YouTube **Footwik** (60 000 abonnés).

Positionnement : analyse sérieuse et transparente, jamais de « gains
garantis ». Tous les pronostics passés (gagnés **et** perdus) sont publics.

## Contenu de cette V1

- **Page d'accueil** — accroche, matchs du jour (aperçu gratuit / premium flouté), taux de réussite en temps réel, témoignages, bloc chaîne YouTube.
- **Fiches d'analyse de match** (`/matchs/[id]`) — forme récente, compositions probables, blessés/suspendus, confrontations directes, statistiques avancées (xG, possession, tirs cadrés, buts dom./ext.), facteurs cachés, indice de confiance (1 à 5 étoiles), marchés analysés (1X2, +/-2,5 buts, BTTS), résumé en 3 lignes.
- **Historique public** (`/historique`) — tableau filtrable par date, compétition, indice de confiance, avec statistiques globales de réussite.
- **Abonnements** (`/abonnement`) — Gratuit, Semaine (1 500 FCFA/3€), Mois (5 000/9€, POPULAIRE), 3 mois (12 000/22€, ÉCONOMISE 20%), 1 an (40 000/70€, MEILLEURE OFFRE), VIP (15 000/25€, PLACES LIMITÉES). Offre **Membre fondateur** (100 places, 3 500 FCFA à vie) et VIP plafonné à 200 membres avec liste d'attente — compteurs alimentés par de vraies requêtes Supabase. Checkout Mobile Money (MTN, Moov, Wave, Orange Money via FedaPay/KkiaPay) et carte bancaire.
- **Verrouillage par formule** — `lib/entitlements.ts` + `<FeatureGate>` bloquent chaque fonctionnalité premium avec un écran d'incitation ("Débloque avec le forfait X") plutôt qu'un message d'erreur brut.
- **Authentification** (`/connexion`, `/inscription`) — email avec code OTP via Supabase Auth (lien magique ou code à 6 chiffres), confirmation d'âge 18+.
- **Espace abonné** (`/compte`) — compte réel par utilisateur : formule active, **historique complet de l'activité** (connexions, fiches consultées, favoris, coupons analysés), favoris réels, équipes suivies, lien de parrainage, historique des paiements.
- **Analyse mon coupon** (`/coupon`, Mois+) — saisie manuelle ou capture d'écran, verdict Solide/Moyen/Risqué par sélection, risque global, historique sauvegardé, quota mensuel par formule (10, illimité en VIP). Analyse réelle via Claude si `ANTHROPIC_API_KEY` est configurée, sinon mode démo clairement indiqué.
- **Suivi de mes paris** (`/paris`, Mois+) — historique des paris, bilan net, taux de réussite, meilleur marché, courbe d'évolution, budget mensuel responsable avec avertissement.
- **Alertes de dernière minute** (`/alertes`, Mois+) — compositions, blessures, mouvements de cotes, filtrables par compétitions suivies.
- **Comparateur de cotes** (onglet « Cotes » sur chaque fiche, Mois+) — meilleure cote par marché, alimenté une fois par jour par un job planifié (jamais d'appel direct depuis le navigateur).
- **Espace VIP** (`/vip`) — calendrier des lives privés (avec ajout au calendrier .ics), exclusivités audio/vidéo « 24h avant YouTube », code d'invitation Telegram personnel.
- **Panneau d'administration** (`/admin`, réservé aux comptes `is_admin`) — gestion réelle des abonnés et de leur formule, compteurs fondateur/VIP en direct, publication de contenus VIP/lives/alertes, usage mensuel d'Analyse mon coupon ; validation des fiches IA et paiements restent en données de démonstration en attendant leurs intégrations respectives.
- **Pages légales** — Conditions d'utilisation, Politique de confidentialité, Jeu responsable, bannière de rappel permanente.
- Placeholder pour l'**Assistant IA** (`/assistant`) — arrivera en V2.

Les matchs (`src/lib/data/matches.ts`) restent des **données simulées**
pour que l'application soit utilisable immédiatement sans configuration ;
comptes, abonnements, coupons, paris, alertes et cotes sont en revanche
**réellement persistés dans Supabase** dès que le projet est configuré
(voir ci-dessous).

## Stack technique

- **Next.js 14** (App Router, TypeScript, Tailwind CSS)
- **Supabase** — base de données PostgreSQL + authentification email/téléphone par OTP (voir `supabase/schema.sql`)
- **API-Football** — source des données de matchs (à intégrer via un job de synchronisation quotidien)
- **FedaPay** / **KkiaPay** — paiements Mobile Money et carte bancaire
- **Telegram Bot API** — notifications automatiques (prévu, non branché en V1)
- **Recharts** — graphiques du panneau d'administration
- **lucide-react** — iconographie

## Démarrer en local

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

L'application fonctionne sans configuration : l'accueil, les fiches de
match, l'historique et le panneau admin utilisent des données simulées.
Le flux de paiement fonctionne aussi en **mode démo** tant qu'aucune clé
FedaPay/KkiaPay n'est renseignée (un bandeau l'indique clairement à
l'écran). L'authentification (email/téléphone OTP) nécessite en revanche un
projet Supabase configuré, car elle appelle réellement l'API Supabase Auth.

## Configuration des services externes

Copiez `.env.example` vers `.env.local` et renseignez :

1. **Supabase** — créez un projet sur [supabase.com](https://supabase.com), récupérez l'URL et la clé anonyme dans *Project Settings → API*, puis exécutez **dans l'ordre**, dans l'éditeur SQL du projet : `supabase/schema.sql` (V1 : profils, matchs, abonnements, paiements, favoris, contenus VIP) puis `supabase/migrations/002_v2_features.sql` (formules réelles, journal d'activité, coupons, paris, alertes, cotes, lives VIP). Activez le provider *Email* dans *Authentication → Providers*. Pour recevoir les emails avec un code affiché en clair (au lieu du lien magique par défaut), configurez un SMTP personnalisé (ex. [Resend](https://resend.com)) dans *Project Settings → Auth → SMTP Settings*, puis éditez le template *Magic Link* pour y inclure `{{ .Token }}`.
   - **Pour devenir administrateur** : après votre première connexion, exécutez `update public.profiles set is_admin = true where email = 'votre@email.com';` dans l'éditeur SQL.
2. **API-Football** — créez un compte sur [api-football.com](https://www.api-football.com/) et renseignez `API_FOOTBALL_KEY`. Les matchs restent des données simulées en V1 ; un job de synchronisation quotidien (fixtures, compositions) reste à construire pour remplacer `src/lib/data/matches.ts` par de vraies données.
3. **FedaPay** — créez un compte sur [fedapay.com](https://fedapay.com), renseignez `FEDAPAY_SECRET_KEY` et `FEDAPAY_ENV=live` en production.
4. **KkiaPay** — créez un compte sur [kkiapay.me](https://kkiapay.me), renseignez `NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY` et `KKIAPAY_PRIVATE_KEY`.
5. **Telegram** (V2) — créez un bot via [@BotFather](https://t.me/BotFather) et renseignez `TELEGRAM_BOT_TOKEN`.
6. **Anthropic (Claude)** — pour une vraie analyse de coupon (lecture d'image et raisonnement), renseignez `ANTHROPIC_API_KEY`. Sans clé, la fonctionnalité reste utilisable en mode démo, clairement indiqué à l'écran.
7. **Cotes (comparateur)** — renseignez `CRON_SECRET`, puis appelez `POST /api/cron/sync-odds` avec l'en-tête `x-cron-secret` une fois par jour (Render Cron Job ou tout planificateur externe — un plan gratuit Render ne propose pas de Cron Job, un service externe comme cron-job.org fonctionne aussi). Cette route génère pour l'instant des cotes d'exemple (bookmakers génériques) tant que les fixtures ne sont pas les vraies données API-Football.

## Structure du projet

```
src/
  app/                    Pages (App Router)
    matchs/[id]/          Fiche d'analyse d'un match
    historique/           Historique public des pronostics
    abonnement/           Plans + checkout Mobile Money / carte
    connexion, inscription/  Authentification OTP
    compte/               Espace abonné
    admin/                Panneau d'administration
    conditions, confidentialite, jeu-responsable/  Pages légales
    api/payments/checkout/  Endpoint de création de transaction FedaPay/KkiaPay
  components/             Composants UI réutilisables
  lib/
    data/                 Données simulées (matchs, historique, tarifs, admin)
    payments/             Intégrations FedaPay / KkiaPay
    supabase/             Clients Supabase (navigateur + serveur)
    types.ts              Types partagés
supabase/schema.sql       Schéma PostgreSQL V1 avec RLS
supabase/migrations/002_v2_features.sql  Formules réelles, coupons, paris, alertes, cotes, VIP
```

## Prochaines étapes (V2)

- Assistant IA conversationnel (« Pose ta question à l'IA ») branché sur un modèle de langage et les données API-Football en temps réel.
- Notifications Telegram automatiques avant chaque match + intégration WhatsApp, et automatisation réelle des invitations au groupe privé VIP.
- Automatisation complète du programme de parrainage (attribution automatique des semaines offertes).
- Job de synchronisation quotidien API-Football (fixtures, compositions, cotes) → remplacement des données simulées de `matches.ts` et de l'`odds` d'exemple par les vraies données, génération de fiches IA → file de validation admin.
- Webhook de confirmation de paiement FedaPay/KkiaPay pour automatiser l'activation des formules (actuellement assignées manuellement depuis le panneau d'administration) et alimenter réellement l'onglet Paiements de l'admin.
