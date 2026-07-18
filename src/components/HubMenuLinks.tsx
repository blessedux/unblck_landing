"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import { useHubToast } from "@/components/HubToastProvider";

type HubMenuLinksProps = {
  variant?: "center" | "sidebar" | "stack";
};

type HubMenuItem =
  | { kind: "link"; href: string; label: string }
  | { kind: "tour"; label: string };

export function HubMenuLinks({ variant = "center" }: HubMenuLinksProps) {
  const { t } = useLocale();
  const { showTourComingSoon } = useHubToast();

  const links: HubMenuItem[] = [
    { kind: "link", href: "/member/hub/rooms", label: t.memberHub.nav.rooms },
    { kind: "link", href: "/member/hub/events", label: t.memberHub.nav.events },
    { kind: "link", href: "/member/hub/connect", label: "Connect" },
    { kind: "tour", label: t.memberHub.nav.tour },
  ];

  const renderItem = (item: HubMenuItem, size: "center" | "sidebar" | "stack") => {
    if (item.kind === "tour") {
      return (
        <FlipButton key="tour" size={size} onClick={showTourComingSoon}>
          {item.label}
        </FlipButton>
      );
    }

    return (
      <FlipLink key={item.href} href={item.href} size={size}>
        {item.label}
      </FlipLink>
    );
  };

  if (variant === "stack") {
    return (
      <section className="flex w-full flex-col items-center gap-2 py-10 pt-16">
        <div className="flex w-full max-w-xs flex-col items-center gap-6 px-6">
          {links.map((link) => renderItem(link, "stack"))}
        </div>
      </section>
    );
  }

  if (variant === "sidebar") {
    return (
      <section className="flex flex-col justify-center h-full min-h-[70vh] px-8 lg:px-14 xl:px-20">
        <div className="flex flex-col items-start gap-6 lg:gap-10">
          {links.map((link) => renderItem(link, "sidebar"))}
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center gap-2 w-full h-screen">
      <div className="flex flex-col items-center gap-8 w-1/2">
        {links.map((link) => renderItem(link, "center"))}
      </div>
    </section>
  );
}

const flipClassNames = {
  sidebar:
    "group text-black relative block overflow-hidden whitespace-nowrap text-5xl font-black uppercase lg:text-6xl xl:text-7xl",
  stack:
    "group text-black relative block overflow-hidden whitespace-nowrap text-4xl font-black uppercase",
  center:
    "group text-black relative block overflow-hidden whitespace-nowrap text-4xl font-black uppercase sm:text-7xl md:text-8xl lg:text-9xl",
} as const;

function FlipContent({ children }: { children: string }) {
  return (
    <>
      <div className="flex">
        {children.split("").map((letter, i) => (
          <span
            key={`top-${i}`}
            className="inline-block transition-transform duration-300 ease-in-out group-hover:-translate-y-[110%]"
            style={{ transitionDelay: `${i * 25}ms` }}
          >
            {letter}
          </span>
        ))}
      </div>
      <div className="absolute inset-0 flex">
        {children.split("").map((letter, i) => (
          <span
            key={`bottom-${i}`}
            className="inline-block translate-y-[110%] transition-transform duration-300 ease-in-out group-hover:translate-y-0"
            style={{ transitionDelay: `${i * 25}ms` }}
          >
            {letter}
          </span>
        ))}
      </div>
    </>
  );
}

const FlipLink = ({
  children,
  href,
  size = "center",
}: {
  children: string;
  href: string;
  size?: "center" | "sidebar" | "stack";
}) => (
  <Link href={href} className={flipClassNames[size]} style={{ lineHeight: 0.75 }}>
    <FlipContent>{children}</FlipContent>
  </Link>
);

const FlipButton = ({
  children,
  onClick,
  size = "center",
}: {
  children: string;
  onClick: () => void;
  size?: "center" | "sidebar" | "stack";
}) => (
  <button
    type="button"
    onClick={onClick}
    className={flipClassNames[size]}
    style={{ lineHeight: 0.75 }}
  >
    <FlipContent>{children}</FlipContent>
  </button>
);
