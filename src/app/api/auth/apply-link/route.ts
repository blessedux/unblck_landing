import { NextResponse } from "next/server";
import {
  ensureAuthUserForEmail,
  generateAndSendMagicLink,
} from "@/lib/auth/magic-link";
import {
  isApplyNextPath,
  sanitizeNextPath,
} from "@/lib/auth/safe-next-path";
import { isValidEmail, normalizeEmail } from "@/lib/forms/validate-email";
import { getSiteUrl } from "@/lib/site-url";

/**
 * Start apply-flow auth: ensure an Auth user exists and email a magic link
 * that returns the applicant to the form (no prior application required).
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; next?: string };
    const email = body.email ? normalizeEmail(body.email) : "";
    const next = sanitizeNextPath(body.next, "/apply");

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 },
      );
    }

    if (!isApplyNextPath(next)) {
      return NextResponse.json(
        { error: "Invalid apply redirect" },
        { status: 400 },
      );
    }

    await ensureAuthUserForEmail(email);

    const redirectTo = `${getSiteUrl(request)}/auth/callback?next=${encodeURIComponent(next)}`;
    await generateAndSendMagicLink(email, redirectTo);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Apply-link API error:", error);
    return NextResponse.json(
      { error: "Could not send email. Please try again." },
      { status: 500 },
    );
  }
}
