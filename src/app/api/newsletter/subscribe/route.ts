import { NextResponse } from "next/server";
import { sendNewsletterWelcomeEmail } from "@/lib/email/send-newsletter-welcome-email";
import { subscribeEmail } from "@/lib/newsletter/buttondown";
import { getClientIp } from "@/lib/request-client-ip";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const result = await subscribeEmail(email, {
      metadata: { source: "popup" },
      ipAddress: getClientIp(request),
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error ?? "Subscription failed" },
        { status: 502 },
      );
    }

    try {
      await sendNewsletterWelcomeEmail({ to: email });
    } catch (emailError) {
      console.error("Newsletter welcome email error:", emailError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Newsletter subscribe API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
