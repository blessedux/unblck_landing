"use client";

import Link from "next/link";
import { VideoPillLink } from "@/components/VideoPillLink";

const offerings = [
  {
    title: "Working space",
    description:
      "A physical hub at Tellus Blockchain Hub STGO where founders can focus, collaborate, and build alongside other operators.",
  },
  {
    title: "Mentorship",
    description:
      "Direct access to experienced builders, operators, and investors who've shipped on blockchain.",
  },
  {
    title: "Funding program",
    description:
      "A complete path to get your startup funded and growing — from grant capital to go-to-market and demo days.",
  },
  {
    title: "Private founder club",
    description:
      "Not an open coworking space. A curated community of founders who want a serious hub for their projects.",
  },
];

export function WhatWeDo() {
  return (
    <section
      id="what-we-do"
      className="relative z-20 flex min-h-screen flex-col overflow-hidden rounded-t-[2rem] md:rounded-t-[2.5rem]"
    >
      <div className="flex-1 bg-black px-6 pt-24 pb-8 rounded-t-[2rem] md:rounded-t-[2.5rem]">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
            What we do
          </p>
          <h2 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl">
            Everything you need to go from builder to startup.
          </h2>
          <p className="mt-4 max-w-xl text-muted leading-relaxed">
            UNBLCK gives founders the space, guidance, and network to launch and
            scale on the Stellar blockchain — without doing it alone.
          </p>

          <div className="mt-12 divide-y divide-border border-y border-border">
            {offerings.map((item) => (
              <article key={item.title} className="py-6">
                <h3 className="text-sm font-medium">{item.title}</h3>
                <p className="mt-1 text-sm text-muted leading-relaxed">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-end gap-4">
            <Link
              href="/login"
              className="text-sm text-muted transition hover:text-foreground"
            >
              Login
            </Link>
            <VideoPillLink href="/apply">
              Request access to Tellus Hub
            </VideoPillLink>
          </div>
        </div>
      </div>

      <div aria-hidden className="h-8 bg-black" />
    </section>
  );
}
