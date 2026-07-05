import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { getMemberProfile } from "@/lib/auth/member";
import { getWeeklyCredits, getMemberOpenDays } from "@/lib/booking-credits";
import {
  formatLocalDate,
  parseLocalDate,
  isCurrentWeek,
  getWeekStart,
} from "@/lib/dates";

export async function GET() {
  try {
    const supabase = await createClient();
    const adminSupabase = createSupabaseAdmin();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await getMemberProfile(user.id);

    if (!profile) {
      return NextResponse.json(
        { error: "Member profile not found" },
        { status: 404 }
      );
    }

    const now = new Date();
    const weekStart = formatLocalDate(getWeekStart(now));

    const { data: schedule } = await adminSupabase
      .from("hub_schedule")
      .select("open_days")
      .eq("week_start", weekStart)
      .single();

    const openDays = getMemberOpenDays(schedule?.open_days);

    const { data: bookings } = await supabase
      .from("bookings")
      .select("id, booking_date")
      .eq("member_id", user.id)
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

    return NextResponse.json({
      bookings: bookingDates.map((d) => formatLocalDate(d)),
      passes,
      credits,
      tier,
      open_days: openDays,
    });
  } catch (error) {
    console.error("Bookings GET error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
}
