"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Footer } from "@/components/Footer";

export function HubDesktopFooter() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return null;
  }

  return <Footer />;
}
