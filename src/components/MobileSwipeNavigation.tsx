"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileSwipeNavigationProps {
  children: React.ReactNode;
}

export function MobileSwipeNavigation({
  children,
}: MobileSwipeNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);
  const [dragCurrentY, setDragCurrentY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 100;
  const maxVerticalMovement = 50;

  const getMotionBlur = () => {
    if (!isDragging || !isMobile) return 0;

    const deltaX = Math.abs(dragStartX - dragCurrentX);
    const maxBlur = 8;
    const blurThreshold = 50;

    if (deltaX < blurThreshold) return 0;

    const blurIntensity =
      Math.min((deltaX - blurThreshold) / 100, 1) * maxBlur;
    return blurIntensity;
  };

  const getContentSlide = () => {
    if (!isDragging || !isMobile) return 0;

    const deltaX = dragStartX - dragCurrentX;
    const slideIntensity = Math.min(Math.abs(deltaX) / 400, 0.15);

    return deltaX > 0 ? -slideIntensity : slideIntensity;
  };

  const getOpacity = () => {
    if (!isDragging || !isMobile) return 1;

    const deltaX = Math.abs(dragStartX - dragCurrentX);
    const fadeThreshold = 30;
    const maxFade = 0.3;

    if (deltaX < fadeThreshold) return 1;

    const fadeIntensity =
      Math.min((deltaX - fadeThreshold) / 100, 1) * (1 - maxFade);
    return 1 - fadeIntensity;
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (!isMobile) return;

    const target = e.target as HTMLElement;
    if (target.closest("a, button, [role=\"button\"]")) {
      return;
    }

    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setDragStartY(e.touches[0].clientY);
    setDragCurrentX(e.touches[0].clientX);
    setDragCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isMobile || !isDragging) return;

    setDragCurrentX(e.touches[0].clientX);
    setDragCurrentY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!isMobile || !isDragging) {
      return;
    }

    const deltaX = dragStartX - dragCurrentX;
    const deltaY = Math.abs(dragStartY - dragCurrentY);

    if (Math.abs(deltaX) > minSwipeDistance && deltaY < maxVerticalMovement) {
      if (typeof window === "undefined") {
        return;
      }

      // Menu is at /member/hub
      if (pathname === "/member/hub") {
        return; // Can't swipe from menu
      }

      if (deltaX > 0) {
        // Swiped left to right - go back to menu
        router.push("/member/hub");
      } else {
        // Swiped right to left - cycle through pages
        if (pathname === "/member/hub/rooms") {
          router.push("/member/hub/events");
        } else if (pathname === "/member/hub/events") {
          router.push("/member/hub/tour");
        } else if (pathname === "/member/hub/tour") {
          router.push("/member/hub/rooms");
        }
      }
    }

    setIsDragging(false);
  };

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    isMobile,
    isDragging,
    dragStartX,
    dragStartY,
    dragCurrentX,
    dragCurrentY,
    pathname,
  ]);

  const slideX = getContentSlide() * 100;
  const blurAmount = getMotionBlur();
  const opacity = getOpacity();

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{
        touchAction: isMobile ? "pan-y" : "auto",
        userSelect: "text",
        WebkitUserSelect: "text",
      }}
    >
      <div
        style={{
          filter: `blur(${blurAmount}px)`,
          opacity: opacity,
          transform: isDragging
            ? `translateX(${slideX}%)`
            : "translateX(0%)",
          transition: isDragging
            ? "none"
            : "filter 0.3s ease-out, transform 0.3s ease-out, opacity 0.3s ease-out",
          willChange: isDragging ? "transform, filter, opacity" : "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}
