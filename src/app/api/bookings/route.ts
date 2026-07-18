import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getHubCheckInState } from "@/lib/hub-checkins";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const state = await getHubCheckInState(user.id);

    if (!state) {
      return NextResponse.json(
        { error: "Member profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(state);
  } catch (error) {
    console.error("Bookings GET error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
}
