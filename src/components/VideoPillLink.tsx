"use client";

import Link from "next/link";

interface VideoPillLinkProps {
  href: string;
  children: React.ReactNode;
}

export function VideoPillLink({ href, children }: VideoPillLinkProps) {
  return (
    <Link
      href={href}
      className="relative inline-block overflow-hidden rounded-full border border-white bg-transparent transition hover:border-white/80"
    >
      <span aria-hidden className="pointer-events-none absolute inset-0">
        <video
          autoPlay
          muted
          playsInline
          loop
          className="pointer-events-none fixed inset-0 h-full w-full object-cover"
        >
          <source src="/hero_bg.webm" type="video/webm" />
          <source src="/hero_bg.mp4" type="video/mp4" />
        </video>
      </span>
      <span className="relative block px-5 py-2.5 text-sm font-medium text-white transition hover:text-white/90">
        {children}
      </span>
    </Link>
  );
}
