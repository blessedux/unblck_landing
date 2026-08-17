"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { AcceleratorProfileCardSkeleton } from "@/components/AcceleratorProfileHandoff";
import { LoginPage } from "@/components/ui/sign-in-page";
import { createClient } from "@/lib/supabase/client";
import { isOAuthInFlight, setOAuthInFlight } from "@/lib/auth/google-profile";
import { isPrivyConfigured } from "@/lib/auth/privy-public";
import { syncPrivyToSupabase } from "@/lib/auth/sync-privy-session";

type ApplyAuthGateProps = {
  /** Path to return to after magic-link auth (e.g. /apply). */
  nextPath: string;
  children: (ctx: { email: string; userId: string }) => ReactNode;
};

/**
 * Requires a Supabase session before rendering the application form.
 * Unauthenticated visitors see the sign-in step (Gmail via Privy + magic link).
 *
 * Post-Gmail handoff renders the step-1 profile skeleton (no spinner pages / copy).
 */
export function ApplyAuthGate(props: ApplyAuthGateProps) {
  if (isPrivyConfigured()) {
    return <ApplyAuthGateWithPrivy {...props} />;
  }
  return <ApplyAuthGateBody {...props} />;
}

function ApplyAuthGateWithPrivy(props: ApplyAuthGateProps) {
  const { ready, authenticated } = usePrivy();
  return (
    <ApplyAuthGateBody
      {...props}
      privyReady={ready}
      privyAuthenticated={authenticated}
    />
  );
}

type ApplyAuthGateBodyProps = ApplyAuthGateProps & {
  privyReady?: boolean;
  privyAuthenticated?: boolean;
};

function SilentCanvas() {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black"
      aria-busy="true"
      aria-hidden
    />
  );
}

function ApplyAuthGateBody({
  nextPath,
  children,
  privyReady = true,
  privyAuthenticated = false,
}: ApplyAuthGateBodyProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [oauthReturn, setOauthReturn] = useState(() =>
    typeof window !== "undefined" ? isOAuthInFlight() : false,
  );
  const [privySyncFailed, setPrivySyncFailed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const syncingRef = useRef(false);

  useEffect(() => {
    setOauthReturn(isOAuthInFlight());
    setMounted(true);
  }, []);

  // Grace timeout if Privy never flips authenticated after Google return.
  useEffect(() => {
    if (!oauthReturn) return;
    if (privyAuthenticated || email) return;
    if (!privyReady) return;

    const timer = window.setTimeout(() => {
      setOauthReturn(false);
      setOAuthInFlight(false);
      setChecking(false);
    }, 8000);

    return () => window.clearTimeout(timer);
  }, [oauthReturn, privyReady, privyAuthenticated, email]);

  useEffect(() => {
    if (!mounted) return;

    let cancelled = false;
    const supabase = createClient();

    async function loadSession() {
      if (!privyReady) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) return;

      if (user?.email) {
        setEmail(user.email);
        setUserId(user.id);
        setChecking(false);
        setOauthReturn(false);
        setOAuthInFlight(false);
        setPrivySyncFailed(false);
        return;
      }

      if (privyAuthenticated) {
        if (syncingRef.current) return;
        syncingRef.current = true;
        try {
          await syncPrivyToSupabase();
          if (cancelled) return;
          const {
            data: { user: synced },
          } = await supabase.auth.getUser();
          if (synced?.email) {
            setEmail(synced.email);
            setUserId(synced.id);
            setChecking(false);
            setOauthReturn(false);
            setOAuthInFlight(false);
            setPrivySyncFailed(false);
            return;
          }
          if (!cancelled) {
            setPrivySyncFailed(true);
            setOauthReturn(false);
            setOAuthInFlight(false);
            setChecking(false);
          }
        } catch (error) {
          console.error("Privy session sync error:", error);
          if (!cancelled) {
            setPrivySyncFailed(true);
            setOauthReturn(false);
            setOAuthInFlight(false);
            setChecking(false);
          }
        } finally {
          syncingRef.current = false;
        }
        return;
      }

      if (!cancelled && !oauthReturn && !isOAuthInFlight()) {
        setChecking(false);
      }
    }

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      const user = session?.user;
      if (user?.email) {
        setEmail(user.email);
        setUserId(user.id);
        setOauthReturn(false);
        setOAuthInFlight(false);
        setChecking(false);
      } else if (!isOAuthInFlight()) {
        setEmail(null);
        setUserId(null);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
    // Intentionally omit oauthReturn — flipping it must not re-run sync.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- see above
  }, [privyAuthenticated, privyReady, mounted]);

  if (email && userId) {
    return <>{children({ email, userId })}</>;
  }

  const awaitingPrivySync = privyAuthenticated && !privySyncFailed;
  const showProfileSkeleton =
    oauthReturn || awaitingPrivySync || (mounted && !privyReady && oauthReturn);

  if (showProfileSkeleton) {
    return <AcceleratorProfileCardSkeleton />;
  }

  // Brief silent canvas while we decide login vs form — no spinner / copy.
  if (!mounted || !privyReady || checking) {
    return <SilentCanvas />;
  }

  return <LoginPage nextPath={nextPath} signupHref={nextPath} />;
}
