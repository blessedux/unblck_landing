"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { createClient } from "@/lib/supabase/client";
import { isPrivyConfigured } from "@/lib/auth/privy-public";
import { useLocale } from "@/contexts/LocaleContext";

type LogoutButtonProps = {
  /** Where to land after sign-out (apply login gate or /login). */
  redirectTo?: string;
  className?: string;
  variant?: "light" | "dark";
};

async function clearSessions(logoutPrivy?: () => Promise<void>) {
  try {
    await logoutPrivy?.();
  } catch (error) {
    console.error("Privy logout error:", error);
  }
  const supabase = createClient();
  await supabase.auth.signOut();
}

function LogoutButtonInner({
  redirectTo = "/login",
  className,
  variant = "light",
}: LogoutButtonProps) {
  const { t } = useLocale();
  const { logout, authenticated } = usePrivy();
  const [loggingOut, setLoggingOut] = useState(false);

  const onLogout = async () => {
    setLoggingOut(true);
    try {
      await clearSessions(authenticated ? logout : undefined);
      window.location.href = redirectTo;
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  };

  const base =
    variant === "light"
      ? "text-sm font-medium text-gray-500 transition hover:text-gray-900 disabled:opacity-50"
      : "text-sm font-medium text-muted transition hover:text-foreground disabled:opacity-50";

  return (
    <button
      type="button"
      onClick={() => {
        void onLogout();
      }}
      disabled={loggingOut}
      className={className ?? base}
    >
      {loggingOut ? t.profile.loggingOut : t.profile.logout}
    </button>
  );
}

function LogoutButtonWithoutPrivy({
  redirectTo = "/login",
  className,
  variant = "light",
}: LogoutButtonProps) {
  const { t } = useLocale();
  const [loggingOut, setLoggingOut] = useState(false);

  const onLogout = async () => {
    setLoggingOut(true);
    try {
      await clearSessions();
      window.location.href = redirectTo;
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  };

  const base =
    variant === "light"
      ? "text-sm font-medium text-gray-500 transition hover:text-gray-900 disabled:opacity-50"
      : "text-sm font-medium text-muted transition hover:text-foreground disabled:opacity-50";

  return (
    <button
      type="button"
      onClick={() => {
        void onLogout();
      }}
      disabled={loggingOut}
      className={className ?? base}
    >
      {loggingOut ? t.profile.loggingOut : t.profile.logout}
    </button>
  );
}

/** Signs out of Privy (if configured) + Supabase, then hard-redirects to login. */
export function LogoutButton(props: LogoutButtonProps) {
  if (isPrivyConfigured()) {
    return <LogoutButtonInner {...props} />;
  }
  return <LogoutButtonWithoutPrivy {...props} />;
}
