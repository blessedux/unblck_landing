import { NextResponse } from "next/server";
import type { UnblckPayload } from "@/lib/forms/unblck-form";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
    const { error } = await supabase.from("unblck_applications").insert({
      full_name: body.full_name.trim(),
      email: body.email.trim().toLowerCase(),
      project_name: body.project_name.trim(),
      project_link: body.project_link?.trim() || null,
      build_description: body.build_description.trim(),
      location: body.location.trim(),
      stage: body.stage.trim(),
      motivation: body.motivation.trim(),
    });

    if (error) {
      console.error("UNBLCK application insert error:", error);
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
