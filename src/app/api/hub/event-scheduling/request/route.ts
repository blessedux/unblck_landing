import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      room_id?: string;
      event_description?: string;
      project_name?: string;
      requested_date?: string;
      requested_time?: string;
    };

    const { room_id, event_description, project_name, requested_date, requested_time } =
      body;

    if (
      !room_id ||
      !event_description?.trim() ||
      !project_name?.trim() ||
      !requested_date ||
      !requested_time
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const adminSupabase = createSupabaseAdmin();

    const { data: room, error: roomError } = await adminSupabase
      .from("hub_rooms")
      .select("id, type")
      .eq("id", room_id)
      .single();

    if (roomError || !room) {
      return NextResponse.json({ error: "Room not found" }, { status: 400 });
    }

    if (room.type !== "event_space") {
      return NextResponse.json(
        { error: "Only event space rooms can be scheduled via this endpoint" },
        { status: 400 },
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("member_profiles")
      .select("auth_user_id")
      .eq("auth_user_id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Member profile not found" },
        { status: 404 },
      );
    }

    const { data: requestRecord, error: insertError } = await adminSupabase
      .from("event_scheduling_requests")
      .insert({
        member_id: user.id,
        room_id,
        event_description: event_description.trim(),
        project_name: project_name.trim(),
        requested_date,
        requested_time,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Event scheduling request error:", insertError);
      return NextResponse.json(
        { error: "Could not create scheduling request" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        id: requestRecord.id,
        message: "Solicitud de programación enviada. El equipo la revisará pronto.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Event scheduling request API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
