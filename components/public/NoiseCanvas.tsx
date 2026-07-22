"use client";

import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

/**
 * NoiseCanvas — Generative organic noise field background.
 * 
 * Uses simplex-noise to generate flowing blob shapes on a Canvas 2D.
 * Very subtle (opacity 6%) — adds organic "life" to the background.
 * Performance: 30fps cap, disabled on mobile and reduced-motion.
 * 
 * USAGE: Place inside a section with position:relative.
 *   <div className="relative">
 *     <NoiseCanvas color="#FDE047" />
 *     <div className="relative z-10">...content...</div>
 *   </div>
 */
interface NoiseCanvasProps {
  color?: string;
  className?: string;
}

export default function NoiseCanvas({
  color = "#FDE047",
  className = "",
}: NoiseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Disable on mobile for performance
    if (window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const noise3D = createNoise3D();
    let lastFrame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.offsetWidth * dpr * 0.5; // Half resolution for perf
      canvas.height = canvas.offsetHeight * dpr * 0.5;
      ctx.scale(dpr * 0.5, dpr * 0.5);
    };

    resize();
    window.addEventListener("resize", resize);

    const step = 25; // pixel step size — lower = more detail but slower

    const draw = (time: number) => {
      // 30fps cap
      if (time - lastFrame < 33) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      lastFrame = time;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      for (let x = 0; x < w; x += step) {
        for (let y = 0; y < h; y += step) {
          const n = noise3D(x * 0.003, y * 0.003, time * 0.0002);
          if (n > 0.25) {
            ctx.fillStyle = color;
            ctx.globalAlpha = n * 0.12;
            ctx.beginPath();
            ctx.arc(x, y, n * step * 0.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [color]);

  return <canvas ref={canvasRef} className={`noise-canvas ${className}`} />;
}
