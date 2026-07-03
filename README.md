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
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only) |

## Supabase tables

- `referral_codes` — per-event codes issued at StellarBarrio (cohort expiry)
- `unblck_applications` — UNBLCK membership applications
- `insta_awards_applications` — Insta Awards grant applications

## Git remote

```bash
git remote -v
# origin  https://github.com/blessedux/unblck_landing.git
```
