import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function DELETE(
  request: Request,
  { params }: { params: { date: string } }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminSupabase = createSupabaseAdmin();
    const { error } = await adminSupabase
      .from("bookings")
      .delete()
      .eq("member_id", user.id)
      .eq("booking_date", params.date);

    if (error) {
      console.error("Booking delete error:", error);
      return NextResponse.json(
        { error: "Could not cancel booking" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Bookings DELETE error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
}
