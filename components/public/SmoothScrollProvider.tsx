"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * SmoothScrollProvider — Lenis smooth scroll with momentum.
 * 
 * Tuned for "luxury" feel:
 * - duration: 1.4 (slightly longer than default for premium feel)
 * - Exposes scroll velocity on window.__lenisVelocity for VelocityMarquee
 * - Synced with GSAP ticker + ScrollTrigger
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Sync ScrollTrigger with Lenis + expose velocity
    lenis.on("scroll", (e: any) => {
      ScrollTrigger.update();
      // Expose velocity for VelocityMarquee speed control
      if (typeof window !== "undefined") {
        (window as any).__lenisVelocity = e.velocity || 0;
      }
    });

    // Connect Lenis to GSAP ticker
    const updatePhysics = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updatePhysics);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updatePhysics);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
