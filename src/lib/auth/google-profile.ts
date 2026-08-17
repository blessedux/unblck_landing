export const PENDING_GOOGLE_PROFILE_KEY = "unblck.pendingGoogleProfile";
export const PENDING_GOOGLE_ACCESS_TOKEN_KEY = "unblck.pendingGoogleAccessToken";
export const OAUTH_INFLIGHT_KEY = "unblck.oauthInFlight";
export const PROFILE_UPDATED_EVENT = "unblck:profile-updated";

export type GoogleProfileInfo = {
  name?: string;
  picture?: string;
};

export function readPendingGoogleProfile(): GoogleProfileInfo | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(PENDING_GOOGLE_PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GoogleProfileInfo;
  } catch {
    sessionStorage.removeItem(PENDING_GOOGLE_PROFILE_KEY);
    return null;
  }
}

export function writePendingGoogleProfile(info: GoogleProfileInfo): void {
  if (typeof window === "undefined") return;
  if (!info.picture && !info.name) return;
  sessionStorage.setItem(PENDING_GOOGLE_PROFILE_KEY, JSON.stringify(info));
}

export function clearPendingGoogleProfile(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PENDING_GOOGLE_PROFILE_KEY);
}

export function writePendingGoogleAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  const trimmed = token.trim();
  if (!trimmed) return;
  sessionStorage.setItem(PENDING_GOOGLE_ACCESS_TOKEN_KEY, trimmed);
}

export function readPendingGoogleAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(PENDING_GOOGLE_ACCESS_TOKEN_KEY);
}

export function clearPendingGoogleAccessToken(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PENDING_GOOGLE_ACCESS_TOKEN_KEY);
}

export function setOAuthInFlight(active: boolean): void {
  if (typeof window === "undefined") return;
  if (active) sessionStorage.setItem(OAUTH_INFLIGHT_KEY, "1");
  else sessionStorage.removeItem(OAUTH_INFLIGHT_KEY);
}

export function isOAuthInFlight(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(OAUTH_INFLIGHT_KEY) === "1";
}

export function notifyProfileUpdated(payload?: {
  avatarUrl?: string | null;
  displayName?: string | null;
}): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(PROFILE_UPDATED_EVENT, { detail: payload ?? {} }),
  );
}

/** Poll until Google userinfo lands in sessionStorage (OAuth token grant is async). */
export async function waitForPendingGoogleProfile(
  timeoutMs = 2800,
): Promise<GoogleProfileInfo | null> {
  const started = Date.now();
  let last = readPendingGoogleProfile();
  if (last?.picture) return last;

  while (Date.now() - started < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, 120));
    last = readPendingGoogleProfile();
    if (last?.picture) return last;
  }
  return last;
}

export async function fetchGoogleUserInfo(
  accessToken: string,
): Promise<GoogleProfileInfo | null> {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    console.error("Google userinfo failed", res.status);
    return null;
  }
  const json = (await res.json()) as {
    name?: string;
    picture?: string;
  };
  return {
    name: json.name?.trim() || undefined,
    picture: json.picture?.trim() || undefined,
  };
}
