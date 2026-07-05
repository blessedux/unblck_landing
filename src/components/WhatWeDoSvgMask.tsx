"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";

const PANEL_RADIUS = 32;
const BOTTOM_BLEED = 6;

function roundedTopPath(
  left: number,
  top: number,
  width: number,
  height: number,
  radius: number
) {
  const right = left + width;
  const bottom = top + height;
  const r = Math.min(radius, width / 2, height);

  return [
    `M ${left} ${bottom}`,
    `L ${left} ${top + r}`,
    `Q ${left} ${top} ${left + r} ${top}`,
    `H ${right - r}`,
    `Q ${right} ${top} ${right} ${top + r}`,
    `V ${bottom}`,
    "Z",
  ].join(" ");
}

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
  sectionRef: RefObject<HTMLElement | null>;
  ctaRef: RefObject<HTMLElement | null>;
}

export function WhatWeDoSvgMask({
  sectionRef,
  ctaRef,
}: WhatWeDoSvgMaskProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const panelRef = useRef<SVGPathElement>(null);
  const bottomSealRef = useRef<SVGRectElement>(null);
  const maskHoleGroupRef = useRef<SVGGElement>(null);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    const panel = panelRef.current;
    const bottomSeal = bottomSealRef.current;
    const maskHoleGroup = maskHoleGroupRef.current;
    const section = sectionRef.current;

    if (!svg || !panel || !bottomSeal || !maskHoleGroup || !section) {
      return;
    }

    let frame = 0;

    const render = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const visible = rect.bottom > 0 && rect.top < viewportHeight;

      svg.style.display = visible ? "block" : "none";
      if (!visible || rect.height <= 0) return;

      const panelHeight = rect.height + BOTTOM_BLEED;
      panel.setAttribute(
        "d",
        roundedTopPath(rect.left, rect.top, rect.width, panelHeight, PANEL_RADIUS)
      );

      bottomSeal.setAttribute("x", String(rect.left));
      bottomSeal.setAttribute("y", String(rect.top + rect.height - 1));
      bottomSeal.setAttribute("width", String(rect.width));
      bottomSeal.setAttribute("height", String(BOTTOM_BLEED + 2));

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
    const sectionObserver = new ResizeObserver(scheduleRender);
    sectionObserver.observe(section);
    observers.push(sectionObserver);

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
    };
  }, [sectionRef, ctaRef]);

  const maskId = "what-we-do-cta-mask";

  return (
    <svg
      ref={svgRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[19] h-full w-full"
    >
      <defs>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width="100%"
          height="100%"
        >
          <rect x={0} y={0} width="100%" height="100%" fill="white" />
          <g ref={maskHoleGroupRef} />
        </mask>
      </defs>

      <path ref={panelRef} fill="#000000" mask={`url(#${maskId})`} />
      <rect ref={bottomSealRef} fill="#000000" />
    </svg>
  );
}
