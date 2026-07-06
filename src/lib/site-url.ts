function normalizeSiteUrl(url: string): string {
  return url.replace(/\/$/, "");
}

/** Production site origin for auth redirects. Prefer NEXT_PUBLIC_SITE_URL in prod. */
export function getSiteUrl(request?: Request): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  }

  if (request) {
    const origin = request.headers.get("origin");
    if (origin) return normalizeSiteUrl(origin);

    const host =
      request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    if (host) {
      const protocol =
        request.headers.get("x-forwarded-proto") ??
        (host.includes("localhost") ? "http" : "https");
      return normalizeSiteUrl(`${protocol}://${host}`);
    }
  }

  if (typeof window !== "undefined") {
    return normalizeSiteUrl(window.location.origin);
  }

  return "http://localhost:3000";
}

export function memberAuthCallbackUrl(request?: Request): string {
  return `${getSiteUrl(request)}/auth/callback?next=/member`;
}
