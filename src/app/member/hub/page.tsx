"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { HubMenuLinks } from "@/components/HubMenuLinks";
import { BookingCalendar } from "@/components/BookingCalendar";
import { CoffeeBadge } from "@/components/CoffeeBadge";
import Link from "next/link";

export default function HubHomePage() {
  const isMobile = useIsMobile();

  // On mobile, show center flip menu
  if (isMobile) {
    return <HubMenuLinks />;
  }

  // On desktop, show full dashboard
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <CoffeeBadge />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black mb-4">
          Hub Access Schedule
        </h2>
        <p className="text-black/60 mb-4">
          Book your hub access days (3 days per week for Builders, unlimited for
          Founders)
        </p>
        <BookingCalendar />
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-black mb-6">Quick Access</h2>
        <div className="space-y-4">
          <Link href="/member/hub/rooms">
            <div className="rounded-2xl border border-black/10 bg-white/50 p-6 hover:bg-white/70 transition-colors cursor-pointer">
              <h3 className="text-xl font-semibold text-black mb-2">
                Book a Room
              </h3>
              <p className="text-black/60">
                Reserve meeting rooms, phone booths, or the podcast studio
              </p>
            </div>
          </Link>

          <Link href="/member/hub/events">
            <div className="rounded-2xl border border-black/10 bg-white/50 p-6 hover:bg-white/70 transition-colors cursor-pointer">
              <h3 className="text-xl font-semibold text-black mb-2">Events</h3>
              <p className="text-black/60">
                Discover upcoming StellarBarrio meetups and workshops
              </p>
            </div>
          </Link>

          <Link href="/member/hub/tour">
            <div className="rounded-2xl border border-black/10 bg-white/50 p-6 hover:bg-white/70 transition-colors cursor-pointer">
              <h3 className="text-xl font-semibold text-black mb-2">
                Santiago Tour
              </h3>
              <p className="text-black/60">
                Explore curated locations and collect rewards
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
