/** Basic email shape check after trim. */
export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
