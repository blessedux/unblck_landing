"use client";

import { useEffect } from "react";
import { useOAuthTokens, usePrivy } from "@privy-io/react-auth";
import {
  clearPendingGoogleAccessToken,
  clearPendingGoogleProfile,
  fetchGoogleUserInfo,
  notifyProfileUpdated,
  readPendingGoogleAccessToken,
  readPendingGoogleProfile,
  writePendingGoogleAccessToken,
  writePendingGoogleProfile,
} from "@/lib/auth/google-profile";
import { isPrivyConfigured } from "@/lib/auth/privy-public";

type ProfilePayload = {
  email?: string;
  displayName?: string | null;
  avatarUrl?: string | null;
};

async function patchFromPendingInfo(): Promise<boolean> {
  const info = readPendingGoogleProfile();
  if (!info) return false;

  const profileRes = await fetch("/api/profile");
  if (!profileRes.ok) return false;

  const current = (await profileRes.json()) as ProfilePayload;

  const patch: { displayName?: string; avatarUrl?: string } = {};
  if (info.picture && info.picture !== current.avatarUrl) {
    patch.avatarUrl = info.picture;
  }

  const localPart = current.email?.split("@")[0];
  const nameIsPlaceholder =
    !current.displayName?.trim() ||
    current.displayName === localPart ||
    current.displayName === "User" ||
    current.displayName === "Usuario";
  if (info.name?.trim() && nameIsPlaceholder) {
    patch.displayName = info.name.trim();
  }

  if (!patch.avatarUrl && !patch.displayName) {
    clearPendingGoogleProfile();
    return true;
  }

  const patchRes = await fetch("/api/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (patchRes.ok) {
    const updated = (await patchRes.json()) as ProfilePayload;
    clearPendingGoogleProfile();
    notifyProfileUpdated({
      avatarUrl: updated.avatarUrl,
      displayName: updated.displayName,
    });
    return true;
  }
  return false;
}

async function enrichFromAccessToken(): Promise<boolean> {
  const accessToken = readPendingGoogleAccessToken();
  if (!accessToken) return false;

  const res = await fetch("/api/profile/google-avatar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken }),
  });

  if (res.status === 401) return false;

  if (res.ok) {
    const updated = (await res.json()) as ProfilePayload;
    clearPendingGoogleAccessToken();
    clearPendingGoogleProfile();
    notifyProfileUpdated({
      avatarUrl: updated.avatarUrl,
      displayName: updated.displayName,
    });
    return true;
  }

  // Token invalid / no picture — stop retrying this token.
  if (res.status === 422 || res.status === 400) {
    clearPendingGoogleAccessToken();
    return true;
  }
  return false;
}

async function flushGoogleProfile(): Promise<boolean> {
  const fromToken = await enrichFromAccessToken();
  if (fromToken) return true;
  return patchFromPendingInfo();
}

/**
 * Captures Google name/picture on OAuth grant and retries until a Supabase
 * session exists so the avatar lands in user_profiles.
 *
 * Requires Privy “custom Google OAuth credentials” + “Return OAuth tokens”
 * for access tokens to be returned; without them this is a no-op.
 */
function GoogleProfileEnricherInner() {
  const { ready, authenticated } = usePrivy();

  useOAuthTokens({
    onOAuthTokenGrant: ({ oAuthTokens }) => {
      if (oAuthTokens.provider !== "google" || !oAuthTokens.accessToken) return;

      writePendingGoogleAccessToken(oAuthTokens.accessToken);

      void (async () => {
        try {
          const info = await fetchGoogleUserInfo(oAuthTokens.accessToken);
          if (info?.picture || info?.name) {
            writePendingGoogleProfile(info);
          }
          for (let i = 0; i < 30; i++) {
            const done = await flushGoogleProfile();
            if (done) return;
            await new Promise((resolve) => setTimeout(resolve, 350));
          }
        } catch (error) {
          console.error("Google profile enrich error:", error);
        }
      })();
    },
  });

  useEffect(() => {
    if (!ready || !authenticated) return;
    void flushGoogleProfile();
  }, [authenticated, ready]);

  return null;
}

export function GoogleProfileEnricher() {
  if (!isPrivyConfigured()) return null;
  return <GoogleProfileEnricherInner />;
}
