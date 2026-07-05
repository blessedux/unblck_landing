import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMemberProfile } from "@/lib/auth/member";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await getMemberProfile(user.id);

    if (!profile) {
      return NextResponse.json(
        { error: "Member profile not found" },
        { status: 404 }
      );
    }

    const { data: application } = await supabase
      .from("unblck_applications")
      .select("full_name, passport_address, passport_verified")
      .eq("auth_user_id", user.id)
      .single();

    const fullName =
      application?.full_name ||
      user.email?.split("@")[0] ||
      "Member";

    return NextResponse.json({
      email: user.email,
      full_name: fullName,
      tier: profile.stellar_funded ? "Founder" : "Builder",
      passport_username: application?.passport_address || null,
      passport_verified: profile.passport_verified,
    });
  } catch (error) {
    console.error("Hub member GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
