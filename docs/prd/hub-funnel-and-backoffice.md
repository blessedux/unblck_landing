# UNBLCK Hub Funnel, Member Access & Backoffice

> Published to Exponential — Personal workspace → **UNBLCK** product.
> Status: DEFINED. Triage: `ready-for-agent`.

## Problem Statement

UNBLCK is an accelerator for AI and blockchain founders in Santiago. Today the site can capture a hub application and an Insta Awards grant application into Supabase, but that is where the funnel ends. There is no way for an applicant to become an account holder, no terms-and-conditions record, no lightweight KYC, and no way for the team to review, approve, or reject applications. There is also no member experience: approved founders cannot book their days at the hub, cannot see when they are entitled to a free coffee, and have no home to return to for content and meetings later.

The immediate pain is operational: applications arrive with no status, no identity anchor (Stellar Passport), and no signed terms, and the team has no backoffice to act on them. Without this, UNBLCK cannot actually onboard members or run the physical space.

## Solution

Turn the hub application into the front door of a real membership funnel, and give the team a backoffice to run it.

A prospective member completes the hub application (Typeform-style flow). Near the end they provide their **Stellar Passport** account address (with a link to create one) and accept the **Terms & Conditions** (opened in a new tab, with the accepted version and timestamp recorded). On submit, a Supabase Auth user is created via **magic link**, and an application row is stored with status `pending`. The applicant can request a magic link to sign in, but until the team approves them they only see an "under review" screen.

The team works applications from a **backoffice** gated to allowlisted admin emails (magic-link login). Admins list applications, open a full submission, add internal notes, and approve or reject. During review they can toggle **Passport verified** and **Stellar funded** — the two lightweight KYC/tier signals. Approving unlocks the member's hub home; rejecting shows the applicant a clear message.

Approved members land on a **member home** that welcomes them, links to program information, and shows placeholders for Content and Meetings (coming soon). The home's working feature is **booking**: ambassadors (the default tier) get **3 renewable booking credits per week** (reset Monday, 24h advance, no same-day) and pick their days on a simple calendar. On a booked day the home shows a **"Coffee available today"** badge; redeeming sends the member to create/login in **Sozu Wallet** to use the hub coffee faucet (UNBLCK stores no wallet address). Members flagged **Stellar funded** get **unlimited access and unlimited coffee** and skip the credit system. The bookable days come from a hub schedule that admins configure per week.

## Implementation Decisions

**Modules (deep, testable where noted):**

- **Application intake** — extends the existing hub application flow and API to capture `passport_address`, `terms_version`, `terms_accepted_at`, and to create the Auth user + `pending` application atomically on submit. Reuses the existing generic multi-step form component; adds a checkbox step type and a Passport-address validated text step.
- **Passport address validator** (deep module) — pure function that validates a Stellar public key / Passport address by format (Stellar `G…` Ed25519 public key rules). No network calls in v1. Simple interface: `validatePassportAddress(input): { valid: boolean; reason?: string }`.
- **Booking credits engine** (deep module) — pure logic for the weekly credit model: given a member, their tier, existing bookings, and the current date, decide whether a given day can be booked. Encapsulates: 3 credits/week for ambassadors, Monday reset (calendar week), 24h advance minimum, no same-day, no double-booking a day, and unlimited for Stellar-funded members. Interface roughly: `canBook(context): { allowed: boolean; reason?: string; creditsRemaining: number }` and `creditsForWeek(context): number`.
- **Hub schedule** — admin-configured open days/hours per week; the booking calendar renders only open days. Read by the booking engine and the member calendar.
- **Application review** — backoffice queries and mutations: list/get applications, set status, set `passport_verified`, set `stellar_funded`, append notes. Guarded by admin-email allowlist.
- **Auth & guards** — magic-link auth (Supabase Auth) for both members and admins; route guards for `pending` vs `approved` members and for the admin allowlist.

**Auth & identity:**

- Login is **magic link only** for both members and admins (no passwords).
- Account is created on hub-form submit; the member is locked (`pending`) until approved.
- Admin access is via an **allowlist of admin emails** (env-configured), checked after magic-link login.

