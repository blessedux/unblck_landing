"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

type CoffeeRedeemModalProps = {
  sozuUrl: string;
  onClose: () => void;
};

export function CoffeeRedeemModal({ sozuUrl, onClose }: CoffeeRedeemModalProps) {
  const { t } = useLocale();
  const copy = t.memberHub.coffee.modal;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="relative w-full max-w-md rounded-2xl border border-black/10 bg-[#f5e6d3] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-black/10 px-5 py-4">
          <h2 className="text-lg font-semibold text-black">{copy.title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-black/60 transition hover:bg-black/5 hover:text-black"
            aria-label={copy.close}
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5 text-sm text-black/75">
          <div>
            <p className="font-medium text-black">{copy.faucetTitle}</p>
            <p className="mt-1 leading-relaxed">{copy.faucetBody}</p>
          </div>
          <div>
            <p className="font-medium text-black">{copy.latrianaTitle}</p>
            <p className="mt-1 leading-relaxed">{copy.latrianaBody}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-black/10 px-5 py-4">
          <a
            href={sozuUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full bg-green-800 py-3 text-center text-sm font-medium text-white transition hover:bg-green-900"
          >
            {copy.goToWallet} →
          </a>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-black/15 py-3 text-sm font-medium text-black/70 transition hover:bg-black/5"
          >
            {copy.close}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
