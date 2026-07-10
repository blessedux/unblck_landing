import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/auth/admin";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !isAdminEmail(user.email!)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = request.nextUrl.searchParams.get("status");
    const adminSupabase = createSupabaseAdmin();

    let query = adminSupabase
      .from("event_scheduling_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (
      status &&
      ["pending", "approved", "rejected"].includes(status)
    ) {
      query = query.eq("status", status);
    }

    const { data: requests, error } = await query;

    if (error) {
      console.error("Event scheduling fetch error:", error);
      return NextResponse.json(
        { error: "Could not fetch event scheduling requests" },
        { status: 500 },
      );
    }

    const memberIds = [
      ...new Set((requests || []).map((r) => r.member_id)),
    ];
    const roomIds = [...new Set((requests || []).map((r) => r.room_id))];

    const [{ data: members }, { data: rooms }] = await Promise.all([
      memberIds.length
        ? adminSupabase
            .from("member_profiles")
            .select("auth_user_id, email")
            .in("auth_user_id", memberIds)
        : Promise.resolve({ data: [] }),
      roomIds.length
        ? adminSupabase.from("hub_rooms").select("id, name").in("id", roomIds)
        : Promise.resolve({ data: [] }),
    ]);

    const emailByMember = Object.fromEntries(
      (members || []).map((m) => [m.auth_user_id, m.email]),
    );
    const nameByRoom = Object.fromEntries(
      (rooms || []).map((r) => [r.id, r.name]),
    );

    const enriched = (requests || []).map((r) => ({
      ...r,
      member_email: emailByMember[r.member_id] ?? null,
      room_name: nameByRoom[r.room_id] ?? null,
    }));

    return NextResponse.json({ requests: enriched });
  } catch (error) {
    console.error("Admin event scheduling API error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }
}
