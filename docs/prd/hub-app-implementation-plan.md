# Tellus Hub App — Implementation Plan

**Branch:** `feat/hub_app`  
**Target:** Phased rollout over 6 weeks  
**Created:** 2026-07-05

---

## Phase 1: Foundation (Week 1-2)

### Database & Migrations
- [ ] Create migration `004_hub_app_schema.sql`
  - New tables: `hub_rooms`, `room_bookings`, `tour_locations`, `tour_claims`
  - Extend `member_profiles` with stats fields
  - Add RLS policies for new tables
- [ ] Seed initial room data (5 rooms with descriptions)
- [ ] Seed initial tour locations (5 Santiago spots with GPS coords)

### Core Components
- [ ] Create `/src/components/mobile-swipe-navigation.tsx`
  - Port swipe logic from urbe_booking reference
  - Adapt to UNBLCK dark theme
  - Handle desktop fallback (navbar)
- [ ] Create `/src/components/page-transition.tsx`
  - Animation wrapper for swipe transitions
- [ ] Create `/src/hooks/use-mobile.ts`
  - Detect mobile vs desktop
  - Handle responsive breakpoints

### Routing Structure
- [ ] Create `/src/app/member/hub/page.tsx` (hub home with swipe sections)
- [ ] Create `/src/app/member/hub/layout.tsx` (shared navigation)
- [ ] Set up `/rooms`, `/events`, `/tour` as sections within hub page

### PWA Setup
- [ ] Create `/public/manifest.json`
  - App name, icons, theme colors
  - Display mode: standalone
- [ ] Update `/src/app/layout.tsx` with PWA meta tags
- [ ] Generate PWA icons from UNBLCK logo
- [ ] Test "Add to Home Screen" on iOS/Android

**Deliverable:** Working swipeable hub app shell with empty sections

---

## Phase 2: Room Booking (Week 3-4)

### Admin Interface
- [ ] Extend `/src/app/admin/page.tsx` with "Rooms" tab
- [ ] Create `/src/components/AdminRoomsList.tsx`
  - CRUD operations for rooms
  - Toggle availability
  - Edit room metadata
- [ ] Create `/src/app/api/admin/rooms/route.ts` (GET, POST)
- [ ] Create `/src/app/api/admin/rooms/[id]/route.ts` (PATCH, DELETE)

### Room Listing & Booking
- [ ] Create `/src/components/RoomCard.tsx`
  - Room photo, name, capacity
  - Availability indicator
  - Book/View button based on tier
- [ ] Create `/src/app/member/hub/rooms/page.tsx`
  - Grid of room cards
  - Filter by availability
- [ ] Create `/src/app/member/hub/rooms/[id]/page.tsx`
  - Room details
  - Calendar view (day/week toggle)
  - Available slots displayed
  - Booking form

### Booking Logic
- [ ] Create `/src/lib/room-bookings.ts`
  - `canBookRoom(member, room, date, time)` validation
  - Check tier restrictions (Builder walk-up vs Founder pre-book)
  - Check slot limits (Builder 1/day, Founder unlimited)
  - Check time conflicts
- [ ] Create `/src/lib/room-bookings.test.ts`
  - Test tier logic
  - Test conflict detection
  - Test daily limits
- [ ] Create `/src/app/api/member/room-bookings/route.ts`
  - GET: Member's bookings
  - POST: Create booking
- [ ] Create `/src/app/api/member/room-bookings/availability/route.ts`
  - GET: Available slots for a room on a date

### Calendar Component
- [ ] Create `/src/components/RoomCalendar.tsx`
  - Day/week view toggle
  - Show booked slots (grayed out)
  - Show available slots (clickable)
  - Handle 30min and 60min slot selection
  - Color code by member tier if needed

### Integration
- [ ] Update `/src/app/member/page.tsx`
  - Add "Hub App" card with stats
  - Show upcoming room bookings
- [ ] Update member profile API to track `total_room_bookings`

**Deliverable:** Full room booking system with tier-based restrictions

---

## Phase 3: Santiago Tour (Week 4-5)

### Admin Interface
- [ ] Extend `/src/app/admin/page.tsx` with "Tour" tab
- [ ] Create `/src/components/AdminTourLocationsList.tsx`
  - CRUD for tour locations
  - Set GPS coordinates
  - Configure reward type and parameters
  - View claim statistics
- [ ] Create `/src/app/api/admin/tour/locations/route.ts` (GET, POST)
- [ ] Create `/src/app/api/admin/tour/locations/[id]/route.ts` (PATCH, DELETE)

### Tour Map & Navigation
- [ ] Add Mapbox GL JS dependency (or use Google Maps if preferred)
- [ ] Create `/src/components/TourMap.tsx`
  - Interactive map with 5 location pins
  - Pins color-coded by status (visited/unvisited)
  - Tap pin to see location card
  - Current location indicator
  - Distance calculation from user
- [ ] Create `/src/app/member/hub/tour/page.tsx`
  - Full-screen map
  - Tour progress bar (X of 5 collected)
  - Filter: Show all / Show remaining

### Location Details
- [ ] Create `/src/components/TourLocationCard.tsx`
  - Location name, description
  - Personal curator story
  - Reward type badge (NFT, USDC, Discount)
  - Distance from current location
  - "Get Directions" button (Google Maps deep link)
  - "Claim Reward" button
- [ ] Create `/src/app/member/hub/tour/[id]/page.tsx`
  - Full location details
  - Larger map view
  - Claim flow UI

