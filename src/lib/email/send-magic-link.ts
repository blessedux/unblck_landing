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

export async function sendMagicLinkEmail({
  to,
  magicLink,
}: {
  to: string;
  magicLink: string;
}) {
  const body = [
    emailParagraph(
      "Haz clic en el botón para iniciar sesión en UNBLCK. Este enlace expira pronto.",
    ),
    emailCta(magicLink, "Iniciar sesión"),
    emailParagraph(
      `Si el botón no funciona, copia y pega esta URL en tu navegador:<br /><a href="${magicLink}" style="color:#666;word-break:break-all;">${magicLink}</a>`,
    ),
    emailParagraph(
      "<span style=\"color:#999;font-size:13px;\">Si no solicitaste este correo, puedes ignorarlo.</span>",
    ),
  ].join("");

  const html = emailLayout({
    body,
    preheader: "Tu enlace de acceso a UNBLCK",
  });

  const text = `Haz clic en el enlace para iniciar sesión en UNBLCK. Este enlace expira pronto.\n\n${magicLink}\n\nSi no solicitaste este correo, puedes ignorarlo.`;

  if (shouldSkipResendInDev()) {
    console.info(
      `[dev] Resend not configured — magic link for ${to}:\n${magicLink}`,
    );
    return;
  }

  const resend = getResendClient();

  const { error } = await resend.emails.send({
    from: getResendFromAddress(),
    to: [to],
    subject: "Tu enlace de acceso a UNBLCK",
    text,
    html,
  });

  if (error) {
    console.error("Resend magic link error:", error);
    throw new Error(error.message);
  }
}
