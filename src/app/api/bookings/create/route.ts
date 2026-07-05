import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { getMemberProfile } from "@/lib/auth/member";
import { canBook } from "@/lib/booking-credits";

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

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

    const targetDate = new Date(body.booking_date);
    const weekStart = getWeekStart(targetDate);

    // Get schedule for this week
    const adminSupabase = createSupabaseAdmin();
    const { data: schedule } = await adminSupabase
      .from("hub_schedule")
      .select("open_days")
      .eq("week_start", weekStart.toISOString().split("T")[0])
      .single();

    const openDays = schedule?.open_days || [];

    // Get existing bookings
    const { data: bookings } = await adminSupabase
      .from("bookings")
      .select("booking_date")
      .eq("member_id", user.id);

    const existingBookings =
      bookings?.map((b) => new Date(b.booking_date)) || [];

    // Check if booking is allowed
    const tier = profile.stellar_funded ? "stellar_funded" : "ambassador";
    const result = canBook({
      tier,
      targetDate,
      now: new Date(),
      existingBookings,
      openDays,
    });

    if (!result.allowed) {
      return NextResponse.json({ error: result.reason }, { status: 400 });
    }

    // Create booking
    const { error } = await adminSupabase.from("bookings").insert({
      member_id: user.id,
      booking_date: targetDate.toISOString().split("T")[0],
      week_start: weekStart.toISOString().split("T")[0],
    });

    if (error) {
      console.error("Booking insert error:", error);
      return NextResponse.json(
        { error: "Could not create booking" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Bookings POST error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
}
