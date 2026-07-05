import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Tellus Hub - Home",
  description: "Welcome to Tellus Blockchain Hub STGO",
};

export default function HubHomePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-white mb-6">
        Welcome to Tellus Hub
      </h1>

      <div className="space-y-4">
        <Link href="/member/hub/rooms">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors cursor-pointer">
            <h2 className="text-xl font-semibold text-white mb-2">
              Book a Room
            </h2>
            <p className="text-gray-400">
              Reserve meeting rooms, phone booths, or the podcast studio
            </p>
          </div>
        </Link>

        <Link href="/member/hub/events">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors cursor-pointer">
            <h2 className="text-xl font-semibold text-white mb-2">Events</h2>
            <p className="text-gray-400">
              Discover upcoming StellarBarrio meetups and workshops
            </p>
          </div>
        </Link>

        <Link href="/member/hub/tour">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors cursor-pointer">
            <h2 className="text-xl font-semibold text-white mb-2">
              Santiago Tour
            </h2>
            <p className="text-gray-400">
              Explore curated locations and collect rewards
            </p>
          </div>
        </Link>

        <div className="pt-4">
          <Link href="/member">
            <Button
              variant="outline"
              className="w-full rounded-full border-white/20 text-white hover:bg-white/10"
            >
              Back to Member Area
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
