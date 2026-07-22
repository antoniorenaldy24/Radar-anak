import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download, ShieldCheck, BarChart3, FileSpreadsheet, PieChart, CheckCircle2 } from "lucide-react";
import { Footer } from "@/components/radar/Footer";

export const metadata: Metadata = {
  title: "Portal Transparansi Data — RADAR ANAK",
  description:
    "Portal data terbuka dan laporan statistik sensus anak putus sekolah Kelurahan Dukuh Sutorejo oleh Kelompok KKN 34 UM Surabaya 2026.",
};

const STATS_CAUSES = [
  { cause: "Kendala Biaya Seragam & Operasional (Ekonomi)", pct: 43, count: "3 Kasus", rw: "RW 04, RW 07" },
  { cause: "Trauma Perundungan / Bullying di Sekolah Lama", pct: 28, count: "2 Kasus", rw: "RW 04" },
  { cause: "Kendala Dokumen Administrasi (KK / Akta Belum Terbit)", pct: 15, count: "1 Kasus", rw: "RW 09" },
  { cause: "Kendala Migrasi Tempat Tinggal & Akses Lokasi", pct: 14, count: "1 Kasus", rw: "RW 12" },
];

const RW_TABLE = [
  { rw: "RW 04 Sutorejo Utara", dapodik: "0 Anak", temuan: "3 Anak", status: "Dalam Advokasi PKBM", update: "2026-07-05" },
  { rw: "RW 07 Sutorejo Indah", dapodik: "0 Anak", temuan: "2 Anak", status: "Proses Beasiswa PIP", update: "2026-07-02" },
  { rw: "RW 09 Mulyorejo Permai", dapodik: "0 Anak", temuan: "1 Anak", status: "Pengurusan Dukcapil", update: "2026-06-28" },
  { rw: "RW 12 Kalijudan", dapodik: "0 Anak", temuan: "1 Anak", status: "PKBM Gelombang II", update: "2026-06-20" },
];

