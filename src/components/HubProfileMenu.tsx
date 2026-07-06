"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { LogOut, User } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type MemberData = {
  full_name: string;
  email: string;
  tier: "Builder" | "Founder";
  passport_username: string | null;
  passport_verified: boolean;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type HubProfileMenuProps = {
  className?: string;
};

export function HubProfileMenu({ className = "" }: HubProfileMenuProps) {
  const { locale, setLocale, t } = useLocale();
  const [profileOpen, setProfileOpen] = useState(false);
  const [member, setMember] = useState<MemberData | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      const res = await fetch("/api/hub/member");
      if (res.ok) {
        setMember(await res.json());
      }
    };
    fetchMember();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const passportLabel = member?.passport_verified
    ? member.passport_username
      ? `@${member.passport_username.replace(/^@/, "")}`
      : t.memberHub.profile.stellarPassport
    : t.memberHub.profile.notVerified;

  const setLanguage = (nextLocale: Locale) => {
    setLocale(nextLocale);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setProfileOpen(!profileOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-black/70 transition hover:bg-black/80"
        aria-label="Profile menu"
        aria-expanded={profileOpen}
      >
        <Image
          src="/passport.svg"
          alt=""
          width={22}
          height={22}
          className="shrink-0 brightness-0 invert"
        />
      </button>

      {profileOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setProfileOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg">
            <div className="border-b border-black/10 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/10">
                  {member && getInitials(member.full_name) ? (
                    <span className="text-sm font-semibold text-black">
                      {getInitials(member.full_name)}
                    </span>
                  ) : (
                    <User size={18} className="text-black/60" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-black">
                    {member?.full_name || "..."}
                  </p>
                  <p className="text-sm text-black/60">
                    {member?.tier || "..."}
                  </p>
                </div>
              </div>
            </div>

            <div className="py-2">
              <a
                href="https://demo.stellarpassport.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-black transition hover:bg-black/5"
              >
                <Image
                  src="/passport.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="shrink-0"
                />
                <span className="min-w-0 flex-1 truncate">
                  {t.memberHub.profile.stellarPassport}
                </span>
                <span className="text-xs text-black/50">{passportLabel}</span>
              </a>
            </div>

            <div className="border-t border-black/10 px-4 py-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-black/50">
                {t.memberHub.profile.language}
              </p>
              <div className="flex gap-2">
                {(["en", "es"] as const).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLanguage(code)}
                    className={cn(
                      "min-h-9 flex-1 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                      locale === code
                        ? "border-black bg-black text-white"
                        : "border-black/15 text-black/70 hover:border-black/30",
                    )}
                  >
                    {code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-black/10 py-2">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-black transition hover:bg-black/5 disabled:opacity-50"
              >
                <LogOut size={16} />
                {loggingOut
                  ? t.memberHub.profile.loggingOut
                  : t.memberHub.profile.logout}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
