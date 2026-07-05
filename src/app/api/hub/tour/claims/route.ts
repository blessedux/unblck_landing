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

    // Get user's tour claims
    const { data: claims, error } = await supabase
      .from("tour_claims")
      .select("*")
      .eq("member_id", user.id)
      .order("claimed_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch claims" },
        { status: 500 }
      );
    }

    return NextResponse.json({ claims: claims || [] });
  } catch (error) {
    console.error("Error fetching tour claims:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
