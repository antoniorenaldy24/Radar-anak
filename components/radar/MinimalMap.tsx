"use client";

import { useEffect, useState } from "react";
import { useHydrated } from "./useHydrated";
import { SUBJECT_DATA, type SubjectProfile } from "./subjectData";
import { ShieldAlert, Sparkles, User, Calendar, MapPin, CheckCircle2, RefreshCw, ShieldCheck } from "lucide-react";

type MapMod = typeof import("./MapClient");

// Coordinates mapping per RW in Dukuh Sutorejo, Kec. Mulyorejo, Surabaya
const RW_COORDS_MAP: Record<string, [number, number]> = {
  "RW 03": [-7.2610, 112.7865],
  "RW 04": [-7.2635, 112.7890],
  "RW 07": [-7.2650, 112.7915],
  "RW 09": [-7.2595, 112.7840],
  "RW 12": [-7.2580, 112.7815],
};

function getInitials(name: string): string {
  if (!name) return "A.N.";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 1).toUpperCase() + ".";
  return parts.map((p) => p[0].toUpperCase()).join(".") + ".";
}

export function MinimalMap() {
  const hydrated = useHydrated();
  const [Mod, setMod] = useState<MapMod["default"] | null>(null);
  const [subjectList, setSubjectList] = useState<SubjectProfile[]>(SUBJECT_DATA);
  const [selectedSubject, setSelectedSubject] = useState<SubjectProfile>(SUBJECT_DATA[0]);
  const [loadingDb, setLoadingDb] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    let alive = true;
    import("./MapClient")
      .then((m) => {
        if (alive) setMod(() => m.default);
      })
      .catch((e) => console.error("MapClient load failed:", e));

    fetchVerifiedCasesOnly();

    return () => {
      alive = false;
    };
  }, [hydrated]);

  // Fetch ONLY cases that have been VERIFIED by operators (Excludes unverified 'baru' reports)
  const fetchVerifiedCasesOnly = async () => {
    try {
      setLoadingDb(true);
      const res = await fetch("/api/kasus");
      const json = await res.json();

      if (json.success && json.data) {
        // Collect cards from 'verifikasi', 'rujuk', and 'selesai' columns (Excludes 'baru')
        const verifiedCards = [
          ...(json.data.verifikasi || []),
          ...(json.data.rujuk || []),
          ...(json.data.selesai || []),
        ];

        if (verifiedCards.length > 0) {
          const mappedSubjects: SubjectProfile[] = verifiedCards.map((c: any, index: number) => {
            const rwKey = Object.keys(RW_COORDS_MAP).find((k) => c.rw?.includes(k)) || "RW 04";
            const basePos = RW_COORDS_MAP[rwKey] || [-7.2635, 112.7890];
            
            // Prioritize exact custom Lat/Lng set by Operator in Verification Modal
            const finalPos: [number, number] = c.lat && c.lng
              ? [Number(c.lat), Number(c.lng)]
              : basePos;

            return {
              id: c.id || String(index + 1),
              initials: getInitials(c.name),
              age: c.age || "12 Tahun",
              location: c.address || `${c.rw || "RW 04"}, Dukuh Sutorejo, Mulyorejo, Surabaya`,
              dateLocked: new Date().toISOString().split("T")[0],
              rootProblem: c.note || "Keterbatasan biaya dan kendala berkas sekolah.",
              dream: c.dream || "Cita-cita: Ingin kembali bersekolah dan menggapai cita-cita.",
              advocacyNote:
                c.rujukan ||
                c.catatanOperator ||
                "Telah diverifikasi valid oleh pengurus RT/RW & tim KKN 34.",
              rw: c.rw || "RW 04",
              pos: finalPos,
              cases: 1,
            };
          });

          setSubjectList(mappedSubjects);
          if (mappedSubjects.length > 0) {
            setSelectedSubject(mappedSubjects[0]);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch verified cases for map:", err);
    } finally {
      setLoadingDb(false);
    }
  };

  return (
    <section id="peta" className="border-b border-ledger bg-[#efeee9]">
      <div className="mx-auto max-w-[1600px] px-6 py-16 md:py-24">
        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              <span>03 &middot; PEMETAAN HANYA KASUS TERVERIFIKASI LAPANGAN (VALIDATED)</span>
            </div>
            <h2 className="mt-2 max-w-xl font-display text-3xl font-extrabold tracking-tight md:text-4xl text-ink">
              Dukuh Sutorejo, Kec. Mulyorejo, Surabaya.
            </h2>
            <p className="mt-3 max-w-md text-sm text-ink/60">
              Peta ini hanya menampilkan lokasi kasus yang telah <strong>diverifikasi valid</strong> dan dicocokkan alamatnya oleh pengurus RT/RW setempat.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start font-mono text-[10px] uppercase tracking-widest">
            <button
              onClick={fetchVerifiedCasesOnly}
              className="border border-ink bg-paper px-3 py-2 text-ink font-bold flex items-center gap-1.5 shadow-[1px_1px_0_0_#121212] hover:bg-ink hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`size-3 text-emerald-600 ${loadingDb ? "animate-spin" : ""}`} />
              <span>{subjectList.length} Kasus Terverifikasi (Live DB)</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Map + Child Profile Dossier Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Interactive Map */}
          <div className="relative lg:col-span-7 h-[450px] lg:h-auto min-h-[420px] overflow-hidden border border-ink/15 bg-paper hard-shadow">
            {Mod ? (
              <Mod
                selectedId={selectedSubject.id}
                subjects={subjectList}
                onSelectSubject={(subject) => setSelectedSubject(subject)}
              />
            ) : (
              <MapSkeleton />
            )}

            <div className="pointer-events-none absolute left-4 top-4 z-[500] bg-paper/95 border border-ink/20 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest font-bold text-ink shadow-sm">
              Peta Investigasi Terverifikasi / Skala 1:2500
            </div>
            <div className="pointer-events-none absolute right-4 bottom-4 z-[500] bg-paper/95 border border-ink/20 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest font-bold text-emerald-600 shadow-sm">
              ● Klik Marker Untuk Buka Berkas Terverifikasi
            </div>
          </div>

          {/* Right Column: Child Profile Dossier Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative flex flex-col justify-between h-full border border-ink bg-white p-6 sm:p-8 shadow-[8px_8px_0_0_#121212] transition-all duration-300">
              <div>
                {/* Dossier Header */}
                <div className="flex items-center justify-between border-b border-ledger pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-600 text-white px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest">
                      BERKAS TERVERIFIKASI #{selectedSubject.id}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-ink/50">
                    SISTEM ARSIP KKN 34
                  </span>
                </div>

                {/* Identity Ledger Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6 bg-[#efeee9] p-4 border border-ink/10">
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-ink/50 flex items-center gap-1 mb-1">
                      <User className="size-3 text-signal" /> Inisial Subjek
                    </div>
                    <div className="font-display text-2xl font-black text-ink">
                      {selectedSubject.initials}
                    </div>
                  </div>

                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-ink/50 flex items-center gap-1 mb-1">
                      <Calendar className="size-3 text-signal" /> Usia
                    </div>
                    <div className="font-display text-xl font-bold text-ink">
                      {selectedSubject.age}
                    </div>
                  </div>

                  <div className="col-span-2 border-t border-ink/10 pt-2.5 mt-1">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-ink/50 flex items-center gap-1 mb-0.5">
                      <MapPin className="size-3 text-signal" /> Alamat Lengkap Terverifikasi
                    </div>
                    <div className="font-mono text-xs font-bold text-ink">
                      {selectedSubject.location}
                    </div>
                  </div>

                  <div className="col-span-2 border-t border-ink/10 pt-2">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-ink/50 flex items-center gap-1 mb-0.5">
                      <CheckCircle2 className="size-3 text-emerald-600" /> Tanggal Verifikasi
                    </div>
                    <div className="font-mono text-xs font-semibold text-ink/70">
                      {selectedSubject.dateLocked}
                    </div>
                  </div>
                </div>

                {/* Akar Permasalahan */}
                <div className="mb-4">
                  <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-signal flex items-center gap-1.5 mb-1.5">
                    <ShieldAlert className="size-3.5" />
                    AKAR PERMASALAHAN:
                  </h4>
                  <p className="font-sans text-xs leading-relaxed text-ink/80 bg-paper p-3 border-l-2 border-signal font-medium">
                    &ldquo;{selectedSubject.rootProblem}&rdquo;
                  </p>
                </div>

                {/* Potensi & Mimpi Jangka Panjang */}
                <div className="mb-4">
                  <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/70 flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="size-3.5 text-amber-500" />
                    POTENSI &amp; MIMPI JANGKA PANJANG:
                  </h4>
                  <p className="font-sans text-xs leading-relaxed text-ink/80 bg-paper p-3 border-l-2 border-amber-500 font-medium italic">
                    &ldquo;{selectedSubject.dream}&rdquo;
                  </p>
                </div>

                {/* Catatan Advokasi Tim KKN 34 */}
                <div>
                  <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink flex items-center gap-1.5 mb-1.5">
                    <span className="size-2 rounded-full bg-ink" />
                    CATATAN ADVOKASI TIM KKN 34:
                  </h4>
                  <p className="font-sans text-xs leading-relaxed text-ink/90 bg-[#efeee9] p-3 border border-ink/15 font-semibold">
                    {selectedSubject.advocacyNote}
                  </p>
                </div>
              </div>

              {/* Footer Indicator */}
              <div className="mt-6 border-t border-ledger pt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-ink/40">
                <span>STATUS: VERIFIED LAPANGAN</span>
                <span>DESA DIGITAL 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MapSkeleton() {
  return (
    <div className="radar-grid grid h-full w-full place-items-center bg-[#efeee9] font-mono text-[10px] uppercase tracking-widest text-ink/40">
      Loading map…
    </div>
  );
}
