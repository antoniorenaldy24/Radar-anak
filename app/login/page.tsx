"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, ShieldCheck, KeyRound, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Set session authentication flag
      if (typeof window !== "undefined") {
        localStorage.setItem("radar_operator_session", JSON.stringify({
          username,
          loginAt: new Date().toISOString(),
          role: "Operator Kelurahan Dukuh Sutorejo",
        }));
        document.cookie = "radar_operator_session=true; path=/; max-age=86400;";
      }

      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="relative min-h-screen bg-paper text-ink flex flex-col justify-between selection:bg-signal selection:text-white">
      <div className="paper-noise pointer-events-none fixed inset-0 z-[60]" />
      <div className="radar-grid pointer-events-none absolute inset-0 opacity-40" />

      {/* Top Header */}
      <nav className="sticky top-0 z-40 border-b border-ledger bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink/70 hover:text-signal transition-colors"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            Kembali ke Beranda
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/50">
            AUTENTIKASI &middot; 01 / OPERATOR
          </span>
        </div>
      </nav>

      {/* Login Card Form */}
      <main className="flex-1 flex items-center justify-center px-6 py-16 z-10">
        <div className="w-full max-w-md bg-white border border-ink p-8 sm:p-10 shadow-[8px_8px_0_0_#121212] relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-ledger pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="grid size-7 place-items-center bg-signal text-white">
                <Lock className="size-3.5" strokeWidth={2.5} />
              </div>
              <span className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] text-ink">
                Akses Terproteksi
              </span>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink/40">
              SYS_AUTH / 02.77
            </span>
          </div>

          <div className="mb-6">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
              Masuk Workspace
            </h1>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink/60">
              Operator Dukuh Sutorejo, Surabaya &middot; KKN 34
            </p>
          </div>

          {/* Quick Credential Hint Box for Testing */}
          <div className="mb-6 border border-ink/15 bg-[#efeee9] p-3.5 text-xs font-mono">
            <div className="flex items-center justify-between font-bold text-ink mb-1">
              <span>🔑 AKUN DEMO OPERATOR:</span>
              <button
                type="button"
                onClick={() => {
                  setUsername("operator_sutorejo");
                  setPassword("radar2026");
                }}
                className="text-signal underline hover:text-ink cursor-pointer text-[9px] uppercase font-bold"
              >
                [Isi Otomatis]
              </button>
            </div>
            <div className="text-ink/70 text-[10px] space-y-0.5">
              <div>Username: <code className="font-bold text-ink bg-white px-1">operator_sutorejo</code></div>
              <div>Password: <code className="font-bold text-ink bg-white px-1">radar2026</code></div>
            </div>
          </div>

          {error && (
            <div className="mb-6 border-l-4 border-signal bg-signal/5 p-3 text-xs font-mono text-signal font-semibold">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-ink/70 font-bold mb-2">
                ID Operator / Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: operator_manggarai"
                  className="w-full border border-ink bg-paper px-4 py-2.5 font-mono text-xs text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-signal focus:border-signal"
                />
                <UserCheck className="absolute right-3 top-3 size-4 text-ink/30 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-ink/70 font-bold mb-2">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full border border-ink bg-paper px-4 py-2.5 font-mono text-xs text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-signal focus:border-signal"
                />
                <KeyRound className="absolute right-3 top-3 size-4 text-ink/30 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 border border-ink bg-ink py-3 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-paper hover:bg-signal hover:border-signal transition-all shadow-[4px_4px_0_0_#121212] active:translate-y-px active:shadow-none disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="size-4" strokeWidth={2.5} />
              <span>{loading ? "MENGVERIFIKASI..." : "MASUK KE DASHBOARD"}</span>
            </button>
          </form>

          <div className="mt-8 border-t border-ledger pt-4 text-center">
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink/40">
              * Hanya untuk petugas terverifikasi KKN 34 &amp; Kelurahan.
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-ledger py-6 text-center font-mono text-[9px] uppercase tracking-widest text-ink/40 z-10">
        Radar Anak &copy; 2026 &middot; Enkripsi Sinyal Terautentikasi
      </footer>
    </div>
  );
}
