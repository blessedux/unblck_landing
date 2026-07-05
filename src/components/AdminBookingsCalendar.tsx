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

export function AdminBookingsCalendar() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } =
    getDaysInMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <div className="border border-gray-800 p-6">
        <h2 className="text-xl font-semibold mb-4">Hub Bookings Calendar</h2>
        <p className="text-gray-400">Loading bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-gray-800 p-6">
        <h2 className="text-xl font-semibold mb-4">Hub Bookings Calendar</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const selectedDateData = selectedDate ? bookingsByDate[selectedDate] : null;

  return (
    <div className="border border-gray-800">
      <div className="border-b border-gray-800 p-4">
        <h2 className="text-xl font-semibold">Hub Bookings Calendar</h2>
        <p className="text-sm text-gray-400 mt-1">
          Click on a date to see who has booked the space
        </p>
      </div>

      <div className="p-4">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={previousMonth}
            className="px-3 py-1 text-sm border border-gray-700 hover:bg-white/5 transition"
          >
            ← Previous
          </button>
          <h3 className="text-lg font-semibold">
            {currentMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <button
            onClick={nextMonth}
            className="px-3 py-1 text-sm border border-gray-700 hover:bg-white/5 transition"
          >
            Next →
          </button>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {/* Day headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-400 py-2"
            >
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Calendar days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateKey = formatDateKey(year, month, day);
            const dayBookings = bookingsByDate[dateKey];
            const isToday = dateKey === today;
            const isSelected = dateKey === selectedDate;

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(dateKey)}
                className={`aspect-square border transition flex flex-col items-center justify-center p-1 ${
                  isSelected
                    ? "border-white bg-white/10"
                    : dayBookings
                      ? "border-gray-600 hover:border-gray-400 bg-white/5"
                      : "border-gray-800 hover:border-gray-700"
                } ${isToday ? "ring-1 ring-white/30" : ""}`}
              >
                <span className="text-sm font-medium">{day}</span>
                {dayBookings && (
                  <span className="text-xs text-gray-400 mt-1">
                    {dayBookings.total}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected date details */}
        {selectedDate && (
          <div className="border border-gray-700 p-4 bg-white/5">
            <h3 className="font-semibold mb-3">
              {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )}
            </h3>

            {selectedDateData ? (
              <>
                <p className="text-sm text-gray-400 mb-4">
                  {selectedDateData.total} member
                  {selectedDateData.total !== 1 ? "s" : ""} scheduled
                </p>

                {selectedDateData.stellarFunded.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-green-500 mb-2">
                      Stellar Funded ({selectedDateData.stellarFunded.length})
                    </p>
                    <div className="space-y-1">
                      {selectedDateData.stellarFunded.map((email) => (
                        <p key={email} className="text-sm text-gray-300 pl-2">
                          • {email}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDateData.ambassadors.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-blue-500 mb-2">
                      Ambassadors ({selectedDateData.ambassadors.length})
                    </p>
                    <div className="space-y-1">
                      {selectedDateData.ambassadors.map((email) => (
                        <p key={email} className="text-sm text-gray-300 pl-2">
                          • {email}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-400">No bookings for this date</p>
            )}
          </div>
        )}

        {!selectedDate && (
          <div className="border border-gray-700 p-4 bg-white/5 text-center">
            <p className="text-sm text-gray-400">
              Select a date to view booking details
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
