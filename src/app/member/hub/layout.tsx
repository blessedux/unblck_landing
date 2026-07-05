import { ReactNode } from "react";
import { HubNavbar } from "@/components/HubNavbar";
import { MobileSwipeNavigation } from "@/components/MobileSwipeNavigation";
import { HubDesktopFooter } from "@/components/HubDesktopFooter";
import { HubBackground } from "@/components/HubBackground";

export default function HubLayout({ children }: { children: ReactNode }) {
  return (
    <MobileSwipeNavigation>
      <div className="relative min-h-screen flex flex-col">
        <HubBackground />
        <HubNavbar />
        <main className="relative flex-1 md:pt-0 pt-4">{children}</main>
        <HubDesktopFooter />
      </div>
    </MobileSwipeNavigation>
  );
}
