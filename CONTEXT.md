# UNBLCK Context

**Domain:** Tellus Builder Hub & UNBLCK Accelerator

This document captures the shared language and core concepts used across the UNBLCK platform, including the Tellus Builder Hub physical space, the UNBLCK accelerator program, and associated member experiences.

---

## Core Concepts

### Tellus Builder Hub
The physical coworking space and community venue in Santiago de Chile, operated by Mente Maestra SpA on behalf of Tellus Cooperative Foundation. Not to be confused with UNBLCK (the accelerator program).

**Physical location:** Tellus Blockchain Hub STGO, Santiago, Chile

### UNBLCK Accelerator
The structured accelerator program for AI and blockchain startups. Provides mentorship, funding opportunities, and go-to-market support. Distinct from the physical hub space. Delivered through time-boxed **UNBLCK Cohorts**.

### UNBLCK Cohort
The primary progression unit of the accelerator: a time-boxed founder-school group. The cohort’s core value is the peer network, contacts, and shared curriculum — not only 1:1 services.

**Duration (v1):** **6 weeks** of cohort activities (curriculum, co-hacking sessions, events, mentor calls).

**Cadence (next ~6 months):** **4 Cohorts** (not back-to-back packing) — intentional space between cohorts.

**Cohort Demo Days (2 per Cohort):**
- **Week 3** — mid-point demo (progress checkpoint)
- **Week 6** — closing Demo Day; selection of teams that advance into the **Insta Awards sprint**

**Curriculum themes (v1, one per week):**
1. **Problem, product & Stellar context** — problem clarity, MVP, rapid iteration, building in/for Stellar
2. **Design & UX** — usable product, simple branding
3. **Smart contract development** — technical depth for MVP readiness (+ mid Demo Day)
4. **Go-to-market** — distribution, early users, narrative
5. **Fundraising & grants** — seed sizing, instruments basics, grant readiness (incl. Insta Awards prep)
6. **Closing Demo Day** — pitch, metrics, selection into Insta Awards sprint

Co-hacking and mentor calls run alongside the six weeks.

**Hub access** is a *benefit* of membership, not the progression unit.  
**Insta Awards** is a *downstream grant track* for builders who’ve earned trust via events + cohort — not an open parallel application funnel.

_Avoid_: treating hub membership or Insta Awards as the primary program unit

### Insta Awards Sprint
A **~4-week (~30-day)** focused grant sprint that begins after the Cohort’s week-6 Demo Day for selected teams. Together with the 6-week Cohort, the full Cohort → Insta Awards path is about **10 weeks**.

**Sprint Demo Days (4 weekly checkpoints):**
- After weeks 1, 2, and 3 — lighter, **internal** progress demos
- After week 4 — **Final Demo Day**: largest event; live audience at Tellus Hub + streamed

_Avoid_: conflating the sprint with the Cohort itself; they are sequential and complementary. _Avoid_: treating all four sprint demos as public events — only the final is the big public/streamed day.

### Selection Committee
The multi-institution body that decides Insta Awards selection (into the sprint / funding path).

**Includes:** UNBLCK Ops, Tellus Cooperative committee members, and a **Stellar-side reviewer** (often trusts UNBLCK/Tellus submissions in practice).  
**Excludes:** External mentors/advisors as decision-makers (they may advise; they do not vote).

_Avoid_: framing selection as a public vote or mentor panel decision

### Member
An approved user who has completed the application process and has access to Tellus Builder Hub and/or UNBLCK programs. Members have a Stellar Passport username for identity verification.

---

## Member Tiers

### Builder
Previously called "Ambassador". Members with limited hub access.

