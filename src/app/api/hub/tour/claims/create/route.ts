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
    const { location_id } = body;

    if (!location_id) {
      return NextResponse.json(
        { error: "Missing location_id" },
        { status: 400 }
      );
    }

    // Verify location exists and is enabled
    const { data: location, error: locationError } = await supabase
      .from("tour_locations")
      .select("enabled")
      .eq("id", location_id)
      .single();

    if (locationError || !location || !location.enabled) {
      return NextResponse.json(
        { error: "Location not found or disabled" },
        { status: 404 }
      );
    }

    // Check if already claimed
    const { data: existing, error: checkError } = await supabase
      .from("tour_claims")
      .select("id")
      .eq("member_id", user.id)
      .eq("location_id", location_id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "no rows returned", which is expected
      return NextResponse.json(
        { error: "Failed to check existing claims" },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { error: "Location already claimed" },
        { status: 409 }
      );
    }

    // Create claim
    const { data: newClaim, error: insertError } = await supabase
      .from("tour_claims")
      .insert({
        member_id: user.id,
        location_id,
      })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        // Unique constraint violation
        return NextResponse.json(
          { error: "Location already claimed" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Failed to create claim" },
        { status: 500 }
      );
    }

    return NextResponse.json({ claim: newClaim }, { status: 201 });
  } catch (error) {
    console.error("Error creating tour claim:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