export default function TransparansiPage() {
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
            PORTAL TRANSPARANSI DATA &middot; ARSIP Q1 2026
          </span>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="relative border-b border-ledger bg-paper">
        <div className="radar-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-[1600px] px-6 py-16 md:py-24">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-signal font-bold flex items-center gap-2">
            <BarChart3 className="size-4" />
            <span>Transparansi Sensus Sipil</span>
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl font-black uppercase leading-[0.92] tracking-tighter max-w-4xl text-ink">
            Statistik Sensus &amp; Laporan Akuntabilitas.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-ink/70 max-w-2xl font-sans leading-relaxed">
            Data terbuka statistik agregat hasil investigasi lapangan Kelompok KKN 34 UM Surabaya 2026 di Kelurahan Dukuh Sutorejo, Kec. Mulyorejo, Surabaya.
          </p>

          {/* Quick Metrics Cards Grid */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px border border-ink bg-ink">
            <div className="bg-paper p-5">
              <div className="font-mono text-[9px] uppercase tracking-widest text-ink/50">Tingkat Akurasi Lapangan</div>
              <div className="mt-1 font-display text-3xl font-black text-ink">100%</div>
              <div className="font-mono text-[9px] text-emerald-600 mt-1">Verifikasi Door-to-Door</div>
            </div>
            <div className="bg-paper p-5">
              <div className="font-mono text-[9px] uppercase tracking-widest text-ink/50">Selisih Klaim Resmi</div>
              <div className="mt-1 font-display text-3xl font-black text-signal">+7 Kasus</div>
              <div className="font-mono text-[9px] text-signal mt-1">Tak Terdata di DAPODIK</div>
            </div>
            <div className="bg-paper p-5">
              <div className="font-mono text-[9px] uppercase tracking-widest text-ink/50">Total Subjek Advokasi</div>
              <div className="mt-1 font-display text-3xl font-black text-ink">07 Anak</div>
              <div className="font-mono text-[9px] text-ink/60 mt-1">4 Wilayah RW Sensus</div>
            </div>
            <div className="bg-paper p-5">
              <div className="font-mono text-[9px] uppercase tracking-widest text-ink/50">Status Rujukan PKBM</div>
              <div className="mt-1 font-display text-3xl font-black text-emerald-600">85%</div>
              <div className="font-mono text-[9px] text-emerald-600 mt-1">Terdaftar Gelombang II</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <main className="mx-auto max-w-[1600px] px-6 py-16 space-y-16">
        {/* Section 1: Breakdown Akar Permasalahan Chart */}
        <section className="border border-ink bg-white p-6 sm:p-10 shadow-[8px_8px_0_0_#121212]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-ledger pb-4 mb-8">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal font-bold flex items-center gap-1.5">
                <PieChart className="size-4" />
                <span>01 &middot; Distribusi Akar Permasalahan</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink mt-1">
                Mengapa Mereka Terputus Sekolah?
              </h2>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink/50">
              N = 07 KASUS TERDATA
            </span>
          </div>

          <div className="space-y-6">
            {STATS_CAUSES.map((item) => (
              <div key={item.cause} className="space-y-2">
                <div className="flex flex-col sm:flex-row justify-between font-mono text-xs font-bold text-ink">
                  <span>{item.cause} ({item.rw})</span>
                  <span className="text-signal">{item.pct}% &middot; {item.count}</span>
                </div>
                <div className="h-4 bg-[#efeee9] border border-ink/20 relative overflow-hidden">
                  <div
                    className="h-full bg-signal transition-all duration-1000"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Aggregated Quarterly Table per RW */}
        <section className="border border-ink bg-white p-6 sm:p-10 shadow-[8px_8px_0_0_#121212]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-ledger pb-4 mb-8">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal font-bold flex items-center gap-1.5">
                <FileSpreadsheet className="size-4" />
                <span>02 &middot; Tabel Rekapitulasi per Wilayah RW</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink mt-1">
                Data Temuan Investigasi vs Laporan Dapodik
              </h2>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink/50">
              UPDATE: 2026-07-22
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-ink bg-[#efeee9] uppercase text-[10px] tracking-wider text-ink/70">
                  <th className="p-3">Wilayah RW Sensus</th>
                  <th className="p-3">Data Resmi DAPODIK</th>
                  <th className="p-3">Temuan Lapangan KKN</th>
                  <th className="p-3">Status Advokasi Rujukan</th>
                  <th className="p-3">Tanggal Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ledger">
                {RW_TABLE.map((row) => (
                  <tr key={row.rw} className="hover:bg-paper/60 transition-colors">
                    <td className="p-3 font-bold text-ink">{row.rw}</td>
                    <td className="p-3 text-ink/50">{row.dapodik}</td>
                    <td className="p-3 font-bold text-signal">{row.temuan}</td>
                    <td className="p-3">
                      <span className="bg-emerald-600/10 text-emerald-700 px-2 py-0.5 font-bold border border-emerald-600/30">
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3 text-ink/60">{row.update}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Official Sensus Report PDF Download */}
        <section className="border-2 border-ink bg-ink text-paper p-8 sm:p-12 shadow-[10px_10px_0_0_#e6390e] flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-signal text-white px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest">
              <ShieldCheck className="size-3.5" /> DOKUMEN RESMI SERAH TERIMA
            </div>
            <h3 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
              Unduh Berkas Laporan Sensus KKN 34 (PDF)
            </h3>
            <p className="font-sans text-xs sm:text-sm text-paper/70 leading-relaxed">
              Berkas laporan pertanggungjawaban fisik lengkap yang mencakup statistik, borang survei anonim, dan rekomendasi advokasi resmi bagi Kelurahan Manggarai &amp; Dinas Pendidikan.
            </p>
          </div>

          <a
            href="#"
            className="inline-flex items-center gap-2 border border-signal bg-signal px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-paper hover:text-ink hover:border-paper transition-all shadow-[4px_4px_0_0_#ffffff] shrink-0"
          >
            <Download className="size-4" strokeWidth={2.5} />
            <span>UNDUH LAPORAN SENSUS (PDF)</span>
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}
