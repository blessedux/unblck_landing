# UNBLCK Landing

Simple landing page for UNBLCK — a private founder hub in Santiago, Chile.

## Stack

- Next.js 15 (App Router)
- Tailwind CSS 4
- Supabase (application storage)
- Typeform-style multi-step forms

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/apply` | Join UNBLCK (open application) |
| `/insta-awards/apply` | Insta Awards grant (referral code required) |

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy env file and add your Supabase credentials:

```bash
cp .env.example .env.local
```

3. Run the SQL migration in Supabase:

- Open `supabase/migrations/001_applications.sql`
- Paste and run it in the Supabase SQL editor
- Seed referral codes for each StellarBarrio event (see commented example in the migration)

4. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Production origin (e.g. `https://unblck-landing.vercel.app`) — used for auth magic link redirects |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only) |
| `RESEND_API_KEY` | Resend API key for magic link emails |
| `RESEND_FROM` | Sender address (must match a verified Resend domain) |
| `ADMIN_EMAILS` | Comma-separated admin allowlist (password login at `/login`) |
| `ADMIN_PASSWORD` | Shared password for all `ADMIN_EMAILS` accounts |

## Admin setup (production)

1. Set `ADMIN_EMAILS` and `ADMIN_PASSWORD` in your hosting env (e.g. Vercel).
2. Point `.env.local` at prod Supabase and run once (or again after password/email changes):

```bash
npm run seed:admin
```

This syncs every email in `ADMIN_EMAILS` into Supabase with the password from `ADMIN_PASSWORD`. Admins then log in at `/login` with email + password — no magic link.

## Magic link email (Resend)

Magic links are generated via Supabase Auth but **sent through Resend** (not Supabase email), avoiding Supabase rate limits.

1. Verify `unblck-landing.vercel.app` (or your domain) in [Resend](https://resend.com/domains).
2. Set `RESEND_API_KEY`, `RESEND_FROM`, and `NEXT_PUBLIC_SITE_URL` in Vercel.
3. In Supabase → Authentication → Email, disable automatic emails or configure a no-op send hook so Supabase doesn't double-send.

Default sender: `UNBLCK <onboarding@unblck-landing.vercel.app>`

## Booking timezone

Hub booking "today" is calculated with `America/Santiago` via `src/lib/dates.ts`, so production servers running in UTC still use Santiago/GMT-4 dates for availability and booking gates.

## Supabase tables

- `referral_codes` — per-event codes issued at StellarBarrio (cohort expiry)
- `unblck_applications` — UNBLCK membership applications
- `insta_awards_applications` — Insta Awards grant applications

## Git remote

```bash
git remote -v
# origin  https://github.com/blessedux/unblck_landing.git
```
