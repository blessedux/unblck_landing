import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events - Tellus Hub",
  description: "Upcoming events at Tellus Blockchain Hub STGO",
};

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-6">Events</h1>
      <p className="text-gray-400 mb-8">
        Events calendar coming soon...
      </p>
    </div>
  );
}
