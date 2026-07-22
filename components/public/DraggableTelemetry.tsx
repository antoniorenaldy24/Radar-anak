"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * DraggableTelemetry — Hover-reactive telemetry elements for Radar Anak.
 * 
 * - Replaces clunky dragging mechanics with high-end, responsive hover-animations.
 * - On hover, triggers a satisfying elastic scale-up and 90-degree twist (spring bounce).
 * - Removed annoying custom cursor attributes to keep navigation clean and fluid.
 * - Shapes: crosshair, signal, compass, cross, zigzag, circle, arrow.
 */
interface DraggableTelemetryProps {
  shape: "crosshair" | "signal" | "compass" | "cross" | "zigzag" | "circle" | "arrow";
  size?: number;
  color?: string;
  initialX?: string;
  initialY?: string;
  rotate?: number;
  className?: string;
}

const shapes: Record<string, (color: string) => string> = {
  crosshair: (c) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 1v22M1 12h22"/></svg>`,
  signal: (c) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"/><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/><circle cx="12" cy="12" r="2" fill="${c}"/></svg>`,
  compass: (c) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"><polygon points="12,2 16,12 12,22 8,12" fill="${c}20"/><circle cx="12" cy="12" r="9"/></svg>`,
  cross: (c) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"><path d="M12 3v18M3 12h18"/></svg>`,
  zigzag: (c) =>
    `<svg viewBox="0 0 48 24" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"><polyline points="2,18 10,6 18,18 26,6 34,18 42,6"/></svg>`,
  circle: (c) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.5"><circle cx="12" cy="12" r="10"/></svg>`,
  arrow: (c) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
};

export default function DraggableTelemetry({
  shape,
  size = 50,
  color = "#121212",
  initialX = "10%",
  initialY = "20%",
  rotate = 0,
  className = "",
}: DraggableTelemetryProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseEnter = () => {
    gsap.to(ref.current, {
      scale: 1.3,
      rotate: rotate + 90,
      duration: 0.5,
      ease: "elastic.out(1, 0.4)",
    });
  };

  const onMouseLeave = () => {
    gsap.to(ref.current, {
      scale: 1.0,
      rotate: rotate,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
  };

  return (
    <div
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute select-none z-30 transition-transform ${className}`}
      style={{
        width: size,
        height: size,
        left: initialX,
        top: initialY,
        transform: `rotate(${rotate}deg)`,
      }}
      dangerouslySetInnerHTML={{ __html: shapes[shape]?.(color) || "" }}
    />
  );
}
