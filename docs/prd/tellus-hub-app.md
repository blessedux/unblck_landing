# Tellus Hub App — Mobile Experience

**Status:** Planning  
**Created:** 2026-07-05  
**Owner:** UNBLCK Team

---

## Overview

A mobile-optimized experience within the UNBLCK platform that enables approved members to:
1. Book specific rooms at Tellus Builder Hub
2. View community events via Luma calendar
3. Explore a curated Santiago tour with crypto rewards

This is not a separate app—it's a new section within the existing UNBLCK web application, designed mobile-first with swipeable navigation inspired by the urbe_booking reference codebase.

---

## Problem Statement

Currently, UNBLCK members can:
- Apply for membership (hub access or accelerator)
- Book general hub access days (3/week for Builders, unlimited for Founders)
- See basic member dashboard

**Missing:**
- No way to book specific rooms (meeting rooms, podcast studio, etc.)
- No visibility into community events
- No engaging way to explore Santiago and partner businesses

**Result:** Members can access the hub but lack tools to maximize their time there. The hub experience feels transactional rather than community-driven.

---

## Goals

### Primary Goals
1. **Enable room bookings** — Members can reserve meeting rooms, podcast studio, phone booths
2. **Surface events** — Make it easy to discover StellarBarrio and other Tellus Hub events
3. **Drive exploration** — Encourage members to visit partner businesses and cultural spots in Santiago

### Secondary Goals
4. **Mobile-first experience** — Optimized for on-the-go usage (swipeable, PWA-installable)
5. **Partner integration** — Drive traffic to partner businesses through tour rewards
6. **Community engagement** — Increase time spent at hub and in Santiago ecosystem

### Non-Goals
- Not replacing the existing member dashboard (this is complementary)
- Not building event management tools (Luma handles this)
- Not building a separate native mobile app (web-based PWA only)
- Not handling tour reward distribution (Sozu Wallet does this)

---

## User Personas

### Builder (Previously "Ambassador")
**Profile:** Active builder, uses hub 2-3 days per week

**Needs:**
- Quick walk-up room booking when at the hub
- See what events are happening this week
- Discover new places to work/hang out nearby

**Constraints:**
- 3 hub check-ins per week
- One room booking per day (30 or 60 minutes)
- Walk-up booking only

### Founder (Previously "Stellar-funded")
**Profile:** Full-time startup founder, uses hub daily

**Needs:**
- Pre-book meeting rooms for client calls and team syncs
- Plan week around hub events
- Same tour access as Builders

**Privileges:**
- Unlimited hub check-ins
- Can pre-book rooms in advance
- Multiple room bookings per day

---

## Features

### 1. Room Booking

#### Available Rooms
1. **Small Meeting Room** — 2-4 people
2. **Large Meeting Room** — 8-10 people
3. **Phone Booth** — 1-on-1 calls
4. **Podcast Studio** — Audio/video recording
5. **Event Space** — After-hours community use

#### Booking Rules
**Builders:**
- Must be checked into the hub (used a daily credit)
- Walk-up booking only (same day)
- One booking per day: 30min OR 60min slot

**Founders:**
- Can pre-book in advance
- Unlimited bookings: multiple 30min or 60min slots

#### User Flow
1. Member navigates to "Rooms" section (swipe or nav)
2. Sees list of available rooms with photos and descriptions
3. Taps room to see calendar view (day/week)
4. Selects available slot (30min or 60min)
5. Confirms booking
6. Receives confirmation + option to add to calendar

#### Technical Notes
- Calendar view shows availability in real-time
- Founders see "Book" button, Builders see "Available now" (walk-up only)
- Past bookings are not editable/cancelable (simplicity)
- Admin can mark rooms unavailable for maintenance

---

### 2. Events Calendar

#### Integration
- Embed Luma calendar for Tellus Hub events
- No RSVP functionality (handled by Luma)
- Simple link-out to event details

#### Content
- **StellarBarrio** monthly events
- Workshop sessions
- Office hours with mentors
- Demo days
- Community socials

#### User Flow
1. Member navigates to "Events" section
2. Sees upcoming events in list/card format
3. Taps event to see details
4. "View on Luma" button opens external page for RSVP

#### Technical Notes
- Static Luma calendar URL embed (no API integration)
- Could use iframe or custom parser depending on Luma's embed options
- Events visible to all approved members (no tier restrictions)

---

### 3. Santiago Tour

#### Overview
5 curated locations around Santiago—partner businesses and cultural spots. Members visit in any order, scan QR codes with GPS verification, and claim rewards via Sozu Wallet.

#### Locations (Examples)
1. **Partner Cafe** near hub — NFT + 10% discount for USDC payment
2. **Tech/Art Gallery** — NFT badge only
3. **Co-working partner** — NFT + $5 USDC from faucet
4. **Cultural landmark** — NFT badge only
5. **Partner Restaurant** — NFT + 15% discount for USDC payment

