import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { getMemberProfile } from "@/lib/auth/member";
import { canBook, getMemberOpenDays } from "@/lib/booking-credits";
import { formatLocalDate, parseLocalDate, isCurrentWeek, getWeekStart, getHubToday } from "@/lib/dates";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

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

    const body = (await request.json()) as { booking_date: string };

    const targetDate = parseLocalDate(body.booking_date);
    const weekStart = getWeekStart(targetDate);

    // Get schedule for this week
    const adminSupabase = createSupabaseAdmin();
    const { data: schedule } = await adminSupabase
      .from("hub_schedule")
      .select("open_days")
      .eq("week_start", formatLocalDate(weekStart))
      .single();

    const openDays = getMemberOpenDays(schedule?.open_days);

    // Get existing bookings
    const { data: bookings } = await adminSupabase
      .from("bookings")
      .select("booking_date")
      .eq("member_id", user.id);

    const existingBookings =
      bookings?.map((b) => parseLocalDate(b.booking_date)) || [];

    // Check if booking is allowed
    const tier = profile.stellar_funded ? "stellar_funded" : "ambassador";
    const now = getHubToday();

    if (tier === "ambassador" && !isCurrentWeek(targetDate, now)) {
      return NextResponse.json(
        { error: "Builders can only book days in the current week." },
        { status: 403 }
      );
    }

    const result = canBook({
      tier,
      targetDate,
      now,
      existingBookings,
      openDays,
    });

    if (!result.allowed) {
      return NextResponse.json({ error: result.reason }, { status: 400 });
    }

    // Create booking
    const { error, data: inserted } = await adminSupabase
      .from("bookings")
      .insert({
        member_id: user.id,
        booking_date: formatLocalDate(targetDate),
        week_start: formatLocalDate(weekStart),
      })
      .select("id")
      .single();

    if (error) {
      console.error("Booking insert error:", error);
      return NextResponse.json(
        { error: "Could not create booking" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, booking_id: inserted?.id });
  } catch (error) {
    console.error("Bookings POST error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
}
