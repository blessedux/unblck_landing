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

    // Get enabled tour locations
    const { data: locations, error } = await supabase
      .from("tour_locations")
      .select("*")
      .eq("enabled", true)
      .order("order_index");

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch locations" },
        { status: 500 }
      );
    }

    return NextResponse.json({ locations: locations || [] });
  } catch (error) {
    console.error("Error fetching tour locations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
