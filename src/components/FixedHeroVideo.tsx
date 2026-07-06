"use client";

import { useEffect, useRef, useState } from "react";

export function FixedHeroVideo() {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);

  useEffect(() => {
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;
    if (!video1 || !video2) return;

    const tryPlay = () => {
      void video1.play().catch(() => {});
    };

    tryPlay();
    video2.currentTime = 0.1;

    const unlockOnTouch = () => {
      tryPlay();
      document.removeEventListener("touchstart", unlockOnTouch);
    };
    document.addEventListener("touchstart", unlockOnTouch, {
      once: true,
      passive: true,
    });

    const handleTimeUpdate = () => {
      const video = activeVideo === 1 ? video1 : video2;
      const timeRemaining = video.duration - video.currentTime;

      if (timeRemaining <= 0.5 && timeRemaining > 0) {
        const nextVideo = activeVideo === 1 ? video2 : video1;
        nextVideo.currentTime = 0;
        nextVideo.play();
        setActiveVideo(activeVideo === 1 ? 2 : 1);
      }
    };

    const currentVideo = activeVideo === 1 ? video1 : video2;
    currentVideo.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      currentVideo.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [activeVideo]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <video
        ref={video1Ref}
        autoPlay
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
        style={{ opacity: activeVideo === 1 ? 1 : 0 }}
      >
        <source src="/hero_bg.webm" type="video/webm" />
        <source src="/hero_bg.mp4" type="video/mp4" />
      </video>

      <video
        ref={video2Ref}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
        style={{ opacity: activeVideo === 2 ? 1 : 0 }}
      >
        <source src="/hero_bg.webm" type="video/webm" />
        <source src="/hero_bg.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
