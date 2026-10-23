"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { ShaderBackground } from "@/components/ui/hero";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";

export function HoldingScreen() {
  const { t } = useLocale();
  const copy = t.holding;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
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
        body: JSON.stringify({ email: email.trim(), source: "holding" }),
      });
      if (!res.ok) throw new Error(copy.error);
      setDone(true);
      setMessage(copy.success);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : copy.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fixed inset-0 overflow-hidden bg-black text-[#E1E0CC]">
      {reduceMotion ? (
        <div className="absolute inset-0 bg-black" aria-hidden />
      ) : (
        <div className="absolute inset-0" aria-hidden>
          <ShaderBackground className="h-full w-full" />
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 bottom-0 z-10 grid place-items-center px-6 [@media(max-height:640px)]:bottom-56 [@media(max-height:640px)_and_(max-width:639px)]:bottom-72">
        <div className="relative aspect-[708/269] w-[min(78vw,36rem,calc(32dvh*2.631))] [@media(max-height:640px)]:w-[min(72vw,28rem,calc(26dvh*2.631))]">
          <Image
            src="/unblck-wordmark.png"
            alt="UNBLCK"
            fill
            priority
            sizes="(max-width: 768px) 78vw, 576px"
            className="object-contain select-none drop-shadow-[0_18px_50px_rgba(0,0,0,0.55)]"
          />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:px-8 sm:pb-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent"
        />
        <div className="relative mx-auto flex w-full max-w-md flex-col items-center pt-16 text-center [@media(max-height:640px)]:pt-8">
          <p className="animate-fade-up text-sm leading-relaxed text-[#E1E0CC]/75 sm:text-[15px]">
            {copy.thesis}
          </p>
          <p className="animate-fade-up mt-2 text-sm font-medium tracking-tight text-[#E1E0CC] sm:text-[15px]">
            {copy.batch}
          </p>

          {done ? (
            <p className="mt-6 text-sm text-[#E1E0CC]/80" role="status">
              {copy.success}
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="mt-6 flex w-full flex-col gap-2 sm:flex-row sm:items-center"
            >
              <label htmlFor="holding-email" className="sr-only">
                {copy.emailLabel}
              </label>
              <input
                id="holding-email"
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={copy.emailPlaceholder}
                className="h-11 w-full min-w-0 rounded-full border border-white/15 bg-black/50 px-5 text-sm text-[#E1E0CC] outline-none backdrop-blur-md placeholder:text-[#E1E0CC]/40 focus-visible:ring-2 focus-visible:ring-[#E1E0CC]/70 sm:flex-1"
              />
              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full shrink-0 bg-[#E1E0CC] px-6 text-black hover:bg-[#E1E0CC]/90 sm:w-auto"
              >
                {loading ? copy.subscribing : copy.subscribe}
              </Button>
            </form>
          )}

          {message && !done && (
            <p className="mt-3 text-xs text-[#E1E0CC]/70" role="status">
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
