import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get member profile
    const { data: profile, error: profileError } = await supabase
      .from("member_profiles")
      .select("stellar_funded")
      .eq("auth_user_id", user.id)
      .single();

    if (profileError || !profile) {
      // No profile yet, return empty rooms for now
      return NextResponse.json({
        rooms: [],
        member_tier: "Builder",
        error: "Please complete your application to access room booking"
      });
    }

    const memberTier = profile.stellar_funded ? "Founder" : "Builder";

    // Get enabled rooms
    const { data: rooms, error: roomsError } = await supabase
      .from("hub_rooms")
      .select("*")
      .eq("booking_enabled", true)
      .order("name");

    if (roomsError) {
      return NextResponse.json(
        { error: "Failed to fetch rooms" },
        { status: 500 }
      );
    }

    return NextResponse.json({ rooms, member_tier: memberTier });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
