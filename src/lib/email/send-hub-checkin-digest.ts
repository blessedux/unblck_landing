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

export type HubCheckinDigestMember = {
  fullName: string;
  email: string;
};

export type SendHubCheckinDigestInput = {
  hubDate: string;
  members: HubCheckinDigestMember[];
  siteUrl: string;
};

export type SendHubCheckinDigestResult =
  | { sent: false; reason: "empty" | "no_recipients" }
  | { sent: true; recipientCount: number; memberCount: number };

export function buildHubCheckinDigestContent({
  hubDate,
  members,
  siteUrl,
}: SendHubCheckinDigestInput) {
  const count = members.length;
  const adminUrl = `${siteUrl}/admin`;
  const subject = `Hub Check-ins for ${hubDate} (${count})`;

  const rowsHtml = members
    .map((member) => {
      const name = member.fullName.trim() || member.email;
      return emailParagraph(
        `<strong>${name}</strong> — ${member.email}`,
      );
    })
    .join("");

  const body = [
    emailParagraph(
      `<strong>${count}</strong> Hub Check-in${count === 1 ? "" : "s"} for <strong>${hubDate}</strong> (America/Santiago).`,
    ),
    rowsHtml,
    emailCta(adminUrl, "Open admin"),
  ].join("");

  const html = emailLayout({
    body,
    preheader: `${count} Hub Check-in${count === 1 ? "" : "s"} on ${hubDate}`,
  });

  const textLines = [
    `${count} Hub Check-in${count === 1 ? "" : "s"} for ${hubDate} (America/Santiago).`,
    "",
    ...members.map((member) => {
      const name = member.fullName.trim() || member.email;
      return `- ${name} — ${member.email}`;
    }),
    "",
    `Admin: ${adminUrl}`,
  ];

  return { subject, html, text: textLines.join("\n"), adminUrl };
}

export async function sendHubCheckinDigest(
  input: SendHubCheckinDigestInput,
): Promise<SendHubCheckinDigestResult> {
  if (input.members.length === 0) {
    return { sent: false, reason: "empty" };
  }

  const recipients = getAdminEmails();
  if (recipients.length === 0) {
    console.warn("Hub Check-in digest skipped: ADMIN_EMAILS is empty");
    return { sent: false, reason: "no_recipients" };
  }

  const { subject, html, text } = buildHubCheckinDigestContent(input);

  if (shouldSkipResendInDev()) {
    console.info(
      `[dev] Hub Check-in digest to ${recipients.join(", ")}:\n${text}`,
    );
    return {
      sent: true,
      recipientCount: recipients.length,
      memberCount: input.members.length,
    };
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
    console.error("Hub Check-in digest email error:", error);
    throw new Error(error.message);
  }

  return {
    sent: true,
    recipientCount: recipients.length,
    memberCount: input.members.length,
  };
}
