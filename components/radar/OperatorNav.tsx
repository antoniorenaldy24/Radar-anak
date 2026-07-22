"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Radar, ExternalLink, LogOut, ShieldCheck } from "lucide-react";

export function OperatorNav() {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("radar_operator_session");
      document.cookie = "radar_operator_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ledger bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-4">
          <div className="grid size-8 place-items-center bg-signal text-white">
            <Radar className="size-4" strokeWidth={2.25} />
          </div>
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">
                Workspace Operator
              </span>
              <span className="inline-flex items-center gap-1 bg-ink text-paper px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider font-bold">
                <ShieldCheck className="size-2.5 text-signal" /> Verified
              </span>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
              <span>Dukuh Sutorejo, Mulyorejo, Surabaya &middot; Tim KKN 34</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 border border-ink/20 bg-white px-3 py-1.5 text-ink/70 hover:text-ink hover:border-ink transition-colors"
          >
            <span>Lihat Web Publik</span>
            <ExternalLink className="size-3" />
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 border border-signal bg-signal px-3.5 py-1.5 font-bold text-white transition-all hover:bg-ink hover:border-ink active:translate-y-px shadow-[2px_2px_0_0_#121212] cursor-pointer"
          >
            <LogOut className="size-3" strokeWidth={2.5} />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
