import {
  getResendClient,
  getResendFromAddress,
  shouldSkipResendInDev,
} from "@/lib/email/resend-config";
import { emailLayout, emailParagraph } from "@/lib/email/templates/layout";

export async function sendNewsletterWelcomeEmail({ to }: { to: string }) {
  const body = [
    emailParagraph("Hola,"),
    emailParagraph(
      "¡Gracias por suscribirte al newsletter de <strong>UNBLCK</strong>!",
    ),
    emailParagraph(
      "Ya formas parte de nuestra lista. A partir de ahora recibirás <strong>invitaciones exclusivas</strong> y <strong>actualizaciones</strong> sobre el Acelerador y la comunidad.",
    ),
    emailParagraph(
      "Nada de spam — solo lo que vale la pena para quienes construyen en el ecosistema Stellar.",
    ),
    emailParagraph("Nos vemos pronto."),
  ].join("");

  const html = emailLayout({
    body,
    preheader: "Bienvenido/a al newsletter de UNBLCK",
  });

  const text =
    "Hola,\n\n¡Gracias por suscribirte al newsletter de UNBLCK!\n\nYa formas parte de nuestra lista. Recibirás invitaciones exclusivas y actualizaciones sobre el Acelerador y la comunidad.\n\nNada de spam — solo lo que vale la pena para quienes construyen en el ecosistema Stellar.\n\nNos vemos pronto.";

  if (shouldSkipResendInDev()) {
    console.info(`[dev] Newsletter welcome email for ${to}:\n${text}`);
    return;
  }

  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: getResendFromAddress(),
    to: [to],
    subject: "Bienvenido/a al newsletter de UNBLCK",
    text,
    html,
  });

  if (error) {
    console.error("Newsletter welcome email error:", error);
    throw new Error(error.message);
  }
}
