"use client";

import Link from "next/link";
import { useRef } from "react";
import { WhatWeDoSvgMask } from "@/components/WhatWeDoSvgMask";

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
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  return (
    <section
      ref={sectionRef}
      id="what-we-do"
      className="relative z-20 min-h-screen overflow-hidden rounded-t-[2rem] px-6 py-24 md:rounded-t-[2.5rem]"
    >
      <WhatWeDoSvgMask sectionRef={sectionRef} ctaRef={ctaRef} />

      <div className="relative z-[25] mx-auto max-w-3xl">
        <div id="our-story">
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
        </div>

        <div className="relative mt-8 flex items-center justify-end gap-4">
          <Link
            href="/login"
            className="text-sm text-muted transition hover:text-foreground"
          >
            Login
          </Link>
          <Link
            ref={ctaRef}
            href="/apply"
            className="relative z-[30] inline-block rounded-full border border-white bg-transparent px-5 py-2.5 text-sm font-medium text-white transition hover:border-white/80 hover:text-white/90"
          >
            Request access to Tellus Hub
          </Link>
        </div>
      </div>
    </section>
  );
}
