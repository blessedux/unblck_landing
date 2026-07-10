import type { Translations } from "@/lib/i18n";

export const ROOM_TYPE_VALUES = [
  "small_meeting",
  "large_meeting",
  "phone_booth",
  "podcast_studio",
  "event_space",
] as const;

export type RoomType = (typeof ROOM_TYPE_VALUES)[number];

export function getRoomTypeLabel(
  roomTypes: Translations["memberHub"]["rooms"]["roomTypes"],
  type: string,
): string {
  if (type in roomTypes) {
    return roomTypes[type as RoomType];
  }
  return type;
}
