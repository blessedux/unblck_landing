import type { SupabaseClient } from "@supabase/supabase-js";
import { formatHubDate } from "@/lib/dates";

const HUB_TIME_ZONE = "America/Santiago";

function formatHubTime(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: HUB_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.hour}:${values.minute}:${values.second}`;
}

export async function revokeMemberAccess(
  adminSupabase: SupabaseClient,
  authUserId: string,
) {
  const today = formatHubDate();
  const currentTime = formatHubTime();

  const { error: tourClaimsError } = await adminSupabase
    .from("tour_claims")
    .delete()
    .eq("member_id", authUserId);

  if (tourClaimsError) {
    throw new Error(`Failed to delete tour claims: ${tourClaimsError.message}`);
  }

  const { error: futureRoomBookingsError } = await adminSupabase
    .from("room_bookings")
    .delete()
    .eq("member_id", authUserId)
    .or(
      `booking_date.gt.${today},and(booking_date.eq.${today},start_time.gt.${currentTime})`,
    );

  if (futureRoomBookingsError) {
    throw new Error(
      `Failed to cancel future room bookings: ${futureRoomBookingsError.message}`,
    );
  }

  const { error: futureBookingsError } = await adminSupabase
    .from("bookings")
    .delete()
    .eq("member_id", authUserId)
    .gte("booking_date", today);

  if (futureBookingsError) {
    throw new Error(
      `Failed to cancel future hub bookings: ${futureBookingsError.message}`,
    );
  }

  const { error: profileError } = await adminSupabase
    .from("member_profiles")
    .delete()
    .eq("auth_user_id", authUserId);

  if (profileError) {
    throw new Error(`Failed to delete member profile: ${profileError.message}`);
  }
}

export const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ["approved", "rejected"],
  approved: ["rejected"],
  rejected: ["approved"],
};

export function isValidStatusTransition(
  fromStatus: string,
  toStatus: string,
): boolean {
  if (fromStatus === toStatus) {
    return true;
  }

  return VALID_STATUS_TRANSITIONS[fromStatus]?.includes(toStatus) ?? false;
}
