-- Track Stellar Ambassador status on hub access applications

alter table public.unblck_applications
add column if not exists stellar_ambassador boolean;
