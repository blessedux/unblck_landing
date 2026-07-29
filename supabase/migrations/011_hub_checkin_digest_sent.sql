-- Marker table so Hub Check-in digest cron retries do not double-email Ops
-- (one row per America/Santiago hub calendar date).

create table if not exists public.hub_checkin_digest_sent (
  hub_date date primary key,
  sent_at timestamptz not null default now()
);

alter table public.hub_checkin_digest_sent enable row level security;

create policy "Service role can manage hub_checkin_digest_sent"
  on public.hub_checkin_digest_sent
  for all
  using (current_setting('request.jwt.claim.role', true) = 'service_role');
