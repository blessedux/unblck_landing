"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface CursorDrivenParticleTypographyProps {
  className?: string;
  text: string;
  fontSize?: number;
  mobileFontSize?: number;
  fontFamily?: string;
  particleSize?: number;
  particleDensity?: number;
  mobileParticleDensity?: number;
  dispersionStrength?: number;
  returnSpeed?: number;
  color?: string;
  accelerometerOnMobile?: boolean;
}

class Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  dispersion: number;
  returnSpd: number;

  constructor(
    x: number,
    y: number,
    size: number,
    color: string,
    dispersion: number,
    returnSpd: number,
  ) {
    this.x = x + (Math.random() - 0.5) * 10;
    this.y = y + (Math.random() - 0.5) * 10;
    this.originX = x;
    this.originY = y;
    this.vx = (Math.random() - 0.5) * 5;
    this.vy = (Math.random() - 0.5) * 5;
    this.size = size;
    this.color = color;
    this.dispersion = dispersion;
    this.returnSpd = returnSpd;
  }

  update(
    interactionX: number,
    interactionY: number,
    interactionRadius: number,
  ) {
    const dx = interactionX - this.x;
    const dy = interactionY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (
      distance < interactionRadius &&
      interactionX !== -1000 &&
      interactionY !== -1000
    ) {
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;
      const force = (interactionRadius - distance) / interactionRadius;

      const repulsionX = forceDirectionX * force * this.dispersion;
      const repulsionY = forceDirectionY * force * this.dispersion;

      this.vx -= repulsionX;
      this.vy -= repulsionY;
    }

    this.vx += (this.originX - this.x) * this.returnSpd;
    this.vy += (this.originY - this.y) * this.returnSpd;

    this.vx *= 0.85;
    this.vy *= 0.85;

    const distToOrigin = Math.sqrt(
      Math.pow(this.x - this.originX, 2) + Math.pow(this.y - this.originY, 2),
    );

    if (distToOrigin < 1 && Math.random() > 0.95) {
      this.vx += (Math.random() - 0.5) * 0.2;
      this.vy += (Math.random() - 0.5) * 0.2;
    }

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function CursorDrivenParticleTypography({
  className,
  text,
  fontSize = 120,
  mobileFontSize,
  fontFamily = "var(--font-geist-sans), system-ui, sans-serif",
  particleSize = 1.5,
  particleDensity = 6,
  mobileParticleDensity,
  dispersionStrength = 15,
  returnSpeed = 0.08,
  color,
  accelerometerOnMobile = true,
}: CursorDrivenParticleTypographyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    let pointerX = -1000;
    let pointerY = -1000;
    let tiltX = -1000;
    let tiltY = -1000;
    let smoothedTiltX = -1000;
    let smoothedTiltY = -1000;

    let containerWidth = 0;
    let containerHeight = 0;
    let isMobileLayout = false;
    let accelerometerActive = false;
    let orientationListenerAttached = false;

    // Accelerometer must only ever run on genuine touch devices; container
    // width is unreliable (the footer canvas is narrow even on desktop).
    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;

    const init = () => {
      const container = containerRef.current;
      if (!container) return;

      containerWidth = container.clientWidth;
      containerHeight = container.clientHeight;
      isMobileLayout = window.innerWidth < 768;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = containerWidth * dpr;
      canvas.height = containerHeight * dpr;
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const computedStyle = window.getComputedStyle(container);
      const textColor = color || computedStyle.color || "#000000";
      const resolvedFontFamily = fontFamily.includes("var(")
        ? computedStyle.fontFamily
        : fontFamily;

      ctx.clearRect(0, 0, containerWidth, containerHeight);

      const configuredSize = isMobileLayout
        ? (mobileFontSize ?? fontSize)
        : fontSize;
      const configuredDensity = isMobileLayout
        ? (mobileParticleDensity ?? particleDensity)
        : particleDensity;
      const sizeCap = isMobileLayout ? 0.22 : 0.15;
      const effectiveFontSize = Math.min(
        configuredSize,
        containerWidth * sizeCap,
      );

      ctx.fillStyle = textColor;
      ctx.font = `bold ${effectiveFontSize}px ${resolvedFontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, containerWidth / 2, containerHeight / 2);

      const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);

      particles = [];

      const step = Math.max(1, Math.floor(configuredDensity * dpr));

      for (let y = 0; y < textCoordinates.height; y += step) {
        for (let x = 0; x < textCoordinates.width; x += step) {
          const index = (y * textCoordinates.width + x) * 4;
          const alpha = textCoordinates.data[index + 3] || 0;

          if (alpha > 128) {
            particles.push(
              new Particle(
                x / dpr,
                y / dpr,
                particleSize,
                textColor,
                dispersionStrength,
                returnSpeed,
              ),
            );
          }
        }
      }

      if (isMobileLayout) {
        smoothedTiltX = containerWidth / 2;
        smoothedTiltY = containerHeight / 2;
        tiltX = smoothedTiltX;
        tiltY = smoothedTiltY;
      }
    };

    const getInteractionPoint = () => {
      const interactionRadius = isMobileLayout ? 150 : 120;

      // Direct pointer input (mouse/touch) always wins over tilt.
      if (pointerX !== -1000 && pointerY !== -1000) {
        return { x: pointerX, y: pointerY, radius: interactionRadius };
      }

      if (accelerometerActive) {
        return {
          x: smoothedTiltX,
          y: smoothedTiltY,
          radius: interactionRadius,
        };
      }

      return { x: -1000, y: -1000, radius: interactionRadius };
    };

    const animate = () => {
      if (accelerometerActive) {
        smoothedTiltX += (tiltX - smoothedTiltX) * 0.14;
        smoothedTiltY += (tiltY - smoothedTiltY) * 0.14;
      }

      const { x, y, radius } = getInteractionPoint();

      ctx.clearRect(0, 0, containerWidth, containerHeight);

      particles.forEach((particle) => {
        particle.update(x, y, radius);
        particle.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = clientX - rect.left;
      pointerY = clientY - rect.top;
    };

    const handleMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      handlePointerMove(touch.clientX, touch.clientY);
    };

    const handlePointerLeave = () => {
      pointerX = -1000;
      pointerY = -1000;
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;

      tiltX = containerWidth * clamp((e.gamma + 45) / 90, 0.08, 0.92);
      tiltY = containerHeight * clamp((e.beta - 30) / 80, 0.08, 0.92);
    };

    const attachOrientationListener = () => {
      if (orientationListenerAttached) return;
      window.addEventListener("deviceorientation", handleOrientation, true);
      orientationListenerAttached = true;
      accelerometerActive = true;
    };

    const enableAccelerometer = async () => {
      if (!accelerometerOnMobile || !isTouchDevice) return;

      const OrientationEvent = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<PermissionState>;
      };

      try {
        if (typeof OrientationEvent.requestPermission === "function") {
          const permission = await OrientationEvent.requestPermission();
          if (permission !== "granted") return;
        }
        attachOrientationListener();
      } catch {
        // Fall back to touch interaction only.
      }
    };

    const handleResize = () => {
      init();
    };

    const timeoutId = setTimeout(() => {
      init();
      animate();
      if (
        accelerometerOnMobile &&
        isTouchDevice &&
        "DeviceOrientationEvent" in window
      ) {
        const OrientationEvent = DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<PermissionState>;
        };
        if (typeof OrientationEvent.requestPermission !== "function") {
          attachOrientationListener();
        }
      }
    }, 100);

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handlePointerLeave);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handlePointerLeave);
    canvas.addEventListener("pointerdown", () => {
      void enableAccelerometer();
    });

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handlePointerLeave);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handlePointerLeave);
      if (orientationListenerAttached) {
        window.removeEventListener("deviceorientation", handleOrientation, true);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    text,
    fontSize,
    mobileFontSize,
    fontFamily,
    particleSize,
    particleDensity,
    mobileParticleDensity,
    dispersionStrength,
    returnSpeed,
    color,
    accelerometerOnMobile,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-full w-full touch-none items-center justify-center",
        className,
      )}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
