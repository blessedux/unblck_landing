"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Map, Home, Grid3x3 } from "lucide-react";

export function HubNavigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/member/hub", label: "Home", icon: Home },
    { href: "/member/hub/rooms", label: "Rooms", icon: Grid3x3 },
    { href: "/member/hub/events", label: "Events", icon: Calendar },
    { href: "/member/hub/tour", label: "Tour", icon: Map },
  ];

  return (
    <>
      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 z-50">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <Icon size={20} />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop top navigation */}
      <nav className="hidden md:block sticky top-0 bg-black border-b border-white/10 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/member/hub"
              className="text-xl font-bold text-white"
            >
              Tellus Hub
            </Link>
            <div className="flex items-center gap-6">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
