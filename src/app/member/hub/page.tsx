import { HubMenuLinks } from "@/components/HubMenuLinks";
import { BookingCalendar } from "@/components/BookingCalendar";
import { CoffeeBadge } from "@/components/CoffeeBadge";
import { HubMemberCard } from "@/components/HubMemberCard";

export default function HubHomePage() {
  return (
    <div className="grid min-h-[calc(100vh-8rem)] md:grid-cols-2">
      <div className="md:border-r md:border-black/10">
        <div className="md:hidden">
          <HubMenuLinks variant="stack" />
        </div>
        <div className="hidden md:block">
          <HubMenuLinks variant="sidebar" />
        </div>
      </div>

      <aside className="flex flex-col px-6 py-8 md:justify-center md:px-8 lg:px-12 md:py-10">
        <div className="mb-6 max-w-md">
          <CoffeeBadge />
        </div>

        <div className="w-full max-w-md">
          <h2 className="mb-3 text-xl font-bold text-black">Hub Access</h2>
          <div className="mb-4">
            <HubMemberCard />
          </div>
          <BookingCalendar compact />
        </div>
      </aside>
    </div>
  );
}
