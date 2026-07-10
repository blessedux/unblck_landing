import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { formatHubDate } from "@/lib/dates";
import { timeToMinutes } from "@/lib/room-slots";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { room_id, start_time, duration_minutes } = body;
    const booking_date = formatHubDate();

    if (!room_id || !start_time || !duration_minutes) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (![30, 60].includes(duration_minutes)) {
      return NextResponse.json(
        { error: "Duration must be 30 or 60 minutes" },
        { status: 400 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("member_profiles")
      .select("stellar_funded")
      .eq("auth_user_id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Member profile not found" },
        { status: 404 }
      );
    }

    const isFounder = profile.stellar_funded;
    const today = booking_date;

    if (!isFounder) {
      const { data: hotDesk } = await supabase
        .from("bookings")
        .select("id")
        .eq("member_id", user.id)
        .eq("booking_date", today)
        .maybeSingle();

      if (!hotDesk) {
        return NextResponse.json(
          {
            error:
              "You need a hot desk booking for today before reserving a room.",
          },
          { status: 403 }
        );
      }

      const { data: existingRoomBookings } = await supabase
        .from("room_bookings")
        .select("id")
        .eq("member_id", user.id)
        .eq("booking_date", today);

      if (existingRoomBookings && existingRoomBookings.length > 0) {
        return NextResponse.json(
          { error: "Builders can only book one room per day" },
          { status: 403 }
        );
      }
    }

    const adminSupabase = createSupabaseAdmin();

    const { data: room, error: roomError } = await adminSupabase
      .from("hub_rooms")
      .select("booking_enabled, type, name")
      .eq("id", room_id)
      .single();

    if (roomError || !room || !room.booking_enabled) {
      return NextResponse.json(
        { error: "Room not available for booking" },
        { status: 404 }
      );
    }

    if (room.type === "event_space") {
      return NextResponse.json(
        {
          error:
            "La Terraza no usa reservas por turnos. Solicita programación de evento desde la página de salas.",
        },
        { status: 400 }
      );
    }

    const { data: existingSlots } = await adminSupabase
      .from("room_bookings")
      .select("start_time, duration_minutes")
      .eq("room_id", room_id)
      .eq("booking_date", today);

    const startMin = timeToMinutes(start_time);
    const endMin = startMin + duration_minutes;

    if (endMin > 18 * 60 + 30) {
      return NextResponse.json(
        { error: "Time slot is outside hub hours" },
        { status: 400 }
      );
    }

    for (const slot of existingSlots || []) {
      const slotStart = timeToMinutes(slot.start_time.slice(0, 5));
      const slotEnd = slotStart + slot.duration_minutes;
      if (startMin < slotEnd && endMin > slotStart) {
        return NextResponse.json(
          { error: "This time slot is already booked" },
          { status: 409 }
        );
      }
    }

    const status = "confirmed";

    const { data: newBooking, error: insertError } = await adminSupabase
      .from("room_bookings")
      .insert({
        member_id: user.id,
        room_id,
        booking_date: today,
        start_time: start_time,
        duration_minutes,
        status,
      })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "Time slot already booked" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        booking: newBooking,
        status,
        message: "Room booked successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating room booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
