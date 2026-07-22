"use client";

import { useEffect, useRef } from "react";
import { MoveDown } from "lucide-react";

const TITLE_TOP = "RADAR";
const TITLE_BOTTOM = "ANAK.";

export function HeroRadar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={ref}
      className="radar-grid relative flex h-[92vh] items-center justify-center overflow-hidden border-b border-ledger"
      style={{ ["--mx" as string]: "50%", ["--my" as string]: "50%" }}
    >
      {/* cursor spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity"
        style={{
          background:
            "radial-gradient(320px circle at var(--mx) var(--my), rgba(230,57,14,0.09), transparent 65%)",
        }}
      />
      {/* crosshair */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, transparent calc(var(--mx) - 0.5px), rgba(18,18,18,0.15) var(--mx), transparent calc(var(--mx) + 0.5px)), linear-gradient(to bottom, transparent calc(var(--my) - 0.5px), rgba(18,18,18,0.15) var(--my), transparent calc(var(--my) + 0.5px))",
        }}
      />

      {/* concentric pulse rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {[0, 1.3, 2.6].map((d, i) => (
          <div
            key={i}
            className="absolute size-[380px] rounded-full border border-signal/25"
            style={{ animation: `radar-pulse 4.2s linear ${d}s infinite` }}
          />
        ))}
        <div
          className="absolute size-[720px] rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(230,57,14,0.08) 30deg, transparent 60deg)",
            animation: "radar-sweep 9s linear infinite",
          }}
        />
        <div className="absolute size-2 rounded-full bg-signal" />
      </div>

      {/* content */}
      <div className="relative z-10 px-6 text-center">
        <div className="mb-8 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-ink/60">
          <span className="h-px w-8 bg-ink/30" />
          Deteksi &middot; Verifikasi &middot; Pemulihan
          <span className="h-px w-8 bg-ink/30" />
        </div>

        <h1 className="font-display text-[clamp(4rem,14vw,11rem)] font-black leading-[0.82] tracking-[-0.04em]">
          <span className="block">
            {TITLE_TOP.split("").map((c, i) => (
              <span
                key={`t${i}`}
                className="inline-block"
                style={{
                  animation: `letter-in 0.7s cubic-bezier(0.19,1,0.22,1) ${i * 0.06}s both`,
                }}
              >
                {c}
              </span>
            ))}
          </span>
          <span className="block italic text-signal">
            {TITLE_BOTTOM.split("").map((c, i) => (
              <span
                key={`b${i}`}
                className="inline-block"
                style={{
                  animation: `letter-in 0.7s cubic-bezier(0.19,1,0.22,1) ${0.4 + i * 0.06}s both`,
                }}
              >
                {c}
              </span>
            ))}
          </span>
        </h1>

        <p
          className="mx-auto mt-8 max-w-md text-balance text-base text-ink/70"
          style={{ animation: "fade-up 0.9s ease-out 0.9s both" }}
        >
          Sistem deteksi dini dan pemetaan anak putus sekolah berbasis RW.
          Menjangkau yang tak terhitung dalam data resmi.
        </p>
      </div>

      {/* corner coords */}
      <div className="absolute bottom-6 left-6 font-mono text-[10px] uppercase leading-relaxed tracking-widest text-ink/50">
        LAT −6.2088°
        <br />
        LON 106.8456°
      </div>
      <div className="absolute bottom-6 right-6 text-right font-mono text-[10px] uppercase leading-relaxed tracking-widest text-ink/50">
        STATUS: SCANNING
        <br />
        <span className="text-signal">● SIGNAL OPTIMAL</span>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ink/40">
        <MoveDown className="size-4 animate-bounce" strokeWidth={1.5} />
      </div>
    </section>
  );
}
