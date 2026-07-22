"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { MOTION_EASE, MOTION_DURATION, MOTION_STAGGER } from "@/lib/motion/config";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * KineticText — Reusable kinetic typography component.
 * 
 * Modes:
 * - "hero": char-by-char with rotateX + skewY (dramatic entrance, trigger on mount)
 * - "heading": char-by-char with rotateX (ScrollTrigger entrance)
 * - "paragraph": word-by-word opacity scrub (scroll-synced reading)
 * - "lines": line-by-line clip reveal (ScrollTrigger entrance)
 * 
 * USAGE:
 *   <KineticText as="h1" mode="hero">RADAR ANAK</KineticText>
 *   <KineticText as="h2" mode="heading">Dampak Penanganan</KineticText>
 *   <KineticText as="p" mode="paragraph">Long description text...</KineticText>
 */
interface KineticTextProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  mode: "hero" | "heading" | "paragraph" | "lines";
  className?: string;
  delay?: number;
}

export default function KineticText({
  children,
  as: Tag = "div",
  mode,
  className = "",
  delay = 0,
}: KineticTextProps) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const el = elementRef.current;
    if (!el) return;

    let split: SplitType | null = null;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      el.classList.remove("kinetic-text-hidden");
      el.classList.add("kinetic-text-visible");
      return;
    }

    const ctx = gsap.context(() => {
      el.classList.remove("kinetic-text-hidden");
      el.classList.add("kinetic-text-visible");

      if (mode === "hero") {
        split = new SplitType(el, { types: "chars,words" });
        gsap.from(split.chars, {
          y: "120%",
          rotateX: -80,
          skewY: 8,
          opacity: 0,
          scale: 0.6,
          duration: MOTION_DURATION.dramatic,
          ease: MOTION_EASE.dramatic,
          stagger: MOTION_STAGGER.char,
          delay: delay,
        });
      } else if (mode === "heading") {
        split = new SplitType(el, { types: "chars,words" });
        gsap.from(split.chars, {
          y: "110%",
          rotateX: -60,
          opacity: 0,
          duration: MOTION_DURATION.slow,
          ease: MOTION_EASE.confident,
          stagger: MOTION_STAGGER.char,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      } else if (mode === "paragraph") {
        split = new SplitType(el, { types: "words" });
        if (split.words) {
          gsap.set(split.words, { opacity: 0.15 });
          gsap.to(split.words, {
            opacity: 1,
            stagger: MOTION_STAGGER.word,
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "bottom 60%",
              scrub: 0.5,
            },
          });
        }
      } else if (mode === "lines") {
        split = new SplitType(el, { types: "lines" });
        if (split.lines) {
          split.lines.forEach((line) => {
            const wrapper = document.createElement("div");
            wrapper.className = "line-wrapper overflow-hidden";
            line.parentNode?.insertBefore(wrapper, line);
            wrapper.appendChild(line);
          });

          gsap.from(split.lines, {
            y: "100%",
            opacity: 0,
            duration: MOTION_DURATION.slow,
            ease: MOTION_EASE.confident,
            stagger: MOTION_STAGGER.line,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        }
      }
    }, el);

    return () => {
      ctx.revert();
      if (split) {
        split.revert();
      }
    };
  }, [mode, delay, children]);

  return (
    <Tag
      ref={elementRef as any}
      className={`kinetic-text-hidden ${mode === "hero" ? "perspective-1000" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