**Access:**
- 3 hub check-in credits per week (Monday-Sunday)
- Walk-up room booking only (on days they're checked in)
- One room booking per day: 30-minute OR 60-minute slot
- Full access to events and tours

**Intent:** For active builders who use the hub regularly but don't need daily access.

### Founder
Previously called "Stellar-funded". Members with unlimited hub access.

**Access:**
- Unlimited hub check-ins
- Can pre-book rooms in advance
- Multiple room bookings: unlimited 30-minute or 60-minute slots
- Full access to events and tours

**Intent:** For funded startups and core community members who need consistent workspace.

---

## Hub Spaces

### Hub Check-in
The act of using one credit to access the physical hub for a full day. Once checked in, members can use coworking space and book specific rooms during their day.

**Not to be confused with:** Room booking (which happens *after* checking in)

### Coworking Space
Open workspace available to all checked-in members. No booking required.

### Bookable Rooms
Specific spaces that require advance booking (for Founders) or walk-up booking (for Builders):

1. **Small Meeting Room** — 2-4 people, for team syncs and focused collaboration
2. **Large Meeting Room** — 8-10 people, for workshops and larger meetings
3. **Phone Booth** — 1-on-1 calls, private conversations
4. **Podcast Studio** — Recording studio for content creation
5. **Event Space** — After-hours venue for community events

**Booking slots:** 30 minutes or 60 minutes only

---

## Events

### StellarBarrio
Monthly builder event at Tellus Hub. Gateway to exclusive opportunities like Insta Awards. Open to community.

### Luma Calendar
Third-party event platform where UNBLCK/Tellus Hub events are listed. Events are embedded in the hub app but managed externally.

**Access:** View-only embed in hub app. RSVPs handled through Luma.

---

## Santiago Tour

### Unguided Tour
A self-guided exploration experience with 5 curated locations around Santiago. Members visit partner businesses and cultural spots to collect rewards.

**Navigation:** Open exploration - visit locations in any order

**Verification:** GPS + QR code scan (must be within 50m of location)

### Tour Locations
Five specific stops, each with distinct rewards:

1. **Partner Business Locations** — NFT badge + special discount for paying with USDC via Sozu Wallet on-site
2. **Cultural Locations** — NFT badge only (pure collection)
3. **Prize Locations** — NFT badge + claimable USDC from limited faucet pool

**Rules:**
- One-time claim per location per member
- USDC faucet locations have limited pools (first-come-first-served)

### Sozu Wallet
External Stellar wallet application used for reward distribution. UNBLCK generates deep links that pre-fill reward claims.

**Integration:** Deep link only - no direct API integration

---

## Applications & Access

### Hub Access Application
Simplified application for members who only want physical workspace access at Tellus Hub. Asks for basic information and Stellar Passport username.

**Route:** `/apply`
**Application Type:** `hub_access`

### Accelerator Application
Comprehensive application for founders applying to the full UNBLCK accelerator program. Includes detailed project information, team size, funding status, and motivation. This is the **Standard** path into a **UNBLCK Cohort**.

**Route:** `/accelerator/apply`
**Application Type:** `accelerator`

### Cohort Admission
Two paths into the same Cohort membership:

1. **Standard** — Accelerator application → admin review → approved into next Cohort
2. **Fast-track** — Verified hackathon win (or equivalent event signal) → Ops marks/creates application as Fast-track and approves into the **next** Cohort (same membership record shape)

**Hub Access alone does not enroll someone in a Cohort** — they must also take Standard or Fast-track.

**v1 Fast-track:** Manual Ops process only — no public “I won a hackathon” claim flow and no hackathon-platform auto-integration yet.

### Application Status
- **Pending** — Under review by admin
- **Approved** — Member can access hub/programs (and Cohort, if admission path completed)
- **Rejected** — Application denied

---

## Technical Terms

### Stellar Passport
Identity system built on Stellar blockchain. Members provide their Passport username (not wallet address) for verification.

**Format:** `@username` or GitHub username

### Hub Credits
Virtual credits that Builders use to check into the hub. Resets weekly on Monday.

**Not for:** Individual room bookings or other resources
**For:** Physical presence at the hub (one credit = one day)

### Member Profile
Database record linking approved applications to auth users. Tracks member tier, passport verification status, and access rights.

---

## Related Systems

### Event Ambassador
A trusted person at **StellarBarrio** (or similar community events) who can provide the **event invite / code** that unlocks the Insta Awards application form. Not a membership tier.

_Avoid_: calling Hub **Builder** tier “Ambassador”; those are different concepts

### Insta Awards
$5,000 non-dilutive grant program for Stellar builders. Complementary to the UNBLCK Cohort: prepares builders to use grant capital well; does not replace the cohort.

**Eligibility model (event-gated invite, not open, not a referral chain):**
- Attending the event unlocks an **invite link / code** to submit the Insta Awards form — incentive to show up; no cold applications from people with no event relationship
- There is **no referral program** (people don’t earn by distributing links); the gate is **attendance → invite/code → submit**
- Applying independently to the **Accelerator / Cohort** and getting selected makes grant funding **much more probable**, but submitters **still need the event invite/code** to open the grant form
- Winning Insta Awards does **not** auto-enroll into a Cohort (Fast-track is the opposite direction: hackathon → Cohort)

**Distinction:** Funding opportunity and grant track, not a membership tier and not the primary progression unit

### Builder Pipeline
The intended path: community/events (and sometimes hackathon wins) → **UNBLCK Cohort** membership → readiness for grants → **Insta Awards** (and later other funds). Goal: no direct Insta Awards submissions from projects with no relationship to the network.

### Mentor Ops CRM
Exponential used as an **ops CRM for mentor supply** — not a full sales/marketing CRM.

**In scope (v1):** Mentor inventory (expertise, availability), book/confirm call workflows, outcome notes, optional link to Cohort / startup.  
**Out of scope (v1):** Invoicing, deep calendar sync, public mentor marketplace, builder self-serve booking marketplace.

_Avoid_: Notion as the system of record for mentor ops if Exponential already holds the tickets; keep one ops home

### Coffee Token
Reward earned through tour completion or hub participation. Redeemable via Sozu Wallet at partner locations.

**Distribution:** Managed through Sozu faucet system

---

## Anti-Patterns

### ❌ "UNBLCK Hub"
UNBLCK is the accelerator program. The physical space is "Tellus Builder Hub" or "Tellus Hub".

### ❌ "Booking credits for rooms"
Credits are for hub check-in (daily access), not individual room bookings.

### ❌ "Wallet address"
We collect Stellar Passport usernames, not wallet addresses.

### ❌ "Ambassador" / "Stellar-funded"
Use "Builder" and "Founder" respectively for membership tiers. Use **Event Ambassador** only for the trusted event-role that hands out Insta Awards invite/codes — never as a tier name.

---

*Last updated: 2026-07-16*
