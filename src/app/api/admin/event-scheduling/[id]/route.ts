import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/auth/admin";

const VALID_STATUSES = ["pending", "approved", "rejected"] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !isAdminEmail(user.email!)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      status?: string;
      admin_notes?: string | null;
    };

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status as (typeof VALID_STATUSES)[number])) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      updatePayload.status = body.status;
    }

    if (body.admin_notes !== undefined) {
      updatePayload.admin_notes = body.admin_notes;
    }

    const adminSupabase = createSupabaseAdmin();

    const { data: updated, error } = await adminSupabase
      .from("event_scheduling_requests")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Event scheduling update error:", error);
      return NextResponse.json(
        { error: "Could not update request" },
        { status: 500 },
      );
    }

    return NextResponse.json({ request: updated });
  } catch (error) {
    console.error("Admin event scheduling PATCH error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }
}
