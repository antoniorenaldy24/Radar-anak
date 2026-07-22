"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION_EASE, MOTION_DURATION } from "@/lib/motion/config";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StatCounterProps {
  target: number;
  duration?: number;
}

export default function StatCounter({
  target,
  duration = MOTION_DURATION.slow,
}: StatCounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Check if prefers-reduced-motion is active
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setCount(target);
      return;
    }

    const ctx = gsap.context(() => {
      const counterObj = { value: 0 };

      gsap.to(counterObj, {
        value: target,
        duration: duration,
        ease: MOTION_EASE.confident, // expo.out for smooth deceleration
        scrollTrigger: {
          trigger: elementRef.current,
          start: "top 90%", // starts when the top of the trigger hits 90% of the viewport height
          toggleActions: "play none none none",
          once: true, // trigger once
        },
        onUpdate: () => {
          setCount(Math.floor(counterObj.value));
        },
      });
    }, elementRef);

    return () => ctx.revert();
  }, [target, duration]);

  return <span ref={elementRef}>{count}</span>;
}
