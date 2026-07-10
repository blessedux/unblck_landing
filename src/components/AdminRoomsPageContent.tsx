"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { RoomManager } from "@/components/RoomManager";

type AdminRoomsPageContentProps = {
  initialRooms: Parameters<typeof RoomManager>[0]["initialRooms"];
};

export function AdminRoomsPageContent({
  initialRooms,
}: AdminRoomsPageContentProps) {
  const { t } = useLocale();
  const copy = t.adminRooms;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{copy.pageHeading}</h1>
            <p className="mt-2 text-gray-400">{copy.pageIntro}</p>
          </div>
          <a
            href="/admin"
            className="text-sm text-gray-400 transition hover:text-white"
          >
            {copy.backToAdmin}
          </a>
        </div>

        <RoomManager initialRooms={initialRooms} />
      </div>
    </div>
  );
}
