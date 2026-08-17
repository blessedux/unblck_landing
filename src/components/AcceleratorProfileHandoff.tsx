"use client";

import type { ReactNode } from "react";
import Link from "next/link";

/** Shared apply-page chrome so handoff skeleton and real form share one layout. */
export function AcceleratorApplyChrome({
  children,
  progress = 0,
  footer,
}: {
  children: ReactNode;
  progress?: number;
  footer?: ReactNode;
}) {
  return (
    <div className="relative z-10 flex min-h-dvh flex-col touch-manipulation">
      <div className="h-px w-full bg-border">
        <div
          className="h-full bg-foreground transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <header className="flex items-center justify-between gap-4 px-6 py-5">
        <Link
          href="/"
          className="text-sm font-medium tracking-[0.15em] text-muted transition hover:text-foreground"
        >
          UNBLCK
        </Link>
      </header>

      <div className="flex flex-1 items-start px-6 pb-28 pt-8 sm:items-center sm:pt-0">
        <div className="mx-auto w-full max-w-2xl">{children}</div>
      </div>

      {footer}
    </div>
  );
}

function Bone({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200/90 ${className}`}
      aria-hidden
    />
  );
}

/**
 * Step-1 profile card skeleton — same shape as the real card, no spinner/copy.
 * Used for the Gmail → apply handoff so the UI never dips into intermediate pages.
 */
export function AcceleratorProfileCardSkeleton() {
  return (
    <AcceleratorApplyChrome
      progress={0}
      footer={
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border/60 bg-black/80 px-6 py-4 backdrop-blur-md">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
            <div className="h-10 w-20 animate-pulse rounded-full bg-white/10" />
            <div className="h-10 w-28 animate-pulse rounded-full bg-white/15" />
          </div>
        </div>
      }
    >
      <div
        className="mx-auto w-full max-w-md rounded-3xl border border-white/15 bg-white p-6 text-gray-900 shadow-2xl sm:p-8"
        role="status"
        aria-busy="true"
        aria-label="Loading profile"
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
          UNBLCK
        </p>
        <Bone className="mt-3 h-8 w-56" />
        <Bone className="mt-3 h-4 w-full max-w-[18rem]" />

        <div className="mt-8 flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 animate-pulse rounded-full bg-gray-200" />
          <div className="min-w-0 flex-1 space-y-2">
            <Bone className="h-4 w-32" />
            <Bone className="h-3 w-44" />
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <Bone className="mb-2 h-4 w-16" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-gray-100" />
          </div>
          <div>
            <Bone className="mb-2 h-4 w-14" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-gray-100" />
            <Bone className="mt-2 h-3 w-52" />
          </div>
          <div className="border-t border-gray-200 pt-5">
            <Bone className="h-4 w-20" />
            <Bone className="mt-2 h-3 w-40" />
          </div>
        </div>
      </div>
    </AcceleratorApplyChrome>
  );
}
