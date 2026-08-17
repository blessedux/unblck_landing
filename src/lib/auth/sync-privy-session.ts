import { getIdentityToken } from "@privy-io/react-auth";
import { createClient } from "@/lib/supabase/client";
import {
  clearPendingGoogleProfile,
  readPendingGoogleProfile,
  setOAuthInFlight,
} from "@/lib/auth/google-profile";

/**
 * Exchange a Privy identity token for a Supabase session.
 * Avatar enrichment runs async via GoogleProfileEnricher — do not block the
 * handoff waiting for OAuth tokens (that delay felt like an extra awkward step).
 */
export async function syncPrivyToSupabase(): Promise<void> {
  const idToken = await getIdentityToken();
  if (!idToken) {
    throw new Error(
      "Missing Privy identity token. In the Privy dashboard, enable “Return user data in an identity token” under User management → Authentication → Advanced.",
    );
  }

  // Best-effort: if userinfo already landed, seed avatar in the same upsert.
  const pending = readPendingGoogleProfile();

  const response = await fetch("/api/auth/privy-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "privy-id-token": idToken,
    },
    body: JSON.stringify({
      displayName: pending?.name ?? null,
      avatarUrl: pending?.picture ?? null,
    }),
  });
  const json = (await response.json()) as {
    error?: string;
    tokenHash?: string;
  };
  if (!response.ok || !json.tokenHash) {
    throw new Error(json.error || "Could not start Gmail session");
  }

  const supabase = createClient();
  const { error } = await supabase.auth.verifyOtp({
    type: "email",
    token_hash: json.tokenHash,
  });
  if (error) throw error;

  if (pending?.picture || pending?.name) {
    clearPendingGoogleProfile();
  }
  setOAuthInFlight(false);
}
