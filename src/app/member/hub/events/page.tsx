import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events - Tellus Hub",
  description: "Upcoming events at Tellus Blockchain Hub STGO",
};

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-black mb-6">Events</h1>
      <p className="text-black/60 mb-8">
        Join us for StellarBarrio meetups, workshops, and community events.
      </p>

      {/* Luma Calendar Embed */}
      <div className="rounded-2xl border border-black/10 bg-white/50 overflow-hidden">
        <div className="aspect-[16/10] md:aspect-[16/9] relative">
          <iframe
            src="https://lu.ma/embed/calendar/cal-EXAMPLE123/events"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{
              border: "none",
              borderRadius: "1rem",
            }}
            allowFullScreen
            aria-hidden="false"
            tabIndex={0}
            className="absolute inset-0"
          ></iframe>
        </div>
      </div>

      <div className="mt-8 p-6 rounded-2xl border border-black/10 bg-white/50">
        <h2 className="text-xl font-semibold text-black mb-2">How to RSVP</h2>
        <ol className="list-decimal list-inside text-black/60 space-y-2">
          <li>Click on any event above to view details</li>
          <li>You&apos;ll be redirected to Luma to complete your registration</li>
          <li>Events are free for all Tellus Hub members</li>
          <li>Bring your enthusiasm and join the community!</li>
        </ol>
      </div>

      <div className="mt-6">
        <p className="text-sm text-black/60 text-center">
          Can&apos;t find the event you&apos;re looking for?{" "}
          <a
            href="https://lu.ma/unblck"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:underline"
          >
            Visit our Luma page
          </a>
        </p>
      </div>
    </div>
  );
}
