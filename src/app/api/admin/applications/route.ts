import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/auth/admin";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !isAdminEmail(user.email!)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use admin client to bypass RLS and fetch all applications
    const adminSupabase = createSupabaseAdmin();
    const { data: applications, error } = await adminSupabase
      .from("unblck_applications")
      .select("id, full_name, email, project_name, status, application_type, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin applications fetch error:", error);
      return NextResponse.json(
        { error: "Could not fetch applications" },
        { status: 500 }
      );
    }

    return NextResponse.json({ applications: applications || [] });
  } catch (error) {
    console.error("Admin applications API error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
}
