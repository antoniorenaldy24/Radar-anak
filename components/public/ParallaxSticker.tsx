"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ParallaxSticker — Floating neo-brutalist decorative element.
 * 
 * Moves at a different scroll speed than the page (parallax).
 * Shapes: star, arrow, circle, cross, zigzag
 */
interface ParallaxStickerProps {
  shape: "star" | "arrow" | "circle" | "cross" | "zigzag";
  size?: number;
  color?: string;
  speed?: number; // negative = moves opposite to scroll, positive = same direction
  rotate?: number;
  className?: string;
  style?: React.CSSProperties;
}

const shapes: Record<string, (color: string) => string> = {
  star: (c) =>
    `<svg viewBox="0 0 24 24" fill="${c}" stroke="#121212" stroke-width="1.5"><polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9"/></svg>`,
  arrow: (c) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
  circle: (c) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.5"><circle cx="12" cy="12" r="10"/></svg>`,
  cross: (c) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"><path d="M12 3v18M3 12h18"/></svg>`,
  zigzag: (c) =>
    `<svg viewBox="0 0 48 24" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"><polyline points="2,18 10,6 18,18 26,6 34,18 42,6"/></svg>`,
};

export default function ParallaxSticker({
  shape,
  size = 40,
  color = "#FDE047",
  speed = -40,
  rotate = 0,
  className = "",
  style = {},
}: ParallaxStickerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: speed,
        rotate: rotate,
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [speed, rotate]);

  return (
    <div
      ref={ref}
      className={`parallax-sticker ${className}`}
      style={{ width: size, height: size, ...style }}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: shapes[shape]?.(color) || "" }}
    />
  );
}
