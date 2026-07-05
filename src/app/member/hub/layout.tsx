import { ReactNode } from "react";
import { HubNavbar } from "@/components/HubNavbar";

export default function HubLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#d4a574]">
      <HubNavbar />
      <main className="pt-4">{children}</main>
    </div>
  );
}
