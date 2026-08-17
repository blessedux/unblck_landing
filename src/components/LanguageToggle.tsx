"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";

export function LanguageToggle() {
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();

  if (
    pathname?.startsWith("/member") ||
    pathname?.startsWith("/admin")
  ) {
    return null;
  }

  const nextLocale = locale === "en" ? "es" : "en";
  const onApplyForm =
    pathname === "/apply" ||
    pathname?.startsWith("/apply?") ||
    pathname === "/accelerator/apply" ||
    pathname?.startsWith("/accelerator/apply?") ||
    pathname === "/insta-awards/apply" ||
    pathname?.startsWith("/insta-awards/apply?");

  return (
    <button
      type="button"
      onClick={() => setLocale(nextLocale)}
      aria-label={nextLocale === "es" ? "Cambiar a español" : "Switch to English"}
      className={
        onApplyForm
          ? "fixed bottom-24 right-6 z-[110] text-[11px] font-medium text-white/60 transition-colors hover:text-white sm:right-8 sm:text-sm max-[480px]:right-4"
          : "fixed bottom-5 right-6 z-[110] text-[11px] font-medium text-white/60 transition-colors hover:text-white sm:bottom-6 sm:right-8 sm:text-sm max-[480px]:bottom-4 max-[480px]:right-4"
      }
    >
      {nextLocale.toUpperCase()}
    </button>
  );
}
