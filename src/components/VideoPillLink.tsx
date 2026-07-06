"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";

interface VideoPillLinkProps {
  href: string;
  children: React.ReactNode;
}

export function VideoPillLink({ href, children }: VideoPillLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const link = linkRef.current;
    const video = videoRef.current;
    if (!link || !video) return;

    const syncVideo = () => {
      const rect = link.getBoundingClientRect();
      video.style.width = `${window.innerWidth}px`;
      video.style.height = `${window.innerHeight}px`;
      video.style.left = `${-rect.left}px`;
      video.style.top = `${-rect.top}px`;

      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      if (inView && video.paused) {
        void video.play().catch(() => {});
      } else if (!inView && !video.paused) {
        video.pause();
      }
    };

    let frame = 0;
    const scheduleSync = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(syncVideo);
    };

    syncVideo();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
    };
  }, []);

  return (
    <Link
      ref={linkRef}
      href={href}
      className="relative isolate inline-block overflow-hidden rounded-full border border-white bg-transparent transition hover:border-white/80"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        loop
        aria-hidden
        className="pointer-events-none absolute max-w-none object-cover"
      >
        <source src="/hero_bg.webm" type="video/webm" />
        <source src="/hero_bg.mp4" type="video/mp4" />
      </video>
      <span className="relative z-10 block px-5 py-2.5 text-sm font-medium text-white transition hover:text-white/90">
        {children}
      </span>
    </Link>
  );
}
