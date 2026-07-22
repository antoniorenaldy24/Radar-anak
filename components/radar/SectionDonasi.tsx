"use client";

import { useState } from "react";
import { Heart, Send, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";

export function SectionDonasi() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [catatan, setCatatan] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !email || !jumlah) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 800);
  };

  return (
    <section id="donasi" className="border-b border-ledger bg-[#efeee9] relative overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:py-28">
        {/* Section Header */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-signal font-bold">
              05 &middot; Intervensi &amp; Dukungan Sosial
            </div>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold tracking-tight text-ink">
              Bantu mereka kembali <span className="italic text-signal">ke sekolah.</span>
            </h2>
            <p className="mt-4 text-sm md:text-base text-ink/70 leading-relaxed font-sans">
              Setiap rupiah dukungan dialokasikan secara terbuka untuk membiayai paket perlengkapan sekolah (buku, seragam, tas), operasional pendampingan relawan KKN 34, dan biaya kejar paket PKBM bagi anak teridentifikasi.
            </p>
          </div>

          <div className="hidden lg:block font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50 border-l border-ink/20 pl-4">
            TRANSPARANSI DATA 100% &middot; DIKELOLA KKN 34
          </div>
        </div>

        {/* 2-Column Donation Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column: Transparency & Program Breakdown Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="border border-ink bg-paper p-6 sm:p-8 shadow-[6px_6px_0_0_#121212]">
              <div className="flex items-center gap-2 mb-4">
                <div className="grid size-7 place-items-center bg-signal text-white">
                  <Heart className="size-4" strokeWidth={2.5} />
                </div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
                  Alokasi Dana Bantuan
                </span>
              </div>
              <ul className="space-y-3 font-mono text-[11px] text-ink/80 border-t border-ledger pt-4">
                <li className="flex items-start gap-2">
                  <span className="text-signal font-bold">●</span>
                  <span><strong>Paket Seragam &amp; Alat Tulis:</strong> Rp 250.000 / anak</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-signal font-bold">●</span>
                  <span><strong>Modul Modul Kejar Paket PKBM:</strong> Rp 400.000 / semester</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-signal font-bold">●</span>
                  <span><strong>Transport Pendampingan Psikososial:</strong> Operasional Relawan</span>
                </li>
              </ul>
            </div>

            <div className="border border-ink/20 bg-white p-6 font-mono text-[10px] uppercase tracking-wider text-ink/60 space-y-2">
              <div className="flex items-center gap-2 text-ink font-bold">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>AKUNTABILITAS TERCATAT</span>
              </div>
              <p className="normal-case font-sans text-xs text-ink/70">
                Laporan pertanggungjawaban donasi dipublikasikan secara berkala di halaman publik &amp; dapat diaudit oleh warga kelurahan.
              </p>
            </div>
          </div>

          {/* Right Column: Donation Form */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="border border-ink bg-white p-6 sm:p-10 shadow-[8px_8px_0_0_#121212] relative">
              {success ? (
                <div className="py-12 text-center space-y-4">
                  <div className="mx-auto grid size-12 place-items-center bg-emerald-600 text-white rounded-full">
                    <CheckCircle2 className="size-6" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-display text-2xl font-extrabold text-ink">
                    Komitmen Donasi Terdaftar!
                  </h3>
                  <p className="max-w-md mx-auto text-xs sm:text-sm text-ink/70 leading-relaxed font-sans">
                    Terima kasih banyak, <strong>{nama}</strong>. Tim KKN 34 / Operator Kelurahan akan menghubungi email <strong>{email}</strong> untuk verifikasi transfer bantuan.
                  </p>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setNama("");
                      setEmail("");
                      setJumlah("");
                      setCatatan("");
                    }}
                    className="mt-4 border border-ink bg-paper px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-ink hover:bg-ink hover:text-paper transition-all cursor-pointer"
                  >
                    + Kirim Donasi Lainnya
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-ledger pb-4">
                    <h3 className="font-display text-xl font-extrabold text-ink">
                      Form Komitmen Donasi
                    </h3>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-ink/40">
                      SYS_DONASI / 2026
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/70 mb-2">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        required
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        placeholder="Nama Anda / Hamba Allah"
                        className="w-full border border-ink bg-paper px-3.5 py-2.5 font-mono text-xs text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-signal"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/70 mb-2">
                        Alamat Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full border border-ink bg-paper px-3.5 py-2.5 font-mono text-xs text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-signal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/70 mb-2">
                        Nominal Donasi (Rupiah) *
                      </label>
                      <div className="relative flex">
                        <span className="inline-flex items-center border border-r-0 border-ink bg-[#efeee9] px-3 font-mono text-xs font-bold text-ink">
                          Rp
                        </span>
                        <input
                          type="number"
                          required
                          min="10000"
                          value={jumlah}
                          onChange={(e) => setJumlah(e.target.value)}
                          placeholder="100000"
                          className="w-full border border-ink bg-paper px-3.5 py-2.5 font-mono text-xs text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-signal"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/70 mb-2">
                        Pesan Dukungan (Opsional)
                      </label>
                      <input
                        type="text"
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        placeholder="Semangat untuk anak-anak!"
                        className="w-full border border-ink bg-paper px-3.5 py-2.5 font-mono text-xs text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-signal"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full border border-ink bg-ink py-3 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-paper hover:bg-signal hover:border-signal transition-all shadow-[4px_4px_0_0_#121212] active:translate-y-px active:shadow-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="size-4" strokeWidth={2.5} />
                    <span>{loading ? "MENDAFTARKAN..." : "KIRIM KOMITMEN DONASI"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
