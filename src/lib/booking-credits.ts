/**
 * Booking credits engine for UNBLCK Hub
 *
 * Rules:
 * - Ambassadors: 3 credits/week (Mon-Sun reset)
 * - Stellar-funded: Unlimited access
 * - Must book 24h in advance (no same-day)
 * - No double-booking
 * - Only open days can be booked
 */

export type MemberTier = "ambassador" | "stellar_funded";

export interface BookingContext {
  tier: MemberTier;
  targetDate: Date;
  now: Date;
  existingBookings: Date[];
  openDays: number[]; // weekdays open this week (0=Sunday, 6=Saturday)
}

export interface BookingResult {
  allowed: boolean;
  reason?: string;
  creditsRemaining: number;
}

/**
 * Get Monday of the week for a given date
 */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Sunday=0, Monday=1
  d.setDate(d.getDate() + diff);
  return d;
}

/**
 * Check if two dates are on the same day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Get bookings in the same week as the target date
 */
function getWeekBookings(targetDate: Date, allBookings: Date[]): Date[] {
  const weekStart = getWeekStart(targetDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  return allBookings.filter((booking) => {
    return booking >= weekStart && booking < weekEnd;
  });
}

/**
 * Check if a member can book a specific date
 */
export function canBook(ctx: BookingContext): BookingResult {
  const { tier, targetDate, now, existingBookings, openDays } = ctx;

  // Normalize dates to start of day for comparison
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  // Rule: No same-day booking (must be 24h advance)
  if (isSameDay(target, today)) {
    return {
      allowed: false,
      reason: "Cannot book same day. Must book at least 24 hours in advance.",
      creditsRemaining: tier === "stellar_funded" ? Infinity : 3,
    };
  }

  // Rule: Cannot book in the past
  if (target < today) {
    return {
      allowed: false,
      reason: "Cannot book dates in the past.",
      creditsRemaining: tier === "stellar_funded" ? Infinity : 3,
    };
  }

  // Rule: Check if day is open
  const targetWeekday = target.getDay();
  if (!openDays.includes(targetWeekday)) {
    return {
      allowed: false,
      reason: "Hub is closed on this day.",
      creditsRemaining: tier === "stellar_funded" ? Infinity : 3,
    };
  }

  // Rule: No double-booking
  const alreadyBooked = existingBookings.some((booking) =>
    isSameDay(booking, target)
  );
  if (alreadyBooked) {
    return {
      allowed: false,
      reason: "You already have a booking on this date.",
      creditsRemaining: tier === "stellar_funded" ? Infinity : 3,
    };
  }

  // Stellar-funded members have unlimited access
  if (tier === "stellar_funded") {
    return {
      allowed: true,
      creditsRemaining: Infinity,
    };
  }

  // Ambassador: check weekly credits
  const weekBookings = getWeekBookings(target, existingBookings);
  const creditsUsed = weekBookings.length;
  const creditsRemaining = 3 - creditsUsed;

  if (creditsUsed >= 3) {
    return {
      allowed: false,
      reason: "You have used all 3 credits for this week (Mon-Sun).",
      creditsRemaining: 0,
    };
  }

  return {
    allowed: true,
    creditsRemaining: creditsRemaining - 1, // Account for this booking
  };
}

/**
 * Get current weekly credit status for a member
 */
export function getWeeklyCredits(
  tier: MemberTier,
  now: Date,
  existingBookings: Date[]
): { total: number; used: number; remaining: number } {
  if (tier === "stellar_funded") {
    return {
      total: Infinity,
      used: 0,
      remaining: Infinity,
    };
  }

  const weekStart = getWeekStart(now);
  const weekBookings = getWeekBookings(weekStart, existingBookings);

  return {
    total: 3,
    used: weekBookings.length,
    remaining: 3 - weekBookings.length,
  };
}
