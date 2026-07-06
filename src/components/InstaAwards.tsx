"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/contexts/LocaleContext";
import { FundCardEventGallery } from "@/components/FundCardEventGallery";

const LUMA_EVENTS_URL = "https://luma.com/telluscoop";

export function InstaAwards() {
  const { t } = useLocale();

  return (
    <section id="insta-awards" className="relative z-30 -mt-px border-t border-border bg-background px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
          {t.instaAwards.label}
        </p>
        <h2 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl">
          {t.instaAwards.heading}
        </h2>
        <p className="mt-4 max-w-xl text-muted leading-relaxed">
          {t.instaAwards.intro}
        </p>

        <div className="mt-12 divide-y divide-border border-y border-border">
          {t.instaAwards.journey.map((item) => (
            <article key={item.phase} className="py-6">
              <p className="text-xs text-muted">{item.phase}</p>
              <h3 className="mt-1 text-sm font-medium">{item.title}</h3>
              <p className="mt-1 text-sm text-muted leading-relaxed">
                {item.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-24 border-t border-border pt-16">
          <div className="group/card relative border border-border bg-white/[0.02] p-8 rounded-2xl transition-all duration-300 hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]">
            <div className="mb-6 flex items-start justify-between gap-4 sm:gap-6">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <Link
                    href="https://stellar.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-100 transition-opacity hover:opacity-60"
                  >
                    <Image
                      src="/stellar_logo_black.jpeg"
                      alt="Stellar Development Foundation"
                      width={120}
                      height={40}
                      className="h-10 w-auto rounded-lg object-contain invert"
                    />
                  </Link>
                  <Link
                    href="https://telluscoop.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-100 transition-opacity hover:opacity-60"
                  >
                    <Image
                      src="/tellus_logo.jpg"
                      alt="Tellus Coop"
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  </Link>
                </div>

                <div className="mt-6">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
                    {t.instaAwards.fundLabel}
                  </p>
                  <h3 className="mt-3 text-xl font-medium tracking-tight sm:text-2xl">
                    {t.instaAwards.fundTitle}
                  </h3>
                </div>
              </div>

              <Link
                href={LUMA_EVENTS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.instaAwards.lumaAriaLabel}
                className="group/event-image relative aspect-square size-32 shrink-0 overflow-hidden rounded-xl border border-border bg-white/[0.03] transition hover:border-white/20 hover:bg-white/[0.06] sm:size-40 md:size-48"
              >
                <FundCardEventGallery />
              </Link>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-3xl font-medium">{t.instaAwards.grantAmount}</span>
                <span className="text-sm text-muted">{t.instaAwards.grantType}</span>
              </div>
              <p className="text-sm text-muted leading-relaxed max-w-2xl">
                {t.instaAwards.fundDescription}
              </p>
            </div>

            <ul className="mb-8 flex flex-wrap gap-2 text-sm text-muted">
              {t.instaAwards.tags.map((tag) => (
                <li key={tag} className="border border-border px-3 py-1.5 rounded-full">
                  {tag}
                </li>
              ))}
            </ul>

            <div className="mb-8">
              <h4 className="text-sm font-medium mb-4">{t.instaAwards.howToApply}</h4>
              <div className="space-y-4">
                {t.instaAwards.steps.map((item, index) => (
                  <div key={item.title} className="flex gap-4">
                    <span className="text-xs text-muted font-medium min-w-[2rem]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h5 className="text-sm font-medium">{item.title}</h5>
                      <p className="mt-1 text-sm text-muted leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href="/insta-awards/apply"
                className="group inline-flex items-center gap-2 bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:gap-3 hover:bg-accent-soft rounded-full"
              >
                {t.instaAwards.applyCta}
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
