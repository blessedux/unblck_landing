-- Channel linking for agent/bot API
-- Allows members to link Telegram/WhatsApp identities for external bot bookings

-- Short-lived one-time codes for linking
create table if not exists public.channel_link_codes (
  code text primary key,
  member_id uuid not null references public.member_profiles(auth_user_id) on delete cascade,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists channel_link_codes_member_id_idx
  on public.channel_link_codes (member_id);

create index if not exists channel_link_codes_expires_at_idx
  on public.channel_link_codes (expires_at);

alter table public.channel_link_codes enable row level security;

-- Durable channel identity bindings
create table if not exists public.channel_links (
  id uuid primary key default gen_random_uuid(),
  channel text not null check (channel in ('telegram', 'whatsapp')),
  channel_user_id text not null,
  member_id uuid not null references public.member_profiles(auth_user_id) on delete cascade,
  linked_at timestamptz not null default now(),
  revoked_at timestamptz,
  
  unique (channel, channel_user_id, member_id)
);

create unique index if not exists channel_links_active_identity_idx
  on public.channel_links (channel, channel_user_id)
  where revoked_at is null;

create index if not exists channel_links_member_id_idx
  on public.channel_links (member_id);

alter table public.channel_links enable row level security;

-- RLS Policies

-- Service role can manage all (for Next.js API routes)
create policy "Service role can manage channel_link_codes" on public.channel_link_codes
  for all using (current_setting('request.jwt.claim.role', true) = 'service_role');

create policy "Service role can manage channel_links" on public.channel_links
  for all using (current_setting('request.jwt.claim.role', true) = 'service_role');

-- Members can read their own codes (for UI display)
create policy "Members can read own link codes" on public.channel_link_codes
  for select using (auth.uid() = member_id);

-- Members can read their own links (for UI display)
create policy "Members can read own channel links" on public.channel_links
  for select using (auth.uid() = member_id);
