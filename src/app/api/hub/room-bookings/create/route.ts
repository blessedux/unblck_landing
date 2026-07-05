import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    const { room_id, booking_date, start_time, duration_minutes } = body;

    // Validate input
    if (!room_id || !booking_date || !start_time || !duration_minutes) {
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

    // Get member profile
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
    const today = new Date().toISOString().split("T")[0];

    // Builders can only book for today
    if (!isFounder && booking_date !== today) {
      return NextResponse.json(
        { error: "Builders can only book rooms for today" },
        { status: 403 }
      );
    }

    // Check if room exists and is enabled
    const { data: room, error: roomError } = await supabase
      .from("hub_rooms")
      .select("booking_enabled")
      .eq("id", room_id)
      .single();

    if (roomError || !room || !room.booking_enabled) {
      return NextResponse.json(
        { error: "Room not available for booking" },
        { status: 404 }
      );
    }

    // Check for existing booking today (Builders: once per day)
    if (!isFounder) {
      const { data: existingBookings, error: checkError } = await supabase
        .from("room_bookings")
        .select("id")
        .eq("member_id", user.id)
        .eq("booking_date", today);

      if (checkError) {
        return NextResponse.json(
          { error: "Failed to check existing bookings" },
          { status: 500 }
        );
      }

      if (existingBookings && existingBookings.length > 0) {
        return NextResponse.json(
          { error: "Builders can only book one room per day" },
          { status: 403 }
        );
      }
    }

    // Create booking
    const { data: newBooking, error: insertError } = await supabase
      .from("room_bookings")
      .insert({
        member_id: user.id,
        room_id,
        booking_date,
        start_time,
        duration_minutes,
      })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        // Unique constraint violation
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

    return NextResponse.json({ booking: newBooking }, { status: 201 });
  } catch (error) {
    console.error("Error creating room booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
