"use client";

import { useState } from "react";
import { useLoginWithOAuth, usePrivy } from "@privy-io/react-auth";
import { setOAuthInFlight } from "@/lib/auth/google-profile";
import { syncPrivyToSupabase } from "@/lib/auth/sync-privy-session";
import { useLocale } from "@/contexts/LocaleContext";

type PrivyGoogleButtonProps = {
  onBusyChange?: (busy: boolean) => void;
  onSynced?: () => void;
};

export function PrivyGoogleButton({
  onBusyChange,
  onSynced,
}: PrivyGoogleButtonProps) {
  const { t } = useLocale();
  const { ready } = usePrivy();
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const { loading, initOAuth } = useLoginWithOAuth({
    onComplete: async () => {
      setSyncing(true);
      onBusyChange?.(true);
      try {
        await syncPrivyToSupabase();
        onSynced?.();
      } catch (err) {
        setOAuthInFlight(false);
        setError(err instanceof Error ? err.message : t.login.errorGeneric);
        onBusyChange?.(false);
      } finally {
        setSyncing(false);
      }
    },
    onError: () => {
      setOAuthInFlight(false);
      onBusyChange?.(false);
      setError(t.login.errorGeneric);
    },
  });

  const busy = !ready || loading || syncing;

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          setError(null);
          setOAuthInFlight(true);
          onBusyChange?.(true);
          void initOAuth({ provider: "google" }).catch(() => {
            setOAuthInFlight(false);
            onBusyChange?.(false);
            setError(t.login.errorGeneric);
          });
        }}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50 disabled:opacity-50"
      >
        <GoogleMark />
        {t.login.continueWithGoogle}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.9v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.71A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.17.26-1.71V4.96H.9A9 9 0 0 0 0 9c0 1.45.35 2.82.9 4.04l3.07-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .9 4.96l3.07 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}
