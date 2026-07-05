-- Add UNBLCK Hub Funnel tables and extend unblck_applications

-- Extend unblck_applications table
alter table public.unblck_applications
add column status text not null default 'pending',
add column passport_address text,
add column terms_version text,
add column terms_accepted_at timestamptz,
add column passport_verified boolean not null default false,
add column stellar_funded boolean not null default false,
add column reviewer_notes text,
add column auth_user_id uuid unique references auth.users(id);

create index if not exists unblck_applications_status_idx
on public.unblck_applications (status);

-- Create member_profiles table
create table if not exists public.member_profiles (
  auth_user_id uuid primary key references auth.users(id),
  application_id uuid unique references public.unblck_applications(id),
  email text not null unique,
  stellar_funded boolean not null default false,
  passport_verified boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists member_profiles_email_idx
on public.member_profiles (email);

alter table public.member_profiles enable row level security;

-- Create bookings table
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.member_profiles(auth_user_id),
  booking_date date not null,
  week_start date not null,
  created_at timestamptz not null default now(),

  unique (member_id, booking_date)
);

create index if not exists bookings_member_id_date_idx
on public.bookings (member_id, booking_date desc);

alter table public.bookings enable row level security;

-- Create hub_schedule table
create table if not exists public.hub_schedule (
  week_start date primary key,
  open_days jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.hub_schedule enable row level security;

-- RLS Policies
-- All writes continue through Next.js API routes using service role
-- Users can read their own data

-- Allow service role to manage all tables (using service_role context)
create policy "Service role can manage unblck_applications" on public.unblck_applications
  for all using (current_setting('request.jwt.claim.role', true) = 'service_role');

create policy "Service role can manage member_profiles" on public.member_profiles
  for all using (current_setting('request.jwt.claim.role', true) = 'service_role');

create policy "Service role can manage bookings" on public.bookings
  for all using (current_setting('request.jwt.claim.role', true) = 'service_role');

create policy "Service role can manage hub_schedule" on public.hub_schedule
  for all using (current_setting('request.jwt.claim.role', true) = 'service_role');

-- Allow authenticated users to read their own data
create policy "Users can read their own unblck applications" on public.unblck_applications
  for select using (auth.uid() = auth_user_id);

create policy "Users can read their own member profiles" on public.member_profiles
  for select using (auth.uid() = auth_user_id);

create policy "Users can read their own bookings" on public.bookings
  for select using (member_id = auth.uid());

-- Anyone can read hub schedule
create policy "Anyone can read hub schedule" on public.hub_schedule
  for select using (true);
