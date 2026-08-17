"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { AUTH_SCREEN_VT_NAME } from "@/lib/nav/auth-screen-vt";

const HERO_IMAGE = "/Roman_Vision.webp";

type AuthScreenShellProps = {
  children: ReactNode;
  onBack: () => void;
};

export function AuthScreenShell({ children, onBack }: AuthScreenShellProps) {
  return (
    <div className="fixed inset-0 z-[100] flex h-dvh w-screen items-stretch bg-black p-2 md:p-3">
      <div
        className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border border-white/15 bg-white shadow-2xl lg:flex-row md:rounded-[2rem]"
        style={{ viewTransitionName: AUTH_SCREEN_VT_NAME }}
      >
        <div className="relative hidden min-h-0 flex-1 p-3 lg:block">
          <div className="relative h-full overflow-hidden rounded-[1.25rem] lg:rounded-[1.5rem]">
            <Image
              src={HERO_IMAGE}
              alt="Roman Vision"
              fill
              priority
              sizes="50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20" />
          </div>
          <div className="absolute left-6 top-6 z-10">
            <button
              type="button"
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm transition-all hover:bg-black/30"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center overflow-y-auto bg-white">
          <div className="w-full max-w-md p-8">
            <div className="mb-6 lg:hidden">
              <button
                type="button"
                onClick={onBack}
                className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200"
                aria-label="Back to home"
              >
                <ArrowLeft className="h-5 w-5 text-gray-700" />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
