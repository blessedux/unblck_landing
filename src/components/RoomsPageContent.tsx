"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { RoomBooking } from "@/components/RoomBooking";

export function RoomsPageContent() {
  const { t } = useLocale();
  const copy = t.memberHub.rooms;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-black">{copy.pageHeading}</h1>
      <p className="mb-8 text-black/60">{copy.pageIntro}</p>
      <RoomBooking />
    </div>
  );
}
