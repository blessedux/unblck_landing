import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMemberProfile } from "@/lib/auth/member";
import { getWeeklyCredits } from "@/lib/booking-credits";

export async function GET() {
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

    // Get member's bookings
    const { data: bookings } = await supabase
      .from("bookings")
      .select("booking_date")
      .eq("member_id", user.id)
      .order("booking_date", { ascending: true });

    const bookingDates = bookings?.map((b) => new Date(b.booking_date)) || [];

    // Calculate weekly credits
    const tier = profile.stellar_funded ? "stellar_funded" : "ambassador";
    const credits = getWeeklyCredits(tier, new Date(), bookingDates);

    return NextResponse.json({
      bookings: bookingDates.map((d) => d.toISOString().split("T")[0]),
      credits,
      tier,
    });
  } catch (error) {
    console.error("Bookings GET error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
}