#### Reward Types
- **Partner Business**: NFT + discount for paying with Sozu/USDC on-site
- **Cultural Location**: NFT badge (collectible only)
- **Prize Location**: NFT + claimable USDC from limited faucet pool

#### User Flow
1. Member navigates to "Tour" section
2. Sees interactive map with 5 location pins
3. Taps pin to see location details:
   - Name and description
   - Personal story/connection
   - Reward type
   - Distance from current location
4. Navigates to location (Google Maps integration)
5. On arrival, taps "Claim Reward"
6. GPS verifies location (within 50m)
7. QR scanner opens
8. Scans QR code at location
9. Deep link opens Sozu Wallet with pre-filled reward claim
10. Member completes claim in Sozu

#### Rules
- One-time claim per location per member
- GPS + QR verification required
- USDC faucet locations have limited pools (first-come-first-served)
- Tour progress tracked in member profile

#### Member Stats
Members can see:
- Tour map with collected vs. remaining locations
- Total NFTs collected
- Total USDC earned
- Personal note from curator at each location

---

## User Experience

### Navigation

#### Mobile (Primary)
**Swipeable full-screen sections:**
- Swipe left/right between: Rooms → Events → Tours
- Persistent bottom indicator showing current section
- Header with hamburger menu for quick navigation

**Inspired by:** urbe_booking's `MobileSwipeNavigation` component

#### Desktop (Secondary)
**Navbar-based navigation:**
- Extends existing SiteNavbar from landing page
- Three buttons: "Rooms" | "Events" | "Tours"
- Traditional click navigation (no swipe)

### Visual Design
- **Theme:** UNBLCK's dark theme (black background, white/accent text)
- **Interaction patterns:** Adapted from urbe (swipe gestures, motion blur, card transitions)
- **Typography:** Consistent with landing page
- **Components:** Rounded buttons/cards (matching existing CTAs)

### PWA Features
- **Installable:** Web manifest for "Add to Home Screen"
- **Icons:** Proper app icons for all platforms
- **No offline support:** Requires real-time data (v1 simplification)
- **No push notifications:** Keep scope focused (v1 simplification)

---

## Technical Architecture

### Routes
```
/member/hub              → Hub home (swipeable sections on mobile)
/member/hub/rooms        → Room booking interface
/member/hub/events       → Events calendar
/member/hub/tour         → Santiago tour map
/member/hub/rooms/[id]   → Specific room booking page
/member/hub/tour/[id]    → Specific tour location details
```

### Database Schema

#### New Tables

**`hub_rooms`**
```sql
id uuid primary key
name text not null
description text
capacity integer
booking_duration_options integer[] -- [30, 60]
image_url text
available boolean default true
created_at timestamptz
```

**`room_bookings`**
```sql
id uuid primary key
room_id uuid references hub_rooms(id)
member_id uuid references member_profiles(auth_user_id)
booking_date date not null
start_time time not null
duration_minutes integer not null -- 30 or 60
created_at timestamptz
unique(room_id, booking_date, start_time)
```

**`tour_locations`**
```sql
id uuid primary key
name text not null
description text not null
personal_story text -- curator's connection to the place
latitude decimal not null
longitude decimal not null
reward_type text not null -- 'partner_discount', 'nft_only', 'usdc_prize'
nft_code text -- identifier for Sozu NFT
usdc_amount decimal
discount_percentage integer
partner_business boolean default false
sozu_deep_link_template text -- parameterized link
display_order integer
created_at timestamptz
```

**`tour_claims`**
```sql
id uuid primary key
location_id uuid references tour_locations(id)
member_id uuid references member_profiles(auth_user_id)
claimed_at timestamptz not null
gps_latitude decimal
gps_longitude decimal
unique(location_id, member_id) -- one claim per member per location
```

#### Modified Tables

**`member_profiles`** (add fields for stats)
```sql
-- existing fields...
hub_checkins_this_week integer default 0
last_checkin_date date
total_room_bookings integer default 0
tour_locations_visited integer default 0
```

### API Routes

**Room Bookings:**
- `GET /api/hub/rooms` — List all rooms with availability
- `GET /api/hub/rooms/[id]` — Room details + availability calendar
- `POST /api/hub/rooms/[id]/book` — Create booking
- `GET /api/hub/bookings` — Member's bookings

**Tour:**
- `GET /api/hub/tour/locations` — List all tour locations with claim status
- `POST /api/hub/tour/claim` — Verify GPS + create claim record
- `GET /api/hub/tour/progress` — Member's tour stats

**Events:**
- Static Luma embed (no backend routes)

### External Integrations

