"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radar, Lock, Users, BarChart3, HeartHandshake, Menu, X } from "lucide-react";

export function TopNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCreditsPage = pathname === "/credits";
  const isTransparansiPage = pathname === "/transparansi";
  const isRelawanPage = pathname === "/relawan";

  return (
    <nav className="sticky top-0 z-40 border-b border-ledger bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="grid size-8 place-items-center bg-ink text-paper group-hover:bg-signal transition-colors">
            <Radar className="size-4" strokeWidth={2.25} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">
              Radar Anak
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
              Investigasi Sipil / 02.77
            </span>
          </div>
        </Link>

        {/* Right: Desktop Navigation Group */}
        <div className="hidden md:flex items-center">
          {/* Page Buttons Group (Identical Form, Size, & Color) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Data Transparansi Page Link */}
            <Link
              href="/transparansi"
              className={`inline-flex items-center gap-1.5 border font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-3.5 py-1.5 transition-all shadow-[2px_2px_0_0_#121212] active:translate-y-px ${
                isTransparansiPage
                  ? "bg-ink text-paper border-ink"
                  : "bg-paper text-ink border-ink hover:bg-ink hover:text-paper"
              }`}
            >
              <BarChart3 className="size-3 text-signal" strokeWidth={2.5} />
              <span>Transparansi</span>
            </Link>

            {/* Relawan & SOP Page Link */}
            <Link
              href="/relawan"
              className={`inline-flex items-center gap-1.5 border font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-3.5 py-1.5 transition-all shadow-[2px_2px_0_0_#121212] active:translate-y-px ${
                isRelawanPage
                  ? "bg-ink text-paper border-ink"
                  : "bg-paper text-ink border-ink hover:bg-ink hover:text-paper"
              }`}
            >
              <HeartHandshake className="size-3 text-signal" strokeWidth={2.5} />
              <span>Relawan &amp; SOP</span>
            </Link>

            {/* Tim KKN 34 Page Link */}
            <Link
              href="/credits"
              className={`inline-flex items-center gap-1.5 border font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-3.5 py-1.5 transition-all shadow-[2px_2px_0_0_#121212] active:translate-y-px ${
                isCreditsPage
                  ? "bg-ink text-paper border-ink"
                  : "bg-paper text-ink border-ink hover:bg-ink hover:text-paper"
              }`}
            >
              <Users className="size-3 text-signal" strokeWidth={2.5} />
              <span>Tim KKN 34</span>
            </Link>
          </div>

          {/* Separated Far-Right Login Button (With Divider & Spacing) */}
          <div className="ml-4 pl-4 border-l border-ink/20">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 border border-ink bg-ink px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-paper transition-all hover:bg-signal hover:border-signal active:translate-y-px shadow-[2px_2px_0_0_#121212]"
            >
              <Lock className="size-3 text-signal" strokeWidth={2.5} />
              <span>Masuk Operator</span>
            </Link>
          </div>
        </div>

        {/* Mobile Hamburger Toggle Button (< md) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="grid size-9 place-items-center border border-ink bg-paper text-ink shadow-[2px_2px_0_0_#121212] active:translate-y-px md:hidden cursor-pointer"
          aria-label="Toggle Mobile Menu"
        >
          {mobileMenuOpen ? (
            <X className="size-5 text-signal" strokeWidth={2.5} />
          ) : (
            <Menu className="size-5 text-ink" strokeWidth={2.5} />
          )}
        </button>
      </div>

      {/* Mobile Tactical Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b-2 border-ink bg-paper p-6 space-y-4 animate-[fade-up_0.2s_ease-out] shadow-xl">
          <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-ink/50 border-b border-ledger pb-2 flex items-center justify-between">
            <span>NAVIGASI MOBILE</span>
            <span className="text-signal font-bold">● ONLINE</span>
          </div>

          <div className="flex flex-col space-y-3 font-mono text-xs uppercase tracking-wider">
            <Link
              href="/transparansi"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-3 border font-bold ${
                isTransparansiPage
                  ? "bg-ink text-paper border-ink"
                  : "bg-white text-ink border-ink/20 hover:border-ink"
              }`}
            >
              <span className="flex items-center gap-2">
                <BarChart3 className="size-4 text-signal" /> Data Transparansi
              </span>
              <span>&rarr;</span>
            </Link>

            <Link
              href="/relawan"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-3 border font-bold ${
                isRelawanPage
                  ? "bg-ink text-paper border-ink"
                  : "bg-white text-ink border-ink/20 hover:border-ink"
              }`}
            >
              <span className="flex items-center gap-2">
                <HeartHandshake className="size-4 text-signal" /> Relawan &amp; SOP
              </span>
              <span>&rarr;</span>
            </Link>

            <Link
              href="/credits"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-3 border font-bold ${
                isCreditsPage
                  ? "bg-ink text-paper border-ink"
                  : "bg-white text-ink border-ink/20 hover:border-ink"
              }`}
            >
              <span className="flex items-center gap-2">
                <Users className="size-4 text-signal" /> Tim KKN 34
              </span>
              <span>&rarr;</span>
            </Link>

            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-3.5 border border-ink bg-ink text-paper font-bold tracking-widest shadow-[3px_3px_0_0_#e6390e] mt-2 active:translate-y-px"
            >
              <Lock className="size-4 text-signal" strokeWidth={2.5} />
              <span>MASUK OPERATOR</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
