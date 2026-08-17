/** Relative paths allowed after magic-link / apply auth. */
const ALLOWED_PREFIXES = [
  "/member",
  "/admin",
  "/apply",
  "/accelerator/apply",
  "/insta-awards/apply",
  "/profile",
  "/submissions",
  "/founders",
] as const;

export function isApplyNextPath(path: string): boolean {
  return (
    path === "/apply" ||
    path.startsWith("/apply?") ||
    path === "/accelerator/apply" ||
    path.startsWith("/accelerator/apply?") ||
    path === "/insta-awards/apply" ||
    path.startsWith("/insta-awards/apply?")
  );
}

export function sanitizeNextPath(
  next: string | null | undefined,
  fallback = "/member",
): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }

  const pathOnly = next.split("?")[0] ?? next;
  const allowed = ALLOWED_PREFIXES.some(
    (prefix) => pathOnly === prefix || pathOnly.startsWith(`${prefix}/`),
  );

  return allowed ? next : fallback;
}
