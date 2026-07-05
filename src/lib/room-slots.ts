export type RoomSlotBooking = {
  start_time: string;
  duration_minutes: number;
  status: "confirmed" | "pending_admin";
  member_id?: string;
};

/** 9:00 AM – 6:00 PM in 30-minute steps */
export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 9; hour <= 18; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour < 18) {
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }
  return slots;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

/** Which start times are blocked by existing bookings */
export function getBlockedStarts(
  bookings: RoomSlotBooking[],
  durationMinutes: 30 | 60
): Map<string, "booked" | "pending"> {
  const blocked = new Map<string, "booked" | "pending">();

  for (const slot of generateTimeSlots()) {
    const startMin = timeToMinutes(slot);
    const endMin = startMin + durationMinutes;

    for (const booking of bookings) {
      const bookingStart = timeToMinutes(booking.start_time.slice(0, 5));
      const bookingEnd = bookingStart + booking.duration_minutes;

      const overlaps = startMin < bookingEnd && endMin > bookingStart;
      if (!overlaps) continue;

      const status =
        booking.status === "pending_admin" ? "pending" : "booked";
      blocked.set(slot, status);
      break;
    }
  }

  return blocked;
}

export function formatSlotLabel(time: string, durationMinutes: number): string {
  const end = minutesToTime(timeToMinutes(time) + durationMinutes);
  return `${time} – ${end}`;
}

/** Hub hours end at 6:30 PM (last 30-min block starting at 6:00 PM) */
export function isValidSlotStart(
  time: string,
  durationMinutes: 30 | 60
): boolean {
  const closingMinutes = 18 * 60 + 30;
  return timeToMinutes(time) + durationMinutes <= closingMinutes;
}