### Claim Flow
- [ ] Create `/src/components/QRScanner.tsx`
  - Use device camera for QR scanning
  - Parse QR code payload
  - Display scanned code confirmation
- [ ] Create `/src/lib/tour-verification.ts`
  - GPS verification logic (within 50m)
  - QR code validation
  - Generate Sozu deep link with parameters
- [ ] Create `/src/app/api/member/tour/claim/route.ts`
  - Verify GPS coordinates
  - Verify QR code
  - Check one-time claim rule
  - Create claim record
  - Return Sozu deep link
- [ ] Create `/src/app/api/member/tour/progress/route.ts`
  - GET: Member's tour stats
  - Locations visited
  - NFTs collected
  - USDC earned

### Member Stats
- [ ] Update `/src/app/member/page.tsx`
  - Add tour progress widget
  - Show collected badges/NFTs
  - Show total USDC earned
- [ ] Create `/src/components/TourProgressWidget.tsx`
  - Mini map with visited locations
  - Progress bar
  - "Continue Tour" CTA

**Deliverable:** Complete Santiago tour with GPS-verified QR claims and Sozu integration

---

## Phase 4: Events Calendar (Week 5)

### Luma Embed
- [ ] Research Luma embed options (iframe vs custom parser)
- [ ] Create `/src/components/LumaCalendar.tsx`
  - Embed Luma calendar
  - Styled to match UNBLCK dark theme
  - Responsive layout
- [ ] Create `/src/app/member/hub/events/page.tsx`
  - Full-screen calendar view on mobile
  - Grid layout on desktop
  - "View on Luma" CTA for each event

### Event Cards (If custom parser used)
- [ ] Create `/src/components/EventCard.tsx`
  - Event name, date, time
  - Location (Tellus Hub, external, virtual)
  - Brief description
  - RSVP link to Luma
- [ ] Parse Luma calendar feed (if available)
  - Extract event data
  - Cache in-memory or database

**Deliverable:** Events calendar visible to all members with link-out to Luma

---

## Phase 5: Polish & Launch (Week 6)

### Testing
- [ ] Mobile device testing
  - iOS Safari (iPhone 12+, iPhone SE)
  - Android Chrome (Pixel, Samsung)
  - Test swipe gestures, PWA install
- [ ] GPS accuracy testing
  - Test at actual tour locations
  - Test spoofing detection (if time permits)
- [ ] Room booking edge cases
  - Concurrent bookings (conflict handling)
  - Tier restrictions (Builder/Founder rules)
  - Time zone handling
- [ ] Cross-browser testing
  - Chrome, Safari, Firefox (desktop)
  - Responsive breakpoints

### Analytics & Monitoring
- [ ] Add usage tracking (optional, simple)
  - Room booking events
  - Tour claim events
  - Event view events
- [ ] Admin dashboard enhancements
  - Room booking stats (most popular rooms, peak times)
  - Tour completion rate
  - Member engagement metrics

### Documentation
- [ ] Update README with hub app information
- [ ] Create user guide (optional)
  - How to book rooms
  - How to complete the tour
  - How to view events
- [ ] Admin documentation
  - How to add/edit rooms
  - How to configure tour locations
  - How to monitor usage

### Launch Prep
- [ ] Migrate existing "Ambassador" → "Builder" data
- [ ] Migrate existing "Stellar-funded" → "Founder" data
- [ ] Seed production database with rooms and tour locations
- [ ] Deploy QR codes to physical locations
- [ ] Notify members about new features

**Deliverable:** Production-ready hub app launched to all approved members

---

## Technical Debt & Future Work

### Post-Launch Improvements
- Push notifications for booking reminders
- Offline caching for room availability
- Tour leaderboards and gamification
- Recurring room bookings for Founders
- Room amenity filters (AV equipment, whiteboards)
- Multiple tour collections (food, tech, nightlife)
- Event RSVP if Luma API becomes available
- IP/device fingerprinting for tour anti-gaming

### Performance Optimizations
- Image optimization for room photos
- Map tile caching for tour
- Calendar data caching
- Lazy loading for swipe sections

---

## Team & Responsibilities

| Area | Owner | Notes |
|------|-------|-------|
| Database & Backend | [Team] | Schema, API routes, business logic |
| Frontend Components | [Team] | React components, mobile UX |
| PWA Setup | [Team] | Manifest, service worker basics |
| Tour Locations | [Curator] | Select 5 locations, write stories, coordinate QR placement |
| Room Photos | [Team/Curator] | Professional photos of each room |
| Testing | [Team] | Cross-device, GPS accuracy, booking conflicts |
| Launch Comms | [Team/Curator] | Announce to members, onboarding |

---

## Dependencies & Blockers

### External
- **Sozu Wallet integration** — Need final deep link format
- **Luma embed** — Confirm embed method works on mobile
- **Tour location partners** — Coordinate QR code placement

### Internal
- **Member tier migration** — Ambassador → Builder, Stellar-funded → Founder
- **Existing booking system** — Hub check-ins must integrate with room bookings
- **Admin bandwidth** — Room and tour configuration workload

---

## Success Criteria

**Week 1-2:** Mobile navigation works, swipe gestures functional, PWA installable  
**Week 3-4:** Room booking works with tier restrictions  
**Week 4-5:** Tour map visible, claims functional, Sozu integration works  
**Week 5:** Events calendar embedded  
**Week 6:** All features tested and launched to members

**Launch Metrics:**
- 80%+ of Builders book a room within first week
- 50%+ of members visit at least one tour location in first month
- 30%+ of members install PWA

---

*Last updated: 2026-07-05*
