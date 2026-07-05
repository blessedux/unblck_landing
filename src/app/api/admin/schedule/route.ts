import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/auth/admin";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !isAdminEmail(user.email!)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      week_start: string;
      open_days: number[];
      notes?: string;
    };

    const adminSupabase = createSupabaseAdmin();

    const { error } = await adminSupabase.from("hub_schedule").upsert(
      {
        week_start: body.week_start,
        open_days: body.open_days,
        notes: body.notes || null,
      },
      { onConflict: "week_start" }
    );

    if (error) {
      console.error("Schedule upsert error:", error);
      return NextResponse.json(
        { error: "Could not save schedule" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin schedule API error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
}
