"use client";

import React, { useRef, useCallback } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

/**
 * MagneticButton — Button that "attracts" toward the cursor on hover.
 * 
 * HOW IT WORKS:
 * 1. On mousemove within the button, calculate cursor offset from center
 * 2. GSAP tweens the button position by 30% of that offset (attraction strength)
 * 3. On mouseleave, button snaps back with elastic.out easing
 * 
 * Props: Same as <button> + className, children, data-cursor
 */
interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  attractionStrength?: number;
}

export default function MagneticButton({
  children,
  className,
  attractionStrength = 0.3,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(buttonRef.current, {
        x: x * attractionStrength,
        y: y * attractionStrength,
        duration: 0.3,
        ease: "power2.out",
      });
    },
    [attractionStrength]
  );

  const handleMouseLeave = useCallback(() => {
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.3)",
    });
  }, []);

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="KLIK"
      className={cn(
        "relative font-sans text-sm font-bold transition-shadow duration-150",
        "px-7 py-3.5 bg-[#FFFFFF] text-[#121212] border-[3px] border-[#121212] rounded-none",
        "shadow-[6px_6px_0px_0px_#121212]",
        "hover:shadow-[8px_8px_0px_0px_#121212]",
        "active:shadow-[2px_2px_0px_0px_#121212] active:translate-x-[2px] active:translate-y-[2px]",
        "disabled:opacity-50 disabled:pointer-events-none",
        "cursor-none",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
