"use client";

import React, { useRef, useCallback } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

/**
 * TiltCard — Card with 3D tilt effect that follows mouse position.
 * 
 * HOW IT WORKS:
 * 1. On mousemove, calculate cursor position relative to card center
 * 2. Convert to rotation angles (max ±10 degrees)
 * 3. GSAP tweens rotateX and rotateY with perspective
 * 4. On mouseleave, reset to flat with elastic easing
 * 
 * Also supports hover shadow growth + translateY lift.
 */
interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  tiltIntensity?: number; // max rotation degrees, default 10
}

export default function TiltCard({
  children,
  className,
  tiltIntensity = 10,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(cardRef.current, {
        rotateY: x * tiltIntensity,
        rotateX: -y * tiltIntensity,
        translateY: -8,
        boxShadow: "10px 10px 0px 0px #121212",
        duration: 0.3,
        ease: "power2.out",
        transformPerspective: 800,
      });
    },
    [tiltIntensity]
  );

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      translateY: 0,
      boxShadow: "6px 6px 0px 0px #121212",
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "bg-[#FFFFFF] border-[3px] border-[#121212] shadow-[6px_6px_0px_0px_#121212]",
        "transition-none cursor-none",
        className
      )}
      style={{ transformStyle: "preserve-3d" }}
      {...props}
    >
      {children}
    </div>
  );
}
