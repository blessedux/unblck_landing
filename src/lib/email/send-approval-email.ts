import { Resend } from "resend";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(apiKey);
}

function getFromAddress() {
  const from = process.env.RESEND_FROM?.trim();
  if (!from) {
    throw new Error(
      "RESEND_FROM is not configured — use an address on your verified Resend domain",
    );
  }
  return from;
}

export async function sendApprovalEmail({
  to,
  fullName,
  loginUrl,
}: {
  to: string;
  fullName?: string | null;
  loginUrl: string;
}) {
  const resend = getResendClient();
  const greeting = fullName?.trim() ? `Hola ${fullName.trim()}` : "Hola";

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: [to],
    subject: "¡Bienvenido a UNBLCK! Tu acceso fue aprobado",
    text: `${greeting},\n\n¡Buenas noticias! Tu postulación a UNBLCK fue aprobada y ya tienes acceso al Tellus Blockchain Hub STGO.\n\nEntra a tu cuenta acá: ${loginUrl}\n\nUsa este mismo correo para iniciar sesión con tu enlace mágico. Nos vemos en el hub.\n\n— El equipo de UNBLCK`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #111;">
        <p style="font-size: 16px; margin: 0 0 16px;">${greeting},</p>
        <p style="font-size: 16px; margin: 0 0 16px;">
          ¡Buenas noticias! Tu postulación a <strong>UNBLCK</strong> fue aprobada y ya tienes acceso al
          Tellus Blockchain Hub STGO.
        </p>
        <a href="${loginUrl}" style="display: inline-block; background: #000; color: #E1E0CC; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 500;">
          Entrar a mi cuenta
        </a>
        <p style="color: #666; font-size: 13px; margin: 24px 0 0;">
          Usa este mismo correo para iniciar sesión con tu enlace mágico. Nos vemos en el hub.
        </p>
        <p style="color: #999; font-size: 12px; margin: 16px 0 0;">
          — El equipo de UNBLCK
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend approval email error:", error);
    throw new Error(error.message);
  }
}
