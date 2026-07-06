"use client";

import React from "react";
import Link from "next/link";

type HubMenuLinksProps = {
  variant?: "center" | "sidebar" | "stack";
};

export function HubMenuLinks({ variant = "center" }: HubMenuLinksProps) {
  if (variant === "stack") {
    return (
      <section className="flex w-full flex-col items-center gap-2 py-10">
        <div className="flex w-full max-w-xs flex-col items-center gap-6 px-6">
          <FlipLink href="/member/hub/rooms" size="stack">
            Rooms
          </FlipLink>
          <FlipLink href="/member/hub/events" size="stack">
            Events
          </FlipLink>
          <FlipLink href="/member/hub/tour" size="stack">
            Tour
          </FlipLink>
        </div>
      </section>
    );
  }

  if (variant === "sidebar") {
    return (
      <section className="flex flex-col justify-center h-full min-h-[70vh] px-8 lg:px-14 xl:px-20">
        <div className="flex flex-col items-start gap-6 lg:gap-10">
          <FlipLink href="/member/hub/rooms" size="sidebar">
            Rooms
          </FlipLink>
          <FlipLink href="/member/hub/events" size="sidebar">
            Events
          </FlipLink>
          <FlipLink href="/member/hub/tour" size="sidebar">
            Tour
          </FlipLink>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center gap-2 w-full h-screen">
      <div className="flex flex-col items-center gap-8 w-1/2">
        <FlipLink href="/member/hub/rooms">Rooms</FlipLink>
        <FlipLink href="/member/hub/events">Events</FlipLink>
        <FlipLink href="/member/hub/tour">Tour</FlipLink>
      </div>
    </section>
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
}) => {
  const linkClassName =
    size === "sidebar"
      ? "group text-black relative block overflow-hidden whitespace-nowrap text-5xl font-black uppercase lg:text-6xl xl:text-7xl"
      : size === "stack"
        ? "group text-black relative block overflow-hidden whitespace-nowrap text-4xl font-black uppercase"
        : "group text-black relative block overflow-hidden whitespace-nowrap text-4xl font-black uppercase sm:text-7xl md:text-8xl lg:text-9xl";
  const linkStyle = { lineHeight: 0.75 };

  const linkContent = (
    <>
      <div className="flex">
        {children.split("").map((letter, i) => (
          <span
            key={i}
            className="inline-block transition-transform duration-300 ease-in-out group-hover:-translate-y-[110%]"
            style={{
              transitionDelay: `${i * 25}ms`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>
      <div className="absolute inset-0 flex">
        {children.split("").map((letter, i) => (
          <span
            key={i}
            className="inline-block translate-y-[110%] transition-transform duration-300 ease-in-out group-hover:translate-y-0"
            style={{
              transitionDelay: `${i * 25}ms`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>
    </>
  );

  return (
    <Link href={href} className={linkClassName} style={linkStyle}>
      {linkContent}
    </Link>
  );
};
