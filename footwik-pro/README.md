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
- **Abonnements** (`/abonnement`) — Gratuit, Semaine, Mois, VIP mensuel, prix en FCFA (Afrique) ou en euros (diaspora), checkout Mobile Money (MTN, Moov, Wave, Orange Money via FedaPay/KkiaPay) et carte bancaire.
- **Authentification** (`/connexion`, `/inscription`) — email ou téléphone avec code OTP via Supabase Auth, confirmation d'âge 18+.
- **Espace abonné** (`/compte`) — vue d'ensemble, favoris, équipes suivies, gestion d'abonnement, lien de parrainage, historique des paiements.
- **Panneau d'administration** (`/admin`) — validation des fiches générées par l'IA avant publication, confirmation des résultats (gagné/perdu), gestion des abonnés et paiements, statistiques (abonnés actifs, taux de conversion, revenus), publication de contenus VIP (audio/vidéo/message).
- **Pages légales** — Conditions d'utilisation, Politique de confidentialité, Jeu responsable, bannière de rappel permanente.
- Placeholder pour l'**Assistant IA** (`/assistant`) — arrivera en V2, avec Telegram et le parrainage automatisé complet.

Cette V1 utilise des **données simulées** (`src/lib/data/*`) pour les matchs,
l'historique et les tableaux d'administration, afin que l'application soit
utilisable immédiatement sans configuration. Les intégrations réelles
(Supabase, API-Football, FedaPay, KkiaPay) sont câblées et prêtes à
fonctionner dès que les clés sont renseignées (voir ci-dessous).

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

1. **Supabase** — créez un projet sur [supabase.com](https://supabase.com), récupérez l'URL et la clé anonyme dans *Project Settings → API*, puis exécutez `supabase/schema.sql` dans l'éditeur SQL du projet pour créer les tables (profils, matchs, fiches d'analyse, abonnements, paiements, favoris, parrainage, contenus VIP). Activez les providers *Email* et *Phone* (SMS) dans *Authentication → Providers*.
2. **API-Football** — créez un compte sur [api-football.com](https://www.api-football.com/) et renseignez `API_FOOTBALL_KEY`. Un job planifié (cron Supabase, route API `/api/matches/sync` à créer, ou tâche externe) doit appeler l'API quotidiennement pour mettre à jour les matchs et déclencher la génération des fiches par le modèle d'IA.
3. **FedaPay** — créez un compte sur [fedapay.com](https://fedapay.com), renseignez `FEDAPAY_SECRET_KEY` et `FEDAPAY_ENV=live` en production.
4. **KkiaPay** — créez un compte sur [kkiapay.me](https://kkiapay.me), renseignez `NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY` et `KKIAPAY_PRIVATE_KEY`.
5. **Telegram** (V2) — créez un bot via [@BotFather](https://t.me/BotFather) et renseignez `TELEGRAM_BOT_TOKEN`.

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
supabase/schema.sql       Schéma PostgreSQL complet avec RLS
```

## Prochaines étapes (V2)

- Assistant IA conversationnel (« Pose ta question à l'IA ») branché sur un modèle de langage et les données API-Football en temps réel.
- Notifications Telegram automatiques avant chaque match + intégration WhatsApp.
- Automatisation complète du programme de parrainage (attribution automatique des semaines offertes).
- Job de synchronisation quotidien API-Football → génération de fiches IA → file de validation admin.
