"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

function HubBrand({
  href = "/",
  className = "",
  titleClassName = "text-xl font-bold text-black",
  subtitleClassName = "text-[11px] text-black/60 mt-0.5 max-w-[240px] leading-snug",
}: {
  href?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}) {
  return (
    <Link href={href} className={cn("group block", className)}>
      <p
        className={cn(
          titleClassName,
          "group-hover:text-black/70 transition-colors"
        )}
      >
        UNBLCK
      </p>
      <p className={subtitleClassName}>
        Tellus Cooperative Blockchain Hub Santiago
      </p>
    </Link>
  );
}

function HubProfileMenu({ className = "" }: { className?: string }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/auth/user");
      if (res.ok) {
        const data = await res.json();
        setUserEmail(data.email);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setProfileOpen(!profileOpen)}
        className="w-10 h-10 rounded-full bg-black/70 flex items-center justify-center hover:bg-black/80 transition"
        aria-label="Profile menu"
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
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg border border-black/10 overflow-hidden z-50">
            <div className="p-4 border-b border-black/10">
              <p className="text-sm text-gray-600">Signed in as</p>
              <p className="text-sm font-medium text-black truncate">
                {userEmail || "Loading..."}
              </p>
            </div>
            <div className="py-2">
              <a
                href="https://demo.stellarpassport.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 text-sm text-black hover:bg-black/5 transition"
              >
                <Image
                  src="/passport.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="shrink-0"
                />
                Stellar Passport
              </a>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-black hover:bg-black/5 transition disabled:opacity-50"
              >
                <LogOut size={16} />
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function HubCenterNav({
  pathname,
  navItems,
}: {
  pathname: string;
  navItems: { href: string; label: string }[];
}) {
  return (
    <nav className="hidden md:block fixed left-1/2 top-0 z-50 -translate-x-1/2">
      <div className="flex w-fit items-center justify-center gap-4 rounded-b-2xl bg-black px-5 py-2 sm:gap-6 sm:px-6 md:rounded-b-3xl md:px-7">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[10px] sm:text-xs md:text-sm font-medium transition-colors",
                isActive ? "text-[#E1E0CC]" : "text-[#E1E0CC]/80 hover:text-[#E1E0CC]"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function HubNavbar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const isHubHome = pathname === "/member/hub";

  const navItems = [
    { href: "/member/hub", label: "Menu" },
    { href: "/member/hub/rooms", label: "Rooms" },
    { href: "/member/hub/events", label: "Events" },
    { href: "/member/hub/tour", label: "Tour" },
  ];

  if (isMobile) {
    if (isHubHome) return null;

    return (
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#d4a574] border-b border-black/10 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/member/hub"
            className="text-sm font-medium text-black hover:text-black/60 transition shrink-0"
          >
            ← Menu
          </Link>
          <HubBrand
            href="/"
            className="text-center"
            titleClassName="text-lg font-bold text-black"
            subtitleClassName="text-[10px] text-black/55 mt-0.5 max-w-[200px] mx-auto leading-snug"
          />
          <div className="w-14 shrink-0" />
        </div>
      </div>
    );
  }

  return (
    <>
      <HubBrand
        href="/"
        className="hidden md:block fixed top-5 left-6 z-50 max-w-[min(240px,calc(50vw-12rem))]"
      />
      <HubCenterNav pathname={pathname} navItems={navItems} />
      <HubProfileMenu className="hidden md:block fixed top-4 right-6 z-50" />
    </>
  );
}
