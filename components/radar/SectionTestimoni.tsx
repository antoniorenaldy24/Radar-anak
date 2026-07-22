"use client";

import { Quote, MessageSquare, Star } from "lucide-react";

type Testimonial = {
  name: string;
  role: string;
  location: string;
  quote: string;
  tag: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "H. Budi Santoso",
    role: "Ketua RW 04 Sutorejo Utara",
    location: "Wilayah Sensus RW 04",
    quote:
      "Sistem RADAR ANAK membuka mata kami bahwa laporan Dapodik tidak selalu mencerminkan kondisi riil di gang-gang sempit. Empat anak yang sebelumnya tak terdata kini kembali memiliki harapan sekolah.",
    tag: "SUARA TOKOH MASYARAKAT",
  },
  {
    name: "Ibu Suhartini",
    role: "Kader Posyandu & PKK",
    location: "Wilayah Sensus RW 07",
    quote:
      "Penyamaran nama menjadi inisial di tampilan publik membuat orang tua tidak merasa malu saat didatangi relawan KKN 34. Warga jadi terbuka menceritakan kendala biaya dan trauma anak.",
    tag: "SUARA KADER LAPANGAN",
  },
  {
    name: "Bapak Wiyono",
    role: "Orang Tua Subjek (S.W.)",
    location: "RW 04 Dukuh Sutorejo",
    quote:
      "Terima kasih tim KKN 34. Anak saya sekarang ceria kembali bisa lanjut Kejar Paket B di PKBM tanpa takut perundungan sekolah lama, dan bantuan seragamnya sangat meringankan.",
    tag: "SUARA WALI SUBJEK",
  },
  {
    name: "Dr. Hj. Rahmawati, M.Pd.",
    role: "Pengelola PKBM Negeri 01",
    location: "Mitra Pendidikan Kelurahan",
    quote:
      "Sinergi pendataan presisi ini membantu PKBM menjangkau anak-anak putus sekolah yang sebelumnya tidak pernah tersentuh alokasi kuota beasiswa pendidikan daerah.",
    tag: "MITRA PENDIDIKAN",
  },
];

export function SectionTestimoni() {
  return (
    <section id="suara" className="border-b border-ledger bg-paper relative overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:py-28">
        {/* Section Header */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-signal font-bold flex items-center gap-2">
              <MessageSquare className="size-3.5" />
              <span>08 &middot; Kesaksian Faktual Lapangan</span>
            </div>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold tracking-tight text-ink max-w-2xl">
              Suara mereka dari garis depan advokasi.
            </h2>
            <p className="mt-3 text-sm md:text-base text-ink/60 max-w-xl font-sans leading-relaxed">
              Kutipan kesan dari pengurus RW, kader posyandu, orang tua murid, dan mitra PKBM tentang dampak nyata sistem RADAR ANAK.
            </p>
          </div>
          <div className="hidden lg:block font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50 border-l border-ink/20 pl-4">
            ARSIP ADVOKASI &middot; DOKUMEN FAKTUALL
          </div>
        </div>

        {/* Testimonials Newspaper Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={t.name}
              className="group border border-ink bg-white p-6 sm:p-8 shadow-[6px_6px_0_0_#121212] transition-all duration-300 hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#e6390e] relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-ledger pb-3 mb-4">
                  <span className="bg-ink/10 text-ink px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest group-hover:bg-signal group-hover:text-white transition-colors">
                    {t.tag}
                  </span>
                  <Quote className="size-5 text-signal/40 group-hover:text-signal transition-colors" />
                </div>

                <p className="font-sans text-sm sm:text-base leading-relaxed text-ink/90 italic mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="border-t border-ledger pt-4 flex items-center justify-between font-mono">
                <div>
                  <div className="font-display text-base font-extrabold text-ink group-hover:text-signal transition-colors">
                    {t.name}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-ink/60">
                    {t.role} &middot; {t.location}
                  </div>
                </div>
                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-3 fill-amber-500" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
