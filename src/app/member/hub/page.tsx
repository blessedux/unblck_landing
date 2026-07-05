"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { HubMenuLinks } from "@/components/HubMenuLinks";
import { BookingCalendar } from "@/components/BookingCalendar";
import { CoffeeBadge } from "@/components/CoffeeBadge";
import { HubMemberCard } from "@/components/HubMemberCard";

export default function HubHomePage() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <HubMenuLinks />;
  }

  return (
    <div className="grid md:grid-cols-2 min-h-[calc(100vh-8rem)]">
      <div className="border-r border-black/10">
        <HubMenuLinks variant="sidebar" />
      </div>

      <aside className="flex flex-col justify-center px-8 lg:px-12 py-10">
        <div className="mb-6 max-w-md">
          <CoffeeBadge />
        </div>

        <div className="max-w-md w-full">
          <h2 className="text-xl font-bold text-black mb-3">Hub Access</h2>
          <div className="mb-4">
            <HubMemberCard />
          </div>
          <BookingCalendar compact />
        </div>
      </aside>
    </div>
  );
}
