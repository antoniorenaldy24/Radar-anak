"use client";

import { useRef, useState } from "react";

export function CreditCard({
  index,
  name,
  role,
}: {
  index: number;
  name: string;
  role: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -y * 8, ry: x * 8 });
  };
  const reset = () => setTilt({ rx: 0, ry: 0 });

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="group [perspective:1000px]"
    >
      <div
        className="relative flex aspect-[3/4] flex-col justify-between border border-ink/15 bg-white p-5 transition-[transform,box-shadow] duration-300 ease-out group-hover:shadow-[8px_8px_0_0_var(--signal)] will-change-transform"
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        }}
      >
        <div className="flex items-start justify-between">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-ink/50">
            #{String(index).padStart(2, "0")}
          </span>
          <span className="size-2 rounded-full bg-signal" />
        </div>

        <div className="flex flex-1 items-center justify-center py-4">
          <div className="relative">
            <div className="font-display text-[clamp(3rem,6vw,5rem)] font-black leading-none tracking-tighter text-ink transition-colors duration-300 group-hover:text-signal">
              {initials}
            </div>
          </div>
        </div>

        <div className="space-y-1 border-t border-ledger pt-3">
          <div className="font-display text-base font-extrabold tracking-tight text-ink">
            {name}
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-ink/60">
            {role}
          </div>
        </div>
      </div>
    </div>
  );
}
