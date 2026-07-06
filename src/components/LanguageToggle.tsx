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

  return (
    <button
      type="button"
      onClick={() => setLocale(nextLocale)}
      aria-label={nextLocale === "es" ? "Cambiar a español" : "Switch to English"}
      className="fixed top-5 right-12 z-[60] text-[11px] font-medium text-white/60 transition-colors hover:text-white sm:top-4 sm:text-sm max-[480px]:top-4 max-[480px]:right-4"
    >
      {nextLocale.toUpperCase()}
    </button>
  );
}
