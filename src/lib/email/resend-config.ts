import { Resend } from "resend";

export function isResendConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() && process.env.RESEND_FROM?.trim(),
  );
}

export function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(apiKey);
}

export function getResendFromAddress(): string {
  const from = process.env.RESEND_FROM?.trim();
  if (!from) {
    throw new Error(
      "RESEND_FROM is not configured — use an address on your verified Resend domain (e.g. UNBLCK <noreply@tellus.foundation>)",
    );
  }
  return from;
}

/** In dev, log email instead of failing when Resend is not fully configured. */
export function shouldSkipResendInDev(): boolean {
  return process.env.NODE_ENV === "development" && !isResendConfigured();
}
