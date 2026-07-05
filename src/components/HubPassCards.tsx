"use client";

import { formatPassDateLabel, type HubPassDetails } from "@/lib/hub-pass";

type Pass = {
  id: string;
  date: string;
};

type HubPassCardsProps = {
  passes: Pass[];
  memberName: string;
  onOpenPass: (details: HubPassDetails) => void;
};

export function HubPassCards({
  passes,
  memberName,
  onOpenPass,
}: HubPassCardsProps) {
  if (passes.length === 0) {
    return (
      <div className="mt-4">
        <p className="text-xs uppercase tracking-wide text-black/50 mb-2">
          Your passes this week
        </p>
        <p className="text-sm text-black/40 rounded-2xl border border-dashed border-black/15 bg-white/30 px-4 py-6 text-center">
          Book a day to get your entry pass
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="text-xs uppercase tracking-wide text-black/50 mb-2">
        Your passes this week
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory -mx-1 px-1">
        {passes.map((pass) => (
          <button
            key={pass.id}
            type="button"
            onClick={() =>
              onOpenPass({
                date: pass.date,
                memberName,
                bookingId: pass.id,
              })
            }
            className="snap-start shrink-0 w-44 rounded-xl border-2 border-dashed border-[#a67c52] bg-[#f5e6d3]/90 p-3 text-left hover:bg-[#f5e6d3] transition shadow-sm"
          >
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/50">
              Tellus Hub
            </p>
            <p className="text-xs font-semibold text-black mt-2 leading-snug">
              {formatPassDateLabel(pass.date)}
            </p>
            <p className="text-[10px] text-black/50 mt-2 truncate">
              {memberName}
            </p>
            <p className="text-[10px] text-[#a67c52] font-medium mt-3">
              Tap to show QR →
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
