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
import type { ApplicationType } from "@/lib/applications/existing-application";

const APPLICATION_TYPE_LABEL: Record<ApplicationType, string> = {
  hub_access: "Hub Access",
  accelerator: "Accelerator",
};

export type AdminApplicationAlertInput = {
  applicationId: string;
  applicationType: ApplicationType;
  fullName: string;
  email: string;
  projectName: string;
  siteUrl: string;
};

export function buildAdminApplicationAlertContent(
  input: AdminApplicationAlertInput,
) {
  const typeLabel = APPLICATION_TYPE_LABEL[input.applicationType];
  const adminUrl = `${input.siteUrl}/admin/applications/${input.applicationId}`;
  const subject = `New ${typeLabel} application — ${input.fullName.trim() || input.email}`;

  const body = [
    emailParagraph(`New <strong>${typeLabel}</strong> application submitted.`),
    emailParagraph(`Name: <strong>${input.fullName.trim()}</strong>`),
    emailParagraph(`Email: <strong>${input.email}</strong>`),
    emailParagraph(`Project: <strong>${input.projectName.trim()}</strong>`),
    emailCta(adminUrl, "Review application"),
  ].join("");

  const html = emailLayout({
    body,
    preheader: `New ${typeLabel} application from ${input.fullName.trim() || input.email}`,
  });

  const text = [
    `New ${typeLabel} application submitted.`,
    `Name: ${input.fullName.trim()}`,
    `Email: ${input.email}`,
    `Project: ${input.projectName.trim()}`,
    `Review: ${adminUrl}`,
  ].join("\n");

  return { subject, html, text, adminUrl };
}

export async function sendAdminApplicationAlert(
  input: AdminApplicationAlertInput,
): Promise<void> {
  const recipients = getAdminEmails();
  if (recipients.length === 0) {
    console.warn(
      "Admin application alert skipped: ADMIN_EMAILS is empty",
    );
    return;
  }

  const { subject, html, text } = buildAdminApplicationAlertContent(input);

  if (shouldSkipResendInDev()) {
    console.info(
      `[dev] Admin application alert to ${recipients.join(", ")}:\n${text}`,
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
    console.error("Admin application alert email error:", error);
    throw new Error(error.message);
  }
}
