type EmailLayoutOptions = {
  body: string;
  preheader?: string;
};

export function emailLayout({ body, preheader }: EmailLayoutOptions): string {
  const hiddenPreheader = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>UNBLCK</title>
  <style>
    @media (prefers-color-scheme: dark) {
      .email-body { background-color: #111 !important; color: #f5f5f5 !important; }
      .email-card { background-color: #1a1a1a !important; }
      .email-muted { color: #999 !important; }
    }
    @media only screen and (max-width: 520px) {
      .email-card { padding: 20px !important; }
      .email-cta { display: block !important; text-align: center !important; }
    }
  </style>
</head>
<body class="email-body" style="margin:0;padding:0;background:#f7f7f5;color:#111;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  ${hiddenPreheader}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f7f5;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;">
          <tr>
            <td style="padding:0 0 20px;text-align:center;">
              <p style="margin:0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#666;">Tellus · UNBLCK</p>
              <p style="margin:6px 0 0;font-size:20px;font-weight:600;color:#111;">Tellus Blockchain Hub STGO</p>
            </td>
          </tr>
          <tr>
            <td class="email-card" style="background:#fff;border-radius:16px;padding:28px 24px;border:1px solid #ecece7;">
              ${body}
            </td>
          </tr>
          <tr>
            <td class="email-muted" style="padding:20px 8px 0;text-align:center;font-size:12px;line-height:1.5;color:#888;">
              <p style="margin:0 0 8px;">Recibiste este correo porque interactuaste con UNBLCK / Tellus Hub.</p>
              <p style="margin:0;">— El equipo de UNBLCK</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function emailCta(href: string, label: string): string {
  return `<a href="${href}" class="email-cta" style="display:inline-block;background:#000;color:#E1E0CC;padding:12px 24px;border-radius:9999px;text-decoration:none;font-weight:500;margin:8px 0 16px;">${label}</a>`;
}

export function emailParagraph(text: string): string {
  return `<p style="font-size:16px;line-height:1.5;margin:0 0 16px;">${text}</p>`;
}
