/**
 * Booking credits engine for UNBLCK Hub
 *
 * Rules:
 * - Ambassadors: 3 credits/week (Sun-Sat reset — schedule your week each Sunday)
 * - Stellar-funded: Unlimited access
 * - Must book 24h in advance (no same-day)
 * - No double-booking
 * - Only open days can be booked
 */

import {
  getWeekStart,
  getWeekEnd,
  startOfLocalDay,
} from "@/lib/dates";

export type MemberTier = "ambassador" | "stellar_funded";

/** Mon–Fri when admin has not configured a week in hub_schedule */
export const DEFAULT_OPEN_DAYS: number[] = [1, 2, 3, 4, 5];

/** Members (builders and founders) may only request hub access on weekdays */
export const MEMBER_BOOKABLE_WEEKDAYS: number[] = [1, 2, 3, 4, 5];

export function resolveOpenDays(scheduleOpenDays: unknown): number[] {
  if (!Array.isArray(scheduleOpenDays) || scheduleOpenDays.length === 0) {
    return DEFAULT_OPEN_DAYS;
  }

  const days = scheduleOpenDays
    .map((d) => Number(d))
    .filter((n) => Number.isInteger(n) && n >= 0 && n <= 6);

  return days.length > 0 ? days : DEFAULT_OPEN_DAYS;
}

/** Weekdays that are both Mon–Fri and open per the admin schedule */
export function getMemberOpenDays(scheduleOpenDays: unknown): number[] {
  const open = resolveOpenDays(scheduleOpenDays);
  return open.filter((d) => MEMBER_BOOKABLE_WEEKDAYS.includes(d));
}

export function isMemberBookableDay(date: Date, openDays: number[]): boolean {
  const weekday = date.getDay();
  if (!MEMBER_BOOKABLE_WEEKDAYS.includes(weekday)) return false;
  return openDays.includes(weekday);
}

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

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Get bookings in the same Sun–Sat week as the anchor date
 */
function getWeekBookings(anchorDate: Date, allBookings: Date[]): Date[] {
  const weekStart = getWeekStart(anchorDate);
  const weekEnd = getWeekEnd(anchorDate);

  return allBookings.filter((booking) => {
    const b = startOfLocalDay(booking);
    return b >= weekStart && b <= weekEnd;
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

  // Rule: Members may only book Mon–Fri
  const targetWeekday = target.getDay();
  if (!MEMBER_BOOKABLE_WEEKDAYS.includes(targetWeekday)) {
    return {
      allowed: false,
      reason: "Hub access is available Monday through Friday only.",
      creditsRemaining: tier === "stellar_funded" ? Infinity : 3,
    };
  }

  // Rule: Check if day is open per admin schedule
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
      reason: "You have used all 3 credits for this week (Sun–Sat).",
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
