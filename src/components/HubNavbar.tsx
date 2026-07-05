"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut } from "lucide-react";

export function HubNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user email for profile display
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

  return (
    <>
      {/* Desktop Navigation - Centered like landing page */}
      <nav className="hidden md:block sticky top-0 bg-[#d4a574] border-b border-black/10 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-black">
              UNBLCK
            </Link>

            {/* Centered nav items */}
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

            {/* Profile Dropdown */}
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

      {/* Mobile Navigation - Center Menu */}
      <nav className="md:hidden fixed top-0 left-0 right-0 bg-[#d4a574] border-b border-black/10 z-50">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/" className="text-xl font-bold text-black">
            UNBLCK
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition"
          >
            {menuOpen ? (
              <X size={20} className="text-black" />
            ) : (
              <Menu size={20} className="text-black" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {menuOpen && (
          <div className="fixed inset-0 top-16 bg-[#d4a574] z-40">
            <div className="flex flex-col items-center justify-center h-full gap-8 p-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`text-2xl font-medium transition-colors ${
                      isActive ? "text-black" : "text-black/60"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="mt-8 pt-8 border-t border-black/10 w-full text-center">
                <p className="text-sm text-black/60 mb-4">
                  {userEmail || "Loading..."}
                </p>
                <a
                  href="https://demo.stellarpassport.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mb-3 text-sm text-black hover:text-black/60"
                >
                  View Stellar Passport
                </a>
                <Link
                  href="/"
                  className="block text-sm text-black hover:text-black/60"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
