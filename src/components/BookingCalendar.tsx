"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type BookingData = {
  bookings: string[];
  credits: {
    total: number;
    used: number;
    remaining: number;
  };
  tier: "ambassador" | "stellar_funded";
};

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days;
}

export function BookingCalendar() {
  const router = useRouter();
  const [data, setData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const days = getDaysInMonth(currentYear, currentMonth);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await fetch("/api/bookings");
      if (!response.ok) throw new Error("Failed to load bookings");
      const json = (await response.json()) as BookingData;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (date: Date) => {
    setActionLoading(true);
    setError(null);

    try {
      const dateStr = date.toISOString().split("T")[0];
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_date: dateStr }),
      });

      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.error || "Booking failed");
      }

      await loadBookings();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (date: Date) => {
    setActionLoading(true);
    setError(null);

    try {
      const dateStr = date.toISOString().split("T")[0];
      const response = await fetch(`/api/bookings/${dateStr}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Cancel failed");
      }

      await loadBookings();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="border border-gray-800 p-6">
        <p className="text-gray-400">Loading bookings...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="border border-gray-800 p-6">
        <p className="text-red-500">Failed to load bookings</p>
      </div>
    );
  }

  const isUnlimited = data.tier === "stellar_funded";

  return (
    <div className="border border-gray-800 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Hub Bookings</h2>
        <div className="text-right">
          {isUnlimited ? (
            <p className="text-sm text-green-500">Unlimited Access</p>
          ) : (
            <p className="text-sm text-gray-400">
              {data.credits.remaining} of {data.credits.total} credits left this
              week
            </p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-medium">
          {today.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-500">{error}</p>
      )}

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs text-gray-500 py-2">
            {day}
          </div>
        ))}

        {days.map((day) => {
          const dateStr = day.toISOString().split("T")[0];
          const isBooked = data.bookings.includes(dateStr);
          const isPast = day < today && day.toDateString() !== today.toDateString();
          const isToday = day.toDateString() === today.toDateString();

          return (
            <button
              key={dateStr}
              onClick={() => (isBooked ? handleCancel(day) : handleBook(day))}
              disabled={isPast || actionLoading}
              className={`aspect-square p-2 text-sm border transition ${
                isBooked
                  ? "border-green-500 bg-green-500/10 text-green-500"
                  : isPast
                    ? "border-gray-800 bg-gray-900 text-gray-600 cursor-not-allowed"
                    : isToday
                      ? "border-white text-white hover:bg-white/10"
                      : "border-gray-800 text-gray-400 hover:border-gray-600"
              } ${actionLoading ? "opacity-50" : ""}`}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Click a date to book or cancel. You must book at least 24 hours in
        advance.
      </p>
    </div>
  );
}
