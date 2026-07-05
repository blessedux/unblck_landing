"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const GALLERY_IMAGES = [
  "/gallery/afteroffice.avif",
  "/gallery/afterthesunset.avif",
  "/gallery/builderday.avif",
  "/gallery/stellaracademy.avif",
  "/gallery/stellarbarrio2.avif",
  "/gallery/stellarconnect.avif",
  "/gallery/stellarenlamuni.avif",
  "/gallery/stellarenlanube.avif",
  "/gallery/stellarquest.avif",
] as const;

const INTERVAL_MS = 4000;

export function FundCardEventGallery() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (GALLERY_IMAGES.length <= 1) return;

    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % GALLERY_IMAGES.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 transition-transform duration-300 group-hover/event-image:scale-[1.02]">
      {GALLERY_IMAGES.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          aria-hidden={index !== activeIndex}
          className="object-cover transition-opacity duration-700 ease-in-out"
          style={{ opacity: index === activeIndex ? 1 : 0 }}
          sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 192px"
        />
      ))}
    </div>
  );
}
