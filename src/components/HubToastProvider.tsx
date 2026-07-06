"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale } from "@/contexts/LocaleContext";

type HubToastContextValue = {
  showTourComingSoon: () => void;
};

const HubToastContext = createContext<HubToastContextValue | null>(null);

export function useHubToast() {
  const context = useContext(HubToastContext);
  if (!context) {
    throw new Error("useHubToast must be used within HubToastProvider");
  }
  return context;
}

export function HubToastProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTourComingSoon = useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
    }

    setVisible(true);

    dismissTimerRef.current = setTimeout(() => {
      setVisible(false);
      dismissTimerRef.current = null;
    }, 5000);
  }, []);

  return (
    <HubToastContext.Provider value={{ showTourComingSoon }}>
      {children}
      <HubComingSoonToast visible={visible} />
    </HubToastContext.Provider>
  );
}

function HubComingSoonToast({ visible }: { visible: boolean }) {
  const { t } = useLocale();
  const copy = t.memberHub.tourComingSoon;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed bottom-6 left-1/2 z-[70] w-[min(100%,20rem)] rounded-2xl border border-black/10 bg-black px-5 py-4 text-white shadow-xl"
        >
          <p className="text-sm font-semibold">{copy.title}</p>
          <p className="mt-1 text-sm text-white/70">{copy.description}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
