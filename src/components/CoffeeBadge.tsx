"use client";

import { useEffect, useState } from "react";
import { formatLocalDate } from "@/lib/dates";

type BookingData = {
  bookings: string[];
  tier: "ambassador" | "stellar_funded";
};

export function CoffeeBadge() {
  const [data, setData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch("/api/bookings");
      if (!response.ok) throw new Error("Failed to load data");
      const json = (await response.json()) as BookingData;
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return null;
  }

  const today = formatLocalDate(new Date());
  const hasBookingToday = data.bookings.includes(today);
  const isStellarFunded = data.tier === "stellar_funded";
  const eligible = hasBookingToday || isStellarFunded;

  if (!eligible) {
    return null;
  }

  const sozuUrl = process.env.NEXT_PUBLIC_SOZU_WALLET_URL || "https://sozuwallet.app";

  return (
    <div className="rounded-2xl border border-green-700/30 bg-green-700/10 p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-green-800">
            ☕ Coffee Available Today
          </h3>
          <p className="mt-1 text-sm text-black/60">
            You have hub access today. Redeem your coffee token at the hub.
          </p>
        </div>
      </div>
      <a
        href={sozuUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block rounded-full bg-green-800 text-white px-5 py-2 text-sm font-medium hover:bg-green-900 transition"
      >
        Open Sozu Wallet →
      </a>
    </div>
  );
}
