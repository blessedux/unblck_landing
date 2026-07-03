"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronRight } from "lucide-react";
import { useScroll, motion } from "motion/react";

const HERO_VIDEO_SRC =
  "https://ik.imagekit.io/lrigu76hy/tailark/dna-video.mp4?updatedAt=1745736251477";

const menuItems = [
  { name: "What we do", href: "#what-we-do" },
  { name: "Insta Awards", href: "#insta-awards" },
];

const ecosystemPartners = [
  "Stellar",
  "Stellar SCF",
  "StellarBarrio",
  "UNBLCK STGO",
  "Santiago",
  "Blockchain Chile",
];

export function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-x-hidden">
        <section className="relative">
          <div className="relative min-h-[88vh] py-24 md:pb-32 lg:pb-36 lg:pt-72">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-1 z-0 aspect-[2/3] overflow-hidden rounded-3xl border border-white/10 sm:aspect-video lg:rounded-[3rem]"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="size-full object-cover opacity-35 invert-0 lg:opacity-75"
                src={HERO_VIDEO_SRC}
              />
            </div>

            <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 lg:block lg:px-12">
              <div className="mx-auto max-w-lg text-center lg:ml-0 lg:max-w-full lg:text-left">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Santiago, Chile
                </p>
                <h1 className="mt-8 max-w-3xl text-balance text-5xl font-medium md:text-6xl lg:mt-16 xl:text-7xl">
                  We turn AI and blockchain founders into unicorn riders.
                </h1>
                <p className="mt-8 max-w-2xl text-balance text-lg ">
                  UNBLCK is an AI and blockchain accelerator for latam founders.
                  <br></br>Based in Santiago, Chile, we provide workspace, mentorship, funding, and the program to
                  take you from builder to market-dominating startup.
                </p>

                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                  <Button
                    asChild
                    size="lg"
                    className="h-12 rounded-full pl-5 pr-3 text-base"
                  >
                    <Link href="/apply">
                      <span className="text-nowrap">Apply to join</span>
                      <ChevronRight className="ml-1" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="h-12 rounded-full px-5 text-base hover:bg-white/5"
                  >
                    <Link href="#what-we-do">
                      <span className="text-nowrap">What we do</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-background pb-2">
          <div className="group relative m-auto max-w-7xl px-6">
            <div className="flex flex-col items-center md:flex-row">
              <div className="md:max-w-44 md:border-r md:border-border md:pr-6">
                <p className="text-end text-sm text-muted-foreground">
                  Part of the ecosystem
                </p>
              </div>
              <div className="relative py-6 md:w-[calc(100%-11rem)]">
                <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
                  {ecosystemPartners.map((partner) => (
                    <div key={partner} className="flex">
                      <span className="mx-auto whitespace-nowrap text-sm font-medium tracking-wide text-muted-foreground">
                        {partner}
                      </span>
                    </div>
                  ))}
                </InfiniteSlider>

                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
                <ProgressiveBlur
                  className="pointer-events-none absolute left-0 top-0 h-full w-20"
                  direction="left"
                  blurIntensity={1}
                />
                <ProgressiveBlur
                  className="pointer-events-none absolute right-0 top-0 h-full w-20"
                  direction="right"
                  blurIntensity={1}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { scrollYProgress } = useScroll();

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrolled(latest > 0.05);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <header>
      <nav
        data-state={menuState ? "active" : "inactive"}
        className="group fixed z-20 w-full pt-2"
      >
        <div
          className={cn(
            "mx-auto max-w-7xl rounded-3xl px-6 transition-all duration-300 lg:px-12",
            scrolled && "bg-background/50 backdrop-blur-2xl",
          )}
        >
          <motion.div
            className={cn(
              "relative flex flex-wrap items-center justify-between gap-6 py-3 duration-200 lg:gap-0 lg:py-6",
              scrolled && "lg:py-4",
            )}
          >
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="text-sm font-medium tracking-[0.15em]"
              >
                UNBLCK
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="m-auto size-6 duration-200 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0" />
                <X className="absolute inset-0 m-auto size-6 scale-0 opacity-0 duration-200 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100" />
              </button>

              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="block text-muted-foreground duration-150 hover:text-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-border bg-background p-6 shadow-2xl group-data-[state=active]:block md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="block text-muted-foreground duration-150 hover:text-foreground"
                        onClick={() => setMenuState(false)}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button asChild size="sm">
                  <Link href="/apply">
                    <span>Apply</span>
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </nav>
    </header>
  );
};
