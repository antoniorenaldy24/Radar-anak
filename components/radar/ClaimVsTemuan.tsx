"use client";

import { useEffect, useRef, useState } from "react";

const BARS = [
  { rw: "RW 03", n: 1 },
  { rw: "RW 04", n: 3 },
  { rw: "RW 07", n: 2 },
  { rw: "RW 09", n: 1 },
];

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useCountUp(target: number, start: boolean, duration = 900) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return n;
}

export function ClaimVsTemuan() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const nZero = useCountUp(0, inView);
  const nSeven = useCountUp(7, inView, 1100);

  return (
    <section
      ref={ref}
      id="klaim"
      className="relative border-b border-ledger bg-paper overflow-hidden"
    >
      <div className="mx-auto max-w-[1600px] px-6 py-16 md:py-24">
        {/* Header */}
        <div
          className={`mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              02 &middot; Klaim vs Temuan
            </div>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold tracking-tight max-w-2xl text-ink">
              Data resmi bilang aman. Lapangan bilang lain.
            </h2>
          </div>
          <div className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50 md:block">
            ARSIP &middot; 02 / RADAR
          </div>
        </div>

        {/* Balanced 12-Column Grid (5 cols + 7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* LEFT — Claim (Official Report) */}
          <div
            className={`group relative lg:col-span-5 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
            }`}
          >
            <div className="relative flex h-full flex-col justify-between border border-ink/15 bg-[#efeee9] p-6 sm:p-8 lg:p-10 transition-all duration-500 ease-out group-hover:translate-y-[-2px] group-hover:shadow-[8px_8px_0_0_rgba(18,18,18,0.1)]">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-block bg-ink/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-ink transition-colors group-hover:bg-ink group-hover:text-paper">
                    Laporan Resmi Kelurahan
                  </span>
                </div>
                <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50">
                  Sumber: Dapodik &middot; Q1 2026
                </div>
              </div>

              <div className="my-10 md:my-14">
                <div className="font-display text-[clamp(5rem,10vw,9rem)] font-black leading-none tracking-tighter text-ink/25">
                  {nZero}
                </div>
                <div className="mt-3 font-display text-xl sm:text-2xl font-bold tracking-tight text-ink/80">
                  anak putus sekolah tercatat.
                </div>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-ink/60 border-t border-ink/10 pt-4">
                Data administratif menyatakan tingkat partisipasi pendidikan
                100%. Tidak ada laporan kasus aktif dalam sistem kelurahan.
              </p>
            </div>
          </div>

          {/* RIGHT — Reality (Field Verification Findings) */}
          <div
            className={`group relative lg:col-span-7 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] delay-150 ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            }`}
          >
            <div className="relative flex h-full flex-col justify-between border border-ink bg-ink p-6 sm:p-8 lg:p-10 text-paper transition-all duration-500 ease-out group-hover:translate-y-[-2px] group-hover:shadow-[10px_10px_0_0_var(--signal)]">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span className="inline-block bg-signal px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                    Temuan Radar Lapangan
                  </span>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/50">
                    Verifikasi Pintu-ke-Pintu
                  </div>
                </div>

                <div className="my-8 flex items-baseline gap-4">
                  <div className="font-display text-[clamp(5rem,10vw,9rem)] font-black leading-none tracking-tighter text-signal transition-[filter] duration-500 group-hover:[filter:drop-shadow(0_0_20px_rgba(230,57,14,0.5))]">
                    {nSeven}
                  </div>
                  <div className="font-display text-lg sm:text-xl italic text-paper/80 leading-tight">
                    anak <br /> ditemukan.
                  </div>
                </div>
              </div>

              <div>
                {/* Bar Chart per RW */}
                <div className="mt-4 flex h-36 items-end gap-4 border-b border-paper/15 pb-4">
                  {BARS.map((b, i) => (
                    <div
                      key={b.rw}
                      className="group/bar relative flex flex-1 flex-col items-center gap-2 h-full justify-end"
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-signal px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-white opacity-0 transition-opacity duration-200 group-hover/bar:opacity-100 shadow-sm z-10">
                        {b.n} anak
                      </div>
                      <div
                        className="w-full origin-bottom bg-signal transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/bar:scale-x-105"
                        style={{
                          height: `${(b.n / 3) * 100}%`,
                          transform: inView ? "scaleY(1)" : "scaleY(0)",
                          transitionDelay: `${300 + i * 100}ms`,
                        }}
                      />
                      <span className="font-mono text-[10px] uppercase tracking-widest text-paper/70 font-semibold">
                        {b.rw}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-xs leading-relaxed text-paper/60 font-medium">
                  Konsentrasi terbesar di RW 04 (3 kasus), disusul RW 07 (2 kasus), RW
                  03 (1 kasus), dan RW 09 (1 kasus). Mayoritas diakibatkan faktor ekonomi &amp;
                  akses sekolah.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
