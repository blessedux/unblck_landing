import { formatLocalDate } from "@/lib/dates";

export type HubPassDetails = {
  date: string;
  memberName: string;
  bookingId?: string;
};

export function formatPassDateLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function buildPassQrPayload(details: HubPassDetails): string {
  return JSON.stringify({
    type: "tellus_hub_pass",
    venue: "Tellus Blockchain Hub STGO",
    date: details.date,
    member: details.memberName,
    id: details.bookingId,
  });
}

export function buildGoogleCalendarUrl(details: HubPassDetails): string {
  const [y, m, d] = details.date.split("-").map(Number);
  const start = new Date(y, m - 1, d);
  const end = new Date(y, m - 1, d + 1);
  const fmt = (dt: Date) =>
    `${dt.getFullYear()}${String(dt.getMonth() + 1).padStart(2, "0")}${String(dt.getDate()).padStart(2, "0")}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Tellus Hub Access Pass",
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `Hot desk access at Tellus Blockchain Hub STGO for ${details.memberName}.`,
    location: "Tellus Blockchain Hub STGO, Santiago, Chile",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildIcsFile(details: HubPassDetails): string {
  const [y, m, d] = details.date.split("-").map(Number);
  const start = formatLocalDate(new Date(y, m - 1, d));
  const endParts = start.split("-").map(Number);
  const endDate = formatLocalDate(new Date(endParts[0], endParts[1] - 1, endParts[2] + 1));
  const uid = details.bookingId || `hub-pass-${details.date}`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//UNBLCK//Tellus Hub//EN",
    "BEGIN:VEVENT",
    `UID:${uid}@unblck.dev`,
    `DTSTAMP:${start.replace(/-/g, "")}T090000Z`,
    `DTSTART;VALUE=DATE:${start.replace(/-/g, "")}`,
    `DTEND;VALUE=DATE:${endDate.replace(/-/g, "")}`,
    "SUMMARY:Tellus Hub Access Pass",
    `DESCRIPTION:Hot desk access for ${details.memberName}`,
    "LOCATION:Tellus Blockchain Hub STGO\\, Santiago\\, Chile",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadTextFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
