"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, X, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  generateTimeSlots,
  getBlockedStarts,
  formatSlotLabel,
  isValidSlotStart,
} from "@/lib/room-slots";
import { formatLocalDate } from "@/lib/dates";

type Room = {
  id: string;
  name: string;
  type: string;
  capacity: number;
  amenities: string[];
  booking_enabled: boolean;
};

type SlotBooking = {
  id: string;
  start_time: string;
  duration_minutes: number;
  status: string;
  is_mine: boolean;
};

type Availability = {
  date: string;
  member_tier: "Builder" | "Founder";
  can_book_rooms: boolean;
  rooms: Room[];
  bookings_by_room: Record<string, SlotBooking[]>;
};

export function RoomBooking() {
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [duration, setDuration] = useState<30 | 60>(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const today = formatLocalDate(new Date());
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const loadAvailability = useCallback(async () => {
    try {
      const res = await fetch("/api/hub/room-bookings/availability");
      if (!res.ok) throw new Error("Failed to load availability");
      setAvailability(await res.json());
    } catch (err) {
      console.error(err);
      setError("Could not load rooms");
    }
  }, []);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  const handleBookSlot = async (startTime: string) => {
    if (!selectedRoom || !availability?.can_book_rooms) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/hub/room-bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id: selectedRoom.id,
          start_time: startTime,
          duration_minutes: duration,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Booking failed");
      }

      setSuccess(data.message || `Booked ${selectedRoom.name}!`);
      setSelectedRoom(null);
      await loadAvailability();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Cancel this booking?")) return;

    try {
      const res = await fetch(`/api/hub/room-bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to cancel");

      setSuccess("Booking cancelled");
      await loadAvailability();
    } catch (err) {
      console.error(err);
      setError("Could not cancel booking");
    }
  };

  if (!availability) {
    return (
      <p className="text-black/60 text-sm">Loading rooms...</p>
    );
  }

  const myBookingsToday = Object.entries(availability.bookings_by_room).flatMap(
    ([roomId, bookings]) =>
      bookings
        .filter((b) => b.is_mine)
        .map((b) => ({ ...b, roomId }))
  );

  const roomBookings = selectedRoom
    ? (availability.bookings_by_room[selectedRoom.id] || []).map((b) => ({
        start_time: b.start_time,
        duration_minutes: b.duration_minutes,
        status: b.status as "confirmed" | "pending_admin",
        member_id: b.is_mine ? "mine" : "other",
      }))
    : [];

  const blockedStarts = selectedRoom
    ? getBlockedStarts(roomBookings, duration)
    : new Map<string, "booked" | "pending">();

  const isEventSpace = selectedRoom?.type === "event_space";

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-700/30 bg-red-700/10 text-red-800 p-4 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-green-700/30 bg-green-700/10 text-green-800 p-4 text-sm">
          {success}
        </div>
      )}

      <div className="rounded-2xl border border-black/10 bg-white/50 p-4">
        <p className="text-xs uppercase tracking-wide text-black/50 mb-1">
          Booking for today
        </p>
        <p className="font-semibold text-black">{todayLabel}</p>
        <p className="text-sm text-black/60 mt-1">
          Tier: {availability.member_tier}
          {availability.member_tier === "Builder" &&
            " · 30 or 60 min, once per day"}
          {availability.member_tier === "Founder" &&
            " · Book anytime, no hot desk required"}
        </p>
      </div>

      {!availability.can_book_rooms && (
        <div className="rounded-2xl border border-amber-700/30 bg-amber-700/10 p-4 flex gap-3">
          <AlertCircle className="shrink-0 text-amber-800" size={20} />
          <div>
            <p className="font-medium text-amber-900 text-sm">
              No hot desk scheduled for today
            </p>
            <p className="text-sm text-amber-800/80 mt-1">
              Builders need a hub access day booked before reserving a room.
              Book a day on the hub home calendar first.
            </p>
          </div>
        </div>
      )}

      {myBookingsToday.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-black mb-3">
            My bookings today
          </h3>
          <div className="space-y-2">
            {myBookingsToday.map((booking) => {
              const room = availability.rooms.find(
                (r) => r.id === booking.roomId
              );
              return (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/50 p-4"
                >
                  <div>
                    <p className="font-medium text-black">
                      {room?.name || "Room"}
                    </p>
                    <p className="text-sm text-black/60">
                      {formatSlotLabel(
                        booking.start_time,
                        booking.duration_minutes
                      )}
                      {booking.status === "pending_admin" && (
                        <span className="ml-2 text-amber-700">
                          · Pending admin
                        </span>
                      )}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelBooking(booking.id)}
                    className="rounded-full border-black/20 text-black hover:bg-black/5"
                  >
                    Cancel
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-black mb-4">Rooms</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {availability.rooms.map((room) => {
            const bookings = availability.bookings_by_room[room.id] || [];
            const bookedCount = bookings.length;
            const isEvent = room.type === "event_space";

            return (
              <button
                key={room.id}
                type="button"
                onClick={() => setSelectedRoom(room)}
                className="text-left rounded-2xl border border-black/10 bg-white/50 p-5 hover:bg-white/70 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-black">{room.name}</h4>
                  {isEvent && (
                    <span className="shrink-0 text-[10px] uppercase tracking-wide bg-amber-700/15 text-amber-900 px-2 py-0.5 rounded-full">
                      Admin approval
                    </span>
                  )}
                </div>
                <div className="mt-2 space-y-1 text-sm text-black/60">
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span>Capacity: {room.capacity}</span>
                  </div>
                  <p className="text-xs text-black/50">
                    {bookedCount} slot{bookedCount !== 1 ? "s" : ""} booked
                    today
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {room.amenities.slice(0, 3).map((amenity, i) => (
                    <span
                      key={i}
                      className="text-xs bg-black/5 px-2 py-0.5 rounded-full text-black/70"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedRoom && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#d4a574] border border-black/10 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-black">
                  {selectedRoom.name}
                </h3>
                <p className="text-sm text-black/60 mt-1">{todayLabel}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRoom(null)}
                className="text-black/50 hover:text-black"
              >
                <X size={24} />
              </button>
            </div>

            {isEventSpace && (
              <div className="rounded-xl border border-amber-700/30 bg-amber-700/10 p-3 mb-4 text-sm text-amber-900">
                Event Space requires admin confirmation and may include an
                additional charge.
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-black/70 mb-2">
                Duration
              </label>
              <div className="flex gap-3">
                {([30, 60] as const).map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDuration(mins)}
                    className={`flex-1 py-2 rounded-full border text-sm font-medium transition-colors ${
                      duration === mins
                        ? "bg-black text-[#d4a574] border-black"
                        : "bg-white/50 text-black border-black/10 hover:bg-white/70"
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-2 flex items-center gap-2 text-sm text-black/60">
              <Clock size={14} />
              <span>Select a time slot</span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
              {generateTimeSlots().map((slot) => {
                const blockStatus = blockedStarts.get(slot);
                const isBlocked = !!blockStatus;
                const invalidStart = !isValidSlotStart(slot, duration);
                const canSelect =
                  availability.can_book_rooms &&
                  !isBlocked &&
                  !invalidStart &&
                  !loading;

                let label = formatSlotLabel(slot, duration);
                let cardClass =
                  "snap-start shrink-0 w-28 rounded-xl border p-3 text-left transition-colors ";

                if (isBlocked) {
                  cardClass +=
                    blockStatus === "pending"
                      ? "border-amber-700/40 bg-amber-700/15 text-amber-900 cursor-not-allowed"
                      : "border-black/10 bg-black/5 text-black/40 cursor-not-allowed";
                  label = blockStatus === "pending" ? "Pending" : "Booked";
                } else if (invalidStart) {
                  cardClass +=
                    "border-black/5 bg-black/5 text-black/25 cursor-not-allowed";
                  label = "—";
                } else if (canSelect) {
                  cardClass +=
                    "border-black/10 bg-white/60 text-black hover:bg-white hover:border-black/30 cursor-pointer";
                } else {
                  cardClass +=
                    "border-black/5 bg-black/5 text-black/30 cursor-not-allowed";
                }

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={!canSelect}
                    onClick={() => handleBookSlot(slot)}
                    className={cardClass}
                  >
                    <span className="block text-xs font-medium opacity-60">
                      {slot}
                    </span>
                    <span className="block text-sm font-semibold mt-0.5">
                      {isBlocked
                        ? label
                        : invalidStart
                          ? "N/A"
                          : `${duration} min`}
                    </span>
                    {!isBlocked && !invalidStart && canSelect && (
                      <span className="block text-[10px] text-black/50 mt-1 truncate">
                        {formatSlotLabel(slot, duration)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 mt-4 text-[10px] text-black/50">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-white/60 border border-black/10" />
                Available
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-black/10" />
                Booked
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-700/30" />
                Pending
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
