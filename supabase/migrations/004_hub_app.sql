-- Hub App: Rooms, Room Bookings, Tour Locations, Tour Claims

-- Create hub_rooms table
create table if not exists public.hub_rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  type text not null check (type in ('small_meeting', 'large_meeting', 'phone_booth', 'podcast_studio', 'event_space')),
  capacity int not null,
  amenities jsonb not null default '[]'::jsonb,
  booking_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists hub_rooms_type_idx on public.hub_rooms (type);

alter table public.hub_rooms enable row level security;

-- Create room_bookings table
create table if not exists public.room_bookings (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.member_profiles(auth_user_id),
  room_id uuid not null references public.hub_rooms(id),
  booking_date date not null,
  start_time time not null,
  duration_minutes int not null check (duration_minutes in (30, 60)),
  created_at timestamptz not null default now(),

  -- Prevent overlapping bookings for the same room
  unique (room_id, booking_date, start_time)
);

create index if not exists room_bookings_member_id_idx on public.room_bookings (member_id);
create index if not exists room_bookings_room_date_idx on public.room_bookings (room_id, booking_date);

alter table public.room_bookings enable row level security;

-- Create tour_locations table
create table if not exists public.tour_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  address text not null,
  latitude decimal(10, 8) not null,
  longitude decimal(11, 8) not null,
  order_index int not null unique,
  location_type text not null check (location_type in ('partner_business', 'cultural', 'prize')),
  reward_type text not null check (reward_type in ('nft', 'usdc', 'nft_and_discount')),
  sozu_claim_url text not null,
  qr_code_data text not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tour_locations_order_idx on public.tour_locations (order_index);

alter table public.tour_locations enable row level security;

-- Create tour_claims table
create table if not exists public.tour_claims (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.member_profiles(auth_user_id),
  location_id uuid not null references public.tour_locations(id),
  claimed_at timestamptz not null default now(),

  -- One claim per location per member
  unique (member_id, location_id)
);

create index if not exists tour_claims_member_id_idx on public.tour_claims (member_id);

alter table public.tour_claims enable row level security;

-- RLS Policies

-- Service role can manage all tables
create policy "Service role can manage hub_rooms" on public.hub_rooms
  for all using (current_setting('request.jwt.claim.role', true) = 'service_role');

create policy "Service role can manage room_bookings" on public.room_bookings
  for all using (current_setting('request.jwt.claim.role', true) = 'service_role');

create policy "Service role can manage tour_locations" on public.tour_locations
  for all using (current_setting('request.jwt.claim.role', true) = 'service_role');

create policy "Service role can manage tour_claims" on public.tour_claims
  for all using (current_setting('request.jwt.claim.role', true) = 'service_role');

-- Authenticated users can read enabled rooms
create policy "Users can read enabled hub rooms" on public.hub_rooms
  for select using (booking_enabled = true);

-- Users can read their own room bookings
create policy "Users can read their own room bookings" on public.room_bookings
  for select using (member_id = auth.uid());

-- Users can read enabled tour locations
create policy "Users can read enabled tour locations" on public.tour_locations
  for select using (enabled = true);

-- Users can read their own tour claims
create policy "Users can read their own tour claims" on public.tour_claims
  for select using (member_id = auth.uid());

-- Seed initial rooms
insert into public.hub_rooms (name, type, capacity, amenities) values
  ('Small Meeting Room', 'small_meeting', 4, '["Whiteboard", "Screen"]'::jsonb),
  ('Large Meeting Room', 'large_meeting', 10, '["Whiteboard", "Screen", "Video Conferencing"]'::jsonb),
  ('Phone Booth', 'phone_booth', 1, '["Quiet", "Standing Desk"]'::jsonb),
  ('Podcast Studio', 'podcast_studio', 3, '["Microphones", "Soundproofing", "Recording Equipment"]'::jsonb),
  ('Event Space', 'event_space', 50, '["Projector", "Sound System", "Catering Area"]'::jsonb)
on conflict (name) do nothing;
