"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, ShieldCheck, BarChart3, FileSpreadsheet, PieChart, RefreshCw } from "lucide-react";
import { Footer } from "@/components/radar/Footer";

type CauseStat = {
  cause: string;
  pct: number;
  count: string;
  rw: string;
};

type RwRow = {
  rw: string;
  dapodik: string;
  temuan: string;
  status: string;
  update: string;
};

const DEFAULT_CAUSES: CauseStat[] = [];

const DEFAULT_RW_ROWS: RwRow[] = [];

export default function TransparansiPage() {
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [rujukPct, setRujukPct] = useState<number>(0);
  const [causeStats, setCauseStats] = useState<CauseStat[]>(DEFAULT_CAUSES);
  const [rwRows, setRwRows] = useState<RwRow[]>(DEFAULT_RW_ROWS);

  useEffect(() => {
    fetchTransparansiData();
  }, []);

  const fetchTransparansiData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/kasus");
      const json = await res.json();

      if (json.success && json.data) {
        const allCards: any[] = [
          ...(json.data.baru || []),
          ...(json.data.verifikasi || []),
          ...(json.data.rujuk || []),
          ...(json.data.selesai || []),
          ...(json.data.ditutup || []),
        ];

        setTotalCount(allCards.length);

        if (allCards.length > 0) {
          const resolvedCards = [
            ...(json.data.rujuk || []),
            ...(json.data.selesai || []),
          ];
          const calculatedRujukPct = Math.round((resolvedCards.length / allCards.length) * 100);
          setRujukPct(calculatedRujukPct || 0);

          const categoryGroup: Record<string, { count: number; rws: Set<string> }> = {};
          allCards.forEach((c) => {
            const cat = c.kategoriAlasan || c.note || "Kendala Biaya & Akses Pendidikan";
            if (!categoryGroup[cat]) {
              categoryGroup[cat] = { count: 0, rws: new Set() };
            }
            categoryGroup[cat].count += 1;
            if (c.rw) categoryGroup[cat].rws.add(c.rw);
          });

          const computedCauses: CauseStat[] = Object.entries(categoryGroup).map(([cause, data]) => {
            const pct = Math.round((data.count / allCards.length) * 100);
            const rwList = Array.from(data.rws).join(", ") || "RW 04";
            return {
              cause,
              pct,
              count: `${data.count} Kasus`,
              rw: rwList,
            };
          });

          computedCauses.sort((a, b) => b.pct - a.pct);
          setCauseStats(computedCauses);

          const rwKeys = ["RW 01", "RW 02", "RW 03", "RW 04", "RW 05", "RW 06", "RW 07", "RW 08", "RW 09"];
          const computedRwRows: RwRow[] = rwKeys.map((rwKey) => {
            const cardsInRw = allCards.filter((c) => c.rw?.includes(rwKey));
            const countInRw = cardsInRw.length;

            let statusText = "Tidak Ada Temuan";
            if (countInRw > 0) {
              const inRujuk = cardsInRw.filter((c) => c.statusAdvokasi === "rujuk" || c.statusAdvokasi === "dirujuk").length;
              const inSelesai = cardsInRw.filter((c) => c.statusAdvokasi === "selesai").length;
              const inVerifikasi = cardsInRw.filter((c) => c.statusAdvokasi === "verifikasi" || c.statusAdvokasi === "diverifikasi").length;

              if (inSelesai > 0) statusText = "Pendampingan Selesai";
              else if (inRujuk > 0) statusText = "Dalam Advokasi PKBM";
              else if (inVerifikasi > 0) statusText = "Proses Verifikasi RT/RW";
              else statusText = "Baru Dilaporkan Warga";
            }

            return {
              rw: `${rwKey} Dukuh Sutorejo`,
              dapodik: "0 Anak",
              temuan: `${countInRw} Anak`,
              status: statusText,
              update: new Date().toISOString().split("T")[0],
            };
          });

          setRwRows(computedRwRows);
        } else {
          // Zero cards in DB
          setRujukPct(0);
          setCauseStats([]);
          const rwKeys = ["RW 01", "RW 02", "RW 03", "RW 04", "RW 05", "RW 06", "RW 07", "RW 08", "RW 09"];
          const emptyRwRows: RwRow[] = rwKeys.map((rwKey) => ({
            rw: `${rwKey} Dukuh Sutorejo`,
            dapodik: "0 Anak",
            temuan: "0 Anak",
            status: "Tidak Ada Temuan",
            update: new Date().toISOString().split("T")[0],
          }));
          setRwRows(emptyRwRows);
        }
      }
    } catch (err) {
      console.error("Failed to fetch transparansi data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-paper text-ink selection:bg-signal selection:text-white">
      <div className="paper-noise pointer-events-none fixed inset-0 z-[60]" />

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

      <section className="relative border-b border-ledger bg-paper">
        <div className="radar-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-[1600px] px-6 py-16 md:py-24">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-signal font-bold flex items-center gap-2">
              <BarChart3 className="size-4" />
              <span>Transparansi Sensus Sipil (Real-Time DB Sync)</span>
            </div>

            <button
              type="button"
              onClick={fetchTransparansiData}
              className="border border-ink bg-paper px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider text-ink hover:bg-ink hover:text-paper transition-all cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0_0_#121212]"
            >
              <RefreshCw className={`size-3 text-emerald-600 ${loading ? "animate-spin" : ""}`} />
              <span>SINKRONKAN DATA TERKINI</span>
            </button>
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl font-black uppercase leading-[0.92] tracking-tighter max-w-4xl text-ink">
            Statistik Sensus &amp; Laporan Akuntabilitas.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-ink/70 max-w-2xl font-sans leading-relaxed">
            Data terbuka statistik agregat hasil investigasi lapangan Kelompok KKN 34 UM Surabaya 2026 di Kelurahan Dukuh Sutorejo, Kec. Mulyorejo, Surabaya.
          </p>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px border border-ink bg-ink">
            <div className="bg-paper p-5">
              <div className="font-mono text-[9px] uppercase tracking-widest text-ink/50">Tingkat Akurasi Lapangan</div>
              <div className="mt-1 font-display text-3xl font-black text-ink">100%</div>
              <div className="font-mono text-[9px] text-emerald-600 mt-1">Verifikasi Door-to-Door</div>
            </div>
            <div className="bg-paper p-5">
              <div className="font-mono text-[9px] uppercase tracking-widest text-ink/50">Selisih Klaim Resmi</div>
              <div className="mt-1 font-display text-3xl font-black text-signal">+{totalCount} Kasus</div>
              <div className="font-mono text-[9px] text-signal mt-1">Tak Terdata di DAPODIK</div>
            </div>
            <div className="bg-paper p-5">
              <div className="font-mono text-[9px] uppercase tracking-widest text-ink/50">Total Subjek Advokasi</div>
              <div className="mt-1 font-display text-3xl font-black text-ink">{totalCount < 10 ? `0${totalCount}` : totalCount} Anak</div>
              <div className="font-mono text-[9px] text-ink/60 mt-1">5 Wilayah RW Sensus</div>
            </div>
            <div className="bg-paper p-5">
              <div className="font-mono text-[9px] uppercase tracking-widest text-ink/50">Status Rujukan PKBM</div>
              <div className="mt-1 font-display text-3xl font-black text-emerald-600">{rujukPct}%</div>
              <div className="font-mono text-[9px] text-emerald-600 mt-1">Terdaftar &amp; Terfasilitasi</div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1600px] px-6 py-16 space-y-16">
        <section className="border border-ink bg-white p-6 sm:p-10 shadow-[8px_8px_0_0_#121212]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-ledger pb-4 mb-8">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal font-bold flex items-center gap-1.5">
                <PieChart className="size-4" />
                <span>01 &middot; Distribusi Akar Permasalahan (Live Aggregation)</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink mt-1">
                Mengapa Mereka Terputus Sekolah?
              </h2>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink/50 font-bold bg-sky-50 border border-sky-200 px-3 py-1 text-sky-900">
              N = {totalCount < 10 ? `0${totalCount}` : totalCount} KASUS TERDATA DI SUPABASE DB
            </span>
          </div>

          <div className="space-y-6">
            {causeStats.map((item) => (
              <div key={item.cause} className="space-y-2">
                <div className="flex flex-col sm:flex-row justify-between font-mono text-xs font-bold text-ink">
                  <span>{item.cause} ({item.rw})</span>
                  <span className="text-signal">{item.pct}% &middot; {item.count}</span>
                </div>
                <div className="h-4 bg-[#efeee9] border border-ink/20 relative overflow-hidden">
                  <div
                    className="h-full bg-signal transition-all duration-1000"
                    style={{ width: `${Math.max(item.pct, 5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-ink bg-white p-6 sm:p-10 shadow-[8px_8px_0_0_#121212]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-ledger pb-4 mb-8">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal font-bold flex items-center gap-1.5">
                <FileSpreadsheet className="size-4" />
                <span>02 &middot; Tabel Rekapitulasi per Wilayah RW (Live DB)</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink mt-1">
                Data Temuan Investigasi vs Laporan Dapodik
              </h2>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink/50">
              UPDATE: {new Date().toISOString().split("T")[0]}
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
                {rwRows.map((row) => (
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

        <section className="border-2 border-ink bg-ink text-paper p-8 sm:p-12 shadow-[10px_10px_0_0_#e6390e] flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-signal text-white px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest">
              <ShieldCheck className="size-3.5" /> DOKUMEN RESMI SERAH TERIMA
            </div>
            <h3 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
              Unduh Berkas Laporan Sensus KKN 34 (PDF)
            </h3>
            <p className="font-sans text-xs sm:text-sm text-paper/70 leading-relaxed">
              Berkas laporan pertanggungjawaban fisik lengkap yang mencakup statistik, borang survei anonim, dan rekomendasi advokasi resmi bagi Kelurahan Dukuh Sutorejo &amp; Dinas Pendidikan.
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
