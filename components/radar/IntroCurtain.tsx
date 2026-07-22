"use client";

import { useEffect, useState } from "react";

const KEY = "radar-intro-shown";

export function IntroCurtain() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(KEY)) return;
    setMounted(true);
    sessionStorage.setItem(KEY, "1");

    const start = performance.now();
    const duration = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setLeaving(true);
        setTimeout(() => setMounted(false), 700);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!mounted) return null;

  const letters = "RADARANAK".split("");

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-paper transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
        leaving ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="paper-noise pointer-events-none absolute inset-0" />
      <div className="radar-grid pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative flex flex-col items-center gap-8 px-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-ink/50">
          Memulai Pemindaian &middot; Sistem Radar Anak
        </div>

        <div className="flex items-baseline gap-2 font-display text-[clamp(3rem,10vw,8rem)] font-black uppercase leading-none tracking-tighter text-ink">
          {letters.slice(0, 5).map((c, i) => (
            <span
              key={`a-${i}`}
              className="inline-block"
              style={{
                animation: `letter-in 0.6s cubic-bezier(0.19,1,0.22,1) both`,
                animationDelay: `${i * 55}ms`,
              }}
            >
              {c}
            </span>
          ))}
          <span className="mx-2 h-[0.7em] w-[6px] bg-signal" aria-hidden />
          {letters.slice(5).map((c, i) => (
            <span
              key={`b-${i}`}
              className="inline-block"
              style={{
                animation: `letter-in 0.6s cubic-bezier(0.19,1,0.22,1) both`,
                animationDelay: `${350 + i * 55}ms`,
              }}
            >
              {c}
            </span>
          ))}
        </div>

        <div className="flex w-full max-w-md items-center gap-4">
          <div className="relative h-px flex-1 bg-ink/15">
            <div
              className="absolute inset-y-0 left-0 bg-signal"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/60 tabular-nums">
            {String(Math.round(progress * 100)).padStart(3, "0")}%
          </div>
        </div>

        <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-ink/40">
          02.77 &middot; MENGKALIBRASI KOORDINAT LAPANGAN
        </div>
      </div>
    </div>
  );
}
