"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import QRCode from "qrcode";
import { motion } from "motion/react";
import {
  buildGoogleCalendarUrl,
  buildIcsFile,
  buildPassQrPayload,
  downloadTextFile,
  formatPassDateLabel,
  type HubPassDetails,
} from "@/lib/hub-pass";

type BookingPassModalProps = {
  details: HubPassDetails;
  onClose: () => void;
};

export function BookingPassModal({ details, onClose }: BookingPassModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 72,
      origin: { y: 0.55 },
      colors: ["#d4a574", "#ffffff", "#2d5016", "#000000"],
    });

    QRCode.toDataURL(buildPassQrPayload(details), {
      width: 280,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    }).then(setQrDataUrl);
  }, [details]);

  const handleDownloadIcs = () => {
    downloadTextFile(
      buildIcsFile(details),
      `tellus-hub-pass-${details.date}.ics`,
      "text/calendar;charset=utf-8"
    );
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `tellus-hub-qr-${details.date}.png`;
    a.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Hub access pass"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          animate={{ rotate: [-1.5, 1.5, -1.5] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="rounded-2xl border-2 border-dashed border-black/20 bg-[#f5e6d3] shadow-2xl overflow-hidden"
        >
          <div className="bg-black text-[#f5e6d3] px-5 py-3 flex items-center justify-between">
            <span className="text-xs font-bold tracking-[0.2em] uppercase">
              Tellus Hub
            </span>
            <span className="text-[10px] opacity-70">ACCESS PASS</span>
          </div>

          <div className="px-5 py-6 text-center border-b border-dashed border-black/15">
            <p className="text-xs uppercase tracking-widest text-black/50 mb-2">
              Valid for
            </p>
            <p className="text-lg font-bold text-black leading-tight">
              {formatPassDateLabel(details.date)}
            </p>
            <p className="text-sm text-black/60 mt-2">{details.memberName}</p>
          </div>

          <div className="px-5 py-5 flex flex-col items-center gap-3">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt="Hub access QR code"
                className="w-40 h-40 rounded-lg border border-black/10 bg-white p-2"
              />
            ) : (
              <div className="w-40 h-40 rounded-lg bg-black/5 animate-pulse" />
            )}
            <p className="text-[10px] text-black/50">
              Show this QR at the hub entrance
            </p>
          </div>
        </motion.div>

        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={handleDownloadIcs}
            className="w-full rounded-full bg-black text-[#f5e6d3] py-2.5 text-sm font-medium hover:bg-black/90 transition"
          >
            Download .ics
          </button>
          <a
            href={buildGoogleCalendarUrl(details)}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center rounded-full border border-black/20 bg-white/80 text-black py-2.5 text-sm font-medium hover:bg-white transition"
          >
            Add to Google Calendar
          </a>
          <button
            type="button"
            onClick={handleDownloadQr}
            disabled={!qrDataUrl}
            className="w-full rounded-full border border-black/20 bg-white/80 text-black py-2.5 text-sm font-medium hover:bg-white transition disabled:opacity-50"
          >
            Download QR (PNG)
          </button>
        </div>

        <p className="text-center text-xs text-black/50 mt-3">
          Tap outside to return to calendar
        </p>
      </motion.div>
    </div>
  );
}
