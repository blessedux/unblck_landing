-- Allow the same email to apply to both hub_access and accelerator.
-- One row per (email, application_type); auth_user_id may be shared across types.

alter table public.unblck_applications
  drop constraint if exists unblck_applications_auth_user_id_key;

create unique index if not exists unblck_applications_email_type_uidx
  on public.unblck_applications (email, application_type);

create index if not exists unblck_applications_auth_user_id_idx
  on public.unblck_applications (auth_user_id);
