import { ReactNode } from "react";
import { HubNavbar } from "@/components/HubNavbar";
import { HubDesktopFooter } from "@/components/HubDesktopFooter";
import { HubBackground } from "@/components/HubBackground";

export default function HubLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <HubBackground />
      <HubNavbar />
      <main className="relative flex-1 pt-4 md:pt-0">{children}</main>
      <HubDesktopFooter />
    </div>
  );
}
