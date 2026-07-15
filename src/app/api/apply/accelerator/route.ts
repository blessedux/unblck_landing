import { NextResponse } from "next/server";
import type { AcceleratorPayload } from "@/lib/forms/accelerator-form";
import { isValidEmail, normalizeEmail } from "@/lib/forms/validate-email";
import { hasExistingApplication } from "@/lib/applications/existing-application";
import { configurationErrorResponse } from "@/lib/api-error";
import { ensureAuthUserForEmail } from "@/lib/auth/magic-link";
import { sendAcceleratorApplicationConfirmation } from "@/lib/email/send-accelerator-application-confirmation";
import { getSiteUrl } from "@/lib/site-url";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { subscribeEmail } from "@/lib/newsletter/buttondown";
import { getClientIp } from "@/lib/request-client-ip";

function isValidUsername(username: string) {
  const usernameRegex = /^@?[a-zA-Z0-9]([a-zA-Z0-9_-]{0,37}[a-zA-Z0-9])?$/;
  return usernameRegex.test(username);
}

function validate(payload: AcceleratorPayload) {
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
  if (!payload.team_size?.trim()) errors.push("Team size is required");
  if (!payload.funding_status?.trim()) errors.push("Funding status is required");
  if (!payload.motivation?.trim()) errors.push("Motivation is required");

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
    const body = (await request.json()) as AcceleratorPayload;
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

    const { user: authUser, created: authUserCreated } =
      await ensureAuthUserForEmail(email);

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
        team_size: body.team_size.trim(),
        funding_status: body.funding_status.trim(),
        motivation: body.motivation.trim(),
        passport_address: body.passport_username.trim(),
        terms_version: termsVersion,
        terms_accepted_at: new Date().toISOString(),
        auth_user_id: authUser.id,
        status: "pending",
        application_type: "accelerator",
      });

    if (insertError) {
      console.error("Accelerator application insert error:", insertError);
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
        source: "accelerator",
        name: body.full_name.trim(),
      },
      ipAddress: getClientIp(request),
    });
    if (!subscribeResult.ok) {
      console.error(
        "Accelerator newsletter subscribe failed:",
        subscribeResult.error,
      );
    }

    const siteUrl = getSiteUrl(request);
    try {
      await sendAcceleratorApplicationConfirmation({
        to: email,
        fullName: body.full_name.trim(),
        projectName: body.project_name.trim(),
        siteUrl,
      });
    } catch (emailError) {
      console.error(
        "Accelerator application confirmation email error:",
        emailError,
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Accelerator application API error:", error);
    return configurationErrorResponse(error);
  }
}
