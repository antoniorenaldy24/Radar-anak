"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp, ShieldCheck } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Generate 48 pixel blocks for matrix reveal grid
const PIXEL_GRID_BLOCKS = Array.from({ length: 48 }, (_, i) => i);

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const brandTextRef = useRef<HTMLDivElement>(null);
  const backToTopRef = useRef<HTMLButtonElement>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [brandHovered, setBrandHovered] = useState(false);
  const [pixelsResolved, setPixelsResolved] = useState(false);

  // === GSAP ScrollTrigger Pixelated Dissolve Reveal ===
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (brandTextRef.current) {
        const pixelBlocks = brandTextRef.current.querySelectorAll(".pixel-block");
        const brandText = brandTextRef.current.querySelector(".brand-typography");

        // Trigger automatically when 75% of footer section is visible (start: "top 75%")
        const tl = gsap.timeline({
          onStart: () => setPixelsResolved(false),
          onComplete: () => setPixelsResolved(true),
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });

        // Dissolve pixel blocks in staggered random order
        tl.to(pixelBlocks, {
          opacity: 0,
          scale: 0.1,
          duration: 0.8,
          stagger: {
            amount: 0.7,
            from: "random",
          },
          ease: "power3.out",
        });
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  // === Magnetic Recoil on Back to Top Button ===
  const handleMagneticMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = backToTopRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMagneticLeave = () => {
    const btn = backToTopRef.current;
    if (!btn) return;
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const FOOTER_LINKS = [
    { label: "Kredit Tim KKN 34", href: "/credits", tag: "SYS_LINK // 01" },
    { label: "Transparansi Data", href: "/transparansi", tag: "SYS_LINK // 02" },
    { label: "Panduan Relawan", href: "/relawan", tag: "SYS_LINK // 03" },
    { label: "Donasi & Intervensi", href: "/#donasi", tag: "SYS_LINK // 04" },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative border-t border-ink bg-ink text-paper pt-16 pb-12 overflow-hidden selection:bg-signal selection:text-white"
    >
      {/* SVG Pixelate Filter Definition */}
      <svg className="hidden" aria-hidden="true">
        <defs>
          <filter id="pixelate-filter" x="0%" y="0%" width="100%" height="100%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            />
          </filter>
        </defs>
      </svg>

      {/* Background Noise & Radar Grid */}
      <div className="paper-noise pointer-events-none absolute inset-0 opacity-10" />
      <div className="radar-grid pointer-events-none absolute inset-0 opacity-20" />

      <div className="mx-auto max-w-[1600px] px-6 relative z-10">
        {/* Top Section: Navigation Links & Live Telemetry HUD */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-paper/15 pb-12">
          {/* Left: System Status & Brand Tag */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-paper/10 px-3 py-1 border border-paper/20 font-mono text-[10px] uppercase tracking-[0.25em] text-paper">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-signal" />
              </span>
              <span>● TELEMETRY STATUS: ONLINE</span>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-paper/50">
              Arsip Investigasi &middot; Kel. Dukuh Sutorejo, Kec. Mulyorejo, Surabaya, Jawa Timur
            </p>
          </div>

          {/* Middle: Quick Links with Sonar Burst & Tracking Expansion Hover */}
          <nav className="flex flex-wrap items-center gap-6 sm:gap-8 font-mono text-[10px] uppercase tracking-widest">
            {FOOTER_LINKS.map((link) => (
              <div
                key={link.label}
                className="relative group py-2"
                onMouseEnter={() => setHoveredLink(link.label)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-2 text-paper/70 transition-all duration-300 group-hover:text-signal group-hover:tracking-[0.25em]"
                >
                  <span className="relative flex size-2 items-center justify-center">
                    <span
                      className={`absolute rounded-full border border-signal transition-all duration-500 ease-out ${
                        hoveredLink === link.label
                          ? "size-6 opacity-100 scale-125 bg-signal/20"
                          : "size-2 opacity-0 scale-50"
                      }`}
                    />
                    <span className="size-1.5 rounded-full bg-signal group-hover:bg-paper transition-colors" />
                  </span>
                  <span>{link.label}</span>
                </Link>

                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-signal text-white px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-widest pointer-events-none transition-all duration-300 ${
                    hoveredLink === link.label
                      ? "opacity-100 -translate-y-1 scale-100"
                      : "opacity-0 translate-y-2 scale-75"
                  }`}
                >
                  {link.tag}
                </div>
              </div>
            ))}
          </nav>

          {/* Right: Magnetic Command Back to Top Button */}
          <button
            ref={backToTopRef}
            onClick={scrollToTop}
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticLeave}
            className="group flex items-center gap-2 border border-paper/30 bg-paper/10 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-paper transition-all hover:bg-signal hover:border-signal hover:text-white shadow-[3px_3px_0_0_#e6390e] cursor-pointer"
          >
            <span>[00 // KEMBALI KE ATAS]</span>
            <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-1" strokeWidth={2.5} />
          </button>
        </div>

        {/* Bottom Section: Interactive Brand Watermark with PIXELATED REVEAL DISSOLVE */}
        <div
          ref={brandTextRef}
          onMouseEnter={() => setBrandHovered(true)}
          onMouseLeave={() => setBrandHovered(false)}
          className="my-10 relative cursor-pointer group select-none overflow-hidden"
        >
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.3em] text-paper/40 mb-3">
            <span>[PIXELATED SENSUS MATRIX]</span>
            <span className={`transition-colors duration-300 font-bold ${brandHovered ? "text-signal" : "text-paper/40"}`}>
              {brandHovered
                ? "● PIXEL MATRIX SCAN: ACTIVE"
                : pixelsResolved
                ? "● PIXEL REVEAL: COMPLETE"
                : "● SENSUS MATRIX REVEALED"}
            </span>
          </div>

          <div className="relative py-2">
            {/* Main Sharp Brand Typography */}
            <h1
              className={`brand-typography font-display text-[14vw] md:text-[11.5vw] font-black leading-[0.85] tracking-tighter transition-all duration-500 ${
                brandHovered
                  ? "text-signal tracking-[0.02em] [text-shadow:0_0_20px_rgba(230,57,14,0.4)]"
                  : "text-paper/20"
              }`}
              style={{
                imageRendering: "pixelated",
              }}
            >
              RADAR ANAK
            </h1>

            {/* Pixel Grid Mosaic Matrix Overlay (Fades out via GSAP ScrollTrigger) */}
            <div className="pointer-events-none absolute inset-0 grid grid-cols-12 sm:grid-cols-24 grid-rows-2 gap-0.5 z-20">
              {PIXEL_GRID_BLOCKS.map((id) => (
                <div
                  key={id}
                  className={`pixel-block border border-paper/10 transition-colors duration-200 ${
                    brandHovered ? "bg-signal/40 border-signal/60" : "bg-ink/90"
                  }`}
                  style={{
                    backdropFilter: "blur(8px)",
                  }}
                />
              ))}
            </div>

            {/* Interactive Pixel Glitch Sweep Flash on Hover */}
            {brandHovered && (
              <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
                <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-signal/20 via-transparent to-transparent animate-pulse" />
              </div>
            )}
          </div>
        </div>

        {/* Copyright Footer Ledger */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-paper/10 font-mono text-[9px] uppercase tracking-widest text-paper/40">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-3.5 text-signal" />
            <span>Radar Anak &copy; 2026 &middot; KKN 34 Universitas Muhammadiyah Surabaya</span>
          </div>
          <div>DATA TER-ENKRIPSI &middot; OPEN-SOURCE CIVIL SYSTEM</div>
        </div>
      </div>
    </footer>
  );
}
