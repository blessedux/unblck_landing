"use client";

import { ReactNode } from "react";
import { HubNavbar } from "@/components/HubNavbar";
import { HubDesktopFooter } from "@/components/HubDesktopFooter";
import { HubBackground } from "@/components/HubBackground";
import { HubToastProvider } from "@/components/HubToastProvider";

export function HubMemberLayout({ children }: { children: ReactNode }) {
  return (
    <HubToastProvider>
      <div className="relative flex min-h-screen flex-col">
        <HubBackground />
        <HubNavbar />
        <main className="relative flex-1 pt-14 md:pt-0">{children}</main>
        <HubDesktopFooter />
      </div>
    </HubToastProvider>
  );
}
