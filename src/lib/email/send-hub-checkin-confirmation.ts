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
import { parseLocalDate } from "@/lib/dates";

export type SendHubCheckinConfirmationInput = {
  to: string;
  fullName?: string | null;
  bookingDate: string;
  siteUrl: string;
};

export function formatHubCheckinDateLabel(bookingDate: string): string {
  return parseLocalDate(bookingDate).toLocaleDateString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function buildHubCheckinConfirmationContent({
  to,
  fullName,
  bookingDate,
  siteUrl,
}: SendHubCheckinConfirmationInput) {
  const greeting = fullName?.trim() ? `Hola ${fullName.trim()}` : "Hola";
  const dateLabel = formatHubCheckinDateLabel(bookingDate);
  const memberUrl = `${siteUrl}/member`;
  const subject = `Confirmación de reserva — ${dateLabel}`;

  const body = [
    emailParagraph(`${greeting},`),
    emailParagraph(
      "Confirmamos tu <strong>Hub Check-in</strong> en el Tellus Blockchain Hub STGO.",
    ),
    emailParagraph(`Fecha: <strong>${dateLabel}</strong>`),
    emailParagraph(
      "Tu acceso es por el día completo. Puedes gestionar tu reserva desde tu cuenta.",
    ),
    emailCta(memberUrl, "Ver mi cuenta"),
  ].join("");

  const html = emailLayout({
    body,
    preheader: `Reserva confirmada para ${dateLabel}`,
  });

  const text = [
    `${greeting},`,
    "",
    "Confirmamos tu Hub Check-in en el Tellus Blockchain Hub STGO.",
    `Fecha: ${dateLabel}`,
    "",
    "Tu acceso es por el día completo. Puedes gestionar tu reserva desde tu cuenta.",
    "",
    `Ver mi cuenta: ${memberUrl}`,
  ].join("\n");

  return { subject, html, text, memberUrl, to };
}

export async function sendHubCheckinConfirmation(
  input: SendHubCheckinConfirmationInput,
) {
  const { subject, html, text } = buildHubCheckinConfirmationContent(input);

  if (shouldSkipResendInDev()) {
    console.info(`[dev] Hub Check-in confirmation for ${input.to}:\n${text}`);
    return;
  }

  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: getResendFromAddress(),
    to: [input.to],
    subject,
    text,
    html,
  });

  if (error) {
    console.error("Hub Check-in confirmation email error:", error);
    throw new Error(error.message);
  }
}
