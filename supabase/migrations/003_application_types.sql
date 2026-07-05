-- Add application_type and new fields to unblck_applications

alter table public.unblck_applications
add column if not exists application_type text not null default 'accelerator',
add column if not exists team_size text,
add column if not exists funding_status text;

-- Add index for application_type
create index if not exists unblck_applications_application_type_idx
on public.unblck_applications (application_type);

-- Make some fields nullable for hub_access applications
alter table public.unblck_applications
alter column build_description drop not null,
alter column stage drop not null,
alter column motivation drop not null;
