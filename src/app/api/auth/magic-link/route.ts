import { NextResponse } from "next/server";
import { generateAndSendMagicLink } from "@/lib/auth/magic-link";
import { memberAuthCallbackUrl } from "@/lib/site-url";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();

    const { data: applications } = await supabase
      .from("unblck_applications")
      .select("id, auth_user_id")
      .eq("email", email)
      .not("auth_user_id", "is", null)
      .limit(1);

    const application = applications?.[0];

    if (!application?.auth_user_id) {
      return NextResponse.json(
        { error: "No account found for this email" },
        { status: 404 },
      );
    }

    await generateAndSendMagicLink(email, memberAuthCallbackUrl(request));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Magic link API error:", error);
    return NextResponse.json(
      { error: "Could not send email. Please try again." },
      { status: 500 },
    );
  }
}
