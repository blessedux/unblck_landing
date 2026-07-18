"use client";

import { ChannelLinks } from "@/components/ChannelLinks";
import { useLocale } from "@/contexts/LocaleContext";

export default function HubConnectPage() {
  const { t } = useLocale();
  const copy = t.memberHub.connect;

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-black">{copy.pageTitle}</h1>
        <p className="text-black/60">{copy.pageDescription}</p>
      </div>

      <ChannelLinks />
    </div>
  );
}
