create table if not exists public.event_scheduling_requests (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.member_profiles(auth_user_id),
  room_id uuid not null references public.hub_rooms(id),
  event_description text not null,
  project_name text not null,
  requested_date date not null,
  requested_time time not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists event_scheduling_requests_member_id_idx
  on public.event_scheduling_requests (member_id);

create index if not exists event_scheduling_requests_room_id_idx
  on public.event_scheduling_requests (room_id);

create index if not exists event_scheduling_requests_status_idx
  on public.event_scheduling_requests (status);

alter table public.event_scheduling_requests enable row level security;

create policy "Service role can manage event_scheduling_requests"
  on public.event_scheduling_requests
  for all
  using (current_setting('request.jwt.claim.role', true) = 'service_role');

create policy "Users can read their own event scheduling requests"
  on public.event_scheduling_requests
  for select
  using (member_id = auth.uid());

create policy "Users can create their own event scheduling requests"
  on public.event_scheduling_requests
  for insert
  with check (member_id = auth.uid());
