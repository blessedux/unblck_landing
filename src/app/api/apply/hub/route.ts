import { NextResponse } from "next/server";
import type { HubAccessPayload } from "@/lib/forms/hub-form";
import { STELLAR_AMBASSADOR_VALUES } from "@/lib/forms/hub-form";
import { isValidEmail, normalizeEmail } from "@/lib/forms/validate-email";
import { hasExistingApplication } from "@/lib/applications/existing-application";
import { configurationErrorResponse } from "@/lib/api-error";
import { ensureAuthUserForEmail } from "@/lib/auth/magic-link";
import { sendAdminApplicationAlert } from "@/lib/email/send-admin-application-alert";
import { sendHubApplicationConfirmation } from "@/lib/email/send-hub-application-confirmation";
import { getSiteUrl } from "@/lib/site-url";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { subscribeEmail } from "@/lib/newsletter/buttondown";
import { getClientIp } from "@/lib/request-client-ip";

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

  if (payload.stellar_ambassador !== STELLAR_AMBASSADOR_VALUES.yes) {
    errors.push("You must be a Stellar Ambassador to request hub access");
  }

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
    const email = normalizeEmail(body.email);
    const termsVersion = process.env.TERMS_VERSION || "2026-07-01";

    if (await hasExistingApplication(supabase, email, "hub_access")) {
      return NextResponse.json(
        { error: "You have already submitted a hub access application with this email." },
        { status: 409 },
      );
    }

    const { user: authUser, created: authUserCreated } =
      await ensureAuthUserForEmail(email);

    const { data: application, error: insertError } = await supabase
      .from("unblck_applications")
      .insert({
        full_name: body.full_name.trim(),
        email,
        project_name: body.project_name.trim(),
        project_link: null,
        build_description: null,
        location: body.location.trim(),
        stellar_ambassador: body.stellar_ambassador === STELLAR_AMBASSADOR_VALUES.yes,
        stage: null,
        motivation: null,
        passport_address: body.passport_username.trim(),
        terms_version: termsVersion,
        terms_accepted_at: new Date().toISOString(),
        auth_user_id: authUser.id,
        status: "pending",
        application_type: "hub_access",
      })
      .select("id")
      .single();

    if (insertError || !application?.id) {
      console.error("Hub access application insert error:", insertError);
      if (authUserCreated) {
        await supabase.auth.admin.deleteUser(authUser.id);
      }
      return NextResponse.json(
        { error: "Could not save application. Try again." },
        { status: 500 },
      );
    }

    const subscribeResult = await subscribeEmail(email, {
      metadata: {
        source: "hub_access",
        name: body.full_name.trim(),
      },
      ipAddress: getClientIp(request),
    });
    if (!subscribeResult.ok) {
      console.error("Hub newsletter subscribe failed:", subscribeResult.error);
    }

    const siteUrl = getSiteUrl(request);
    const fullName = body.full_name.trim();
    const projectName = body.project_name.trim();
    try {
      await sendHubApplicationConfirmation({
        to: email,
        fullName,
        projectName,
        siteUrl,
      });
    } catch (emailError) {
      console.error("Hub application confirmation email error:", emailError);
    }

    try {
      await sendAdminApplicationAlert({
        applicationId: application.id,
        applicationType: "hub_access",
        fullName,
        email,
        projectName,
        siteUrl,
      });
    } catch (alertError) {
      console.error("Hub application admin alert error:", alertError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Hub access application API error:", error);
    return configurationErrorResponse(error);
  }
}
