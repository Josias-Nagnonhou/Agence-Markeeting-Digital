-- Footwik Pro — migration 002 : comptes réels, formules, coupon IA,
-- suivi de paris, alertes, cotes, espace VIP.
-- À exécuter dans l'éditeur SQL Supabase après supabase/schema.sql.

create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILS : formule active, statut fondateur, Telegram
-- ============================================================
alter table public.profiles
  add column if not exists plan text not null default 'gratuit'
    check (plan in ('gratuit', 'semaine', 'mois', 'trimestre', 'an', 'vip')),
  add column if not exists plan_expires_at timestamptz,
  add column if not exists is_founder boolean not null default false,
  add column if not exists telegram_invite_code text;

-- Les admins peuvent lire et modifier tous les profils (gestion des
-- formules/places fondateur-VIP depuis le panneau d'administration).
-- Fonction security definer pour éviter toute récursion RLS sur profiles.
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = uid), false);
$$;

create policy "Les admins lisent tous les profils"
  on public.profiles for select
  using (public.is_admin(auth.uid()));

create policy "Les admins modifient tous les profils"
  on public.profiles for update
  using (public.is_admin(auth.uid()));

-- Auto-création du profil à l'inscription (déclencheur sur auth.users)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, referral_code)
  values (new.id, new.email, upper(substr(md5(new.id::text), 1, 8)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Favoris et équipes suivies référencent les identifiants texte des
-- données mock (ex: "psg-lens", "senegal") tant que la synchronisation
-- API-Football réelle n'alimente pas les tables matches/teams.
alter table public.favorites drop constraint if exists favorites_match_id_fkey;
alter table public.favorites alter column match_id type text using match_id::text;

alter table public.followed_teams drop constraint if exists followed_teams_team_id_fkey;
alter table public.followed_teams alter column team_id type text using team_id::text;

-- ============================================================
-- JOURNAL D'ACTIVITÉ (historique visible dans l'espace abonné)
-- ============================================================
create table if not exists public.activity_log (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  activity_type text not null,
  label text not null,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

alter table public.activity_log enable row level security;

create policy "Un utilisateur voit sa propre activité"
  on public.activity_log for select using (auth.uid() = user_id);

create policy "Un utilisateur journalise sa propre activité"
  on public.activity_log for insert with check (auth.uid() = user_id);

-- ============================================================
-- ANALYSE MON COUPON
-- ============================================================
create table if not exists public.coupon_analyses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  source text not null default 'manuel' check (source in ('image', 'manuel')),
  selections jsonb not null default '[]',
  overall_risk text check (overall_risk in ('solide', 'moyen', 'risque')),
  summary text,
  created_at timestamptz not null default now()
);

alter table public.coupon_analyses enable row level security;

create policy "Un utilisateur gère ses coupons"
  on public.coupon_analyses for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- SUIVI PERSONNEL DES PARIS
-- ============================================================
create table if not exists public.bets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  match_label text not null,
  market text not null,
  odds numeric not null,
  stake numeric not null,
  result text not null default 'en_attente' check (result in ('gagne', 'perdu', 'en_attente', 'annule')),
  placed_at timestamptz not null default now(),
  settled_at timestamptz
);

alter table public.bets enable row level security;

create policy "Un utilisateur gère ses paris"
  on public.bets for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.betting_budgets (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  monthly_limit numeric not null,
  updated_at timestamptz not null default now()
);

alter table public.betting_budgets enable row level security;

create policy "Un utilisateur gère son budget"
  on public.betting_budgets for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- ALERTES & PRÉFÉRENCES DE SUIVI
-- ============================================================
create table if not exists public.alerts (
  id uuid primary key default uuid_generate_v4(),
  alert_type text not null check (alert_type in ('composition', 'blessure', 'cote')),
  competition text,
  team_name text,
  message text not null,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles (id)
);

alter table public.alerts enable row level security;
create policy "Lecture publique des alertes pour les abonnés"
  on public.alerts for select using (auth.uid() is not null);
create policy "Les admins publient des alertes"
  on public.alerts for insert with check (public.is_admin(auth.uid()));

create table if not exists public.followed_competitions (
  user_id uuid references public.profiles (id) on delete cascade,
  competition text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, competition)
);

alter table public.followed_competitions enable row level security;
create policy "Un utilisateur gère ses compétitions suivies"
  on public.followed_competitions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- COTES (comparateur) — alimenté 1x/jour par un job planifié,
-- jamais interrogé directement par le navigateur.
-- ============================================================
create table if not exists public.odds (
  id uuid primary key default uuid_generate_v4(),
  match_id text not null,
  bookmaker text not null,
  market text not null,
  pick text not null,
  odd numeric not null,
  fetched_at timestamptz not null default now()
);

create index if not exists odds_match_id_idx on public.odds (match_id);

alter table public.odds enable row level security;
create policy "Lecture publique des cotes" on public.odds for select using (true);

-- Publication de contenu VIP (audio/vidéo/message) depuis le panneau
-- d'administration — vip_contents existe depuis schema.sql mais n'avait
-- pas encore de politique d'écriture.
create policy "Les admins publient du contenu VIP"
  on public.vip_contents for insert with check (public.is_admin(auth.uid()));

-- ============================================================
-- ESPACE VIP
-- ============================================================
create table if not exists public.vip_lives (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  scheduled_at timestamptz not null,
  access_url text,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles (id)
);

alter table public.vip_lives enable row level security;
create policy "Lecture des lives réservée aux connectés"
  on public.vip_lives for select using (auth.uid() is not null);
create policy "Les admins publient des lives"
  on public.vip_lives for insert with check (public.is_admin(auth.uid()));

-- Liste d'attente VIP quand les 200 places sont prises
create table if not exists public.vip_waitlist (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  user_id uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.vip_waitlist enable row level security;
create policy "Ajout public à la liste d'attente VIP"
  on public.vip_waitlist for insert with check (true);
