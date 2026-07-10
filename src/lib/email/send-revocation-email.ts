import {
  getResendClient,
  getResendFromAddress,
  shouldSkipResendInDev,
} from "@/lib/email/resend-config";

export async function sendRevocationEmail({
  to,
  fullName,
  reapplyUrl,
}: {
  to: string;
  fullName?: string | null;
  reapplyUrl: string;
}) {
  if (shouldSkipResendInDev()) {
    console.info(
      `[dev] Resend not configured — revocation email for ${to}:\n${reapplyUrl}`,
    );
    return;
  }

  const resend = getResendClient();
  const greeting = fullName?.trim() ? `Hola ${fullName.trim()}` : "Hola";

  const { error } = await resend.emails.send({
    from: getResendFromAddress(),
    to: [to],
    subject: "Tu acceso al Tellus Hub fue revocado",
    text: `${greeting},\n\nTe informamos que tu acceso al Tellus Blockchain Hub STGO fue revocado. Las reservas futuras de salas fueron canceladas.\n\nSi crees que esto es un error o deseas volver a postular, puedes hacerlo aquí: ${reapplyUrl}\n\n— El equipo de UNBLCK`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #111;">
        <p style="font-size: 16px; margin: 0 0 16px;">${greeting},</p>
        <p style="font-size: 16px; margin: 0 0 16px;">
          Te informamos que tu acceso al <strong>Tellus Blockchain Hub STGO</strong> fue revocado.
          Las reservas futuras de salas fueron canceladas.
        </p>
        <p style="font-size: 16px; margin: 0 0 16px;">
          Si crees que esto es un error o deseas volver a postular, puedes hacerlo aquí:
        </p>
        <a href="${reapplyUrl}" style="display: inline-block; background: #000; color: #E1E0CC; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 500;">
          Volver a postular
        </a>
        <p style="color: #999; font-size: 12px; margin: 24px 0 0;">
          — El equipo de UNBLCK
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend revocation email error:", error);
    throw new Error(error.message);
  }
}
