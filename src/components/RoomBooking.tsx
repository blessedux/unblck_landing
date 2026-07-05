"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Room = {
  id: string;
  name: string;
  type: string;
  capacity: number;
  amenities: string[];
  booking_enabled: boolean;
};

type MemberTier = "Builder" | "Founder";

type RoomBooking = {
  id: string;
  room_id: string;
  booking_date: string;
  start_time: string;
  duration_minutes: number;
};

export function RoomBooking() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [memberTier, setMemberTier] = useState<MemberTier>("Builder");
  const [myBookings, setMyBookings] = useState<RoomBooking[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>("09:00");
  const [duration, setDuration] = useState<30 | 60>(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
    fetchMyBookings();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/hub/rooms");
      if (!res.ok) throw new Error("Failed to fetch rooms");
      const data = await res.json();
      setRooms(data.rooms);
      setMemberTier(data.member_tier);
    } catch (err) {
      console.error(err);
      setError("Could not load rooms");
    }
  };

  const fetchMyBookings = async () => {
    try {
      const res = await fetch("/api/hub/room-bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setMyBookings(data.bookings);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookRoom = async () => {
    if (!selectedRoom) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/hub/room-bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id: selectedRoom.id,
          booking_date: selectedDate,
          start_time: selectedTime,
          duration_minutes: duration,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Booking failed");
      }

      setSuccess(`Successfully booked ${selectedRoom.name}!`);
      setSelectedRoom(null);
      fetchMyBookings();
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
      fetchMyBookings();
    } catch (err) {
      console.error(err);
      setError("Could not cancel booking");
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const canBookAhead = memberTier === "Founder";

  // Generate time slots (9 AM to 6 PM)
  const timeSlots = [];
  for (let hour = 9; hour <= 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour < 18) {
      timeSlots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-2xl">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-4 rounded-2xl">
          {success}
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Your Tier: {memberTier}</h2>
        <p className="text-gray-400 text-sm">
          {memberTier === "Builder"
            ? "Walk-up booking only (today). 30 or 60 min slots, once per day."
            : "Unlimited pre-booking. 30 or 60 min slots."}
        </p>
      </div>

      {/* My Bookings */}
      {myBookings.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">My Room Bookings</h3>
          <div className="space-y-2">
            {myBookings.map((booking) => {
              const room = rooms.find((r) => r.id === booking.room_id);
              return (
                <div
                  key={booking.id}
                  className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4"
                >
                  <div>
                    <p className="font-medium text-white">{room?.name || "Room"}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(booking.booking_date).toLocaleDateString()} at{" "}
                      {booking.start_time} ({booking.duration_minutes} min)
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelBooking(booking.id)}
                    className="rounded-full border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Rooms */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Available Rooms</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="border border-white/10 bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => setSelectedRoom(room)}
            >
              <h4 className="font-semibold text-white mb-2">{room.name}</h4>
              <div className="space-y-1 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>Capacity: {room.capacity}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {room.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="text-xs bg-white/10 px-2 py-1 rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-black border border-white/20 rounded-2xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Book {selectedRoom.name}
              </h3>
              <button
                onClick={() => setSelectedRoom(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <Calendar size={16} className="inline mr-2" />
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={today}
                  max={canBookAhead ? undefined : today}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-full px-4 py-2 text-white"
                />
                {!canBookAhead && (
                  <p className="text-xs text-gray-500 mt-1">
                    Builders can only book for today
                  </p>
                )}
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <Clock size={16} className="inline mr-2" />
                  Start Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-full px-4 py-2 text-white"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Duration
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setDuration(30)}
                    className={`flex-1 py-2 rounded-full border transition-colors ${
                      duration === 30
                        ? "bg-white text-black border-white"
                        : "bg-white/5 text-white border-white/20 hover:bg-white/10"
                    }`}
                  >
                    30 min
                  </button>
                  <button
                    onClick={() => setDuration(60)}
                    className={`flex-1 py-2 rounded-full border transition-colors ${
                      duration === 60
                        ? "bg-white text-black border-white"
                        : "bg-white/5 text-white border-white/20 hover:bg-white/10"
                    }`}
                  >
                    60 min
                  </button>
                </div>
              </div>

              <Button
                onClick={handleBookRoom}
                disabled={loading}
                className="w-full rounded-full bg-white text-black hover:bg-gray-200"
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
