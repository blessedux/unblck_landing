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

export async function sendAcceleratorApplicationConfirmation({
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
      "Recibimos tu postulación al <strong>UNBLCK Accelerator</strong>.",
    ),
    emailParagraph(`Proyecto: <strong>${projectName}</strong>`),
    emailParagraph("Revisaremos tu aplicación pronto."),
    emailCta(`${siteUrl}/apply`, "También solicita acceso al Hub"),
  ].join("");

  const html = emailLayout({
    body,
    preheader: "Recibimos tu postulación al Acelerador",
  });

  const text = `${greeting},\n\nRecibimos tu postulación al UNBLCK Accelerator.\nProyecto: ${projectName}\n\nRevisaremos tu aplicación pronto.\n\nTambién solicita acceso al Hub: ${siteUrl}/apply`;

  if (shouldSkipResendInDev()) {
    console.info(
      `[dev] Accelerator application confirmation for ${to}:\n${text}`,
    );
    return;
  }

  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: getResendFromAddress(),
    to: [to],
    subject: "Recibimos tu postulación al Acelerador",
    text,
    html,
  });

  if (error) {
    console.error("Accelerator application confirmation email error:", error);
    throw new Error(error.message);
  }
}
