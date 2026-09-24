-- Footwik Pro — schéma Supabase (PostgreSQL)
-- À exécuter dans l'éditeur SQL de votre projet Supabase.

create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILS UTILISATEURS
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  phone text,
  country text,
  region text check (region in ('afrique', 'diaspora')) default 'afrique',
  age_confirmed boolean not null default false,
  referral_code text unique,
  referred_by uuid references public.profiles (id),
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Un utilisateur peut lire son propre profil"
  on public.profiles for select using (auth.uid() = id);

create policy "Un utilisateur peut modifier son propre profil"
  on public.profiles for update using (auth.uid() = id);

-- ============================================================
-- ÉQUIPES & COMPÉTITIONS
-- ============================================================
create table if not exists public.teams (
  id uuid primary key default uuid_generate_v4(),
  api_football_id integer unique,
  name text not null,
  short_name text not null,
  country text,
  logo_url text
);

create table if not exists public.matches (
  id uuid primary key default uuid_generate_v4(),
  api_football_id integer unique,
  competition text not null,
  home_team_id uuid references public.teams (id),
  away_team_id uuid references public.teams (id),
  kickoff timestamptz not null,
  venue text,
  status text not null default 'a_venir' check (status in ('a_venir', 'en_cours', 'termine')),
  final_score text,
  created_at timestamptz not null default now()
);

alter table public.teams enable row level security;
alter table public.matches enable row level security;

create policy "Lecture publique des équipes" on public.teams for select using (true);
create policy "Lecture publique des matchs" on public.matches for select using (true);

-- ============================================================
-- FICHES D'ANALYSE GÉNÉRÉES PAR L'IA
-- ============================================================
create table if not exists public.match_analyses (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid not null references public.matches (id) on delete cascade,
  home_form jsonb default '[]',
  away_form jsonb default '[]',
  home_lineup jsonb default '[]',
  away_lineup jsonb default '[]',
  home_injuries jsonb default '[]',
  away_injuries jsonb default '[]',
  h2h jsonb default '[]',
  home_stats jsonb default '{}',
  away_stats jsonb default '{}',
  hidden_factors jsonb default '[]',
  markets jsonb default '[]',
  summary jsonb default '[]',
  main_pick text,
  confidence smallint check (confidence between 1 and 5),
  is_free boolean not null default false,
  status text not null default 'en_attente' check (status in ('en_attente', 'publie', 'rejete')),
  generated_at timestamptz not null default now(),
  validated_at timestamptz,
  validated_by uuid references public.profiles (id)
);

alter table public.match_analyses enable row level security;

create policy "Lecture publique des fiches publiées"
  on public.match_analyses for select using (status = 'publie');

create policy "Les admins gèrent toutes les fiches"
  on public.match_analyses for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- ============================================================
-- HISTORIQUE PUBLIC DES PRONOSTICS
-- ============================================================
create table if not exists public.prediction_history (
  id uuid primary key default uuid_generate_v4(),
  match_analysis_id uuid references public.match_analyses (id) on delete set null,
  match_label text not null,
  competition text not null,
  pick text not null,
  confidence smallint check (confidence between 1 and 5),
  outcome text not null default 'en_attente' check (outcome in ('gagne', 'perdu', 'en_attente', 'annule')),
  final_score text,
  match_date timestamptz not null,
  published_at timestamptz not null default now()
);

alter table public.prediction_history enable row level security;
create policy "Lecture publique de l'historique" on public.prediction_history for select using (true);

-- ============================================================
-- ABONNEMENTS & PAIEMENTS
-- ============================================================
create table if not exists public.subscription_plans (
  id text primary key,
  name text not null,
  fcfa_price integer not null,
  eur_price integer not null,
  period text not null,
  features jsonb default '[]'
);

create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  plan_id text not null references public.subscription_plans (id),
  status text not null default 'actif' check (status in ('actif', 'expire', 'annule')),
  started_at timestamptz not null default now(),
  expires_at timestamptz
);

create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  subscription_id uuid references public.subscriptions (id),
  provider text not null check (provider in ('fedapay', 'kkiapay')),
  provider_transaction_id text,
  payment_method text not null check (payment_method in ('mobile_money', 'card')),
  operator text check (operator in ('mtn', 'moov', 'wave', 'orange')),
  amount integer not null,
  currency text not null check (currency in ('XOF', 'EUR')),
  status text not null default 'en_attente' check (status in ('paye', 'echoue', 'en_attente')),
  created_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;

create policy "Un utilisateur voit ses propres abonnements"
  on public.subscriptions for select using (auth.uid() = user_id);

create policy "Un utilisateur voit ses propres paiements"
  on public.payments for select using (auth.uid() = user_id);

-- ============================================================
-- FAVORIS, ÉQUIPES SUIVIES, PARRAINAGE
-- ============================================================
create table if not exists public.favorites (
  user_id uuid references public.profiles (id) on delete cascade,
  match_id uuid references public.matches (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, match_id)
);

create table if not exists public.followed_teams (
  user_id uuid references public.profiles (id) on delete cascade,
  team_id uuid references public.teams (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, team_id)
);

create table if not exists public.referrals (
  id uuid primary key default uuid_generate_v4(),
  referrer_id uuid not null references public.profiles (id) on delete cascade,
  referred_id uuid not null references public.profiles (id) on delete cascade,
  reward_applied boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.favorites enable row level security;
alter table public.followed_teams enable row level security;
alter table public.referrals enable row level security;

create policy "Un utilisateur gère ses favoris" on public.favorites for all using (auth.uid() = user_id);
create policy "Un utilisateur gère ses équipes suivies" on public.followed_teams for all using (auth.uid() = user_id);
create policy "Un utilisateur voit ses parrainages" on public.referrals for select using (auth.uid() = referrer_id);

-- ============================================================
-- CONTENUS VIP & NOTIFICATIONS (Telegram / WhatsApp à venir)
-- ============================================================
create table if not exists public.vip_contents (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content_type text not null check (content_type in ('audio', 'video', 'message')),
  media_url text,
  body text,
  published_at timestamptz not null default now(),
  created_by uuid references public.profiles (id)
);

alter table public.vip_contents enable row level security;
create policy "Lecture VIP réservée aux abonnés authentifiés"
  on public.vip_contents for select using (auth.uid() is not null);

create table if not exists public.telegram_links (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  telegram_chat_id text not null unique,
  linked_at timestamptz not null default now()
);

alter table public.telegram_links enable row level security;
create policy "Un utilisateur gère son lien Telegram"
  on public.telegram_links for all using (auth.uid() = user_id);
