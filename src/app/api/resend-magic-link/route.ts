import { NextResponse } from "next/server";
import { memberAuthCallbackUrl } from "@/lib/site-url";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email: string };
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();

    // Check if user has an application
    const { data: application } = await supabase
      .from("unblck_applications")
      .select("id, auth_user_id")
      .eq("email", email)
      .single();

    if (!application || !application.auth_user_id) {
      return NextResponse.json(
        { error: "No application found for this email" },
        { status: 404 }
      );
    }

    // Generate and send new magic link
    const { error: linkError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        redirectTo: memberAuthCallbackUrl(request),
      },
    });

    if (linkError) {
      console.error("Magic link generation error:", linkError);
      return NextResponse.json(
        { error: "Could not send email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Resend API error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
}
