"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, ShieldCheck, FileText } from "lucide-react";

type FAQItem = {
  id: string;
  q: string;
  a: string;
  tag: string;
};

const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    tag: "PRIVASI & HUKUM",
    q: "Bagaimana kerahasiaan & privasi data anak saya dilindungi jika dilaporkan?",
    a: "Di tampilan publik website, seluruh nama anak wajib disamarkan menggunakan inisial (misalnya Siti Wulandari menjadi S.W.) dan alamat hanya ditampilkan di tingkat RW tanpa nomor rumah. Data asli lengkap (Nama Asli, NIK, No. KK, Alamat RT) tersimpan aman dalam server enkripsi yang hanya bisa diakses oleh Operator Resmi Kelurahan & Tim Advokasi KKN 34 berizin.",
  },
  {
    id: "faq-2",
    tag: "BIAYA & LAYANAN",
    q: "Apakah pendaftaran rujukan ke Kejar Paket B/C PKBM ini dipungut biaya?",
    a: "Tidak ada biaya sama sekali (100% GRATIS). Seluruh biaya operasional pendaftaran, modul Kejar Paket B/C, dan bantuan alat tulis disubsidi melalui alokasi dana donasi transparansi dan program beasiswa pemerintah (KIP/PIP) bersama mitra PKBM Negeri 01 Kelurahan Manggarai.",
  },
  {
    id: "faq-3",
    tag: "KEBERLANJUTAN SISTEM",
    q: "Siapa yang mengelola platform ini setelah periode KKN 34 selesai?",
    a: "Sistem RADAR ANAK dirancang dengan arsitektur hibah open-source yang diserahterimakan sepenuhnya kepada pihak Kelurahan Manggarai dan Pengurus Karang Taruna Kelurahan. Pelatihan operator telah dilaksanakan sehingga pemantauan kasus tetap berjalan berkelanjutan.",
  },
  {
    id: "faq-4",
    tag: "PROSEDUR PELAPORAN",
    q: "Bagaimana cara warga umum melaporkan indikasi anak putus sekolah di RW-nya?",
    a: "Warga dapat mengisi formulir awal melalui tombol 'Lapor Kasus' di website ini atau mendatangi Kantor Kelurahan Manggarai / Posko KKN 34. Setiap laporan yang masuk akan mendapatkan nomor tiket ter-enkripsi dan diverifikasi oleh tim relawan lapangan dalam 2x24 jam.",
  },
  {
    id: "faq-5",
    tag: "TRANSPARANSI DONASI",
    q: "Apakah donasi yang dikirim bisa dipantau pertanggungjawabannya secara terbuka?",
    a: "Ya. Seluruh pemasukan dan alokasi dana bantuan (pembelian seragam, buku tulis, modul PKBM, transport relawan) dicatat secara real-time dan dapat diakses di Halaman Transparansi Data (/transparansi). Laporan pertanggungjawaban fisik juga diserahkan ke Lurah Manggarai.",
  },
];

export function SectionFAQ() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="border-b border-ledger bg-[#efeee9] relative overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:py-28">
        {/* Section Header */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-signal font-bold flex items-center gap-2">
              <HelpCircle className="size-3.5" />
              <span>07 &middot; Informasi &amp; Jawaban Publik</span>
            </div>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold tracking-tight text-ink max-w-2xl">
              Pertanyaan yang sering diajukan warga.
            </h2>
            <p className="mt-3 text-sm md:text-base text-ink/60 max-w-xl font-sans leading-relaxed">
              Jawaban transparan mengenai jaminan kerahasiaan data, alur biaya gratis, dan keberlanjutan sistem di Kelurahan Manggarai.
            </p>
          </div>
          <div className="hidden lg:block font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50 border-l border-ink/20 pl-4">
            ARSIP FAQ &middot; TRANSPARANSI SIPIL
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className="border border-ink bg-white shadow-[4px_4px_0_0_#121212] transition-all duration-200 overflow-hidden"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-paper/50 transition-colors"
                >
                  <div className="flex items-center gap-3 pr-2">
                    <span className="bg-signal/10 text-signal border border-signal/30 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest shrink-0">
                      {faq.tag}
                    </span>
                    <h3 className="font-display text-base sm:text-lg font-bold text-ink leading-snug">
                      {faq.q}
                    </h3>
                  </div>
                  <div
                    className={`grid size-7 place-items-center border border-ink bg-paper text-ink shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-ink text-paper" : ""
                    }`}
                  >
                    <ChevronDown className="size-4" strokeWidth={2.5} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-ledger font-sans text-xs sm:text-sm text-ink/80 leading-relaxed bg-paper/30">
                    <p className="border-l-2 border-signal pl-4 py-1">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
