import { ReactNode } from "react";
import { HubNavigation } from "@/components/HubNavigation";

export default function HubLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <HubNavigation />
      <main className="pb-20 md:pb-0">{children}</main>
    </div>
  );
}
