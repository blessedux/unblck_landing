"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";
import { HubProfileMenu } from "@/components/HubProfileMenu";
import { useHubToast } from "@/components/HubToastProvider";

function HubBrand({
  href = "/",
  className = "",
  titleClassName = "text-xl font-bold text-black",
  subtitleClassName = "text-[11px] text-black/60 mt-0.5 max-w-[240px] leading-snug",
  showSubtitle = true,
}: {
  href?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  showSubtitle?: boolean;
}) {
  const { t } = useLocale();

  return (
    <Link href={href} className={cn("group block", className)}>
      <p
        className={cn(
          titleClassName,
          "group-hover:text-black/70 transition-colors",
        )}
      >
        UNBLCK
      </p>
      {showSubtitle && (
        <p className={subtitleClassName}>{t.memberHub.brandSubtitle}</p>
      )}
    </Link>
  );
}

function HubCenterNav({
  pathname,
  navItems,
  onTourClick,
}: {
  pathname: string;
  navItems: { href: string; label: string; comingSoon?: boolean }[];
  onTourClick: () => void;
}) {
  return (
    <nav className="hidden md:block fixed left-1/2 top-0 z-50 -translate-x-1/2">
      <div className="flex w-fit items-center justify-center gap-4 rounded-b-2xl bg-black px-5 py-2 sm:gap-6 sm:px-6 md:rounded-b-3xl md:px-7">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          if (item.comingSoon) {
            return (
              <button
                key={item.href}
                type="button"
                onClick={onTourClick}
                className="text-[10px] sm:text-xs md:text-sm font-medium text-[#E1E0CC]/80 transition-colors hover:text-[#E1E0CC]"
              >
                {item.label}
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[10px] sm:text-xs md:text-sm font-medium transition-colors",
                isActive
                  ? "text-[#E1E0CC]"
                  : "text-[#E1E0CC]/80 hover:text-[#E1E0CC]",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function HubNavbar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { t } = useLocale();
  const { showTourComingSoon } = useHubToast();
  const isHubHome = pathname === "/member/hub";

  const navItems = [
    { href: "/member/hub", label: t.memberHub.nav.menu },
    { href: "/member/hub/rooms", label: t.memberHub.nav.rooms },
    { href: "/member/hub/events", label: t.memberHub.nav.events },
    {
      href: "/member/hub/tour",
      label: t.memberHub.nav.tour,
      comingSoon: true,
    },
  ];

  if (isMobile) {
    if (isHubHome) {
      return (
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 pointer-events-none">
          <div className="flex items-start justify-between px-4 py-3">
            <HubBrand
              href="/"
              className="pointer-events-auto"
              titleClassName="text-base font-bold text-black"
              showSubtitle={false}
            />
            <div className="pointer-events-auto">
              <HubProfileMenu />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#d4a574] border-b border-black/10 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/member/hub"
            className="text-sm font-medium text-black hover:text-black/60 transition shrink-0"
          >
            {t.memberHub.nav.backToMenu}
          </Link>
          <HubBrand
            href="/"
            className="text-center"
            titleClassName="text-lg font-bold text-black"
            subtitleClassName="text-[10px] text-black/55 mt-0.5 max-w-[200px] mx-auto leading-snug"
          />
          <HubProfileMenu className="shrink-0" />
        </div>
      </div>
    );
  }

  return (
    <>
      <HubBrand
        href="/"
        className="hidden md:block fixed top-5 left-6 z-50 max-w-[min(240px,calc(50vw-12rem))]"
      />
      <HubCenterNav
        pathname={pathname}
        navItems={navItems}
        onTourClick={showTourComingSoon}
      />
      <HubProfileMenu className="hidden md:block fixed top-4 right-6 z-50" />
    </>
  );
}
