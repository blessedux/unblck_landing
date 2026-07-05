-- Room booking approval status (event space requires admin confirmation)
--
-- If you hit "deadlock detected":
--   1. Stop `npm run dev` and close other Supabase SQL tabs
--   2. Run each block below ONE AT A TIME (wait for success before the next)
--   3. Retry after ~30s if needed

-- ── Block 1: add column ─────────────────────────────────────────────
alter table public.room_bookings
  add column if not exists status text default 'confirmed';

-- ── Block 2: backfill + enforce (skip if Block 1 already had NOT NULL) ─
update public.room_bookings
  set status = 'confirmed'
  where status is null;

alter table public.room_bookings
  alter column status set default 'confirmed';

alter table public.room_bookings
  alter column status set not null;

-- ── Block 3: check constraint ─────────────────────────────────────────
alter table public.room_bookings
  drop constraint if exists room_bookings_status_check;

alter table public.room_bookings
  add constraint room_bookings_status_check
  check (status in ('confirmed', 'pending_admin'));

-- ── Block 4: RLS policy (run last) ────────────────────────────────────
drop policy if exists "Users can read all room bookings for availability"
  on public.room_bookings;

create policy "Users can read all room bookings for availability"
  on public.room_bookings
  for select
  using (auth.uid() is not null);
