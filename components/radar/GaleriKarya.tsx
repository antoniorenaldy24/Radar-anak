"use client";

import { useRef } from "react";

const ITEMS = [
  { img: "/assets/karya-1.jpg", title: "Bus Sekolah Kuning", author: "Budi, 10 thn", tag: "Kembali sekolah / Jan 2024", rot: -2 },
  { img: "/assets/karya-2.jpg", title: "Rumah Impian", author: "Siti, 9 thn", tag: "Penerima beasiswa Radar Anak", rot: 3 },
  { img: "/assets/karya-3.jpg", title: "Kawan Belajar", author: "Fikri, 11 thn", tag: "PKBM, sedang berjalan", rot: -1 },
];

function TiltCard({
  item,
}: {
  item: (typeof ITEMS)[number];
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotate(${item.rot}deg) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-6px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `perspective(1000px) rotate(${item.rot}deg)`;
  };

  return (
    <div className="group flex flex-col gap-5" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div
        ref={ref}
        className="relative bg-white p-3 ring-1 ring-ink/10 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.04)] transition-[transform,box-shadow] duration-300 ease-out group-hover:shadow-[8px_8px_0_0_var(--signal)] will-change-transform"
        style={{ transform: `perspective(1000px) rotate(${item.rot}deg)` }}
      >
        <img
          src={item.img}
          alt={item.title}
          loading="lazy"
          width={600}
          height={800}
          className="block aspect-[3/4] w-full object-cover"
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-widest text-ink/60">
            {item.author}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-signal">
            ●
          </span>
        </div>
      </div>

      <div>
        <p className="font-display text-xl font-extrabold italic tracking-tight">
          &ldquo;{item.title}&rdquo;
        </p>
        <p className="mt-1 text-xs text-ink/50">{item.tag}</p>
        <div className="mt-2 h-[2px] w-0 bg-ink transition-[width] duration-500 ease-out group-hover:w-24" />
      </div>
    </div>
  );
}

export function GaleriKarya() {
  return (
    <section id="galeri" className="border-b border-ledger bg-paper">
      <div className="mx-auto max-w-[1600px] px-6 py-20">
        <div className="mb-14">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            04 &middot; Galeri Karya
          </div>
          <h2 className="mt-2 max-w-2xl font-display text-3xl font-extrabold tracking-tight md:text-5xl">
            Mereka yang kembali <span className="italic text-signal">tersenyum.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-14">
          {ITEMS.map((it, i) => (
            <div key={i} className={i === 1 ? "md:mt-14" : ""}>
              <TiltCard item={it} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
