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

export async function sendHubApplicationConfirmation({
  to,
  fullName,
  projectName,
  siteUrl,
}: {
  to: string;
  fullName: string;
  projectName: string;
  siteUrl: string;
}) {
  const greeting = fullName.trim() ? `Hola ${fullName.trim()}` : "Hola";
  const body = [
    emailParagraph(`${greeting},`),
    emailParagraph(
      "Recibimos tu postulación de acceso al <strong>Tellus Blockchain Hub STGO</strong>.",
    ),
    emailParagraph(`Proyecto: <strong>${projectName}</strong>`),
    emailParagraph("Revisaremos tu aplicación pronto."),
    emailCta(`${siteUrl}/accelerator/apply`, "También postula al Acelerador"),
  ].join("");

  const html = emailLayout({
    body,
    preheader: "Recibimos tu postulación al Hub",
  });

  const text = `${greeting},\n\nRecibimos tu postulación de acceso al Tellus Hub.\nProyecto: ${projectName}\n\nRevisaremos tu aplicación pronto.\n\nTambién postula al Acelerador: ${siteUrl}/accelerator/apply`;

  if (shouldSkipResendInDev()) {
    console.info(`[dev] Hub application confirmation for ${to}:\n${text}`);
    return;
  }

  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: getResendFromAddress(),
    to: [to],
    subject: "Recibimos tu postulación al Hub",
    text,
    html,
  });

  if (error) {
    console.error("Hub application confirmation email error:", error);
    throw new Error(error.message);
  }
}
