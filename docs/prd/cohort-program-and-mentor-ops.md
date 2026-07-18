# UNBLCK Cohort Program, Insta Awards Pipeline & Mentor Ops CRM

> Published to Exponential — UNBLCK workspace → **UNBLCK Web App** product.
> Status: DEFINED. Domain language locked in `CONTEXT.md` (2026-07-16 grill-with-docs).

## Problem Statement

UNBLCK already captures Hub Access and Accelerator applications, and runs Tellus Hub membership. What is missing is an explicit **program operating system**: how builders enter a **UNBLCK Cohort**, what the six weeks teach, how Demo Days work, how selected teams enter the **Insta Awards sprint**, and how Ops books experienced founders as mentors.

Without that, admissions, curriculum, grant gating, and mentor supply live in ad-hoc chat — so the team cannot run four Cohorts in six months, prepare builders for grants, or grow beyond a single fund with a clear Builder Pipeline.

## Solution

Define and operate UNBLCK as a **founder school delivered through Cohorts**, with Insta Awards as a complementary downstream grant track, and Exponential as the **Mentor Ops CRM** for mentor supply.

Builders enter a Cohort via **Standard** (Accelerator application) or **Fast-track** (manual Ops after a hackathon win). Hub Access alone does not enroll someone in a Cohort. Over ~six months, run **four Cohorts** with space between them. Each Cohort is **six weeks** (curriculum, co-hacking, events, mentor calls) with Demo Days at **week 3** and **week 6**. Week 6 selection feeds a **~4-week Insta Awards sprint** with weekly internal demos and a final public Hub + streamed Demo Day (~10 weeks end-to-end).

Insta Awards applications stay **event-gated**: attend StellarBarrio (or similar), get an **invite/code** from an **Event Ambassador**, then submit. This is not a referral chain. Cohort selection raises the odds of being funded but does not replace the event invite. A multi-institution **Selection Committee** (UNBLCK Ops, Tellus Cooperative, Stellar-side reviewer) decides; external mentors advise only.

## Implementation Decisions

### Modules

1. **Cohort Program Ops** — calendar for four Cohorts in ~six months; six weekly themes; week-3 and week-6 Demo Days; Fast-track admission flag handled by Ops (manual v1).
2. **Mentor Ops CRM (Exponential)** — mentor inventory (expertise, availability); book → confirm → notes workflows; optional link to Cohort / startup. Not a sales CRM.
3. **Insta Awards Gate** — keep form closed without event invite/code; align product language to **event invite/code** (attendance-gated), not referral-chain messaging; Event Ambassador is the trusted event-role that provides the invite.
4. **Insta Awards Sprint Ops** — post–week-6 selection into ~4-week sprint; four weekly demo checkpoints (three internal, one final public/streamed); Selection Committee decision recorded in ops.
5. **Builder Pipeline docs** — single source of truth in CONTEXT + this PRD; light marketing/site copy later so Standard / Fast-track / event invite → Cohort → sprint is clear.

### Program shape (locked)

- **UNBLCK Cohort** is the primary progression unit; hub access is a benefit; Insta Awards is downstream.
- **Curriculum weeks:** (1) Problem, product & Stellar context (2) Design & UX (3) Smart contract development + mid Demo Day (4) Go-to-market (5) Fundraising & grants (6) Closing Demo Day / selection.
- **Fast-track v1:** Ops marks/creates application and approves into the **next** Cohort — no public claim form, no hackathon-platform sync.
- **Selection Committee:** UNBLCK Ops + Tellus Cooperative + Stellar-side reviewer; mentors do not vote.

### App vs ops split (v1)

- Most of Modules 1, 2, 4, 5 are **ops process on Exponential** (+ docs in repo).
- Module 3 may include **small product changes** on the existing Insta Awards apply flow (copy, validation messaging, admin notes) while preserving the existing code gate.
- Existing schema already stores `referral_code` on Insta Awards applications — v1 may keep the column and treat it as the event invite/code in language and UX; a rename migration is optional later.

### Interfaces (behavioral)

- **Cohort admission:** Standard path remains `/accelerator/apply`; Fast-track is Ops-only status/path marking in backoffice or Exponential until a dedicated admin UI exists.
- **Insta Awards gate:** submit requires a valid event invite/code issued for an event window (same validation pattern as today’s referral codes table).
- **Mentor Ops:** Exponential tickets/contacts (or equivalent CRM entities) for Mentors and Booking workflows — no new public booking UI in v1.

## Testing Decisions

### What makes a good test

Test external behavior (API contracts, invite validation outcomes, copy gates), not private helpers or CSS.

### What to test in v1

- **Insta Awards Gate** — invalid / expired / missing invite-code still rejected; valid code still accepts (reuse/extend existing referral-code validation tests if present).
- Skip automated tests for pure Exponential ops workflows and markdown curriculum docs.

### Prior art

- `src/lib/referral-codes.ts` and `/api/referral-codes/validate`
- `/api/insta-awards/apply`

## Out of Scope

- Public mentor marketplace or builder self-serve booking
- Deep calendar sync / invoicing for mentors
- Hackathon-platform auto Fast-track
- Hub Access auto-enrolling into a Cohort
- New grant funds beyond Insta Awards
- Renaming DB columns from `referral_code` (optional follow-up)
- Full in-app Cohort LMS / curriculum delivery platform

## Further Notes

Domain glossary for this work lives in root `CONTEXT.md` (UNBLCK Cohort, Insta Awards Sprint, Event Ambassador, Selection Committee, Mentor Ops CRM, Builder Pipeline, Cohort Admission). Prefer those terms in tickets and UI copy.

Next workflow step after this Feature is defined: **/to-expo** tracer-bullet tickets under this Feature for ops setup + any Insta Awards gate/copy slices.
