import { NextResponse } from "next/server";
import type { UnblckPayload } from "@/lib/forms/unblck-form";
import { isValidEmail, normalizeEmail } from "@/lib/forms/validate-email";
import { hasExistingApplication } from "@/lib/applications/existing-application";
import { generateAndSendMagicLink } from "@/lib/auth/magic-link";
import { memberAuthCallbackUrl } from "@/lib/site-url";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

function isValidUsername(username: string) {
  // Accept usernames with optional @ prefix, alphanumeric, hyphens, underscores
  // Length 2-39 characters (GitHub username limits)
  const usernameRegex = /^@?[a-zA-Z0-9]([a-zA-Z0-9_-]{0,37}[a-zA-Z0-9])?$/;
  return usernameRegex.test(username);
}

function validate(payload: UnblckPayload) {
  const errors: string[] = [];

  if (!payload.full_name?.trim()) errors.push("Name is required");
  if (!payload.email?.trim() || !isValidEmail(payload.email)) {
    errors.push("Valid email is required");
  }
  if (!payload.project_name?.trim()) errors.push("Project name is required");
  if (!payload.build_description?.trim()) {
    errors.push("Build description is required");
  }
  if (!payload.location?.trim()) errors.push("Location is required");
  if (!payload.stage?.trim()) errors.push("Stage is required");
  if (!payload.motivation?.trim()) errors.push("Motivation is required");

  // Validate username
  if (!payload.passport_username?.trim()) {
    errors.push("Stellar Passport username is required");
  } else if (!isValidUsername(payload.passport_username.trim())) {
    errors.push("Please enter a valid username (letters, numbers, hyphens, underscores only)");
  }

  // Validate T&C acceptance
  if (payload.terms_accepted !== "true") {
    errors.push("You must accept the Terms & Conditions");
  }

  return errors;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as UnblckPayload;
    const errors = validate(body);

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const email = normalizeEmail(body.email);
    const termsVersion = process.env.TERMS_VERSION || "2026-07-01";

    if (await hasExistingApplication(supabase, email, "accelerator")) {
      return NextResponse.json(
        {
          error:
            "You have already submitted an accelerator application with this email.",
        },
        { status: 409 },
      );
    }

    const authUser = await generateAndSendMagicLink(
      email,
      memberAuthCallbackUrl(request),
    );

    // Insert application with pending status
    const { error: insertError } = await supabase
      .from("unblck_applications")
      .insert({
        full_name: body.full_name.trim(),
        email,
        project_name: body.project_name.trim(),
        project_link: body.project_link?.trim() || null,
        build_description: body.build_description.trim(),
        location: body.location.trim(),
        stage: body.stage.trim(),
        motivation: body.motivation.trim(),
        passport_address: body.passport_username.trim(),
        terms_version: termsVersion,
        terms_accepted_at: new Date().toISOString(),
        auth_user_id: authUser.id,
        status: "pending",
        application_type: "accelerator",
      });

    if (insertError) {
      console.error("UNBLCK application insert error:", insertError);
      // Do not delete auth user — they may already have a hub application.
      return NextResponse.json(
        { error: "Could not save application. Try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("UNBLCK application API error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }
}
