"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * WebGLImage — Image with OGL WebGL CRT Glitch shader on hover.
 * 
 * Creates a "radar telemetry scanline glitch" displacement effect when hovered.
 * Uses OGL (lightweight WebGL library) with a custom GLSL fragment shader.
 * 
 * Falls back to normal <img> on:
 * - Mobile devices (< 768px)
 * - prefers-reduced-motion
 * - WebGL not supported
 * - If dynamic import resolves after component is unmounted (Resolves Temuan 2!)
 */
interface WebGLImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function WebGLImage({ src, alt, className = "" }: WebGLImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const hoverRef = useRef({ value: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || window.innerWidth < 768) return;

    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    let isMounted = true;
    let cleanup: (() => void) | undefined;

    // Dynamic import OGL for bundle size optimization
    import("ogl").then(({ Renderer, Program, Mesh, Texture, Plane }) => {
      // Prevent running if component was already unmounted
      if (!isMounted) return;

      const renderer = new Renderer({
        alpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio, 2),
      });

      const gl = renderer.gl;
      gl.canvas.style.position = "absolute";
      gl.canvas.style.inset = "0";
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";
      gl.canvas.style.zIndex = "2";
      gl.canvas.style.pointerEvents = "none";
      container.appendChild(gl.canvas);

      const resize = () => {
        renderer.setSize(container.offsetWidth, container.offsetHeight);
      };
      resize();
      window.addEventListener("resize", resize);

      const texture = new Texture(gl);
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = src;
      image.onload = () => {
        if (isMounted) texture.image = image;
      };
      const program = new Program(gl, {
        vertex: `
          attribute vec2 uv;
          attribute vec3 position;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragment: `
          precision highp float;
          uniform sampler2D uTexture;
          uniform float uHover;
          uniform float uTime;
          varying vec2 vUv;

          // Simple pseudo-random hash generator
          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
          }

          void main() {
            vec2 uv = vUv;

            if (uHover > 0.0) {
              // 1. Horizontal telemetry scanline oscillation
              float scanline = sin(uv.y * 70.0 + uTime * 15.0) * 0.03;

              // 2. Random glitch impulse lines
              float glitchLine = step(0.96, sin(uv.y * 4.0 - uTime * 6.0));
              float glitchOffset = (scanline + hash(vec2(uTime, uv.y)) * 0.06) * glitchLine * uHover;

              // Apply horizontal offset
              uv.x += glitchOffset * 0.45;

              // Subtle vertical CRT screen sync ripple
              uv.y += sin(uv.x * 25.0 + uTime * 4.0) * 0.006 * uHover;
            }

            vec4 color = texture2D(uTexture, uv);

            // Overlay thin telemetry line highlights on hover
            if (uHover > 0.0) {
              float scanlineHighlight = sin(vUv.y * 220.0) * 0.04 * uHover;
              color.rgb += vec3(scanlineHighlight);
            }

            gl_FragColor = color;
          }
        `,
        uniforms: {
          uTexture: { value: texture },
          uHover: { value: 0 },
          uTime: { value: 0 },
        },
      });

      const geometry = new Plane(gl, { width: 2, height: 2 });
      const mesh = new Mesh(gl, { geometry, program });

      let raf: number;
      const startTime = performance.now();

      const animate = () => {
        program.uniforms.uTime.value = (performance.now() - startTime) * 0.001;
        program.uniforms.uHover.value = hoverRef.current.value;
        renderer.render({ scene: mesh });
        raf = requestAnimationFrame(animate);
      };

      const onEnter = () => {
        gsap.to(hoverRef.current, { value: 1, duration: 0.6, ease: "power2.out" });
        if (img) img.style.opacity = "0";
        gl.canvas.style.pointerEvents = "none";
      };

      const onLeave = () => {
        gsap.to(hoverRef.current, { value: 0, duration: 0.5, ease: "power2.inOut" });
        setTimeout(() => {
          if (hoverRef.current.value < 0.01 && img && isMounted) {
            img.style.opacity = "1";
          }
        }, 600);
      };

      container.addEventListener("mouseenter", onEnter);
      container.addEventListener("mouseleave", onLeave);
      raf = requestAnimationFrame(animate);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        container.removeEventListener("mouseenter", onEnter);
        container.removeEventListener("mouseleave", onLeave);
        if (gl.canvas.parentNode) gl.canvas.parentNode.removeChild(gl.canvas);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    }).catch(() => {
      // Fail gracefully — default image is visible
    });

    return () => {
      isMounted = false;
      cleanup?.();
    };
  }, [src]);

  return (
    <div ref={containerRef} className={`webgl-image-container ${className}`} data-cursor="LIHAT">
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-opacity duration-300"
        loading="lazy"
      />
    </div>
  );
}
