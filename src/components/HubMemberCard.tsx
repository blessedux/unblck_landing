"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

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

export function HubMemberCard() {
  const { t } = useLocale();
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch("/api/hub/member");
        if (res.ok) {
          setMember(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white/50 p-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black/10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 rounded bg-black/10" />
            <div className="h-3 w-32 rounded bg-black/10" />
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return null;
  }

  const passportLabel = member.passport_verified
    ? member.passport_username
      ? `@${member.passport_username.replace(/^@/, "")}`
      : t.memberHub.profile.stellarPassport
    : t.memberHub.profile.notVerified;

  return (
    <div className="rounded-2xl border border-black/10 bg-white/50 p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 shrink-0 rounded-full bg-black/10 flex items-center justify-center overflow-hidden">
          {getInitials(member.full_name) ? (
            <span className="text-sm font-semibold text-black">
              {getInitials(member.full_name)}
            </span>
          ) : (
            <User size={18} className="text-black/60" />
          )}
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-black truncate">{member.full_name}</p>
          <a
            href="https://demo.stellarpassport.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-black/60 hover:text-black transition-colors"
          >
            {member.tier} · {t.memberHub.profile.stellarPassport} ({passportLabel}) →
          </a>
        </div>
      </div>
    </div>
  );
}
