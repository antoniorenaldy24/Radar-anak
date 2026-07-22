# RADAR ANAK — Implementation Plan (Ultra-Detail untuk Eksekusi AI)

> **INSTRUKSI UNTUK EXECUTOR**: Ikuti setiap step secara BERURUTAN. Jangan skip. Jangan ubah nama file, path, atau variable. Setiap code block adalah FINAL — copy-paste langsung.

---

## DAFTAR PERUBAHAN

### File Baru (10 file)
| # | Path | Deskripsi |
|---|------|-----------|
| 1 | `components/public/StickerCursor.tsx` | Custom cursor dot global |
| 2 | `components/public/MagneticButton.tsx` | Button dengan efek magnetic |
| 3 | `components/public/KineticText.tsx` | Reusable kinetic typography |
| 4 | `components/public/VelocityMarquee.tsx` | Infinite scroll ticker |
| 5 | `components/public/TiltCard.tsx` | Card dengan 3D tilt hover |
| 6 | `components/public/WebGLImage.tsx` | OGL WebGL distortion hover |
| 7 | `components/public/GrainOverlay.tsx` | Film grain texture overlay |
| 8 | `components/public/NoiseCanvas.tsx` | Generative noise background |
| 9 | `components/public/ParallaxSticker.tsx` | Floating decorative sticker |
| 10 | `components/public/ScrollScene.tsx` | Reusable pinned scroll wrapper |

### File Dimodifikasi (8 file)
| # | Path | Perubahan |
|---|------|-----------|
| 1 | `next.config.ts` | Enable viewTransition |
| 2 | `package.json` | Tambah ogl + simplex-noise |
| 3 | `lib/motion/config.ts` | Tambah easings + durations |
| 4 | `styles/globals.css` | Redesign total CSS |
| 5 | `app/layout.tsx` | Tambah JetBrains Mono font + grain SVG |
| 6 | `app/(public)/layout.tsx` | Tambah StickerCursor + GrainOverlay |
| 7 | `components/public/SmoothScrollProvider.tsx` | Expose scroll velocity |
| 8 | `app/(public)/page.tsx` | **REWRITE TOTAL** — semua section baru |

### File TIDAK diubah (tetap sama)
- `components/public/MapTransparency.tsx` — tetap sama, hanya tile URL berubah (dihandle di page.tsx)
- `components/public/StatCounter.tsx` — tetap sama
- `components/public/Button.tsx` — tetap ada tapi MagneticButton jadi primary CTA
- `components/public/Card.tsx` — tetap ada tapi TiltCard dipakai untuk cards interaktif
- `lib/utils.ts` — tetap sama
- `lib/supabase.ts` — tetap sama
- `tsconfig.json` — tetap sama

---

## STEP 0: Install Dependencies

**Jalankan command ini di terminal pada root project (`c:\Users\renal\Downloads\RadarAnak(KKN)`):**

```bash
npm install ogl@^1.0.8 simplex-noise@^4.0.3
```

**Verifikasi**: Setelah install, cek `package.json` memiliki `ogl` dan `simplex-noise` di `dependencies`.

---

## STEP 1: Modify `next.config.ts`

**File**: `c:\Users\renal\Downloads\RadarAnak(KKN)\next.config.ts`
**Aksi**: OVERWRITE seluruh file

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
```

---

## STEP 2: Modify `lib/motion/config.ts`

**File**: `c:\Users\renal\Downloads\RadarAnak(KKN)\lib\motion\config.ts`
**Aksi**: OVERWRITE seluruh file

```typescript
/**
 * Animation tokens for Website Publik — Awwwards-Level Craft.
 * 
 * Semua easing dan duration digunakan konsisten di seluruh halaman.
 * Jangan hardcode easing string di component — selalu import dari sini.
 */

export const MOTION_EASE = {
  // Entrance utama — hero headline, section headings
  confident: "expo.out",
  confidentBezier: "cubic-bezier(0.16, 1, 0.3, 1)",

  // Snap reveals — card entrances, badge pop-ins
  snap: "power4.out",
  snapBezier: "cubic-bezier(0.25, 1, 0.5, 1)",

  // Gentle loops — floating stickers, background animations
  gentle: "sine.inOut",
  gentleBezier: "cubic-bezier(0.37, 0, 0.63, 1)",

  // Magnetic button snapback — elastic bounce
  elastic: "elastic.out(1, 0.3)",

  // Kinetic text entrance — dramatic character reveals
  dramatic: "expo.out",
  dramaticBezier: "cubic-bezier(0.16, 1, 0.3, 1)",

  // Scroll-scrubbed animations — linear (scroll controls speed)
  scrub: "none",
};

export const MOTION_DURATION = {
  micro: 0.1,     // cursor, hover state transitions
  fast: 0.15,     // micro-interactions
  base: 0.4,      // standard reveals
  slow: 0.8,      // signature moments
  dramatic: 1.2,  // hero headline, major reveals
  epic: 1.6,      // page-level transitions
};

/** Stagger presets for consistent rhythm */
export const MOTION_STAGGER = {
  char: 0.035,    // character-by-character
  word: 0.06,     // word-by-word
  line: 0.12,     // line-by-line
  card: 0.15,     // card grid entrance
  fast: 0.05,     // rapid sequential reveals
};
```

---

## STEP 3: Modify `styles/globals.css`

**File**: `c:\Users\renal\Downloads\RadarAnak(KKN)\styles\globals.css`
**Aksi**: OVERWRITE seluruh file

```css
@import "tailwindcss";

:root {
  /* Shared Base Tokens */
  --font-sans: var(--font-grotesk);
  --font-serif: var(--font-editorial);
  --font-mono: var(--font-jetbrains);

  /* Shared Color HSL Base Values */
  --color-neutral-50: 0 0% 98%;
  --color-neutral-100: 0 0% 96%;
  --color-neutral-200: 0 0% 90%;
  --color-neutral-300: 0 0% 80%;
  --color-neutral-400: 0 0% 60%;
  --color-neutral-500: 0 0% 45%;
  --color-neutral-600: 0 0% 35%;
  --color-neutral-700: 0 0% 25%;
  --color-neutral-800: 0 0% 15%;
  --color-neutral-900: 0 0% 10%;
  --color-neutral-950: 0 0% 5%;

  /* Default theme values */
  --bg-page: hsl(var(--color-neutral-50));
  --text-page: hsl(var(--color-neutral-900));
  --border-width: 1px;
  --border-color: hsl(var(--color-neutral-200));
  --radius-factor: 0.375rem;
  --shadow-ui: none;
}

