"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import { LanguageToggle } from "@/components/LanguageToggle";

export function NotFoundContent() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-black text-white font-[family-name:var(--font-geist-sans)]">
      <div className="absolute right-6 top-6">
        <LanguageToggle />
      </div>
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
        <p className="mb-4 text-sm uppercase tracking-widest text-gray-500">404</p>
        <h1 className="mb-4 text-4xl font-bold">{t.notFound.title}</h1>
        <p className="mb-10 text-lg text-gray-400">{t.notFound.description}</p>
        <div className="flex w-full flex-col gap-3">
          <Link
            href="/"
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-gray-200"
          >
            {t.notFound.backHome}
          </Link>
          <Link
            href="/apply"
            className="rounded-full border border-white/20 px-6 py-3 text-sm text-white transition hover:bg-white/10"
          >
            {t.notFound.hubApply}
          </Link>
          <Link
            href="/accelerator/apply"
            className="rounded-full border border-white/20 px-6 py-3 text-sm text-white transition hover:bg-white/10"
          >
            {t.notFound.acceleratorApply}
          </Link>
        </div>
      </div>
    </div>
  );
}
