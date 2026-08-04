import { getAdminEmails } from "@/lib/auth/admin";
import {
  getResendClient,
  getResendFromAddress,
  shouldSkipResendInDev,
} from "@/lib/email/resend-config";
import {
  emailCta,
  emailLayout,
  emailParagraph,
} from "@/lib/email/templates/layout";

export type HubCheckinAdminAlertInput = {
  fullName?: string | null;
  email: string;
  bookingDate: string;
  siteUrl: string;
};

export function buildHubCheckinAdminAlertContent(
  input: HubCheckinAdminAlertInput,
) {
  const name = input.fullName?.trim() || input.email;
  const adminUrl = `${input.siteUrl}/admin`;
  const subject = `New Hub Check-in — ${name} (${input.bookingDate})`;

  const body = [
    emailParagraph("New <strong>Hub Check-in</strong> reservation."),
    emailParagraph(`Name: <strong>${name}</strong>`),
    emailParagraph(`Email: <strong>${input.email}</strong>`),
    emailParagraph(`Date: <strong>${input.bookingDate}</strong>`),
    emailCta(adminUrl, "Open admin"),
  ].join("");

  const html = emailLayout({
    body,
    preheader: `Hub Check-in from ${name} on ${input.bookingDate}`,
  });

  const text = [
    "New Hub Check-in reservation.",
    `Name: ${name}`,
    `Email: ${input.email}`,
    `Date: ${input.bookingDate}`,
    `Admin: ${adminUrl}`,
  ].join("\n");

  return { subject, html, text, adminUrl };
}

export async function sendHubCheckinAdminAlert(
  input: HubCheckinAdminAlertInput,
): Promise<void> {
  const recipients = getAdminEmails();
  if (recipients.length === 0) {
    console.warn("Hub Check-in admin alert skipped: ADMIN_EMAILS is empty");
    return;
  }

  const { subject, html, text } = buildHubCheckinAdminAlertContent(input);

  if (shouldSkipResendInDev()) {
    console.info(
      `[dev] Hub Check-in admin alert to ${recipients.join(", ")}:\n${text}`,
    );
    return;
  }

  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: getResendFromAddress(),
    to: recipients,
    subject,
    text,
    html,
  });

  if (error) {
    console.error("Hub Check-in admin alert email error:", error);
    throw new Error(error.message);
  }
}
