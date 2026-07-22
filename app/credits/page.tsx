import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreditCard } from "@/components/radar/CreditCard";
import { Footer } from "@/components/radar/Footer";

export const metadata: Metadata = {
  title: "Kredit Tim — KKN 34 UM Surabaya 2026",
  description:
    "Halaman kredit Kelompok KKN 34 Universitas Muhammadiyah Surabaya 2026 — tim di balik proyek RADAR ANAK, sistem deteksi anak putus sekolah berbasis wilayah RW.",
};

const MEMBERS = [
  { name: "Anggota 1", role: "Ketua Kelompok" },
  { name: "Anggota 2", role: "Sekretaris" },
  { name: "Anggota 3", role: "Bendahara" },
  { name: "Anggota 4", role: "Koordinator Lapangan" },
  { name: "Anggota 5", role: "Dokumentasi" },
  { name: "Anggota 6", role: "Humas" },
  { name: "Anggota 7", role: "Riset & Data" },
  { name: "Anggota 8", role: "Perlengkapan" },
];

const META = [
  { label: "Periode", value: "Jan — Mar 2026" },
  { label: "Lokasi", value: "Dukuh Sutorejo" },
  { label: "Anggota", value: "08 Mahasiswa" },
  { label: "Fokus", value: "Hak Pendidikan" },
];

const NARRATIVES = [
  {
    kicker: "01 · Tentang",
    title: "Kelompok KKN 34",
    body:
      "Kelompok KKN 34 Universitas Muhammadiyah Surabaya 2026 adalah delapan mahasiswa lintas program studi yang menjalani pengabdian masyarakat dengan pendekatan berbasis data. Kami memilih isu yang sering tak terlihat: anak-anak yang hilang dari catatan pendidikan.",
  },
  {
    kicker: "02 · Misi",
    title: "Kenapa RADAR ANAK",
    body:
      "RADAR ANAK dirancang sebagai instrumen deteksi dini berbasis RW. Kami percaya, data administratif saja tidak cukup — dibutuhkan verifikasi pintu-ke-pintu untuk memastikan setiap anak tercatat, dan setiap kasus dirujuk ke penyelesaian.",
  },
  {
    kicker: "03 · Lokasi",
    title: "Kelurahan Dukuh Sutorejo",
    body:
      "Pengabdian dilaksanakan di Kelurahan Dukuh Sutorejo, Kec. Mulyorejo, Surabaya, Jawa Timur bersama warga, ketua RT/RW, kader posyandu, dan mitra kelurahan. Lima wilayah RW menjadi titik uji awal sistem: RW 03, RW 04, RW 07, RW 09, dan RW 12.",
  },
  {
    kicker: "04 · Terima Kasih",
    title: "Kepada semua yang menopang",
    body:
      "Terima kasih kepada dosen pembimbing lapangan, LPPM UM Surabaya, aparat Kelurahan Dukuh Sutorejo, Kec. Mulyorejo, kader dan relawan RW, orang tua serta anak-anak yang bersedia berbagi cerita. Proyek ini tidak akan berdiri tanpa kepercayaan mereka.",
  },
];

export default function CreditsPage() {
  return (
    <div className="relative min-h-screen bg-paper text-ink selection:bg-signal selection:text-white">
      <div className="paper-noise pointer-events-none fixed inset-0 z-[60]" />

      {/* Top bar (simple, page-local) */}
      <nav className="sticky top-0 z-40 border-b border-ledger bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink/70 hover:text-signal"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            Kembali ke Beranda
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/50">
            KREDIT TIM &middot; 03 / RADAR
          </span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative border-b border-ledger">
        <div className="radar-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-[1600px] px-6 py-20 md:py-28">
          <div className="animate-[fade-up_0.7s_cubic-bezier(0.19,1,0.22,1)_both]">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-signal">
              Kredit Tim &middot; 03
            </div>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-black uppercase leading-[0.95] tracking-tighter md:text-7xl">
              Kelompok KKN 34 <br />
              <span className="text-ink/40">UM Surabaya 2026</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/70 md:text-lg">
              Delapan mahasiswa, satu kelurahan, satu janji: tidak ada anak
              yang hilang dari peta pendidikan. Halaman ini mendata tim di
              balik sistem RADAR ANAK.
            </p>
          </div>

          {/* Meta ledger */}
          <div
            className="mt-12 grid grid-cols-2 gap-px border border-ledger bg-ledger md:grid-cols-4 animate-[fade-up_0.9s_cubic-bezier(0.19,1,0.22,1)_both]"
            style={{ animationDelay: "150ms" }}
          >
            {META.map((m) => (
              <div key={m.label} className="bg-paper p-5">
                <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/50">
                  {m.label}
                </div>
                <div className="mt-2 font-display text-xl font-extrabold tracking-tight">
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative */}
      <section className="border-b border-ledger">
        <div className="mx-auto max-w-[1600px] px-6 py-16 md:py-20">
          <div className="grid gap-8 md:grid-cols-2 md:gap-10">
            {NARRATIVES.map((n) => (
              <article
                key={n.kicker}
                className="group border-l-2 border-ink/20 pl-6 transition-colors duration-300 hover:border-signal"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/50 transition-colors duration-300 group-hover:text-signal">
                  {n.kicker}
                </div>
                <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                  {n.title}
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink/70 md:text-base">
                  {n.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Members */}
      <section className="border-b border-ledger">
        <div className="mx-auto max-w-[1600px] px-6 py-16 md:py-24">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                05 &middot; Anggota Kelompok
              </div>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-5xl">
                Delapan nama, satu kelompok.
              </h2>
            </div>
            <div className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50 md:block">
              N = 08 &middot; KKN-34
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {MEMBERS.map((m, i) => (
              <CreditCard
                key={m.name}
                index={i + 1}
                name={m.name}
                role={m.role}
              />
            ))}
          </div>

          <p className="mt-10 max-w-2xl font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50">
            * Nama dan foto anggota dapat diperbarui oleh tim. Format kartu
            mengikuti standar arsip RADAR.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
