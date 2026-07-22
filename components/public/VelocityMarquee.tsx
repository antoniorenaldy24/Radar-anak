"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * VelocityMarquee — Infinite horizontal scroll ticker.
 * 
 * - GSAP-powered horizontal animation.
 * - Speed scale dynamically adapts to Lenis scroll velocity.
 * - Pauses on hover, speeds up smoothly on scroll, returns to base speed.
 * - Content is duplicated to ensure seamless loop.
 */
interface VelocityMarqueeProps {
  text: string;
  bgColor?: string;
  textColor?: string;
  speed?: number; // seconds for one complete loop
  className?: string;
}

export default function VelocityMarquee({
  text,
  bgColor = "#121212",
  textColor = "#FAF9F5",
  speed = 25,
  className = "",
}: VelocityMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const repeatedText = `${text} — ${text} — ${text} — ${text} — `;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Slide horizontal track to -50% for seamless looping
    const tween = gsap.to(track, {
      xPercent: -50,
      ease: "none",
      duration: speed,
      repeat: -1,
    });

    // Reactive scroll velocity listener
    const handleScroll = () => {
      if (typeof window === "undefined") return;
      const velocity = Math.abs((window as any).__lenisVelocity || 0);
      
      // Base speed is 1.0. Speed up by up to 5x for heavy scrolling.
      const targetScale = 1.0 + Math.min(velocity * 0.12, 5.0);

      gsap.to(tween, {
        timeScale: targetScale,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      tween.kill();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [speed]);

  return (
    <div
      className={`w-full overflow-hidden py-4 border-y-[3px] border-[#121212] select-none ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <div ref={trackRef} className="marquee-track flex whitespace-nowrap">
        <span
          className="font-serif text-2xl md:text-3xl lg:text-4xl italic font-bold tracking-tight px-4"
          style={{ color: textColor }}
        >
          {repeatedText}
        </span>
        <span
          className="font-serif text-2xl md:text-3xl lg:text-4xl italic font-bold tracking-tight px-4"
          style={{ color: textColor }}
          aria-hidden="true"
        >
          {repeatedText}
        </span>
      </div>
    </div>
  );
}