**Funnel order:** existing questions first (name, email, project, build, location, stage, motivation), then **Passport address**, then **T&C checkbox**, then submit (which sends the magic link / creates the account).

**Tiers & KYC-lite:**

- Two tiers: **ambassador** (default) and **stellar_funded** (unlimited).
- `passport_verified` and `stellar_funded` are **manual backoffice toggles** in v1 (no Passport/on-chain API). Passport address is collected on the form with a create link.

**Booking model (from the grill session):** 3 credits/week, reset Monday (calendar week Mon–Sun), max 3 bookings/week, **24h advance required**, no same-day. Stellar-funded members bypass credits entirely.

**Coffee:** booking is authoritative; on a booked day the member home shows a coffee-eligibility badge. Redemption is handled by **Sozu Wallet** — the app links out to Sozu create/login for the hub coffee faucet and does **not** store a Sozu/wallet address in UNBLCK.

**Schedule config:** open days/hours are **configurable in the backoffice** per week rather than hardcoded, so events/holidays/StellarBarrio can adjust availability.

**Schema changes (Supabase):**

- `unblck_applications` gains: `status` (`pending` | `approved` | `rejected`), `passport_address`, `terms_version`, `terms_accepted_at`, `passport_verified` (bool), `stellar_funded` (bool), `reviewer_notes`, `auth_user_id`.
- New `member_profiles` (or equivalent) keyed to the Auth user: tier, `stellar_funded`, `passport_verified`, link back to the application.
- New `bookings`: member, date, created_at, week key (for credit accounting).
- New `hub_schedule`: per-week open days/hours configured by admins.
- New `admin_allowlist` is env-configured (not necessarily a table in v1).

**API contracts (behavioral, not paths):**

- Hub submit: accepts full payload incl. Passport address + terms acceptance; creates Auth user (magic link) + `pending` application; rejects on invalid Passport format or unaccepted terms.
- Booking: create/cancel a booking for a date; server re-validates against the booking engine and schedule; returns remaining credits.
- Admin review: list/get/update-status/set-flags/add-note; all guarded by admin allowlist.

## Testing Decisions

Good tests here assert **external behavior** through a module's public interface, not internal state or implementation details. The two deep modules are the priority because they hold branchy rules that are easy to get wrong and cheap to test in isolation:

- **Booking credits engine** — table-driven tests over the interface: ambassador with 0/1/2/3 bookings this week; Monday reset boundary; 24h advance rejection and same-day rejection; double-booking the same day; Stellar-funded unlimited bypass; interaction with an open/closed day from the schedule. No database — pass context in, assert the decision out.
- **Passport address validator** — valid Stellar `G…` keys accepted; malformed/empty/wrong-prefix/wrong-length rejected, each with a reason.

Application-intake and review logic can be covered with lighter behavioral tests around validation (invalid Passport / missing terms rejected; valid submission produces `pending` + account) rather than exhaustively mocking Supabase. Prior art: the existing referral-code validation and application-route validation already follow a "validate input, return errors" shape that these tests can mirror.

The user has not yet confirmed which modules they want tests written for; default recommendation is to test the **booking credits engine** and the **Passport address validator** first.

## Out of Scope

- Content library and private meeting / call scheduling with founders and investors (member home shows placeholders only).
- Automated Stellar Passport verification or on-chain funding lookups (both are manual backoffice toggles in v1).
- Sozu Wallet token/airdrop integration and storing wallet addresses (redirect-only for coffee redemption).
- Insta Awards grant flow — already built as a separate referral-gated funnel; unchanged here.
- Password-based auth, role hierarchies beyond a simple admin allowlist, and email automation for approve/reject (manual for the first cohort; a fast follow).
- Payments / membership billing.

## Further Notes

- Insta Awards remains its own referral-gated funnel; the hub funnel is the general "join UNBLCK" door.
- Email triggers on approve/reject are a likely fast follow once the first cohort is processed manually.
- The `stellar_funded` tier is expected to move from manual toggle to automated Passport/on-chain detection once a reliable API is available; the tier flag and audit trail are designed so that swap is non-breaking.
- Design language stays black-and-white dark mode, consistent with the current landing page and Typeform-style flows.
