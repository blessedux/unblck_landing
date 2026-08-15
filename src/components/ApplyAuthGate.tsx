"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { LoginPage } from "@/components/ui/sign-in-page";

type ApplyAuthGateProps = {
  /** Path to return to after magic-link auth (e.g. /apply). */
  nextPath: string;
  children: (ctx: { email: string; userId: string }) => ReactNode;
};

/**
 * Requires a Supabase session before rendering the application form.
 * Unauthenticated visitors see the sign-in step (email → magic link).
 */
export function ApplyAuthGate({ nextPath, children }: ApplyAuthGateProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function loadSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) return;

      if (user?.email) {
        setEmail(user.email);
        setUserId(user.id);
      }
      setChecking(false);
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
      } else {
        setEmail(null);
        setUserId(null);
      }
      setChecking(false);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-black px-6">
        <p className="text-sm text-white/60">Checking sign-in…</p>
      </div>
    );
  }

  if (!email || !userId) {
    return <LoginPage nextPath={nextPath} signupHref={nextPath} />;
  }

  return <>{children({ email, userId })}</>;
}
