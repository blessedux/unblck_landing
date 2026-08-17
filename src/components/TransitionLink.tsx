"use client";

import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { forwardRef, type MouseEvent, type ReactNode } from "react";
import { startViewTransition } from "@/lib/nav/start-view-transition";

type TransitionLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  function TransitionLink({ href, children, className, onClick, ...props }, ref) {
    const router = useRouter();

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }

      const url = typeof href === "string" ? href : href.pathname;
      if (!url || url.startsWith("#") || url.startsWith("http")) return;

      event.preventDefault();
      startViewTransition(() => {
        router.push(url);
      });
    };

    return (
      <Link
        ref={ref}
        href={href}
        className={className}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Link>
    );
  },
);
