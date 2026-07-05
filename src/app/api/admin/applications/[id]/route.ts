import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/auth/admin";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !isAdminEmail(user.email!)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      status?: string;
      reviewer_notes?: string;
      passport_verified?: boolean;
      stellar_funded?: boolean;
    };

    const adminSupabase = createSupabaseAdmin();

    // Get the application
    const { data: application } = await adminSupabase
      .from("unblck_applications")
      .select("*")
      .eq("id", params.id)
      .single();

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Update application
    const { error: updateError } = await adminSupabase
      .from("unblck_applications")
      .update({
        status: body.status,
        reviewer_notes: body.reviewer_notes,
        passport_verified: body.passport_verified,
        stellar_funded: body.stellar_funded,
      })
      .eq("id", params.id);

    if (updateError) {
      console.error("Application update error:", updateError);
      return NextResponse.json(
        { error: "Could not update application" },
        { status: 500 }
      );
    }

    // If approved, upsert member_profiles
    if (body.status === "approved" && application.auth_user_id) {
      const { error: profileError } = await adminSupabase
        .from("member_profiles")
        .upsert(
          {
            auth_user_id: application.auth_user_id,
            application_id: application.id,
            email: application.email,
            stellar_funded: body.stellar_funded ?? false,
            passport_verified: body.passport_verified ?? false,
          },
          { onConflict: "auth_user_id" }
        );

      if (profileError) {
        console.error("Member profile upsert error:", profileError);
        return NextResponse.json(
          { error: "Could not create member profile" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
}
