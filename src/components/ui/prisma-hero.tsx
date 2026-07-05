"use client";

import Link from "next/link";
import { motion, useInView } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";

/* ---------------- WordsPullUp ---------------- */
interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: React.CSSProperties;
}

export const WordsPullUp = ({ text, className = "", showAsterisk = false, style }: WordsPullUpProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ---------------- WordsPullUpMultiStyle ---------------- */
interface Segment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  className?: string;
  style?: React.CSSProperties;
}

export const WordsPullUpMultiStyle = ({ segments, className = "", style }: WordsPullUpMultiStyleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const words: { word: string; className?: string }[] = [];
  segments.forEach((seg) => {
    seg.text.split(" ").forEach((w) => {
      if (w) words.push({ word: w, className: seg.className });
    });
  });

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`} style={style}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-block ${w.className ?? ""}`}
          style={{ marginRight: "0.25em" }}
        >
          {w.word}
        </motion.span>
      ))}
    </div>
  );
};

/* ---------------- Hero ---------------- */
const PrismaHero = () => {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);

  useEffect(() => {
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;
    if (!video1 || !video2) return;

    // Start video2 slightly offset so they can crossfade
    video2.currentTime = 0.1;

    const handleTimeUpdate = () => {
      const video = activeVideo === 1 ? video1 : video2;
      const timeRemaining = video.duration - video.currentTime;
      
      // Start crossfade 0.5 seconds before the end
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
    <section className="h-screen w-full">
      <div className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-[2rem]">

        {/* Background videos for crossfade */}
        <video
          ref={video1Ref}
          autoPlay
          muted
          playsInline
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
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: activeVideo === 2 ? 1 : 0 }}
        >
          <source src="/hero_bg.webm" type="video/webm" />
          <source src="/hero_bg.mp4" type="video/mp4" />
        </video>

        {/* Noise overlay */}
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-2 sm:px-6 md:px-10">
          <div className="grid grid-cols-12 items-end gap-4">

            <div className="col-span-12 lg:col-span-8">
              <h1
                className="font-medium leading-[0.85] tracking-[-0.07em] text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw]"
                style={{ color: "#E1E0CC" }}
              >
                <WordsPullUp text="UNBLCK" />
              </h1>
            </div>

            <div className="col-span-12 flex flex-col gap-5 pb-6 ml-6 sm:ml-8 md:ml-10 lg:col-span-4 lg:ml-12 lg:pb-10 xl:ml-16">

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-[13rem] text-xs leading-snug text-primary/70 sm:max-w-[15rem] sm:text-sm md:max-w-[16rem] md:text-base"
              >
                On the search for cracked and jacked founders in Latam.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href="/accelerator/apply"
                  className="group inline-flex items-center gap-2 self-start rounded-full bg-primary py-1 pl-5 pr-1 text-sm font-medium text-black transition-all hover:gap-3 sm:text-base"
                >
                  Apply to accelerator
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                    <ArrowRight className="h-4 w-4" style={{ color: "#E1E0CC" }} />
                  </span>
                </Link>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { PrismaHero };
