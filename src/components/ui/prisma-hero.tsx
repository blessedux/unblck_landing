"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: React.CSSProperties;
}

export const WordsPullUp = ({
  text,
  className = "",
  showAsterisk = false,
  style,
}: WordsPullUpProps) => {
  const words = text.split(" ");

  return (
    <div className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
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

interface Segment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  className?: string;
  style?: React.CSSProperties;
}

export const WordsPullUpMultiStyle = ({
  segments,
  className = "",
  style,
}: WordsPullUpMultiStyleProps) => {
  const words: { word: string; className?: string }[] = [];
  segments.forEach((seg) => {
    seg.text.split(" ").forEach((w) => {
      if (w) words.push({ word: w, className: seg.className });
    });
  });

  return (
    <div className={`inline-flex flex-wrap justify-center ${className}`} style={style}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
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

const PrismaHero = () => {
  const { t } = useLocale();

  return (
    <>
      {/* Scroll height spacer — content lives in the fixed layer below */}
      <section className="relative z-10 h-screen w-full" aria-hidden />

      <div className="pointer-events-none fixed inset-0 z-10 p-2 md:p-3">
        <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-[0_0_0_9999px_#000] md:rounded-[2rem]">
          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/10 via-transparent to-black/25" />

          <div className="pointer-events-auto absolute bottom-0 left-0 right-0 z-10 px-4 pb-2 sm:px-6 md:px-10">
            <div className="flex flex-col items-start gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12 xl:gap-16">
              <div className="@container min-w-0 w-full lg:flex-1">
                <h1
                  className="font-medium leading-[0.85] tracking-[-0.07em] text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[min(20vw,24cqw)]"
                  style={{ color: "#E1E0CC" }}
                >
                  <WordsPullUp text="UNBLCK" />
                </h1>
              </div>

              <div className="flex w-full shrink-0 flex-col gap-5 pb-6 sm:ml-8 sm:w-auto md:ml-10 lg:ml-0 lg:pb-10">
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-[13rem] text-xs leading-snug text-primary/70 sm:max-w-[15rem] sm:text-sm md:max-w-[16rem] md:text-base"
                >
                  {t.hero.subtitle}
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href="/accelerator/apply"
                    className="group inline-flex items-center gap-2 self-end rounded-full bg-primary py-1 pl-5 pr-1 text-sm font-medium text-black transition-all hover:gap-3 lg:self-start sm:text-base"
                  >
                    {t.hero.cta}
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                      <ArrowRight className="h-4 w-4" style={{ color: "#E1E0CC" }} />
                    </span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { PrismaHero };
