-- Profiles for every authenticated user (applicants + members).
-- Distinct from member_profiles, which is created only on hub approval.

create table if not exists public.user_profiles (
  auth_user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  privy_did text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists user_profiles_email_idx
  on public.user_profiles (email);

create index if not exists user_profiles_privy_did_idx
  on public.user_profiles (privy_did)
  where privy_did is not null;

alter table public.user_profiles enable row level security;

create policy "Service role can manage user_profiles"
  on public.user_profiles
  for all
  using (current_setting('request.jwt.claim.role', true) = 'service_role');

create policy "Users can read their own user profile"
  on public.user_profiles
  for select
  using (auth.uid() = auth_user_id);

create policy "Users can update their own user profile"
  on public.user_profiles
  for update
  using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);
