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

    const { data, error } = await supabase
      .from("unblck_applications")
      .select(
        "id, application_type, project_name, status, created_at, full_name",
      )
      .eq("auth_user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Submissions list error:", error);
      return NextResponse.json(
        { error: "Could not load submissions" },
        { status: 500 },
      );
    }

    return NextResponse.json({ submissions: data ?? [] });
  } catch (error) {
    console.error("Submissions API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
