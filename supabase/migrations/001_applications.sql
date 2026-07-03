-- Run this in the Supabase SQL editor for your project.

-- Referral codes (issued at StellarBarrio events)
create table if not exists public.referral_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  event_name text not null,
  cohort text not null,
  expires_at timestamptz not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists referral_codes_code_idx
  on public.referral_codes (code);

-- UNBLCK membership applications
create table if not exists public.unblck_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  project_name text not null,
  project_link text,
  build_description text not null,
  location text not null,
  stage text not null,
  motivation text not null
);

create index if not exists unblck_applications_created_at_idx
  on public.unblck_applications (created_at desc);

create index if not exists unblck_applications_email_idx
  on public.unblck_applications (email);

-- Insta Awards grant applications
create table if not exists public.insta_awards_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  referral_code text not null,
  full_name text not null,
  email text not null,
  project_name text not null,
  project_link text not null,
  stellar_build text not null,
  stellar_use_case text not null,
  stage text not null,
  is_unblck_member boolean not null,
  grant_motivation text not null
);

create index if not exists insta_awards_applications_created_at_idx
  on public.insta_awards_applications (created_at desc);

create index if not exists insta_awards_applications_email_idx
  on public.insta_awards_applications (email);

create index if not exists insta_awards_applications_referral_code_idx
  on public.insta_awards_applications (referral_code);

alter table public.referral_codes enable row level security;
alter table public.unblck_applications enable row level security;
alter table public.insta_awards_applications enable row level security;

-- Inserts happen via Next.js API routes using the service role key.

-- Example: seed a referral code for your first StellarBarrio event
-- insert into public.referral_codes (code, event_name, cohort, expires_at)
-- values (
--   'STELLARBARRIO-MAR26',
--   'StellarBarrio March 2026',
--   'Cohort 1',
--   '2026-04-30T23:59:59Z'
-- );
