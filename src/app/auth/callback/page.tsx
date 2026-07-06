"use client";

import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

/** Reject if the underlying auth call hangs (Brave/Android can stall on storage). */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error("Login timed out. Please try the link again.")),
        ms,
      ),
    ),
  ]);
}

function AuthCallbackHandler() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const next = searchParams.get("next") ?? "/member";

    async function finishLogin() {
      try {
        const code = searchParams.get("code");

        if (code) {
          const { error: exchangeError } = await withTimeout(
            supabase.auth.exchangeCodeForSession(code),
            15000,
          );
          if (exchangeError) throw exchangeError;
        } else {
          const hash = window.location.hash.startsWith("#")
            ? window.location.hash.slice(1)
            : window.location.hash;
          const hashParams = new URLSearchParams(hash);
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");

          if (!accessToken || !refreshToken) {
            throw new Error("Missing auth credentials in callback URL.");
          }

          const { error: sessionError } = await withTimeout(
            supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            }),
            15000,
          );
          if (sessionError) throw sessionError;
        }

        // Confirm the session actually persisted before we hand off to
        // middleware — Brave can block cookie/storage writes silently.
        const {
          data: { session },
        } = await withTimeout(supabase.auth.getSession(), 15000);

        if (!session) {
          throw new Error(
            "Your browser blocked the login session. Disable Shields for this site or try another browser.",
          );
        }

        // Hard navigation so the server middleware re-reads the auth cookies.
        window.location.assign(next);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not complete login.",
        );
      }
    }

    void finishLogin();
  }, [searchParams]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="max-w-md text-center">
          <p className="mb-4 text-red-400">{error}</p>
          <a href="/login" className="text-white underline">
            Back to login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <p className="text-white/70">Signing you in...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
          <p className="text-white/70">Signing you in...</p>
        </div>
      }
    >
      <AuthCallbackHandler />
    </Suspense>
  );
}
