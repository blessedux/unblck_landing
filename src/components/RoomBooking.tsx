"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Users, X, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  generateTimeSlots,
  getBlockedStarts,
  formatSlotLabel,
  isValidSlotStart,
} from "@/lib/room-slots";
import { HUB_TIME_ZONE } from "@/lib/dates";
import { useLocale } from "@/contexts/LocaleContext";
import { getRoomTypeLabel } from "@/lib/rooms/room-types";
import { RoomImagePlaceholder } from "@/components/RoomImagePlaceholder";

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
  const { t, locale } = useLocale();
  const copy = t.memberHub.rooms;

  const [availability, setAvailability] = useState<Availability | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [duration, setDuration] = useState<30 | 60>(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "es" ? "es-CL" : "en-US", {
        timeZone: HUB_TIME_ZONE,
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(new Date()),
    [locale],
  );

  const loadAvailability = useCallback(async () => {
    try {
      const res = await fetch("/api/hub/room-bookings/availability");
      if (!res.ok) throw new Error("Failed to load availability");
      setAvailability(await res.json());
    } catch (err) {
      console.error(err);
      setError(copy.loadFailed);
    }
  }, [copy.loadFailed]);

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
        throw new Error(data.error || copy.bookingFailed);
      }

      setSuccess(data.message || `${selectedRoom.name}!`);
      setSelectedRoom(null);
      await loadAvailability();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : copy.bookingFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm(copy.cancelConfirm)) return;

    try {
      const res = await fetch(`/api/hub/room-bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to cancel");

      setSuccess(copy.bookingCancelled);
      await loadAvailability();
    } catch (err) {
      console.error(err);
      setError(copy.cancelFailed);
    }
  };

  if (!availability) {
    return <p className="text-sm text-black/60">{copy.loading}</p>;
  }

  const myBookingsToday = Object.entries(availability.bookings_by_room).flatMap(
    ([roomId, bookings]) =>
      bookings
        .filter((b) => b.is_mine)
        .map((b) => ({ ...b, roomId })),
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
  const tierLabel = copy.memberTiers[availability.member_tier];

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-700/30 bg-red-700/10 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-green-700/30 bg-green-700/10 p-4 text-sm text-green-800">
          {success}
        </div>
      )}

      <div className="rounded-2xl border border-black/10 bg-white/50 p-4">
        <p className="mb-1 text-xs uppercase tracking-wide text-black/50">
          {copy.bookingForToday}
        </p>
        <p className="font-semibold text-black">{todayLabel}</p>
        <p className="mt-1 text-sm text-black/60">
          {copy.tier}: {tierLabel}
          {availability.member_tier === "Builder" &&
            ` · ${copy.builderTierHint}`}
          {availability.member_tier === "Founder" &&
            ` · ${copy.founderTierHint}`}
        </p>
      </div>

      {!availability.can_book_rooms && (
        <div className="flex gap-3 rounded-2xl border border-amber-700/30 bg-amber-700/10 p-4">
          <AlertCircle className="shrink-0 text-amber-800" size={20} />
          <div>
            <p className="text-sm font-medium text-amber-900">
              {copy.noHotDeskTitle}
            </p>
            <p className="mt-1 text-sm text-amber-800/80">
              {copy.noHotDeskBody}
            </p>
          </div>
        </div>
      )}

      {myBookingsToday.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold text-black">
            {copy.myBookingsToday}
          </h3>
          <div className="space-y-2">
            {myBookingsToday.map((booking) => {
              const room = availability.rooms.find(
                (r) => r.id === booking.roomId,
              );
              return (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/50 p-4"
                >
                  <div>
                    <p className="font-medium text-black">
                      {room?.name || copy.roomFallback}
                    </p>
                    <p className="text-sm text-black/60">
                      {formatSlotLabel(
                        booking.start_time,
                        booking.duration_minutes,
                      )}
                      {booking.status === "pending_admin" && (
                        <span className="ml-2 text-amber-700">
                          · {copy.pendingAdmin}
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
                    {copy.cancelBooking}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-4 text-lg font-semibold text-black">
          {copy.roomsHeading}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {availability.rooms.map((room) => {
            const bookings = availability.bookings_by_room[room.id] || [];
            const bookedCount = bookings.length;
            const isEvent = room.type === "event_space";
            const typeLabel = getRoomTypeLabel(copy.roomTypes, room.type);

            return (
              <button
                key={room.id}
                type="button"
                onClick={() => setSelectedRoom(room)}
                className="rounded-2xl border border-black/10 bg-white/50 p-5 text-left transition-colors hover:bg-white/70"
              >
                <RoomImagePlaceholder className="mb-4" />
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-black">{room.name}</h4>
                    <p className="mt-0.5 text-xs text-black/50">{typeLabel}</p>
                  </div>
                  {isEvent && (
                    <span className="shrink-0 rounded-full bg-amber-700/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-amber-900">
                      {copy.adminApprovalBadge}
                    </span>
                  )}
                </div>
                <div className="mt-2 space-y-1 text-sm text-black/60">
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span>
                      {copy.capacity.replace("{count}", String(room.capacity))}
                    </span>
                  </div>
                  <p className="text-xs text-black/50">
                    {copy.slotsBookedToday.replace(
                      "{count}",
                      String(bookedCount),
                    )}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {room.amenities.slice(0, 3).map((amenity, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-black/5 px-2 py-0.5 text-xs text-black/70"
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
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-black/10 bg-[#d4a574] p-6">
            <RoomImagePlaceholder className="mb-4" />
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-black">
                  {selectedRoom.name}
                </h3>
                <p className="mt-1 text-sm text-black/60">
                  {getRoomTypeLabel(copy.roomTypes, selectedRoom.type)}
                </p>
                <p className="text-sm text-black/60">{todayLabel}</p>
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
              <div className="mb-4 rounded-xl border border-amber-700/30 bg-amber-700/10 p-3 text-sm text-amber-900">
                {copy.eventSpaceNotice}
              </div>
            )}

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-black/70">
                {copy.duration}
              </label>
              <div className="flex gap-3">
                {([30, 60] as const).map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDuration(mins)}
                    className={`flex-1 rounded-full border py-2 text-sm font-medium transition-colors ${
                      duration === mins
                        ? "border-black bg-black text-[#d4a574]"
                        : "border-black/10 bg-white/50 text-black hover:bg-white/70"
                    }`}
                  >
                    {copy.durationMinutes.replace("{mins}", String(mins))}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-2 flex items-center gap-2 text-sm text-black/60">
              <Clock size={14} />
              <span>{copy.selectTimeSlot}</span>
            </div>

            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 snap-x snap-mandatory">
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
                  label =
                    blockStatus === "pending"
                      ? copy.slotPending
                      : copy.slotBooked;
                } else if (invalidStart) {
                  cardClass +=
                    "border-black/5 bg-black/5 text-black/25 cursor-not-allowed";
                  label = copy.slotUnavailable;
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
                    <span className="mt-0.5 block text-sm font-semibold">
                      {isBlocked
                        ? label
                        : invalidStart
                          ? copy.slotUnavailable
                          : copy.durationMinutes.replace(
                              "{mins}",
                              String(duration),
                            )}
                    </span>
                    {!isBlocked && !invalidStart && canSelect && (
                      <span className="mt-1 block truncate text-[10px] text-black/50">
                        {formatSlotLabel(slot, duration)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex gap-3 text-[10px] text-black/50">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full border border-black/10 bg-white/60" />
                {copy.legendAvailable}
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-black/10" />
                {copy.legendBooked}
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-700/30" />
                {copy.legendPending}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
