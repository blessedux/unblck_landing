"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatLocalDate } from "@/lib/dates";

type ScheduleConfig = {
  week_start: string;
  open_days: number[];
  notes: string;
};

const WEEKDAYS = [
  { name: "Sunday", value: 0 },
  { name: "Monday", value: 1 },
  { name: "Tuesday", value: 2 },
  { name: "Wednesday", value: 3 },
  { name: "Thursday", value: 4 },
  { name: "Friday", value: 5 },
  { name: "Saturday", value: 6 },
];

function getSunday(date: Date): string {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  return formatLocalDate(d);
}

export function ScheduleManager({
  initialSchedule,
}: {
  initialSchedule?: ScheduleConfig | null;
}) {
  const router = useRouter();
  const [weekOffset, setWeekOffset] = useState(0);
  const [openDays, setOpenDays] = useState<number[]>(
    initialSchedule?.open_days || [1, 2, 3, 4, 5]
  );
  const [notes, setNotes] = useState(initialSchedule?.notes || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentWeekStart = (() => {
    const today = new Date();
    today.setDate(today.getDate() + weekOffset * 7);
    return getSunday(today);
  })();

  const toggleDay = (day: number) => {
    setOpenDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          week_start: currentWeekStart,
          open_days: openDays,
          notes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save schedule");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setWeekOffset((prev) => prev - 1)}
          className="px-4 py-2 rounded-full border border-gray-800 text-gray-400 hover:text-white transition"
        >
          ← Previous Week
        </button>
        <h2 className="text-xl font-semibold">
          Week of {new Date(currentWeekStart).toLocaleDateString()}
        </h2>
        <button
          onClick={() => setWeekOffset((prev) => prev + 1)}
          className="px-4 py-2 rounded-full border border-gray-800 text-gray-400 hover:text-white transition"
        >
          Next Week →
        </button>
      </div>

      <div className="border border-gray-800 p-6">
        <h3 className="text-lg font-semibold mb-4">Open Days</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {WEEKDAYS.map((weekday) => {
            const isOpen = openDays.includes(weekday.value);
            return (
              <button
                key={weekday.value}
                onClick={() => toggleDay(weekday.value)}
                className={`px-4 py-3 rounded-full border text-sm font-medium transition ${
                  isOpen
                    ? "border-white bg-white text-black"
                    : "border-gray-800 text-gray-400 hover:border-gray-600"
                }`}
              >
                {weekday.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border border-gray-800 p-6">
        <h3 className="text-lg font-semibold mb-4">Notes (Optional)</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Any special notes for this week..."
          className="w-full px-4 py-3 bg-white/5 border border-gray-800 text-white placeholder-gray-500 focus:border-white focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full rounded-full bg-white text-black py-3 px-6 font-medium hover:bg-gray-200 transition disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Schedule"}
      </button>
    </div>
  );
}
