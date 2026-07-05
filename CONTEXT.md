# UNBLCK Context

**Domain:** Tellus Builder Hub & UNBLCK Accelerator

This document captures the shared language and core concepts used across the UNBLCK platform, including the Tellus Builder Hub physical space, the UNBLCK accelerator program, and associated member experiences.

---

## Core Concepts

### Tellus Builder Hub
The physical coworking space and community venue in Santiago de Chile, operated by Mente Maestra SpA on behalf of Tellus Cooperative Foundation. Not to be confused with UNBLCK (the accelerator program).

**Physical location:** Tellus Blockchain Hub STGO, Santiago, Chile

### UNBLCK Accelerator
The structured accelerator program for AI and blockchain startups. Provides mentorship, funding opportunities, and go-to-market support. Distinct from the physical hub space.

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
Comprehensive application for founders applying to the full UNBLCK accelerator program. Includes detailed project information, team size, funding status, and motivation.

**Route:** `/accelerator/apply`
**Application Type:** `accelerator`

### Application Status
- **Pending** — Under review by admin
- **Approved** — Member can access hub/programs
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

### Insta Awards
$5,000 non-dilutive grant program for Stellar builders. Requires referral code from StellarBarrio events. Managed separately from hub access.

**Distinction:** Funding opportunity, not a membership tier

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
Use "Builder" and "Founder" respectively.

---

*Last updated: 2026-07-05*
