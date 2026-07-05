"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";

const BOTTOM_BLEED = 6;

function appendMaskHoleRect(
  group: SVGGElement,
  box: DOMRect,
  radius: number
) {
  const hole = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  hole.setAttribute("x", String(box.left));
  hole.setAttribute("y", String(box.top));
  hole.setAttribute("width", String(box.width));
  hole.setAttribute("height", String(box.height));
  hole.setAttribute("rx", String(radius));
  hole.setAttribute("fill", "black");
  group.appendChild(hole);
}

interface WhatWeDoSvgMaskProps {
  blackBgRef: RefObject<HTMLDivElement | null>;
  ctaRef: RefObject<HTMLElement | null>;
}

export function WhatWeDoSvgMask({
  blackBgRef,
  ctaRef,
}: WhatWeDoSvgMaskProps) {
  const maskHoleGroupRef = useRef<SVGGElement>(null);

  useLayoutEffect(() => {
    const blackBg = blackBgRef.current;
    const maskHoleGroup = maskHoleGroupRef.current;

    if (!blackBg || !maskHoleGroup) {
      return;
    }

    const maskId = "what-we-do-cta-mask";
    const maskUrl = `url(#${maskId})`;
    blackBg.style.mask = maskUrl;
    blackBg.style.webkitMask = maskUrl;

    let frame = 0;

    const render = () => {
      maskHoleGroup.replaceChildren();

      const cta = ctaRef.current;
      if (cta) {
        const ctaBox = cta.getBoundingClientRect();
        if (ctaBox.width > 0 && ctaBox.height > 0) {
          appendMaskHoleRect(maskHoleGroup, ctaBox, ctaBox.height / 2);
        }
      }
    };

    const scheduleRender = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(render);
    };

    scheduleRender();

    window.addEventListener("scroll", scheduleRender, { passive: true });
    window.addEventListener("resize", scheduleRender);

    const observers: ResizeObserver[] = [];
    const cta = ctaRef.current;
    if (cta) {
      const ctaObserver = new ResizeObserver(scheduleRender);
      ctaObserver.observe(cta);
      observers.push(ctaObserver);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleRender);
      window.removeEventListener("resize", scheduleRender);
      observers.forEach((observer) => observer.disconnect());
      blackBg.style.mask = "";
      blackBg.style.webkitMask = "";
    };
  }, [blackBgRef, ctaRef]);

  const maskId = "what-we-do-cta-mask";

  return (
    <svg aria-hidden className="pointer-events-none absolute h-0 w-0 overflow-hidden">
      <defs>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width="100%"
          height="100%"
        >
          <rect x={0} y={0} width="100vw" height="100vh" fill="white" />
          <g ref={maskHoleGroupRef} />
        </mask>
      </defs>
    </svg>
  );
}
