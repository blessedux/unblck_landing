import {
  getResendClient,
  getResendFromAddress,
  shouldSkipResendInDev,
} from "@/lib/email/resend-config";
import { emailLayout, emailParagraph } from "@/lib/email/templates/layout";

export async function sendAcceleratorApprovalEmail({
  to,
  fullName,
}: {
  to: string;
  fullName?: string | null;
}) {
  const greeting = fullName?.trim() ? `Hola ${fullName.trim()}` : "Hola";
  const body = [
    emailParagraph(`${greeting},`),
    emailParagraph(
      "¡Felicitaciones! Fuiste aceptado al <strong>UNBLCK Accelerator</strong>.",
    ),
    emailParagraph(
      "Pronto recibirás más detalles del programa y los próximos pasos de nuestro equipo.",
    ),
    emailParagraph("¡Nos vemos en el ecosistema UNBLCK!"),
  ].join("");

  const html = emailLayout({
    body,
    preheader: "Fuiste aceptado al Acelerador UNBLCK",
  });

  const text = `${greeting},\n\n¡Felicitaciones! Fuiste aceptado al UNBLCK Accelerator.\n\nPronto recibirás más detalles del programa.`;

  if (shouldSkipResendInDev()) {
    console.info(`[dev] Accelerator approval email for ${to}`);
    return;
  }

  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: getResendFromAddress(),
    to: [to],
    subject: "Felicitaciones — Aceptado al Acelerador UNBLCK",
    text,
    html,
  });

  if (error) {
    console.error("Accelerator approval email error:", error);
    throw new Error(error.message);
  }
}