/* Scoped theme override for Website Publik */
.theme-public {
  --bg-page: #FAF9F5;
  --text-page: #121212;
  --accent: #E11D48;
  --border-width: 2.5px;
  --border-color: #121212;
  --radius-factor: 0px;
  --shadow-ui: 4px 4px 0px 0px #121212;

  /* Refined Neo-Brutalist Palette — NOT one color per section */
  --brutalist-yellow: #FDE047;
  --brutalist-purple: #C084FC;
  --brutalist-rose: #F43F5E;
  --brutalist-sky: #38BDF8;
  --brutalist-orange: #FB923C;
  --brutalist-lime: #A3E635;

  /* Section backgrounds — mostly unified */
  --bg-section-alt: #F3F0EB;  /* subtle warm alternation */
}

/* Scoped theme override for Dashboard Operator */
.theme-dashboard {
  --bg-page: hsl(var(--color-neutral-50));
  --text-page: hsl(var(--color-neutral-900));
  --border-width: 1px;
  --border-color: hsl(var(--color-neutral-200));
  --radius-factor: 0.375rem;
  --shadow-ui: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  --status-red: 0 84% 60%;
  --status-yellow: 38 92% 50%;
  --status-green: 142 70% 45%;
}

@theme {
  --color-neutral-50: hsl(var(--color-neutral-50));
  --color-neutral-100: hsl(var(--color-neutral-100));
  --color-neutral-200: hsl(var(--color-neutral-200));
  --color-neutral-300: hsl(var(--color-neutral-300));
  --color-neutral-400: hsl(var(--color-neutral-400));
  --color-neutral-500: hsl(var(--color-neutral-500));
  --color-neutral-600: hsl(var(--color-neutral-600));
  --color-neutral-700: hsl(var(--color-neutral-700));
  --color-neutral-800: hsl(var(--color-neutral-800));
  --color-neutral-900: hsl(var(--color-neutral-900));
  --color-neutral-950: hsl(var(--color-neutral-950));

  --color-bg-page: var(--bg-page);
  --color-text-page: var(--text-page);
  --color-accent: var(--accent);
  --color-border-theme: var(--border-color);

  --color-status-red: hsl(var(--status-red));
  --color-status-yellow: hsl(var(--status-yellow));
  --color-status-green: hsl(var(--status-green));

  --color-brutalist-yellow: #FDE047;
  --color-brutalist-purple: #C084FC;
  --color-brutalist-rose: #F43F5E;
  --color-brutalist-sky: #38BDF8;
  --color-brutalist-orange: #FB923C;
  --color-brutalist-lime: #A3E635;

  --font-serif: var(--font-serif);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);

  --border-width-theme: var(--border-width);
  --radius-theme: var(--radius-factor);
  --shadow-theme: var(--shadow-ui);

  --ease-confident: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-snap: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-gentle: cubic-bezier(0.37, 0, 0.63, 1);

  --animate-fast: 150ms;
  --animate-base: 400ms;
  --animate-slow: 800ms;
}

body {
  background-color: var(--bg-page);
  color: var(--text-page);
  font-family: var(--font-sans);
}

/* ============================================
   KINETIC TEXT — FOUT Prevention
   ============================================ */
.kinetic-text-hidden {
  opacity: 0;
  visibility: hidden;
}
.kinetic-text-visible {
  opacity: 1;
  visibility: visible;
}

/* ============================================
   PERSPECTIVE — for 3D character animations
   ============================================ */
.perspective-1000 {
  perspective: 1000px;
}
.perspective-800 {
  perspective: 800px;
}

/* ============================================
   FILM GRAIN OVERLAY
   ============================================ */
.grain-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.035;
  mix-blend-mode: multiply;
}
.grain-overlay::after {
  content: '';
  position: absolute;
  inset: -200%;
  filter: url(#grain-filter);
  animation: grain-shift 0.5s steps(4) infinite;
}

@keyframes grain-shift {
  0%, 100% { transform: translate(0, 0); }
  25%      { transform: translate(-2%, -3%); }
  50%      { transform: translate(3%, 1%); }
  75%      { transform: translate(-1%, 4%); }
}

/* ============================================
   VELOCITY MARQUEE
   ============================================ */
@keyframes marquee-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.marquee-track {
  animation: marquee-scroll 25s linear infinite;
  will-change: transform;
}
.marquee-track:hover {
  animation-play-state: paused;
}

/* ============================================
   STICKER CURSOR
   ============================================ */
.sticker-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 14px;
  height: 14px;
  background-color: #121212;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  mix-blend-mode: difference;
  transform: translate(-50%, -50%);
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              height 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              background-color 0.3s ease;
}
.sticker-cursor.is-hovering {
  width: 64px;
  height: 64px;
  background-color: #FFFFFF;
  mix-blend-mode: difference;
}
.sticker-cursor-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #121212;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.sticker-cursor.is-hovering .sticker-cursor-label {
  opacity: 1;
}

/* ============================================
   VIEW TRANSITIONS — Page Route Change
   ============================================ */
::view-transition-old(root) {
  animation: vt-exit 0.4s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}
::view-transition-new(root) {
  animation: vt-enter 0.4s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}
@keyframes vt-exit {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to   { opacity: 0; transform: translateY(-20px) scale(0.98); }
}
@keyframes vt-enter {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* Shared element transition — brand text morphs across routes */
.vt-brand {
  view-transition-name: brand-identity;
}

/* ============================================
   MAP OVERRIDES
   ============================================ */
@keyframes marker-pulse-ring {
  0% { transform: scale(0.6); opacity: 1; }
  100% { transform: scale(1.6); opacity: 0; }
}
.marker-pulse {
  animation: marker-pulse-ring 2s infinite ease-in-out;
}

.brutalist-map-popup .leaflet-popup-content-wrapper {
  background-color: #FAF9F5 !important;
  color: #121212 !important;
  border: 2.5px solid #121212 !important;
  border-radius: 0px !important;
  box-shadow: 4px 4px 0px 0px #121212 !important;
  padding: 0px !important;
}
.brutalist-map-popup .leaflet-popup-tip {
  background-color: #FAF9F5 !important;
  border-left: 2.5px solid #121212 !important;
  border-bottom: 2.5px solid #121212 !important;
  box-shadow: none !important;
}
.brutalist-map-popup .leaflet-popup-content {
  margin: 0 !important;
}

/* ============================================
   SCROLL INDICATOR
   ============================================ */
@keyframes scroll-bounce {
  0%, 100% { transform: translateY(0); opacity: 0.6; }
  50%      { transform: translateY(8px); opacity: 1; }
}
.scroll-indicator {
  animation: scroll-bounce 2s ease-in-out infinite;
}

/* ============================================
   NOISE CANVAS
   ============================================ */
.noise-canvas {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.06;
}

/* ============================================
   WEBGL IMAGE CONTAINER
   ============================================ */
.webgl-image-container {
  position: relative;
  overflow: hidden;
  cursor: none;
}
.webgl-image-container canvas {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  z-index: 1;
}
.webgl-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ============================================
   PARALLAX STICKER
   ============================================ */
.parallax-sticker {
  position: absolute;
  pointer-events: none;
  z-index: 5;
  will-change: transform;
}

/* Prefers reduced motion — disable ALL animations */
@media (prefers-reduced-motion: reduce) {
  .grain-overlay::after { animation: none; }
  .marquee-track { animation: none; }
  .scroll-indicator { animation: none; }
  .marker-pulse { animation: none; }
  .sticker-cursor { display: none; }
  ::view-transition-old(root) { animation: none; }
  ::view-transition-new(root) { animation: none; }
}
```

---

## STEP 4: Modify `app/layout.tsx`

**File**: `c:\Users\renal\Downloads\RadarAnak(KKN)\app\layout.tsx`
**Aksi**: OVERWRITE seluruh file

```tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "../styles/globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const serif = Playfair_Display({
  variable: "--font-editorial",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RADAR ANAK - Deteksi & Penanganan Anak Putus Sekolah",
  description: "Platform kredibilitas dan transparansi penanganan anak putus sekolah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${sans.variable} ${serif.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Inline SVG filter for grain overlay — zero network cost */}
        <svg style={{ display: "none" }} aria-hidden="true">
          <filter id="grain-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>
        {children}
      </body>
    </html>
  );
}
```

---

## STEP 5: Create New Components (10 files)

### 5.1 — `components/public/GrainOverlay.tsx`

**File**: `c:\Users\renal\Downloads\RadarAnak(KKN)\components\public\GrainOverlay.tsx`
**Aksi**: CREATE file baru

```tsx
"use client";

