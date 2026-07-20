import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { getMemberProfileAdmin } from "@/lib/auth/member";
import { canBook, getWeeklyCredits, getMemberOpenDays } from "@/lib/booking-credits";
import {
  formatLocalDate,
  getHubToday,
  parseLocalDate,
  isCurrentWeek,
  getWeekStart,
} from "@/lib/dates";

export type HubCheckInState = {
  bookings: string[];
  passes: { id: string; date: string }[];
  credits: {
    total: number;
    used: number;
    remaining: number;
  };
  tier: "stellar_funded" | "ambassador";
  open_days: number[];
};

export type HubCheckInResult =
  | { ok: true; booking_id: string }
  | { ok: false; error: string; code?: string };

export type CancelCheckInResult =
  | { ok: true }
  | { ok: false; error: string };

export async function getHubCheckInState(
  memberId: string
): Promise<HubCheckInState | null> {
  const profile = await getMemberProfileAdmin(memberId);

  if (!profile) {
    return null;
  }

  const adminSupabase = createSupabaseAdmin();
  const now = getHubToday();
  const weekStart = formatLocalDate(getWeekStart(now));

  const { data: schedule } = await adminSupabase
    .from("hub_schedule")
    .select("open_days")
    .eq("week_start", weekStart)
    .single();

  const openDays = getMemberOpenDays(schedule?.open_days);

  const { data: bookings } = await adminSupabase
    .from("bookings")
    .select("id, booking_date")
    .eq("member_id", memberId)
    .order("booking_date", { ascending: true });

  const bookingDates =
    bookings?.map((b) => parseLocalDate(b.booking_date)) || [];

  const tier = profile.stellar_funded ? "stellar_funded" : "ambassador";
  const credits = getWeeklyCredits(tier, now, bookingDates);

  const passes =
    bookings
      ?.filter((b) => {
        const d = parseLocalDate(b.booking_date);
        if (tier === "ambassador") {
          return isCurrentWeek(d, now);
        }
        return d >= parseLocalDate(formatLocalDate(now));
      })
      .map((b) => ({
        id: b.id,
        date: b.booking_date,
      })) || [];

  return {
    bookings: bookingDates.map((d) => formatLocalDate(d)),
    passes,
    credits,
    tier,
    open_days: openDays,
  };
}

export async function createHubCheckIn(
  memberId: string,
  bookingDate: string
): Promise<HubCheckInResult> {
  const profile = await getMemberProfileAdmin(memberId);

  if (!profile) {
    return { ok: false, error: "Member profile not found" };
  }

  const targetDate = parseLocalDate(bookingDate);
  const weekStart = getWeekStart(targetDate);

  const adminSupabase = createSupabaseAdmin();
  const { data: schedule } = await adminSupabase
    .from("hub_schedule")
    .select("open_days")
    .eq("week_start", formatLocalDate(weekStart))
    .single();

  const openDays = getMemberOpenDays(schedule?.open_days);

  const { data: bookings } = await adminSupabase
    .from("bookings")
    .select("booking_date")
    .eq("member_id", memberId);

  const existingBookings =
    bookings?.map((b) => parseLocalDate(b.booking_date)) || [];

  const tier = profile.stellar_funded ? "stellar_funded" : "ambassador";
  const now = getHubToday();

  if (tier === "ambassador" && !isCurrentWeek(targetDate, now)) {
    return {
      ok: false,
      error: "Builders can only book days in the current week.",
      code: "not_current_week",
    };
  }

  const result = canBook({
    tier,
    targetDate,
    now,
    existingBookings,
    openDays,
  });

  if (!result.allowed) {
    const reason = result.reason ?? "Booking not allowed";
    const errorCode = reason.includes("credit")
      ? "credits_exhausted"
      : reason.includes("closed")
        ? "hub_closed"
        : reason.includes("same day")
          ? "same_day_blocked"
          : undefined;

    return { ok: false, error: reason, code: errorCode };
  }

  const { error, data: inserted } = await adminSupabase
    .from("bookings")
    .insert({
      member_id: memberId,
      booking_date: formatLocalDate(targetDate),
      week_start: formatLocalDate(weekStart),
    })
    .select("id")
    .single();

  if (error) {
    console.error("Booking insert error:", error);
    return { ok: false, error: "Could not create booking" };
  }

  return { ok: true, booking_id: inserted!.id };
}

export async function cancelHubCheckIn(
  memberId: string,
  bookingDate: string
): Promise<CancelCheckInResult> {
  const adminSupabase = createSupabaseAdmin();
  const { error } = await adminSupabase
    .from("bookings")
    .delete()
    .eq("member_id", memberId)
    .eq("booking_date", bookingDate);

  if (error) {
    console.error("Booking delete error:", error);
    return { ok: false, error: "Could not cancel booking" };
  }

  return { ok: true };
}
