"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { createClient } from "@/lib/supabase/client";

const APPLICATION_SUBMITTED_KEY = "unblck_application_submitted";
const POPUP_DISMISSED_KEY = "newsletter_popup_dismissed";

function isEligible(): boolean {
  if (typeof window === "undefined") return false;
  if (localStorage.getItem(APPLICATION_SUBMITTED_KEY)) return false;
  if (localStorage.getItem(POPUP_DISMISSED_KEY)) return false;
  return true;
}

function dismissPopup() {
  localStorage.setItem(POPUP_DISMISSED_KEY, "true");
}

function getScrollDepth(): number {
  const scrollHeight = document.documentElement.scrollHeight;
  const viewportBottom = window.scrollY + window.innerHeight;
  return scrollHeight > 0 ? viewportBottom / scrollHeight : 0;
}

export function NewsletterPopup() {
  const { t } = useLocale();
  const copy = t.newsletterPopup;

  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const triggeredRef = useRef(false);

  const handleDismiss = useCallback(() => {
    dismissPopup();
    setVisible(false);
    setExpanded(false);
  }, []);

  useEffect(() => {
    if (!isEligible()) return;

    let cancelled = false;
    let removeScroll: (() => void) | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    void (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled || user || !isEligible()) return;

      const tryShow = () => {
        if (triggeredRef.current || !isEligible()) return;
        triggeredRef.current = true;
        setVisible(true);
        setExpanded(true);
      };

      const onScroll = () => {
        if (getScrollDepth() >= 0.5) {
          tryShow();
          removeScroll?.();
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      removeScroll = () => window.removeEventListener("scroll", onScroll);

      timer = window.setTimeout(() => {
        tryShow();
        removeScroll?.();
      }, 10_000);
    })();

    return () => {
      cancelled = true;
      removeScroll?.();
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const handleSubscribe = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage(copy.invalidEmail);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || copy.error);

      setMessage(copy.success);
      dismissPopup();
      window.setTimeout(() => setVisible(false), 2000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : copy.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="fixed bottom-4 right-4 z-50 w-[min(100vw-2rem,22rem)]"
        >
          {!expanded ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="rounded-full bg-black px-5 py-3 text-sm font-medium text-[#E1E0CC] shadow-lg"
            >
              Newsletter
            </button>
          ) : (
            <div className="rounded-2xl border border-black/10 bg-[#f5e6d3] p-4 shadow-2xl">
              <div className="mb-3 flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-black">{copy.message}</p>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="shrink-0 rounded-full p-1 text-black/60 hover:bg-black/5"
                  aria-label={copy.dismiss}
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={copy.emailPlaceholder}
                  className="w-full rounded-lg border border-black/10 bg-white/80 px-3 py-2 text-sm text-black outline-none focus:border-black/30"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-black py-2.5 text-sm font-medium text-[#E1E0CC] disabled:opacity-60"
                >
                  {loading ? copy.subscribing : copy.subscribe}
                </button>
              </form>

              {message && (
                <p className="mt-2 text-xs text-black/70">{message}</p>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
