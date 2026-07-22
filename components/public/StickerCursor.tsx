"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

/**
 * StickerCursor — Custom cursor dot that follows the mouse.
 * 
 * - Small dot (14px) with mix-blend-mode: difference
 * - Scales up (64px) when hovering interactive elements
 * - Shows label text when hovering (e.g. "LIHAT", "KLIK")
 * - Only renders on desktop (hidden on touch devices)
 * 
 * HOW IT WORKS:
 * 1. Listens to global mousemove → updates cursor position with GSAP spring
 * 2. Uses event delegation to detect hover on [data-cursor] elements
 * 3. [data-cursor="LABEL"] attribute on any element triggers hover state
 * 
 * USAGE: Place once in the public layout.
 * Then add data-cursor="LIHAT" to any element that should trigger cursor hover.
 */
export default function StickerCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, {
      x: e.clientX,
      y: e.clientY,
      xPercent: -50,
      yPercent: -50,
      duration: 0.2,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    // Only activate on non-touch devices
    if (typeof window === "undefined") return;
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    // Hide default cursor
    document.documentElement.style.cursor = "none";

    window.addEventListener("mousemove", handleMouseMove);

    // Event delegation for hover detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-cursor]");
      if (target) {
        setIsHovering(true);
        setLabel(target.getAttribute("data-cursor") || "");
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-cursor]");
      if (target) {
        setIsHovering(false);
        setLabel("");
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={cursorRef}
      className={`sticker-cursor hidden md:flex items-center justify-center ${isHovering ? "is-hovering" : ""}`}
    >
      <span className="sticker-cursor-label">{label}</span>
    </div>
  );
}
