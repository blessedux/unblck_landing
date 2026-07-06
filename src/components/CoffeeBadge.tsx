"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { formatHubDate } from "@/lib/dates";
import { CoffeeRedeemModal } from "@/components/CoffeeRedeemModal";

type BookingData = {
  bookings: string[];
  tier: "ambassador" | "stellar_funded";
};

export function CoffeeBadge() {
  const { t } = useLocale();
  const [data, setData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

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

  const today = formatHubDate();
  const hasBookingToday = data.bookings.includes(today);
  const isStellarFunded = data.tier === "stellar_funded";
  const eligible = hasBookingToday || isStellarFunded;

  if (!eligible) {
    return null;
  }

  const sozuUrl =
    process.env.NEXT_PUBLIC_SOZU_WALLET_URL || "https://credit.sozu.capital";
  const copy = t.memberHub.coffee;

  return (
    <>
      <div className="rounded-2xl border border-green-700/30 bg-green-700/10 p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-green-800">
              {copy.title}
            </h3>
            <p className="mt-1 text-sm text-black/60">{copy.description}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="mt-4 inline-block rounded-full bg-green-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-green-900"
        >
          {copy.redeem} →
        </button>
      </div>

      {modalOpen && (
        <CoffeeRedeemModal
          sozuUrl={sozuUrl}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
