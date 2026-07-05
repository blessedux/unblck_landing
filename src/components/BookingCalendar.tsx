"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  formatLocalDate,
  isSameLocalDay,
  isCurrentWeek,
  startOfLocalDay,
  parseLocalDate,
} from "@/lib/dates";
import { BookingPassModal } from "@/components/BookingPassModal";
import { HubPassCards } from "@/components/HubPassCards";
import { isMemberBookableDay } from "@/lib/booking-credits";
import type { HubPassDetails } from "@/lib/hub-pass";

type Pass = {
  id: string;
  date: string;
};

type BookingData = {
  bookings: string[];
  passes: Pass[];
  open_days: number[];
  credits: {
    total: number;
    used: number;
    remaining: number;
  };
  tier: "ambassador" | "stellar_funded";
};

function getMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  return { daysInMonth, startingDayOfWeek, year, month };
}

type BookingCalendarProps = {
  compact?: boolean;
};

export function BookingCalendar({ compact = false }: BookingCalendarProps) {
  const [data, setData] = useState<BookingData | null>(null);
  const [memberName, setMemberName] = useState("Member");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [passDetails, setPassDetails] = useState<HubPassDetails | null>(null);

  const today = startOfLocalDay(new Date());
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const { daysInMonth, startingDayOfWeek } = getMonthGrid(
    currentYear,
    currentMonth
  );

  const loadBookings = async () => {
    try {
      const [bookingsRes, memberRes] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/hub/member"),
      ]);

      if (!bookingsRes.ok) throw new Error("Failed to load bookings");

      const json = (await bookingsRes.json()) as BookingData;
      setData(json);

      if (memberRes.ok) {
        const member = await memberRes.json();
        setMemberName(member.full_name || "Member");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const isBuilder = data?.tier === "ambassador";

  const isDateSelectable = (date: Date, openDays: number[]) => {
    const dayStart = startOfLocalDay(date);
    if (dayStart <= today) return false;
    if (!isMemberBookableDay(date, openDays)) return false;
    if (isBuilder && !isCurrentWeek(date, today)) return false;
    return true;
  };

  const handleSelectDay = (year: number, month: number, day: number) => {
    const dateStr = formatLocalDate(new Date(year, month, day));
    if (data?.bookings.includes(dateStr)) return;
    setSelectedDate(dateStr);
    setError(null);
  };

  const handleConfirmPass = async () => {
    if (!selectedDate) return;

    setActionLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_date: selectedDate }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Booking failed");
      }

      setPassDetails({
        date: selectedDate,
        memberName,
        bookingId: json.booking_id,
      });

      setSelectedDate(null);
      await loadBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  const cardClass = compact
    ? "rounded-2xl border border-black/10 bg-white/50 backdrop-blur-sm p-4"
    : "rounded-2xl border border-black/10 bg-white/50 backdrop-blur-sm p-6";

  if (loading) {
    return (
      <div className={cardClass}>
        <p className="text-black/60 text-sm">Loading bookings...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={cardClass}>
        <p className="text-red-600 text-sm">Failed to load bookings</p>
      </div>
    );
  }

  const isUnlimited = data.tier === "stellar_funded";
  const calendarCells: ReactNode[] = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarCells.push(
      <div key={`empty-${i}`} className="aspect-square" />
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const dateStr = formatLocalDate(date);
    const isBooked = data.bookings.includes(dateStr);
    const isSelected = selectedDate === dateStr;
    const selectable = isDateSelectable(date, data.open_days);
    const isToday = isSameLocalDay(date, today);
    const outsideBuilderWeek =
      isBuilder && !isCurrentWeek(date, today) && date > today;
    const isClosedDay =
      !isBooked && date > today && !isMemberBookableDay(date, data.open_days);

    calendarCells.push(
      <button
        key={dateStr}
        type="button"
        onClick={() =>
          isBooked ? undefined : handleSelectDay(currentYear, currentMonth, day)
        }
        disabled={isBooked || !selectable || actionLoading}
        className={`rounded-lg border-2 transition ${
          compact ? "aspect-square p-0.5 text-xs" : "aspect-square p-2 text-sm"
        } ${
          isBooked
            ? "border-[#a67c52] bg-[#d4a574]/40 text-black font-medium cursor-default"
            : isSelected
              ? "border-green-600 bg-green-600/20 text-green-900 font-semibold ring-2 ring-green-600/30"
              : isToday
                ? "border-black ring-2 ring-black/80 bg-black/15 text-black font-bold"
                : !selectable
                  ? outsideBuilderWeek
                    ? "border-black/5 bg-black/5 text-black/25 cursor-not-allowed"
                    : isClosedDay
                      ? "border-black/5 bg-black/5 text-black/20 cursor-not-allowed"
                      : "border-black/5 bg-black/5 text-black/30 cursor-not-allowed"
                  : "border-black/10 text-black/70 hover:border-green-600/50 hover:bg-white/60"
        } ${actionLoading ? "opacity-50" : ""}`}
      >
        {day}
      </button>
    );
  }

  const selectedLabel = selectedDate
    ? parseLocalDate(selectedDate).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      <div className={cardClass}>
        <div
          className={`flex items-center justify-between ${compact ? "mb-3" : "mb-4"}`}
        >
          <h2
            className={`font-semibold text-black ${compact ? "text-base" : "text-xl"}`}
          >
            Hub Bookings
          </h2>
          <div className="text-right">
            {isUnlimited ? (
              <p
                className={`text-green-700 font-medium ${compact ? "text-xs" : "text-sm"}`}
              >
                Unlimited
              </p>
            ) : (
              <p className={`text-black/60 ${compact ? "text-xs" : "text-sm"}`}>
                {data.credits.remaining}/{data.credits.total} credits · Mon–Fri
              </p>
            )}
          </div>
        </div>

        <div className={compact ? "mb-2" : "mb-4"}>
          <h3
            className={`font-medium text-black ${compact ? "text-sm" : "text-lg"}`}
          >
            {today.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <p className="text-[10px] text-black/50 mt-1">
            {isBuilder
              ? "Mon–Fri · schedule your week each Sunday."
              : "Mon–Fri hub access."}
          </p>
        </div>

        {error && <p className="mb-3 text-xs text-red-600">{error}</p>}

        <div className={`grid grid-cols-7 ${compact ? "gap-1" : "gap-2"}`}>
          {["S", "M", "T", "W", "T", "F", "S"].map((label, i) => (
            <div
              key={`header-${label}-${i}`}
              className={`text-center text-black/50 ${compact ? "text-[10px] py-1" : "text-xs py-2"}`}
            >
              {label}
            </div>
          ))}
          {calendarCells}
        </div>

        <div className="flex gap-3 mt-3 text-[10px] text-black/50">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded border-2 border-green-600 bg-green-600/20" />
            Selected
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded border-2 border-[#a67c52] bg-[#d4a574]/40" />
            Booked
          </span>
        </div>
      </div>

      {selectedDate && (
        <div className="mt-3 rounded-2xl border border-black/10 bg-white/70 backdrop-blur-sm p-4 shadow-lg">
          <p className="text-sm text-black/60 mb-1">Request pass for</p>
          <p className="font-semibold text-black mb-3">{selectedLabel}</p>
          <button
            type="button"
            onClick={handleConfirmPass}
            disabled={actionLoading}
            className="w-full rounded-full bg-black text-[#f5e6d3] py-3 text-sm font-medium hover:bg-black/90 transition disabled:opacity-50"
          >
            {actionLoading ? "Confirming..." : "Confirm and request pass"}
          </button>
        </div>
      )}

      <HubPassCards
        passes={data.passes}
        memberName={memberName}
        onOpenPass={setPassDetails}
      />

      {passDetails && (
        <BookingPassModal
          details={passDetails}
          onClose={() => setPassDetails(null)}
        />
      )}
    </>
  );
}
