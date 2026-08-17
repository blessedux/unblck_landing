"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GoogleAvatar } from "@/components/GoogleAvatar";
import { PROFILE_UPDATED_EVENT } from "@/lib/auth/google-profile";
import { useLocale } from "@/contexts/LocaleContext";

type ProfilePayload = {
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Bottom-left identity card on authenticated apply forms. */
export function ApplyUserCard() {
  const { t } = useLocale();
  const [profile, setProfile] = useState<ProfilePayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    let timer: number | undefined;

    const load = async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) return;
      const data = (await res.json()) as ProfilePayload;
      if (cancelled) return;
      setProfile(data);
      if (!data.avatarUrl && tries < 16) {
        tries += 1;
        timer = window.setTimeout(() => {
          void load();
        }, 700);
      }
    };

    const onUpdated = (event: Event) => {
      const detail = (event as CustomEvent<Partial<ProfilePayload>>).detail;
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              avatarUrl:
                detail?.avatarUrl !== undefined
                  ? detail.avatarUrl ?? null
                  : prev.avatarUrl,
              displayName:
                detail?.displayName !== undefined
                  ? detail.displayName ?? null
                  : prev.displayName,
            }
          : prev,
      );
      if (detail?.avatarUrl) {
        tries = 99;
        if (timer) window.clearTimeout(timer);
      }
    };

    void load();
    window.addEventListener(PROFILE_UPDATED_EVENT, onUpdated);
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      window.removeEventListener(PROFILE_UPDATED_EVENT, onUpdated);
    };
  }, []);

  const name =
    profile?.displayName?.trim() ||
    profile?.email?.split("@")[0] ||
    t.profile.cardFallback;

  return (
    <Link
      href="/profile"
      className="fixed bottom-5 left-6 z-[110] flex max-w-[min(16rem,calc(100vw-5.5rem))] items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-3 py-2.5 text-left shadow-lg backdrop-blur-md transition hover:bg-white/15 max-[480px]:bottom-4 max-[480px]:left-4"
      aria-label={t.profile.openProfile}
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white/15">
        {profile?.avatarUrl ? (
          <GoogleAvatar src={profile.avatarUrl} />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-white">
            {getInitials(name) || "?"}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">{name}</p>
        <p className="truncate text-[11px] text-white/55">{t.profile.viewProfile}</p>
      </div>
    </Link>
  );
}
