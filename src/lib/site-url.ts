export const CANONICAL_SITE_ORIGIN = "https://unblck.cl";

const LEGACY_VERCEL_HOSTS = new Set([
  "unblck-landing.vercel.app",
  "unblck-landing-mentes-projects.vercel.app",
]);

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/$/, "");
}

function hostnameFromUrl(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function isLegacyVercelHost(url: string): boolean {
  const host = hostnameFromUrl(url);
  if (!host) return false;
  return LEGACY_VERCEL_HOSTS.has(host) || host.endsWith(".vercel.app");
}

function resolveCanonicalOrigin(url: string): string {
  if (process.env.VERCEL_ENV === "production" && isLegacyVercelHost(url)) {
    return CANONICAL_SITE_ORIGIN;
  }
  return normalizeSiteUrl(url);
}

/** Production site origin for auth redirects and emails. */
export function getSiteUrl(request?: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return resolveCanonicalOrigin(fromEnv);
  }

  if (request) {
    const origin = request.headers.get("origin");
    if (origin) return resolveCanonicalOrigin(origin);

    const host =
      request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    if (host) {
      const protocol =
        request.headers.get("x-forwarded-proto") ??
        (host.includes("localhost") ? "http" : "https");
      return resolveCanonicalOrigin(`${protocol}://${host}`);
    }
  }

  if (typeof window !== "undefined") {
    return resolveCanonicalOrigin(window.location.origin);
  }

  if (process.env.VERCEL_ENV === "production") {
    return CANONICAL_SITE_ORIGIN;
  }

  return "http://localhost:3000";
}

export function memberAuthCallbackUrl(request?: Request): string {
  return `${getSiteUrl(request)}/auth/callback?next=/member`;
}

/** Force magic links to redirect to our canonical callback URL. */
export function ensureMagicLinkRedirect(
  actionLink: string,
  redirectTo: string,
): string {
  try {
    const url = new URL(actionLink);
    url.searchParams.set("redirect_to", redirectTo);
    return url.toString();
  } catch {
    return actionLink;
  }
}

export function shouldRedirectToCanonicalHost(host: string): boolean {
  const bare = host.split(":")[0]?.toLowerCase() ?? "";
  return LEGACY_VERCEL_HOSTS.has(bare) || bare.endsWith(".vercel.app");
}
