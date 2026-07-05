import { ReactNode } from "react";
import { HubNavbar } from "@/components/HubNavbar";
import { MobileSwipeNavigation } from "@/components/MobileSwipeNavigation";

export default function HubLayout({ children }: { children: ReactNode }) {
  return (
    <MobileSwipeNavigation>
      <div className="min-h-screen bg-[#d4a574]">
        <HubNavbar />
        <main className="pt-4">{children}</main>
      </div>
    </MobileSwipeNavigation>
  );
}
