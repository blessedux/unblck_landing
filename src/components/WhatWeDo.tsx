"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import { VideoPillLink } from "@/components/VideoPillLink";
import type { HubLinkSegment } from "@/lib/i18n/locales/en";

function InlineLink({ segment }: { segment: HubLinkSegment }) {
  return (
    <>
      {segment.before}
      <a
        href={segment.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-white/90 underline-offset-2 transition hover:text-white hover:underline"
      >
        {segment.label}
      </a>
      {segment.after}
    </>
  );
}

export function WhatWeDo() {
  const { t } = useLocale();

  return (
    <section
      id="what-we-do"
      className="relative z-20 min-h-screen overflow-hidden rounded-t-[2rem] bg-black md:rounded-t-[2.5rem]"
    >
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-24">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
          {t.whatWeDo.label}
        </p>
        <h2 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl">
          {t.whatWeDo.heading}
        </h2>
        <p className="mt-4 max-w-xl text-muted leading-relaxed">
          {t.whatWeDo.introLink ? (
            <InlineLink segment={t.whatWeDo.introLink} />
          ) : (
            t.whatWeDo.intro
          )}
        </p>

        <div className="mt-12 divide-y divide-border border-y border-border">
          {t.whatWeDo.offerings.map((item) => (
            <article key={item.title} className="py-6">
              <h3 className="text-sm font-medium">{item.title}</h3>
              <p className="mt-1 text-sm text-muted leading-relaxed">
                {item.hubLink ? (
                  <InlineLink segment={item.hubLink} />
                ) : (
                  item.description
                )}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-end gap-4">
          <Link
            href="/login"
            className="text-sm text-muted transition hover:text-foreground"
          >
            {t.whatWeDo.login}
          </Link>
          <VideoPillLink href="/apply">{t.whatWeDo.cta}</VideoPillLink>
        </div>
      </div>

      <div aria-hidden className="h-8 bg-black" />
    </section>
  );
}
