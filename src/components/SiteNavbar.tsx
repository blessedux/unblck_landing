"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";

export function SiteNavbar() {
  const pathname = usePathname();
  const { t } = useLocale();

  if (pathname?.startsWith("/member")) {
    return null;
  }

  const navItems = [
    { label: t.nav.accelerator, href: "#insta-awards" },
    { label: t.nav.hub, href: "#what-we-do" },
    { label: t.nav.ourStory, href: "#our-story" },
  ];

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="fixed left-1/2 top-0 z-50 -translate-x-1/2">
      <div className="flex w-fit items-center justify-center gap-6 rounded-b-2xl bg-black px-5 py-2 sm:gap-8 sm:px-6 md:rounded-b-3xl md:px-7">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={(e) => handleSmoothScroll(e, item.href)}
            className="text-[10px] transition-colors sm:text-xs md:text-sm"
            style={{ color: "rgba(225, 224, 204, 0.8)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#E1E0CC")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(225, 224, 204, 0.8)")}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/accelerator/apply"
          className="shrink-0 rounded-full bg-primary px-3 py-1 text-[10px] font-medium text-black transition-opacity hover:opacity-90 sm:px-4 sm:py-1.5 sm:text-xs md:text-sm"
        >
          {t.nav.apply}
        </Link>
      </div>
    </nav>
  );
}
