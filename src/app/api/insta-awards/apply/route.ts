import { NextResponse } from "next/server";
import type { InstaAwardsPayload } from "@/lib/forms/insta-awards-form";
import { validateReferralCode } from "@/lib/referral-codes";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function validate(payload: InstaAwardsPayload) {
  const errors: string[] = [];

  if (!payload.referral_code?.trim()) errors.push("Referral code is required");
  if (!payload.full_name?.trim()) errors.push("Name is required");
  if (!payload.email?.trim() || !isValidEmail(payload.email)) {
    errors.push("Valid email is required");
  }
  if (!payload.project_name?.trim()) errors.push("Project name is required");
  if (!payload.project_link?.trim() || !isValidUrl(payload.project_link)) {
    errors.push("Valid project link is required");
  }
  if (!payload.stellar_build?.trim()) {
    errors.push("Stellar build description is required");
  }
  if (!payload.stellar_use_case?.trim()) {
    errors.push("On-chain use case is required");
  }
  if (!payload.stage?.trim()) errors.push("Stage is required");
  if (!payload.is_unblck_member?.trim()) {
    errors.push("UNBLCK membership status is required");
  }
  if (!payload.grant_motivation?.trim()) {
    errors.push("Grant motivation is required");
  }

  return errors;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InstaAwardsPayload;
    const errors = validate(body);

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    const referral = await validateReferralCode(body.referral_code);
    if (!referral.valid) {
      return NextResponse.json({ error: referral.error }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from("insta_awards_applications").insert({
      referral_code: referral.code,
      full_name: body.full_name.trim(),
      email: body.email.trim().toLowerCase(),
      project_name: body.project_name.trim(),
      project_link: body.project_link.trim(),
      stellar_build: body.stellar_build.trim(),
      stellar_use_case: body.stellar_use_case.trim(),
      stage: body.stage.trim(),
      is_unblck_member: body.is_unblck_member === "Yes",
      grant_motivation: body.grant_motivation.trim(),
    });

    if (error) {
      console.error("Insta Awards application insert error:", error);
      return NextResponse.json(
        { error: "Could not save application. Try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Insta Awards application API error:", error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }
}
