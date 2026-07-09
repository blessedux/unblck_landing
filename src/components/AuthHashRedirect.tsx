"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function hasAuthHash(): boolean {
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  if (!hash) return false;

  const params = new URLSearchParams(hash);
  return params.has("access_token") && params.has("refresh_token");
}

/** Supabase may land magic links on Site URL root with tokens in the hash. */
export function AuthHashRedirect() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/auth/callback") return;

    const search = window.location.search;
    const params = new URLSearchParams(search);

    if (params.has("code")) {
      window.location.replace(`/auth/callback${search}`);
      return;
    }

    if (!hasAuthHash()) return;

    const next = params.get("next") ?? "/member";
    window.location.replace(
      `/auth/callback?next=${encodeURIComponent(next)}${window.location.hash}`,
    );
  }, [pathname]);

  return null;
}
