"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Users, FileSearch, Building2, GraduationCap } from "lucide-react";

type Step = {
  num: string;
  title: string;
  subtitle: string;
  icon: any;
  actor: string;
  duration: string;
  output: string;
  description: string;
  details: string[];
};

const STEPS: Step[] = [
  {
    num: "01",
    title: "Pelaporan Awal Sensus",
    subtitle: "Inisiasi Laporan Lapangan",
    icon: FileSearch,
    actor: "Warga, Ketua RT/RW, & Kader Posyandu",
    duration: "1 &ndash; 2 Hari",
    output: "Tiket Laporan Terdaftar",
    description:
      "Laporan awal diterima dari warga atau kader RW ketika menemukan anak usia 7-18 tahun yang tidak aktif bersekolah.",
    details: [
      "Pengisian formulir indikasi awal via website RADAR ANAK atau posko KKN 34.",
      "Penyamaran otomatis nama anak menjadi inisial publik (contoh: S.W.).",
      "Penerbitan nomor tiket laporan ter-enkripsi untuk pelacak status.",
    ],
  },
  {
    num: "02",
    title: "Verifikasi Pintu-ke-Pintu",
    subtitle: "Validasi Faktual Rumah Tangga",
    icon: Users,
    actor: "Tim Mahasiswa KKN 34 & Pengurus RW",
    duration: "2 &ndash; 3 Hari",
    output: "Berkas Investigasi Valid",
    description:
      "Tim KKN 34 mendatangi kediaman keluarga subjek untuk melakukan wawancara etis dan identifikasi akar masalah.",
    details: [
      "Pendataan kondisi ekonomi keluarga, kelengkapan berkas KK/Akta, dan penyebab putus sekolah.",
      "Identifikasi potensi & minat jangka panjang anak (misal: IT, Seni, Otomotif).",
      "Penyusunan rekomendasi rujukan yang dipersetujui oleh orang tua/wali.",
    ],
  },
  {
    num: "03",
    title: "Advokasi & Registrasi Operator",
    subtitle: "Penetapan Berkas Kelurahan",
    icon: Building2,
    actor: "Operator Kelurahan & Lembaga Mitra",
    duration: "1 &ndash; 2 Hari",
    output: "Surat Rekomendasi Rujukan",
    description:
      "Data lengkap resmi diajukan ke Workspace Operator Kelurahan Manggarai untuk diproses rujukan ke dinas/sekolah.",
    details: [
      "Pemeriksaan silang dengan data DAPODIK & kependudukan Dukcapil.",
      "Penerbitan surat rekomendasi beasiswa KIP atau Kejar Paket B/C PKBM.",
      "Pendampingan pengurusan dokumen kependudukan yang tertunda.",
    ],
  },
  {
    num: "04",
    title: "Rujukan & Monitoring 3 Bulan",
    subtitle: "Penempatan Sekolah & Pemantauan",
    icon: GraduationCap,
    actor: "Pengelola PKBM, Sekolah, & Relawan KKN",
    duration: "90 Hari Pemantauan",
    output: "Kasus Selesai (Kembali Sekolah)",
    description:
      "Anak resmi terdaftar di sekolah/PKBM dan mendapatkan pendampingan psikososial berkala hingga stabil.",
    details: [
      "Penyerahan paket seragam, buku tulis, dan alat belajar gratis dari donasi.",
      "Pemantauan kehadiran mingguan oleh kader RW & tim monitoring.",
      "Penutupan status kasus di dashboard menjadi 'Kasus Selesai' jika konsisten 3 bulan.",
    ],
  },
];

export function SectionAdvokasiFlow() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeStep = STEPS[activeIdx];

  return (
    <section id="alur" className="border-b border-ledger bg-paper relative overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:py-28">
        {/* Section Header */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-signal font-bold">
              06 &middot; Protokol Operasional
            </div>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold tracking-tight text-ink max-w-2xl">
              Alur rujukan advokasi dari pintu ke sekolah.
            </h2>
            <p className="mt-3 text-sm md:text-base text-ink/60 max-w-xl font-sans leading-relaxed">
              Empat tahapan terukur yang memastikan setiap laporan warga ditindaklanjuti secara etis, akuntabel, dan tuntas.
            </p>
          </div>
          <div className="hidden lg:block font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50 border-l border-ink/20 pl-4">
            STANDAR OPERASIONAL &middot; KKN 34
          </div>
        </div>

        {/* Step Selector Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isActive = activeIdx === idx;

            return (
              <button
                key={s.num}
                onClick={() => setActiveIdx(idx)}
                className={`text-left p-5 border transition-all duration-300 relative cursor-pointer ${
                  isActive
                    ? "border-ink bg-ink text-paper shadow-[6px_6px_0_0_#e6390e] -translate-y-1"
                    : "border-ink/15 bg-white text-ink hover:border-ink hover:bg-paper"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 ${
                      isActive ? "bg-signal text-white" : "bg-ink/10 text-ink/60"
                    }`}
                  >
                    TAHAP {s.num}
                  </span>
                  <Icon className={`size-4 ${isActive ? "text-signal" : "text-ink/40"}`} />
                </div>
                <div className="font-display text-lg font-extrabold tracking-tight">
                  {s.title}
                </div>
                <div
                  className={`mt-1 font-mono text-[9px] uppercase tracking-wider ${
                    isActive ? "text-paper/60" : "text-ink/50"
                  }`}
                >
                  {s.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Interactive Detail Panel */}
        <div className="border border-ink bg-white p-6 sm:p-10 shadow-[8px_8px_0_0_#121212] relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Detail Summary */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center bg-signal font-mono text-sm font-black text-white">
                  {activeStep.num}
                </span>
                <div>
                  <h3 className="font-display text-2xl md:text-3xl font-extrabold text-ink">
                    {activeStep.title}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink/50">
                    {activeStep.subtitle}
                  </span>
                </div>
              </div>

              <p className="font-sans text-sm md:text-base leading-relaxed text-ink/80 border-l-2 border-signal pl-4 py-1">
                {activeStep.description}
              </p>

              <div className="space-y-2.5 pt-2">
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60">
                  RINCIAN TINDAKAN &amp; KELUARAN:
                </h4>
                {activeStep.details.map((d, i) => (
                  <div key={i} className="flex items-start gap-2.5 font-sans text-xs text-ink/90">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Meta Specs Box */}
            <div className="lg:col-span-5 bg-[#efeee9] border border-ink/15 p-6 space-y-5">
              <div className="border-b border-ink/10 pb-3">
                <span className="font-mono text-[9px] uppercase tracking-widest text-ink/50 block mb-1">
                  PENGANGGUNG JAWAB UTAMA
                </span>
                <span className="font-display text-base font-extrabold text-ink block">
                  {activeStep.actor}
                </span>
              </div>

              <div className="border-b border-ink/10 pb-3">
                <span className="font-mono text-[9px] uppercase tracking-widest text-ink/50 block mb-1">
                  ESTIMASI DURASI PROSES
                </span>
                <span className="font-mono text-xs font-bold text-signal block">
                  ⏱️ {activeStep.duration}
                </span>
              </div>

              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-ink/50 block mb-1">
                  OUTPUT / HASIL AKHIR TAHAP
                </span>
                <span className="inline-flex items-center gap-1.5 bg-ink text-paper px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="size-3 text-signal" /> {activeStep.output}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
