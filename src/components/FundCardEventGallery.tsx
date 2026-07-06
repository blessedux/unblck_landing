"use client";

import { useEffect, useRef, useState } from "react";

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
const FADE_MS = 700;

type GalleryLayer = {
  src: (typeof GALLERY_IMAGES)[number];
  visible: boolean;
};

function GalleryLayer({ src, visible }: GalleryLayer) {
  return (
    // Native img avoids Next/Image wrapper spans that break opacity transitions on Android.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden={!visible}
      decoding="async"
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity ${FADE_MS}ms ease-in-out`,
        willChange: "opacity",
        transform: "translateZ(0)",
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
      }}
    />
  );
}

export function FundCardEventGallery() {
  const [layerA, setLayerA] = useState<GalleryLayer>({
    src: GALLERY_IMAGES[0],
    visible: true,
  });
  const [layerB, setLayerB] = useState<GalleryLayer>({
    src: GALLERY_IMAGES[1] ?? GALLERY_IMAGES[0],
    visible: false,
  });
  const indexRef = useRef(0);
  const showARef = useRef(true);

  useEffect(() => {
    for (const src of GALLERY_IMAGES) {
      const img = new window.Image();
      img.src = src;
    }

    if (GALLERY_IMAGES.length <= 1) return;

    const id = window.setInterval(() => {
      indexRef.current = (indexRef.current + 1) % GALLERY_IMAGES.length;
      const nextSrc = GALLERY_IMAGES[indexRef.current];
      const showA = showARef.current;

      if (showA) {
        setLayerB({ src: nextSrc, visible: true });
        setLayerA((prev) => ({ ...prev, visible: false }));
      } else {
        setLayerA({ src: nextSrc, visible: true });
        setLayerB((prev) => ({ ...prev, visible: false }));
      }

      showARef.current = !showA;
    }, INTERVAL_MS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 transition-transform duration-300 group-hover/event-image:scale-[1.02]">
      <GalleryLayer src={layerA.src} visible={layerA.visible} />
      <GalleryLayer src={layerB.src} visible={layerB.visible} />
    </div>
  );
}
