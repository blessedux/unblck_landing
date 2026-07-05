"use client";

import { useEffect, useState } from "react";

type Booking = {
  id: string;
  booking_date: string;
  member_id: string;
  member_profiles: {
    email: string;
    stellar_funded: boolean;
  };
};

type BookingsByDate = {
  [date: string]: {
    ambassadors: string[];
    stellarFunded: string[];
    total: number;
  };
};

export function HubBookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await fetch("/api/admin/bookings");
      if (!response.ok) throw new Error("Failed to load bookings");
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="border border-gray-800 p-6">
        <h2 className="text-xl font-semibold mb-4">Hub Bookings</h2>
        <p className="text-gray-400">Loading bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-gray-800 p-6">
        <h2 className="text-xl font-semibold mb-4">Hub Bookings</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Group bookings by date
  const bookingsByDate: BookingsByDate = bookings.reduce((acc, booking) => {
    const date = booking.booking_date;
    if (!acc[date]) {
      acc[date] = { ambassadors: [], stellarFunded: [], total: 0 };
    }

    if (booking.member_profiles.stellar_funded) {
      acc[date].stellarFunded.push(booking.member_profiles.email);
    } else {
      acc[date].ambassadors.push(booking.member_profiles.email);
    }
    acc[date].total++;

    return acc;
  }, {} as BookingsByDate);

  const sortedDates = Object.keys(bookingsByDate).sort();

  if (sortedDates.length === 0) {
    return (
      <div className="border border-gray-800 p-6">
        <h2 className="text-xl font-semibold mb-4">Hub Bookings</h2>
        <p className="text-gray-400">No upcoming bookings</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-800">
      <div className="border-b border-gray-800 p-4">
        <h2 className="text-xl font-semibold">Hub Bookings</h2>
        <p className="text-sm text-gray-400 mt-1">
          Upcoming scheduled days at the hub
        </p>
      </div>

      <div className="divide-y divide-gray-800">
        {sortedDates.map((date) => {
          const dayData = bookingsByDate[date];
          const dateObj = new Date(date + "T00:00:00");
          const isToday =
            new Date().toISOString().split("T")[0] === date;

          return (
            <div key={date} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">
                    {dateObj.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                    {isToday && (
                      <span className="ml-2 text-xs bg-white/10 px-2 py-1 rounded">
                        Today
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {dayData.total} member{dayData.total !== 1 ? "s" : ""} scheduled
                  </p>
                </div>
              </div>

              {dayData.stellarFunded.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-green-500 mb-2">
                    Stellar Funded ({dayData.stellarFunded.length})
                  </p>
                  <div className="space-y-1">
                    {dayData.stellarFunded.map((email) => (
                      <p key={email} className="text-sm text-gray-300 pl-2">
                        • {email}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {dayData.ambassadors.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-blue-500 mb-2">
                    Ambassadors ({dayData.ambassadors.length})
                  </p>
                  <div className="space-y-1">
                    {dayData.ambassadors.map((email) => (
                      <p key={email} className="text-sm text-gray-300 pl-2">
                        • {email}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
