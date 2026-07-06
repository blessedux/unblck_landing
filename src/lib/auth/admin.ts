export function getAdminEmails(): string[] {
  return (
    process.env.ADMIN_EMAILS?.split(",").map((email) =>
      email.trim().toLowerCase(),
    ) ?? []
  ).filter(Boolean);
}

export function isAdminEmail(email: string): boolean {
  return getAdminEmails().includes(email.trim().toLowerCase());
}

/** Emails that sign in with password instead of magic link */
export function isPasswordLoginEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return (
    isAdminEmail(normalized) || normalized.endsWith("@test.unblck.dev")
  );
}
