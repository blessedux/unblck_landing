"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function HubNavbar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [profileOpen, setProfileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

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

  const navItems = [
    { href: "/member/hub", label: "Home" },
    { href: "/member/hub/rooms", label: "Rooms" },
    { href: "/member/hub/events", label: "Events" },
    { href: "/member/hub/tour", label: "Tour" },
  ];

  // Hide navbar on mobile menu page
  if (isMobile && pathname === "/member/hub") {
    return null;
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block sticky top-0 bg-[#d4a574] border-b border-black/10 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-black">
              UNBLCK
            </Link>

            <div className="flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors ${
                      isActive ? "text-black" : "text-black/60 hover:text-black"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition"
              >
                <User size={20} className="text-black" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg border border-black/10 overflow-hidden">
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
                      <User size={16} />
                      View Stellar Passport
                    </a>
                    <Link
                      href="/"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-black hover:bg-black/5 transition"
                    >
                      <LogOut size={16} />
                      Back to Home
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Simple back link, no burger menu */}
      {isMobile && pathname !== "/member/hub" && (
        <div className="md:hidden fixed top-0 left-0 right-0 bg-[#d4a574] border-b border-black/10 z-50">
          <div className="flex items-center justify-between h-16 px-4">
            <Link
              href="/member/hub"
              className="text-sm font-medium text-black hover:text-black/60 transition"
            >
              ← Menu
            </Link>
            <Link href="/" className="text-xl font-bold text-black">
              UNBLCK
            </Link>
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>
        </div>
      )}
    </>
  );
}
