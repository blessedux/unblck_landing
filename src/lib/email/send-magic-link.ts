import { Resend } from "resend";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(apiKey);
}

function getFromAddress() {
  return (
    process.env.RESEND_FROM ??
    "UNBLCK <onboarding@unblck-landing.vercel.app>"
  );
}

export async function sendMagicLinkEmail({
  to,
  magicLink,
}: {
  to: string;
  magicLink: string;
}) {
  const resend = getResendClient();

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: [to],
    subject: "Your UNBLCK login link",
    text: `Click the link below to log in to UNBLCK. This link expires soon.\n\n${magicLink}\n\nIf you didn't request this, you can ignore this email.`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <p style="color: #111; font-size: 16px; margin: 0 0 16px;">
          Click below to log in to UNBLCK. This link expires soon.
        </p>
        <a href="${magicLink}" style="display: inline-block; background: #000; color: #E1E0CC; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 500;">
          Log in to UNBLCK
        </a>
        <p style="color: #666; font-size: 13px; margin: 24px 0 0;">
          If the button doesn't work, copy and paste this URL into your browser:<br />
          <a href="${magicLink}" style="color: #666; word-break: break-all;">${magicLink}</a>
        </p>
        <p style="color: #999; font-size: 12px; margin: 16px 0 0;">
          If you didn't request this, you can ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend magic link error:", error);
    throw new Error(error.message);
  }
}
