import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/auth/admin";
import { formatHubDate } from "@/lib/dates";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !isAdminEmail(user.email!)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminSupabase = createSupabaseAdmin();

    // Get all upcoming bookings with member profile info
    const today = formatHubDate();

    const { data: bookings, error } = await adminSupabase
      .from("bookings")
      .select(
        `
        id,
        booking_date,
        member_id,
        member_profiles!inner (
          email,
          stellar_funded
        )
      `
      )
      .gte("booking_date", today)
      .order("booking_date", { ascending: true });

    if (error) {
      console.error("Admin bookings fetch error:", error);
      return NextResponse.json(
        { error: "Could not fetch bookings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ bookings: bookings || [] });
  } catch (error) {
    console.error("Admin bookings API error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
}
