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

export async function sendHubWelcomeEmail({
  to,
  fullName,
  magicLink,
}: {
  to: string;
  fullName?: string | null;
  magicLink: string;
}) {
  const greeting = fullName?.trim() ? `Hola ${fullName.trim()}` : "Hola";
  const body = [
    emailParagraph(`${greeting},`),
    emailParagraph(
      "¡Bienvenido al <strong>Tellus Blockchain Hub STGO</strong>! Tu acceso fue aprobado.",
    ),
    emailCta(magicLink, "Entrar a mi cuenta"),
    emailParagraph(
      "<strong>Beneficio Triana:</strong> 10% de descuento en compras en los negocios asociados del barrio Triana. Menciona que eres miembro del Tellus Hub al pagar (redención verbal, v1).",
    ),
    emailParagraph(
      "Negocios asociados: Taller Uno, la cafetería (planta baja), Casino Triana y la destilería. La lista puede actualizarse.",
    ),
  ].join("");

  const html = emailLayout({
    body,
    preheader: "Bienvenido al Tellus Hub",
  });

  const text = `${greeting},\n\n¡Bienvenido al Tellus Hub! Entra acá: ${magicLink}\n\nBeneficio Triana: 10% de descuento en negocios asociados del barrio (mención verbal).`;

  if (shouldSkipResendInDev()) {
    console.info(`[dev] Hub welcome email for ${to}:\n${magicLink}`);
    return;
  }

  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: getResendFromAddress(),
    to: [to],
    subject: "Bienvenido al Tellus Hub",
    text,
    html,
  });

  if (error) {
    console.error("Hub welcome email error:", error);
    throw new Error(error.message);
  }
}
