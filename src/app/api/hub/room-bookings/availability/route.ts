import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { formatLocalDate } from "@/lib/dates";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("member_profiles")
      .select("stellar_funded")
      .eq("auth_user_id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: "Member profile not found" },
        { status: 404 }
      );
    }

    const isFounder = profile.stellar_funded;
    const memberTier = isFounder ? "Founder" : "Builder";
    const today = formatLocalDate(new Date());

    let hasHotDeskToday = isFounder;

    if (!isFounder) {
      const { data: hotDesk } = await supabase
        .from("bookings")
        .select("id")
        .eq("member_id", user.id)
        .eq("booking_date", today)
        .maybeSingle();

      hasHotDeskToday = !!hotDesk;
    }

    const adminSupabase = createSupabaseAdmin();

    const { data: rooms } = await adminSupabase
      .from("hub_rooms")
      .select("id, name, type, capacity, amenities, booking_enabled")
      .eq("booking_enabled", true)
      .order("name");

    const { data: roomBookings } = await adminSupabase
      .from("room_bookings")
      .select("id, room_id, start_time, duration_minutes, status, member_id")
      .eq("booking_date", today);

    const bookingsByRoom: Record<
      string,
      Array<{
        id: string;
        start_time: string;
        duration_minutes: number;
        status: string;
        is_mine: boolean;
      }>
    > = {};

    for (const booking of roomBookings || []) {
      if (!bookingsByRoom[booking.room_id]) {
        bookingsByRoom[booking.room_id] = [];
      }
      bookingsByRoom[booking.room_id].push({
        id: booking.id,
        start_time: booking.start_time.slice(0, 5),
        duration_minutes: booking.duration_minutes,
        status: booking.status,
        is_mine: booking.member_id === user.id,
      });
    }

    return NextResponse.json({
      date: today,
      member_tier: memberTier,
      can_book_rooms: hasHotDeskToday,
      rooms: rooms || [],
      bookings_by_room: bookingsByRoom,
    });
  } catch (error) {
    console.error("Room availability error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