/**
 * GrainOverlay — Subtle film-grain texture overlay.
 * 
 * Uses the SVG feTurbulence filter defined in app/layout.tsx.
 * Renders a fixed overlay across the entire viewport.
 * pointer-events: none ensures it doesn't block clicks.
 * mix-blend-mode: multiply makes it blend naturally.
 * 
 * USAGE: Place once in the public layout.
 */
export default function GrainOverlay() {
  return <div className="grain-overlay" aria-hidden="true" />;
}
```

### 5.2 — `components/public/StickerCursor.tsx`

**File**: `c:\Users\renal\Downloads\RadarAnak(KKN)\components\public\StickerCursor.tsx`
**Aksi**: CREATE file baru

```tsx
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
 * 2. Uses MutationObserver + event delegation to detect hover on [data-cursor] elements
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
      duration: 0.5,
      ease: "power3.out",
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
```

### 5.3 — `components/public/MagneticButton.tsx`

**File**: `c:\Users\renal\Downloads\RadarAnak(KKN)\components\public\MagneticButton.tsx`
**Aksi**: CREATE file baru

```tsx
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
```

### 5.4 — `components/public/KineticText.tsx`

**File**: `c:\Users\renal\Downloads\RadarAnak(KKN)\components\public\KineticText.tsx`
**Aksi**: CREATE file baru

```tsx
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
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const el = elementRef.current;
    if (!el) return;

    if (prefersReducedMotion) {
      el.classList.remove("kinetic-text-hidden");
      el.classList.add("kinetic-text-visible");
      return;
    }

    const ctx = gsap.context(() => {
      if (mode === "hero") {
        // Char-by-char with 3D rotateX + skewY — dramatic entrance on mount
        const split = new SplitType(el, { types: "chars,words" });
        el.classList.remove("kinetic-text-hidden");
        el.classList.add("kinetic-text-visible");

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
      }

      if (mode === "heading") {
        // Char-by-char with rotateX — triggered by ScrollTrigger
        const split = new SplitType(el, { types: "chars,words" });
        el.classList.remove("kinetic-text-hidden");
        el.classList.add("kinetic-text-visible");

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
      }

      if (mode === "paragraph") {
        // Word-by-word opacity scrub — scroll-synced
        const split = new SplitType(el, { types: "words" });
        el.classList.remove("kinetic-text-hidden");
        el.classList.add("kinetic-text-visible");

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
      }

      if (mode === "lines") {
        // Line-by-line clip reveal
        const split = new SplitType(el, { types: "lines" });
        el.classList.remove("kinetic-text-hidden");
        el.classList.add("kinetic-text-visible");

        if (split.lines) {
          // Wrap each line in an overflow-hidden container
          split.lines.forEach((line) => {
            const wrapper = document.createElement("div");
            wrapper.style.overflow = "hidden";
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

    return () => ctx.revert();
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
```

### 5.5 — `components/public/VelocityMarquee.tsx`

**File**: `c:\Users\renal\Downloads\RadarAnak(KKN)\components\public\VelocityMarquee.tsx`
**Aksi**: CREATE file baru

```tsx
"use client";

/**
 * VelocityMarquee — Infinite horizontal scroll ticker.
 * 
 * - CSS-driven infinite animation (performant)
 * - Speed can be adjusted via prop
 * - Pauses on hover
 * - Content is duplicated 4x to ensure seamless loop
 * 
 * USAGE:
 *   <VelocityMarquee
 *     text="DETEKSI • LAPOR • RUJUK • SEKOLAHKAN"
 *     bgColor="#121212"
 *     textColor="#FAF9F5"
 *   />
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
  // Duplicate text 4x for seamless loop
  const repeatedText = `${text} — ${text} — ${text} — ${text} — `;

  return (
    <div
      className={`w-full overflow-hidden py-4 border-y-[3px] border-[#121212] select-none ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="marquee-track flex whitespace-nowrap"
        style={{ animationDuration: `${speed}s` }}
      >
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
```

### 5.6 — `components/public/TiltCard.tsx`

**File**: `c:\Users\renal\Downloads\RadarAnak(KKN)\components\public\TiltCard.tsx`
**Aksi**: CREATE file baru

```tsx
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
```

### 5.7 — `components/public/NoiseCanvas.tsx`

**File**: `c:\Users\renal\Downloads\RadarAnak(KKN)\components\public\NoiseCanvas.tsx`
**Aksi**: CREATE file baru

```tsx
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
```

### 5.8 — `components/public/WebGLImage.tsx`

**File**: `c:\Users\renal\Downloads\RadarAnak(KKN)\components\public\WebGLImage.tsx`
**Aksi**: CREATE file baru

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * WebGLImage — Image with OGL WebGL distortion shader on hover.
 * 
 * Creates a "liquid" displacement effect when the user hovers over the image.
 * Uses OGL (lightweight ~20KB WebGL library) with a custom GLSL fragment shader.
 * 
 * Falls back to a normal <img> on:
 * - Mobile devices (< 768px)
 * - prefers-reduced-motion
 * - WebGL not supported
 * 
 * USAGE:
 *   <WebGLImage src="/image.jpg" alt="Description" className="w-full aspect-[4/3]" />
 */
interface WebGLImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function WebGLImage({ src, alt, className = "" }: WebGLImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const rendererRef = useRef<any>(null);
  const hoverRef = useRef({ value: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || window.innerWidth < 768) return;

    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    let cleanup: (() => void) | undefined;

    // Dynamic import OGL to keep initial bundle small
    import("ogl").then(({ Renderer, Program, Mesh, Texture, Plane }) => {
      // Create renderer
      const renderer = new Renderer({
        alpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio, 2),
      });
      rendererRef.current = renderer;
      const gl = renderer.gl;
      gl.canvas.style.position = "absolute";
      gl.canvas.style.inset = "0";
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";
      gl.canvas.style.zIndex = "2";
      gl.canvas.style.pointerEvents = "none";
      container.appendChild(gl.canvas);

      // Resize to match container
      const resize = () => {
        renderer.setSize(container.offsetWidth, container.offsetHeight);
      };
      resize();
      window.addEventListener("resize", resize);

      // Load texture from img
      const texture = new Texture(gl);
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = src;
      image.onload = () => {
        texture.image = image;
      };

      // Create displacement texture (procedural noise)
      const dispCanvas = document.createElement("canvas");
      dispCanvas.width = 256;
      dispCanvas.height = 256;
      const dispCtx = dispCanvas.getContext("2d")!;
      const dispData = dispCtx.createImageData(256, 256);
      for (let i = 0; i < dispData.data.length; i += 4) {
        const v = Math.random() * 255;
        dispData.data[i] = v;
        dispData.data[i + 1] = v;
        dispData.data[i + 2] = v;
        dispData.data[i + 3] = 255;
      }
      dispCtx.putImageData(dispData, 0, 0);
      const dispTexture = new Texture(gl);
      dispTexture.image = dispCanvas;

      // Create program with shaders
      const program = new Program(gl, {
        vertex: `
          attribute vec2 uv;
          attribute vec3 position;
          uniform mat4 modelViewMatrix;
          uniform mat4 projectionMatrix;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragment: `
          precision highp float;
          uniform sampler2D uTexture;
          uniform sampler2D uDisplacement;
          uniform float uHover;
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            vec4 disp = texture2D(uDisplacement, vUv);
            float force = disp.r * uHover * 0.12;
            vec2 distUV = vec2(
              vUv.x + force * sin(vUv.y * 12.0 + uTime),
              vUv.y + force * cos(vUv.x * 12.0 + uTime)
            );
            vec4 color = texture2D(uTexture, distUV);
            gl_FragColor = color;
          }
        `,
        uniforms: {
          uTexture: { value: texture },
          uDisplacement: { value: dispTexture },
          uHover: { value: 0 },
          uTime: { value: 0 },
        },
      });

      const geometry = new Plane(gl, { width: 2, height: 2 });
      const mesh = new Mesh(gl, { geometry, program });

      // Animation loop
      let raf: number;
      let startTime = performance.now();
      const animate = () => {
        program.uniforms.uTime.value = (performance.now() - startTime) * 0.001;
        program.uniforms.uHover.value = hoverRef.current.value;
        renderer.render({ scene: mesh });
        raf = requestAnimationFrame(animate);
      };

      // Hover handlers
      const onEnter = () => {
        gsap.to(hoverRef.current, { value: 1, duration: 1.0, ease: "power2.out" });
        // Hide the img, show canvas
        if (img) img.style.opacity = "0";
        gl.canvas.style.pointerEvents = "auto";
      };

      const onLeave = () => {
        gsap.to(hoverRef.current, { value: 0, duration: 0.8, ease: "power2.inOut" });
        setTimeout(() => {
          if (hoverRef.current.value < 0.01 && img) {
            img.style.opacity = "1";
          }
        }, 900);
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
      // WebGL not supported — img fallback is already visible
    });

    return () => cleanup?.();
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
```

### 5.9 — `components/public/ParallaxSticker.tsx`

**File**: `c:\Users\renal\Downloads\RadarAnak(KKN)\components\public\ParallaxSticker.tsx`
**Aksi**: CREATE file baru

```tsx
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
 * 
 * USAGE:
 *   <ParallaxSticker shape="star" size={48} color="#FDE047"
 *     style={{ top: '20%', right: '10%' }} speed={-50} />
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
```

### 5.10 — `components/public/ScrollScene.tsx`

**File**: `c:\Users\renal\Downloads\RadarAnak(KKN)\components\public\ScrollScene.tsx`
**Aksi**: CREATE file baru

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ScrollScene — Reusable pinned scroll section wrapper.
 * 
 * Pins its children in place while scrolling through a configurable
 * scroll distance. Used for scroll-driven storytelling scenes.
 * 
 * IMPORTANT: Children should use GSAP ScrollTrigger with the same
 * trigger element to create scroll-synced animations.
 * 
 * USAGE:
 *   <ScrollScene scrollDistance="200%" className="bg-white">
 *     {(triggerRef) => (
 *       <div ref={triggerRef}>...animated content...</div>
 *     )}
 *   </ScrollScene>
 */
interface ScrollSceneProps {
  children: React.ReactNode;
  scrollDistance?: string; // e.g. "200%", "250%" — controls pin duration
  className?: string;
  id?: string;
}

export default function ScrollScene({
  children,
  scrollDistance = "200%",
  className = "",
  id,
}: ScrollSceneProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${scrollDistance}`,
        pin: true,
        anticipatePin: 1,
        pinSpacing: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [scrollDistance]);

  return (
    <section ref={sectionRef} id={id} className={`relative w-full min-h-screen ${className}`}>
      {children}
    </section>
  );
}
```

---

## STEP 6: Modify `components/public/SmoothScrollProvider.tsx`

**File**: `c:\Users\renal\Downloads\RadarAnak(KKN)\components\public\SmoothScrollProvider.tsx`
**Aksi**: OVERWRITE seluruh file

```tsx
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
```

---

## STEP 7: Modify `app/(public)/layout.tsx`

**File**: `c:\Users\renal\Downloads\RadarAnak(KKN)\app\(public)\layout.tsx`
**Aksi**: OVERWRITE seluruh file

```tsx
import SmoothScrollProvider from "@/components/public/SmoothScrollProvider";
import StickerCursor from "@/components/public/StickerCursor";
import GrainOverlay from "@/components/public/GrainOverlay";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-public min-h-screen flex flex-col bg-bg-page text-text-page">
      <SmoothScrollProvider>
        <StickerCursor />
        <GrainOverlay />
        <main className="flex-1 flex flex-col">{children}</main>
      </SmoothScrollProvider>
    </div>
  );
}
```

---

## STEP 8: REWRITE `app/(public)/page.tsx` — COMPLETE NEW FILE

**File**: `c:\Users\renal\Downloads\RadarAnak(KKN)\app\(public)\page.tsx`
**Aksi**: OVERWRITE seluruh file (836 baris lama → file baru)

> **CATATAN PENTING**: File ini adalah yang paling besar dan paling kritis. Ini adalah REWRITE TOTAL dari landing page. Konten (copy text, data) tetap sama — hanya presentasi visual dan animasi yang berubah total.

Karena file ini sangat besar (~800+ baris), berikut adalah STRUKTUR LENGKAPNYA. Executor harus membuat file ini persis sesuai kode di bawah.

**Struktur Section dalam file ini:**
1. Imports + Registrasi plugin
2. Schema + Type (donasi form — tetap sama)
3. Component function + refs
4. useEffect untuk GSAP animations
5. JSX Return:
   - Section 1: HERO (noise canvas + kinetic text + magnetic buttons)
   - Marquee Divider 1
   - Section 2: STORY (pinned clip-path wipe)
   - Section 3: DAMPAK (tilt cards + counters)
   - Marquee Divider 2
   - Section 4: PETA (map section)
   - Section 5: GALERI (WebGL distortion images)
   - Section 6: DONASI (form)
   - Section 7: FOOTER (massive text clip reveal)

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, AlertCircle, BookOpen, Award, Compass, ChevronDown } from "lucide-react";

import KineticText from "@/components/public/KineticText";
import MagneticButton from "@/components/public/MagneticButton";
import TiltCard from "@/components/public/TiltCard";
import VelocityMarquee from "@/components/public/VelocityMarquee";
import NoiseCanvas from "@/components/public/NoiseCanvas";
import WebGLImage from "@/components/public/WebGLImage";
import ParallaxSticker from "@/components/public/ParallaxSticker";
import StatCounter from "@/components/public/StatCounter";
import { MOTION_EASE, MOTION_DURATION, MOTION_STAGGER } from "@/lib/motion/config";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MapTransparency = dynamic(
  () => import("@/components/public/MapTransparency"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] border-[3px] border-[#121212] bg-[#FFFFFF] flex flex-col items-center justify-center font-sans font-bold text-[#121212] shadow-[6px_6px_0px_0px_#121212]">
        <Compass className="w-10 h-10 animate-spin mb-4 text-accent" />
        <span>Memuat Peta Transparansi...</span>
      </div>
    ),
  }
);

// --- Donation Form Schema (unchanged) ---
const donationSchema = z.object({
  nama: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  email: z.string().email({ message: "Format email tidak valid" }),
  jumlah: z.coerce.number().min(10000, { message: "Donasi minimal Rp10.000" }),
  catatan: z.string().optional(),
});
type DonationFormValues = z.infer<typeof donationSchema>;

export default function PublicHomePage() {
  // --- Refs ---
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const dampakRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const footerBrandRef = useRef<HTMLDivElement>(null);

  // --- Donation Form ---
  const [donationSuccess, setDonationSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema) as any,
  });

  const onSubmit = async (data: DonationFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setDonationSuccess(true);
    reset();
    setTimeout(() => setDonationSuccess(false), 5000);
  };

  // --- GSAP Master Timeline ---
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // === HERO EXIT: Scale-down peel transition ===
      if (heroRef.current) {
        gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "+=100%",
            scrub: 1,
            pin: true,
            pinSpacing: true,
          },
        })
          .to(".hero-card", {
            scale: 0.85,
            rotateX: 4,
            opacity: 0.25,
            borderColor: "#121212",
            boxShadow: "12px 12px 0px 0px #121212",
            transformOrigin: "center top",
            ease: "none",
          })
          .to(".hero-grid-svg", { opacity: 0.03, scale: 0.9, ease: "none" }, 0);

        // Hero sub-elements staggered entrance
        gsap.from(".hero-fade-in", {
          y: 30,
          opacity: 0,
          duration: MOTION_DURATION.base,
          ease: MOTION_EASE.confident,
          stagger: 0.12,
          delay: 0.9,
        });
      }

      // === STORY: Pinned clip-path wipe ===
      if (storyRef.current) {
        const storyTL = gsap.timeline({
          scrollTrigger: {
            trigger: storyRef.current,
            start: "top top",
            end: "+=250%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        // Phase 1: Read klaim (dead zone)
        storyTL.to({}, { duration: 0.25 });

        // Phase 2: Reality panel wipe from right
        storyTL.fromTo(
          ".story-reality-panel",
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.45, ease: "none" }
        );

        // Phase 3: Stats animate in
        storyTL.from(".story-stat-bar-fill", {
          scaleX: 0,
          transformOrigin: "left center",
          stagger: 0.06,
          duration: 0.2,
          ease: "power2.out",
        }, "-=0.15");

        // Phase 4: Hold for reading
        storyTL.to({}, { duration: 0.1 });
      }

      // === DAMPAK: Staggered 3D card entrance ===
      if (dampakRef.current) {
        gsap.from(".dampak-card", {
          y: 120,
          rotateX: 15,
          rotateZ: () => (Math.random() - 0.5) * 8,
          scale: 0.8,
          opacity: 0,
          duration: MOTION_DURATION.slow,
          ease: MOTION_EASE.confident,
          stagger: MOTION_STAGGER.card,
          transformPerspective: 800,
          scrollTrigger: {
            trigger: dampakRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      }

      // === GALLERY: Staggered entrance ===
      if (galleryRef.current) {
        gsap.from(".gallery-card", {
          y: 80,
          rotateZ: () => (Math.random() - 0.5) * 6,
          scale: 0.9,
          opacity: 0,
          duration: MOTION_DURATION.slow,
          ease: MOTION_EASE.confident,
          stagger: MOTION_STAGGER.card,
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      }

      // === FOOTER: Brand text clip reveal ===
      if (footerBrandRef.current) {
        gsap.fromTo(
          footerBrandRef.current,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            scrollTrigger: {
              trigger: footerBrandRef.current,
              start: "top 90%",
              end: "top 40%",
              scrub: 1,
            },
          }
        );
      }

      // === MAP: Scale entrance ===
      gsap.from(".map-container", {
        scale: 0.95,
        opacity: 0,
        duration: MOTION_DURATION.slow,
        ease: MOTION_EASE.confident,
        scrollTrigger: {
          trigger: ".map-container",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // === DONASI: Form entrance ===
      gsap.from(".donasi-card", {
        y: 60,
        opacity: 0,
        duration: MOTION_DURATION.slow,
        ease: MOTION_EASE.confident,
        scrollTrigger: {
          trigger: ".donasi-card",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Refresh after dynamic content settles
      setTimeout(() => ScrollTrigger.refresh(), 500);
      setTimeout(() => ScrollTrigger.refresh(), 2000);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden bg-[#FAF9F5] text-[#121212]">

      {/* ============================================
          SECTION 1: HERO
          ============================================ */}
      <section
        ref={heroRef}
        className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#FAF9F5] z-0"
      >
        <div className="hero-card w-full h-full bg-[#FAF9F5] border-[3px] border-transparent shadow-none flex flex-col justify-center px-6 md:px-12 lg:px-24 relative overflow-hidden z-10">
          {/* Generative Noise Canvas */}
          <NoiseCanvas color="#FDE047" />

          {/* Background Grid SVG */}
          <div className="hero-grid-svg absolute inset-0 z-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#121212" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>
          </div>

          {/* Floating Stickers */}
          <ParallaxSticker shape="star" size={52} color="#FDE047" speed={-60} style={{ top: "15%", right: "8%" }} />
          <ParallaxSticker shape="cross" size={36} color="#E11D48" speed={-30} rotate={45} style={{ top: "60%", right: "15%" }} />
          <ParallaxSticker shape="zigzag" size={64} color="#38BDF8" speed={-45} style={{ bottom: "20%", left: "5%" }} />

          {/* Hero Content */}
          <div className="max-w-5xl z-10 relative">
            <div className="hero-fade-in inline-flex items-center gap-2 px-4 py-1.5 bg-[#121212] text-[#FDE047] border-[3px] border-[#121212] font-sans text-xs font-bold mb-6 shadow-[3px_3px_0px_0px_#A3E635]">
              <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-ping" />
              PROYEK KKN PILOT KELURAHAN
            </div>

            <KineticText
              as="h1"
              mode="hero"
              className="text-5xl md:text-7xl lg:text-[5.5rem] xl:text-[7rem] font-bold font-serif leading-[1.0] tracking-tight mb-8 text-[#121212]"
              delay={0.3}
            >
              RADAR ANAK: DETEKSI DINI HAK SEKOLAH
            </KineticText>

            <KineticText
              as="p"
              mode="lines"
              className="text-lg md:text-xl font-sans max-w-2xl text-neutral-800 font-medium leading-relaxed mb-8"
            >
              Setiap anak berhak atas masa depan. Kami membangun jembatan data pelaporan warga langsung ke kelurahan untuk menemukan, merujuk, dan menyekolahkan kembali anak-anak yang putus sekolah.
            </KineticText>

            <div className="hero-fade-in flex flex-wrap gap-4 items-center">
              <MagneticButton
                onClick={() => {
                  const el = document.getElementById("story-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Lihat Dampak Program
              </MagneticButton>
              <a
                href="/dashboard"
                data-cursor="BUKA"
                className="group flex items-center gap-2 font-sans font-bold text-sm text-[#121212] hover:text-[#E11D48] transition-colors cursor-none"
              >
                Buka Dashboard Operator
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="hero-fade-in absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
            <span className="font-sans text-xs font-bold text-neutral-500 uppercase tracking-widest">
              Scroll untuk cerita
            </span>
            <ChevronDown className="w-5 h-5 text-neutral-400 scroll-indicator" />
          </div>
        </div>
      </section>

      {/* ============================================
          MARQUEE DIVIDER 1
          ============================================ */}
      <VelocityMarquee
        text="DETEKSI • LAPOR • RUJUK • SEKOLAHKAN"
        bgColor="#121212"
        textColor="#FAF9F5"
        speed={20}
      />

      {/* ============================================
          SECTION 2: STORY (Pinned Clip-Path Wipe)
          ============================================ */}
      <section
        ref={storyRef}
        id="story-section"
        className="relative h-screen w-full overflow-hidden bg-[#FAF9F5] z-10"
      >
        <div className="relative w-full h-full grid grid-cols-1 md:grid-cols-2">
          {/* Left Panel: Klaim */}
          <div className="flex flex-col justify-center p-8 md:p-12 lg:p-20 bg-[#FAF9F5] relative">
            <ParallaxSticker shape="circle" size={32} color="#C084FC" speed={-20} style={{ top: "10%", right: "10%" }} />
            <span className="font-sans text-xs font-bold tracking-widest uppercase mb-4 text-neutral-400">
              KLAIM AWAL KELURAHAN
            </span>
            <KineticText
              as="h2"
              mode="paragraph"
              className="text-3xl lg:text-5xl font-serif font-bold italic mb-6 leading-tight text-neutral-600"
            >
              Tidak ada anak putus sekolah di wilayah kami — sebuah asumsi administratif yang menyembunyikan kenyataan
            </KineticText>
            <p className="font-sans leading-relaxed text-sm lg:text-base font-medium text-neutral-500">
              Tanpa pintu pelaporan yang mudah dan familier bagi warga, statistik kelurahan tetap menunjukkan angka nol yang keliru.
            </p>
          </div>

          {/* Right Panel: Reality (clip-path reveal) */}
          <div
            className="story-reality-panel absolute inset-0 md:relative md:inset-auto flex flex-col justify-center p-8 md:p-12 lg:p-20 bg-[#FDE047] z-20"
            style={{ clipPath: "inset(0 100% 0 0)" }}
          >
            <ParallaxSticker shape="star" size={44} color="#E11D48" speed={-35} style={{ top: "8%", right: "5%" }} />
            <span className="font-sans text-xs font-bold tracking-widest uppercase mb-4 text-[#121212]/70">
              KENYATAAN DI LAPANGAN
            </span>
            <h2 className="text-5xl lg:text-7xl font-serif font-bold mb-6 leading-none text-[#121212]">
              Menemukan <span className="font-mono">7</span> Anak
            </h2>
            <p className="font-sans leading-relaxed text-sm lg:text-base font-bold mb-6 text-[#121212]/80">
              Wawancara langsung KKN & WA membuktikan data. Terdapat 7 anak putus sekolah di kelurahan percontohan.
            </p>

            {/* RW Stats Bars */}
            <div className="space-y-3">
              {[
                { rw: "RW 03", count: 1, max: 5 },
                { rw: "RW 05", count: 1, max: 5 },
                { rw: "RW 07", count: 5, max: 5 },
              ].map((stat) => (
                <div key={stat.rw} className="font-sans text-xs">
                  <div className="flex justify-between font-bold mb-1 text-[#121212]">
                    <span className="font-mono">{stat.rw}</span>
                    <span>{stat.count} Anak</span>
                  </div>
                  <div className="w-full h-3 bg-[#121212]/10 border-[2px] border-[#121212] overflow-hidden">
                    <div
                      className="story-stat-bar-fill h-full bg-[#121212]"
                      style={{ width: `${(stat.count / stat.max) * 100}%`, transformOrigin: "left center" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 3: DAMPAK (3D Tilt Cards)
          ============================================ */}
      <section ref={dampakRef} className="px-6 md:px-12 lg:px-24 py-24 bg-[#FAF9F5] relative">
        <ParallaxSticker shape="arrow" size={40} color="#FDE047" speed={-25} style={{ top: "5%", left: "3%" }} />

        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <KineticText
              as="h2"
              mode="heading"
              className="text-3xl md:text-5xl font-serif font-bold mb-4 text-[#121212]"
            >
              Dampak Penanganan
            </KineticText>
            <KineticText
              as="p"
              mode="paragraph"
              className="font-sans text-neutral-600 font-medium text-sm md:text-base"
            >
              Statistik riil penanganan anak putus sekolah dari laporan warga yang masuk melalui platform Radar Anak
            </KineticText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: AlertCircle,
                title: "Kasus Dilaporkan",
                target: 7,
                unit: "Anak",
                desc: "Total laporan masuk terindikasi putus sekolah.",
                iconBg: "bg-[#E11D48]",
              },
              {
                icon: BookOpen,
                title: "Sedang Ditangani",
                target: 2,
                unit: "Anak",
                desc: "Kasus dalam rujukan bantuan biaya & sosial.",
                iconBg: "bg-[#FDE047]",
              },
              {
                icon: Award,
                title: "Berhasil Disekolahkan",
                target: 5,
                unit: "Anak",
                desc: "Kasus terverifikasi yang kini aktif belajar.",
                iconBg: "bg-[#22C55E]",
              },
            ].map((card) => (
              <TiltCard key={card.title} className="dampak-card p-6 flex flex-col justify-between bg-[#FFFFFF]" data-cursor="DETAIL">
                <div>
                  <div className={`inline-flex p-3 ${card.iconBg} text-[#FFFFFF] border-[2px] border-[#121212] mb-4 shadow-[2px_2px_0px_0px_#121212]`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-sans text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
                    {card.title}
                  </h3>
                  <div className="font-mono text-4xl md:text-5xl font-bold text-[#121212] leading-none mb-3">
                    <StatCounter target={card.target} />
                    <span className="text-lg ml-1 font-sans font-bold text-neutral-600">
                      {card.unit}
                    </span>
                  </div>
                </div>
                <p className="font-sans text-xs text-neutral-600 font-semibold border-t-[2px] border-[#121212] pt-3 mt-3">
                  {card.desc}
                </p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          MARQUEE DIVIDER 2
          ============================================ */}
      <VelocityMarquee
        text="5 ANAK BERHASIL KEMBALI BERSEKOLAH"
        bgColor="#E11D48"
        textColor="#FFFFFF"
        speed={22}
      />

      {/* ============================================
          SECTION 4: PETA TRANSPARANSI
          ============================================ */}
      <section className="px-6 md:px-12 lg:px-24 py-24 bg-[#FAF9F5] relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-xl">
              <span className="font-sans text-xs font-bold text-[#E11D48] uppercase tracking-widest mb-2 block">
                SEBARAN GEOGRAFIS
              </span>
              <KineticText
                as="h2"
                mode="heading"
                className="text-3xl md:text-5xl font-serif font-bold text-[#121212]"
              >
                Peta Transparansi Kasus
              </KineticText>
            </div>
            <p className="font-sans text-neutral-600 max-w-md font-medium text-sm">
              Klik pada marker wilayah RW untuk meninjau jumlah kasus anak putus sekolah dan penyebab dominan.
            </p>
          </div>

          <div className="map-container w-full h-[500px] border-[3px] border-[#121212] shadow-[8px_8px_0px_0px_#121212]">
            <MapTransparency />
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 5: GALERI KARYA (WebGL Distortion)
          ============================================ */}
      <section ref={galleryRef} className="px-6 md:px-12 lg:px-24 py-24 bg-[#F3F0EB] relative">
        <ParallaxSticker shape="star" size={48} color="#FB923C" speed={-40} style={{ top: "5%", right: "8%" }} />

        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-sans text-xs font-bold text-[#121212] uppercase tracking-widest mb-2 block">
              PENGEMBALIAN HARAPAN
            </span>
            <KineticText
              as="h2"
              mode="heading"
              className="text-3xl md:text-5xl font-serif font-bold text-[#121212]"
            >
              Galeri Karya Anak
            </KineticText>
            <KineticText
              as="p"
              mode="paragraph"
              className="font-sans text-neutral-600 mt-4 font-medium"
            >
              Karya kreatif yang digambar oleh anak-anak yang telah berhasil kita sekolahkan kembali — sebuah bukti nyata hak bermain dan belajar mereka
            </KineticText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Mimpi di Langit Sore",
                artist: "Dodi (10 tahun)",
                desc: "Gambar cat air tentang cita-cita menjadi pilot pesawat terbang.",
                img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=600",
              },
              {
                title: "Sekolah Baru Kami",
                artist: "Siti (8 tahun)",
                desc: "Ilustrasi gedung sekolah berpagar merah penuh bunga matahari.",
                img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=600",
              },
              {
                title: "Bermain Bola Bersama",
                artist: "Rudi (12 tahun)",
                desc: "Krayon tentang persahabatan di lapangan rumput halaman sekolah.",
                img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600",
              },
            ].map((art) => (
              <div key={art.title} className="gallery-card group">
                <div className="border-[3px] border-[#121212] shadow-[6px_6px_0px_0px_#121212] bg-[#FFFFFF] p-4 hover:-translate-y-2 transition-transform duration-300">
                  <WebGLImage
                    src={art.img}
                    alt={art.title}
                    className="w-full aspect-[4/3] border-[2px] border-[#121212] shadow-[2px_2px_0px_0px_#121212] mb-4"
                  />
                  <h3 className="font-serif text-lg font-bold text-[#121212] mb-1">{art.title}</h3>
                  <span className="font-sans text-xs font-bold text-[#E11D48] mb-3 block">
                    Karya {art.artist}
                  </span>
                  <p className="font-sans text-xs text-neutral-600 font-semibold mt-2 border-t border-[#121212]/30 pt-2">
                    {art.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 6: DONASI
          ============================================ */}
      <section className="px-6 md:px-12 lg:px-24 py-24 bg-[#FAF9F5]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <KineticText
              as="h2"
              mode="heading"
              className="text-3xl md:text-5xl font-serif font-bold text-[#121212] mb-4"
            >
              Donasi dan Dukungan Sosial
            </KineticText>
            <p className="font-sans text-neutral-600 font-medium">
              Dukungan Anda sepenuhnya dialokasikan untuk membiayai paket seragam, buku tulis, dan transport operasional rujukan anak putus sekolah.
            </p>
          </div>

          <div className="donasi-card p-8 md:p-12 bg-[#FFFFFF] border-[3px] border-[#121212] shadow-[8px_8px_0px_0px_#121212]">
            {donationSuccess ? (
              <div className="flex flex-col items-center justify-center text-center p-6 bg-emerald-100 border-[3px] border-[#121212] text-emerald-950 font-sans shadow-[4px_4px_0px_0px_#121212]">
                <Award className="w-12 h-12 mb-4 text-emerald-700" />
                <h3 className="text-lg font-bold mb-2">Terima Kasih Banyak!</h3>
                <p className="text-sm font-semibold">
                  Komitmen dukungan Anda telah tercatat. Tim KKN / Operator akan menghubungi email Anda untuk verifikasi transfer donasi.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="font-sans text-xs font-bold text-[#121212] uppercase tracking-wider mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      className="px-4 py-3 bg-[#FFFFFF] border-[3px] border-[#121212] font-sans text-sm font-semibold focus:outline-none focus:border-[#E11D48] focus:shadow-[2px_2px_0px_0px_#E11D48] transition-all"
                      placeholder="Masukkan nama Anda"
                      {...register("nama")}
                    />
                    {errors.nama && (
                      <span className="font-sans text-xs text-[#E11D48] mt-1 flex items-center gap-1 font-bold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.nama.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="font-sans text-xs font-bold text-[#121212] uppercase tracking-wider mb-2">Alamat Email</label>
                    <input
                      type="email"
                      className="px-4 py-3 bg-[#FFFFFF] border-[3px] border-[#121212] font-sans text-sm font-semibold focus:outline-none focus:border-[#E11D48] focus:shadow-[2px_2px_0px_0px_#E11D48] transition-all"
                      placeholder="nama@email.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <span className="font-sans text-xs text-[#E11D48] mt-1 flex items-center gap-1 font-bold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="font-sans text-xs font-bold text-[#121212] uppercase tracking-wider mb-2">Jumlah Donasi (Rupiah)</label>
                    <div className="relative flex">
                      <span className="inline-flex items-center px-4 bg-neutral-200 border-y-[3px] border-l-[3px] border-[#121212] font-mono font-bold text-sm text-neutral-800">
                        Rp
                      </span>
                      <input
                        type="number"
                        className="w-full px-4 py-3 bg-[#FFFFFF] border-[3px] border-[#121212] font-sans text-sm font-semibold focus:outline-none focus:border-[#E11D48] focus:shadow-[2px_2px_0px_0px_#E11D48] transition-all"
                        placeholder="100000"
                        {...register("jumlah")}
                      />
                    </div>
                    {errors.jumlah && (
                      <span className="font-sans text-xs text-[#E11D48] mt-1 flex items-center gap-1 font-bold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.jumlah.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="font-sans text-xs font-bold text-[#121212] uppercase tracking-wider mb-2">Catatan Dukungan (Opsional)</label>
                    <input
                      type="text"
                      className="px-4 py-3 bg-[#FFFFFF] border-[3px] border-[#121212] font-sans text-sm font-semibold focus:outline-none focus:border-[#E11D48] focus:shadow-[2px_2px_0px_0px_#E11D48] transition-all"
                      placeholder="Pesan dukungan untuk anak-anak"
                      {...register("catatan")}
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <MagneticButton type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                    {isSubmitting ? "Mengirim Donasi..." : "Kirim Komitmen Donasi"}
                  </MagneticButton>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 7: FOOTER
          ============================================ */}
      <footer className="px-6 md:px-12 lg:px-24 py-16 bg-[#121212] text-[#FAF9F5] font-sans overflow-hidden">
        {/* Massive Brand Text with Clip Reveal */}
        <div ref={footerBrandRef} className="mb-12">
          <span className="vt-brand block font-serif text-[15vw] md:text-[12vw] font-bold leading-none tracking-tighter text-[#FAF9F5]/10 select-none">
            RADAR ANAK
          </span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-[#FAF9F5]/10 pt-8">
          <div className="flex items-center gap-4">
            <span className="vt-brand font-serif text-lg font-bold tracking-tight text-white">
              RADAR ANAK
            </span>
            <span className="text-neutral-500">|</span>
            <span className="text-neutral-500 font-medium text-xs">
              &copy; 2026 KKN Pilot Kelurahan Percontohan. All rights reserved.
            </span>
          </div>
          <div className="flex gap-6 text-neutral-400 font-bold text-xs">
            <a href="/dashboard" data-cursor="BUKA" className="hover:text-white transition-colors cursor-none">
              Dashboard Operator
            </a>
            <a href="#" data-cursor="INFO" className="hover:text-white transition-colors cursor-none">
              Filosofi Program
            </a>
            <a href="#" data-cursor="KONTAK" className="hover:text-white transition-colors cursor-none">
              Hubungi Kami
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
```

---

## STEP 9: Install Dependencies & Build

**Jalankan di terminal berurutan:**

```bash
npm install ogl@^1.0.8 simplex-noise@^4.0.3
```

Kemudian test:

```bash
npm run dev
```

Verifikasi di browser:
1. Buka `http://localhost:3000`
2. Pastikan hero section muncul dengan kinetic text animation
3. Scroll — pastikan hero scale-down transition bekerja
4. Pastikan marquee divider scrolling
5. Scroll ke story — pastikan clip-path wipe bekerja
6. Scroll ke dampak — pastikan cards muncul dengan 3D entrance
7. Hover cards — pastikan tilt effect bekerja
8. Scroll ke gallery — hover images, pastikan WebGL distortion bekerja (desktop only)
9. Pastikan custom cursor terlihat di desktop
10. Pastikan film grain terlihat (sangat subtle)
11. Pastikan smooth scroll bekerja (Lenis)

Kemudian build test:

```bash
npm run build
```

Pastikan **0 errors**.

---

## STEP 10: Final Verification Checklist

| # | Item | Expected |
|---|------|----------|
| 1 | `npm run build` | Success, 0 errors |
| 2 | Hero kinetic text | Chars animate in with rotateX + skewY |
| 3 | Hero → Story transition | Hero scales down with shadow on scroll |
| 4 | Story clip-path wipe | Yellow panel reveals from right |
| 5 | Dampak cards | 3D staggered entrance |
| 6 | Dampak tilt | Cards tilt following mouse |
| 7 | Gallery WebGL | Liquid distortion on hover (desktop) |
| 8 | Marquee dividers | Infinite scroll text |
| 9 | Custom cursor | Dot follows mouse, scales on hover |
| 10 | Film grain | Very subtle texture overlay |
| 11 | Smooth scroll | Buttery Lenis scroll |
| 12 | Footer brand reveal | "RADAR ANAK" clips in on scroll |
| 13 | Mobile responsive | Simplified animations, no WebGL |
| 14 | `prefers-reduced-motion` | All animations disabled |
| 15 | Form donation | Submit works, success state shows |

---

## CATATAN PENTING UNTUK EXECUTOR

1. **JANGAN** ubah file di `components/dashboard/`, `app/(dashboard)/`, `lib/supabase.ts`, `lib/api/`, `lib/risk-engine/`, `lib/validation/`, atau `types/`. Itu bagian dashboard yang tidak boleh disentuh.

2. **JANGAN** ubah `MapTransparency.tsx` — komponen ini tetap sama. Tile map yang digunakan saat ini (CartoDB Positron) sudah bagus dan terang.

3. **Semua file baru** harus di-create, BUKAN modify file yang sudah ada. Gunakan exact path yang ditulis di atas.

4. **Urutan eksekusi WAJIB diikuti** — Step 0 → 1 → 2 → ... → 10. Jangan loncat.

5. Jika ada TypeScript error tentang `window.__lenisVelocity`, abaikan — ini adalah dynamic property yang sengaja di-set at runtime.

6. **OGL dynamic import**: `WebGLImage.tsx` menggunakan `import("ogl")` — ini dynamic import agar tidak masuk ke initial bundle. Pastikan `ogl` terinstall di `node_modules`.
