"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, HeartHandshake, FileText, Send, CheckCircle2, AlertTriangle, BookOpen } from "lucide-react";
import { Footer } from "@/components/radar/Footer";

const CODE_OF_ETHICS = [
  {
    title: "1. Perlindungan Identitas Publik",
    body: "Seluruh nama anak wajib disamarkan di tampilan publik menjadi inisial (misal: S.W.). Dilarang mengambil foto wajah anak secara terbuka tanpa izin tertulis dari orang tua/wali.",
  },
  {
    title: "2. Bebas Stigma & Empati Pendampingan",
    body: "Wawancara dilakukan tanpa menghakimi atau menyudutkan keluarga. Pendekatan fokus pada pencarian solusi teknis (akses biaya, dokumen, dan trauma bullying).",
  },
  {
    title: "3. Akuntabilitas & Kerahasiaan Berkas",
    body: "Data asli (NIK/KK) hanya digunakan untuk kepentingan administratif resmi (pendaftaran PKBM & pengurusan Dukcapil) dan tidak boleh disebarluaskan ke pihak ketiga.",
  },
];

export default function RelawanPage() {
  const [namaChild, setNamaChild] = useState("");
  const [usiaChild, setUsiaChild] = useState("12 Tahun");
  const [rw, setRw] = useState("RW 04");
  const [catatan, setCatatan] = useState("");
  const [pelapor, setPelapor] = useState("");
  const [phone, setPhone] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaChild || !pelapor) return;

    setLoading(true);
    try {
      const res = await fetch("/api/lapor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: namaChild,
          age: usiaChild,
          rw,
          note: catatan,
          reporter: `${pelapor} (${phone || "Tanpa No. WA"})`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTicketId(data.ticketId || "RADAR-TK-" + Math.floor(100000 + Math.random() * 900000));
        setSubmitted(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-paper text-ink selection:bg-signal selection:text-white">
      <div className="paper-noise pointer-events-none fixed inset-0 z-[60]" />

      {/* Top Bar Navigation */}
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
            SOP &amp; PELAPORAN LAPANGAN &middot; KKN 34
          </span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative border-b border-ledger bg-paper">
        <div className="radar-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-[1600px] px-6 py-16 md:py-24">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-signal font-bold flex items-center gap-2">
            <HeartHandshake className="size-4" />
            <span>SOP &amp; Portal Pelaporan Lapangan</span>
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl font-black uppercase leading-[0.92] tracking-tighter max-w-4xl text-ink">
            Laporkan Temuan Anak Putus Sekolah.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-ink/70 max-w-2xl font-sans leading-relaxed">
            Panduan Kode Etik SOP Investigasi dan Formulir Pelaporan Kasus Temuan Anak Putus Sekolah / Rawan Putus Sekolah di Wilayah Kelurahan Manggarai.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-[1600px] px-6 py-16 space-y-16">
        {/* Section 1: Kode Etik & Protokol Perlindungan Anak */}
        <section className="border border-ink bg-white p-6 sm:p-10 shadow-[8px_8px_0_0_#121212]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-ledger pb-4 mb-8">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal font-bold flex items-center gap-1.5">
                <ShieldCheck className="size-4" />
                <span>01 &middot; Kode Etik Investigasi Lapangan</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink mt-1">
                Tiga Aturan Utama Relawan RADAR ANAK
              </h2>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink/50">
              STANDAR ADVOKASI DOKUMEN
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CODE_OF_ETHICS.map((item) => (
              <div key={item.title} className="border border-ink/20 bg-paper p-6 space-y-3">
                <h3 className="font-display text-lg font-bold text-ink leading-snug">
                  {item.title}
                </h3>
                <p className="font-sans text-xs text-ink/75 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Form Pelaporan Temuan Anak Rawan Putus Sekolah */}
        <section className="border border-ink bg-white p-6 sm:p-10 shadow-[8px_8px_0_0_#121212]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-ledger pb-4 mb-8">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal font-bold flex items-center gap-1.5">
                <AlertTriangle className="size-4" />
                <span>02 &middot; Formulir Pelaporan Temuan Lapangan</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink mt-1">
                Input Kasus Anak Putus Sekolah / Rawan
              </h2>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink/50">
              INPUT LAPORAN LAPANGAN
            </span>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="mx-auto grid size-12 place-items-center bg-emerald-600 text-white rounded-full">
                <CheckCircle2 className="size-6" strokeWidth={2.5} />
              </div>
              <h3 className="font-display text-2xl font-extrabold text-ink">
                Laporan Temuan Berhasil Terdaftar!
              </h3>
              <div className="inline-block border border-ink bg-paper px-4 py-2 font-mono text-xs font-bold text-signal">
                TIKET RESMI: {ticketId}
              </div>
              <p className="max-w-md mx-auto text-xs sm:text-sm text-ink/70 leading-relaxed font-sans">
                Laporan temuan subjek <strong>{namaChild}</strong> ({rw}) telah resmi masuk ke database. Operator Kelurahan akan langsung melakukan verifikasi lapangan.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setNamaChild("");
                  setCatatan("");
                }}
                className="mt-4 border border-ink bg-paper px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-ink hover:bg-ink hover:text-paper transition-all cursor-pointer shadow-[2px_2px_0_0_#121212]"
              >
                + Input Laporan Kasus Lainnya
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/70 mb-2">
                    Nama Subjek Anak *
                  </label>
                  <input
                    type="text"
                    required
                    value={namaChild}
                    onChange={(e) => setNamaChild(e.target.value)}
                    placeholder="Contoh: Ahmad Rizky"
                    className="w-full border border-ink bg-paper px-3.5 py-2.5 font-mono text-xs text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-signal"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/70 mb-2">
                    Estimasi Usia *
                  </label>
                  <select
                    value={usiaChild}
                    onChange={(e) => setUsiaChild(e.target.value)}
                    className="w-full border border-ink bg-paper px-3.5 py-2.5 font-mono text-xs text-ink focus:outline-none focus:ring-2 focus:ring-signal"
                  >
                    <option value="7 Tahun (SD)">7 - 9 Tahun (Usia SD)</option>
                    <option value="12 Tahun (SMP)">10 - 14 Tahun (Usia SMP)</option>
                    <option value="16 Tahun (SMA)">15 - 18 Tahun (Usia SMA)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/70 mb-2">
                    Lokasi Wilayah RW *
                  </label>
                  <select
                    value={rw}
                    onChange={(e) => setRw(e.target.value)}
                    className="w-full border border-ink bg-paper px-3.5 py-2.5 font-mono text-xs text-ink focus:outline-none focus:ring-2 focus:ring-signal"
                  >
                    <option value="RW 03">RW 03 Dukuh Sutorejo</option>
                    <option value="RW 04">RW 04 Sutorejo Utara</option>
                    <option value="RW 07">RW 07 Sutorejo Indah</option>
                    <option value="RW 09">RW 09 Mulyorejo Permai</option>
                    <option value="RW 12">RW 12 Kalijudan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/70 mb-2">
                    Nama Pelapor / RT / Kader *
                  </label>
                  <input
                    type="text"
                    required
                    value={pelapor}
                    onChange={(e) => setPelapor(e.target.value)}
                    placeholder="Contoh: Pak RT 04 / Relawan"
                    className="w-full border border-ink bg-paper px-3.5 py-2.5 font-mono text-xs text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-signal"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/70 mb-2">
                  Nomor WhatsApp Pelapor (Opsional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812-3456-7890"
                  className="w-full border border-ink bg-paper px-3.5 py-2.5 font-mono text-xs text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-signal"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/70 mb-2">
                  Catatan Temuan / Indikasi Akar Masalah *
                </label>
                <textarea
                  rows={4}
                  required
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Jelaskan kondisi anak (misal: terkendala biaya seragam, trauma perundungan, tidak punya dokumen NIK/KK, dll)"
                  className="w-full border border-ink bg-paper px-3.5 py-2.5 font-mono text-xs text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-signal"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 border border-ink bg-signal px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[3px_3px_0_0_#121212] transition-all hover:bg-ink active:translate-y-px cursor-pointer"
              >
                <Send className="size-4" />
                <span>{loading ? "MEMPROSES LAPORAN..." : "KIRIM LAPORAN TEMUAN"}</span>
              </button>
            </form>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
