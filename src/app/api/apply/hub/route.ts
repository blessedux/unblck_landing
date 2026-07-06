import { NextResponse } from "next/server";
import type { HubAccessPayload } from "@/lib/forms/hub-form";
import { memberAuthCallbackUrl } from "@/lib/site-url";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUsername(username: string) {
  const usernameRegex = /^@?[a-zA-Z0-9]([a-zA-Z0-9_-]{0,37}[a-zA-Z0-9])?$/;
  return usernameRegex.test(username);
}

function validate(payload: HubAccessPayload) {
  const errors: string[] = [];

  if (!payload.full_name?.trim()) errors.push("Name is required");
  if (!payload.email?.trim() || !isValidEmail(payload.email)) {
    errors.push("Valid email is required");
  }
  if (!payload.project_name?.trim()) errors.push("Project description is required");
  if (!payload.location?.trim()) errors.push("Location is required");

  if (!payload.passport_username?.trim()) {
    errors.push("Stellar Passport username is required");
  } else if (!isValidUsername(payload.passport_username.trim())) {
    errors.push("Please enter a valid username (letters, numbers, hyphens, underscores only)");
  }

  if (payload.terms_accepted !== "true") {
    errors.push("You must accept the Terms & Conditions");
  }

  return errors;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HubAccessPayload;
    const errors = validate(body);

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const email = body.email.trim().toLowerCase();
    const termsVersion = process.env.TERMS_VERSION || "2026-07-01";

    // Check for existing application
    const { data: existingApp } = await supabase
      .from("unblck_applications")
      .select("id")
      .eq("email", email)
      .single();

    if (existingApp) {
      return NextResponse.json(
        { error: "You have already submitted an application with this email." },
        { status: 409 },
      );
    }

    // Create auth user and send magic link
    const { data: authData, error: authError } =
      await supabase.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: {
          redirectTo: memberAuthCallbackUrl(request),
        },
      });

    if (authError || !authData.user) {
      console.error("Auth link generation error:", authError);
      return NextResponse.json(
        { error: "Could not create account. Please try again." },
        { status: 500 },
      );
    }

    // Insert hub access application
    const { error: insertError } = await supabase
      .from("unblck_applications")
      .insert({
        full_name: body.full_name.trim(),
        email,
        project_name: body.project_name.trim(),
        project_link: null,
        build_description: null,
        location: body.location.trim(),
        stage: null,
        motivation: null,
        passport_address: body.passport_username.trim(),
        terms_version: termsVersion,
        terms_accepted_at: new Date().toISOString(),
        auth_user_id: authData.user.id,
        status: "pending",
        application_type: "hub_access",
      });

    if (insertError) {
      console.error("Hub access application insert error:", insertError);
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: "Could not save application. Try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Hub access application API error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }
}
