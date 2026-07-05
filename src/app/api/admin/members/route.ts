import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !isAdminEmail(user.email || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminSupabase = createSupabaseAdmin();

    // Get all member profiles (approved members)
    const { data: members, error } = await adminSupabase
      .from("member_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch members" },
        { status: 500 }
      );
    }

    return NextResponse.json({ members: members || [] });
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
