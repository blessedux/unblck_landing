"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { BookingCalendar } from "@/components/BookingCalendar";
import { CoffeeBadge } from "@/components/CoffeeBadge";
import { HubMemberCard } from "@/components/HubMemberCard";

export function HubHomeAside() {
  const { t } = useLocale();

  return (
    <aside className="flex flex-col px-6 py-8 md:justify-center md:px-8 lg:px-12 md:py-10">
      <div className="mb-6 max-w-md">
        <CoffeeBadge />
      </div>

      <div className="w-full max-w-md">
        <h2 className="mb-3 text-xl font-bold text-black">
          {t.memberHub.home.hubAccess}
        </h2>
        <div className="mb-4 hidden md:block">
          <HubMemberCard />
        </div>
        <BookingCalendar compact />
      </div>
    </aside>
  );
}
