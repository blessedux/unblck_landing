import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createHubCheckIn } from "@/lib/hub-checkins";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { booking_date: string };
    const result = await createHubCheckIn(user.id, body.booking_date);

    if (!result.ok) {
      const status = result.code === "not_current_week" ? 403 : 400;
      return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json({ ok: true, booking_id: result.booking_id });
  } catch (error) {
    console.error("Bookings POST error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
}
