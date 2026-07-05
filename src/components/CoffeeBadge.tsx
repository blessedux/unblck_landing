"use client";

import { useEffect, useState } from "react";

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

  const today = new Date().toISOString().split("T")[0];
  const hasBookingToday = data.bookings.includes(today);
  const isStellarFunded = data.tier === "stellar_funded";
  const eligible = hasBookingToday || isStellarFunded;

  if (!eligible) {
    return null;
  }

  const sozuUrl = process.env.NEXT_PUBLIC_SOZU_WALLET_URL || "https://sozuwallet.app";

  return (
    <div className="border border-green-500 bg-green-500/10 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-green-500">
            ☕ Coffee Available Today
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            You have hub access today. Redeem your coffee token at the hub.
          </p>
        </div>
      </div>
      <a
        href={sozuUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block bg-green-500 text-black px-6 py-2 font-medium hover:bg-green-400 transition"
      >
        Open Sozu Wallet →
      </a>
    </div>
  );
}