**Sozu Wallet:**
- Deep link format: `sozu://reward?type={nft|usdc}&code={code}&amount={amount}&passport={username}`
- UNBLCK generates link, Sozu handles distribution
- No direct API integration

**Luma Calendar:**
- Embed via iframe or static link
- No API integration (no access to Luma API)

**Google Maps:**
- For tour navigation ("Get Directions" button)
- Uses standard `google.com/maps` deep links

---

## Admin Interface

### Extend `/admin` Dashboard

**New Tabs:**
1. **Rooms** (tab in existing admin)
   - CRUD for hub_rooms
   - Mark rooms available/unavailable
   - View upcoming bookings (read-only)

2. **Tour Locations** (tab in existing admin)
   - CRUD for tour_locations
   - Set GPS coordinates
   - Configure reward parameters
   - View claim statistics

**No Real-Time Booking Management:**
- Admins don't cancel/modify member bookings
- Config-only interface (room metadata, availability toggles)

**Tour Configuration:**
- Actual reward distribution handled by Sozu
- Admin just sets location metadata and Sozu link parameters

---

## Member Dashboard Integration

### Updated `/member` Page

**Existing sections:**
- Application status
- Booking calendar (general hub access)
- Coffee badge

**New section:**
- **"Hub App" card/button** linking to `/member/hub`
- Shows quick stats:
  - Days checked in this week
  - Upcoming room bookings
  - Tour locations visited

### Navigation Flow
```
/member (existing dashboard)
  ↓
  "Open Hub App" button
  ↓
/member/hub (new swipeable hub interface)
  ↓
  Swipe between Rooms / Events / Tours
```

---

## Success Metrics

### Usage Metrics
1. **Room booking rate** — % of hub check-ins that include a room booking
2. **Tour completion rate** — % of members who visit all 5 locations
3. **Event discovery** — % of members who view events section
4. **PWA installs** — Number of home screen installs

### Business Metrics
5. **Partner traffic** — Visits to partner business tour locations
6. **Member engagement** — Average days per week at hub (before/after)
7. **Reward distribution** — Total USDC/NFTs claimed through tour

### Health Metrics
8. **Booking conflicts** — Room double-bookings (should be 0)
9. **GPS verification failures** — % of failed tour claims due to location
10. **Mobile usage** — % of traffic from mobile devices

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- Database schema + migrations
- Mobile navigation component (adapt urbe swipe pattern)
- PWA manifest + icons
- Basic routing structure

### Phase 2: Room Booking (Week 3-4)
- Room CRUD in admin
- Room listing UI
- Calendar/availability logic
- Booking creation + validation
- Walk-up vs. pre-book tier logic

### Phase 3: Tour (Week 4-5)
- Tour location CRUD in admin
- Interactive map UI (Mapbox or Google Maps)
- GPS verification logic
- QR scanner integration
- Sozu deep link generation
- Member progress tracking

### Phase 4: Events (Week 5)
- Luma calendar embed
- Event card UI
- Link-out to Luma

### Phase 5: Polish & Launch (Week 6)
- Member stats dashboard
- Admin analytics
- Testing (mobile devices, GPS accuracy)
- PWA testing
- Documentation

---

## Open Questions

1. **Mapbox vs. Google Maps** — Which mapping provider for the tour? (Mapbox is in urbe reference)
2. **QR code generation** — Who creates/places the physical QR codes at locations?
3. **USDC faucet caps** — How to handle when a prize location runs out of funds?
4. **Room photos** — Do we have photos of each room for the UI?
5. **Tour curator voice** — How much personal story at each location? (Few sentences vs. longer narratives)

---

## Dependencies

**External:**
- Sozu Wallet (reward distribution)
- Luma (event calendar)
- Google Maps or Mapbox (tour navigation)

**Internal:**
- Existing member system (approval, tiers, auth)
- Existing booking credit system (for hub check-ins)
- Supabase (database + RLS)

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| **GPS spoofing** (fake tour claims) | Accept some gaming for v1; add IP/device fingerprinting later if needed |
| **Room booking conflicts** | Unique constraint on (room, date, time); test thoroughly |
| **Sozu integration changes** | Use parameterized deep links; easy to update if format changes |
| **Mobile browser compatibility** | Test on iOS Safari, Android Chrome; graceful degradation |
| **Partner location closures** | Admin can mark locations unavailable; tour continues with remaining spots |

---

## Future Enhancements (Post-v1)

- **Push notifications:** Booking reminders, event alerts
- **Offline support:** Cache room availability for spotty connections
- **Tour gamification:** Leaderboards, completion badges
- **Advanced booking:** Recurring bookings for Founders
- **Event RSVPs:** Direct integration if Luma API becomes available
- **More tour themes:** Multiple tour collections (food, tech history, nightlife)
- **Room amenities:** Filter by AV equipment, whiteboard, etc.

---

*Last updated: 2026-07-05*
