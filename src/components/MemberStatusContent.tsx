"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";

type MemberStatusView =
  | { type: "no_application" }
  | { type: "pending"; appliedAt: string }
  | { type: "rejected" };

export function MemberStatusContent({ view }: { view: MemberStatusView }) {
  const { t, locale } = useLocale();
  const copy = t.memberHub.memberStatus;

  if (view.type === "no_application") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <h1 className="text-3xl font-bold mb-4">{copy.noApplication.title}</h1>
          <p className="text-gray-400 mb-8">{copy.noApplication.description}</p>
          <div className="flex flex-col gap-3">
            <Link
              href="/apply"
              className="inline-block bg-white text-black px-6 py-3 font-medium hover:bg-gray-200 transition rounded-full"
            >
              {copy.noApplication.hubAccess}
            </Link>
            <Link
              href="/accelerator/apply"
              className="inline-block border border-white/20 text-white px-6 py-3 font-medium hover:bg-white/10 transition rounded-full"
            >
              {copy.noApplication.accelerator}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (view.type === "pending") {
    const appliedDate = new Date(view.appliedAt).toLocaleDateString(
      locale === "es" ? "es-CL" : "en-US",
    );

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <div className="mb-6 inline-block h-16 w-16 animate-pulse rounded-full bg-yellow-500/20" />
          <h1 className="text-3xl font-bold mb-4">{copy.pending.title}</h1>
          <p className="text-gray-400 mb-2">{copy.pending.description}</p>
          <p className="text-sm text-gray-500">
            {copy.pending.appliedOn.replace("{date}", appliedDate)}
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              {copy.pending.backHome}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-4">{copy.rejected.title}</h1>
        <p className="text-gray-400 mb-8">{copy.rejected.description}</p>
        <div className="space-y-3">
          <Link
            href="/"
            className="block text-sm text-gray-400 hover:text-white transition"
          >
            {copy.rejected.backHome}
          </Link>
          <p className="text-sm text-gray-500">{copy.rejected.community}</p>
        </div>
      </div>
    </div>
  );
}
