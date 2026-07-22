"use client";

import { useState, useEffect } from "react";
import { useHydrated } from "./useHydrated";
import {
  Plus,
  Flag,
  User,
  FileText,
  X,
  Phone,
  Home,
  Trash2,
  Filter,
  History,
  Clock,
  AlertTriangle,
  FileUp,
  ArrowUpDown,
  Search,
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  Eye,
  CheckCircle2,
  Image as ImageIcon,
  MapPin,
  Map as MapIcon,
} from "lucide-react";

type MapPickerMod = typeof import("./MapPickerClient");

type ColKey = "baru" | "verifikasi" | "rujuk" | "selesai" | "ditutup";

export type Card = {
  id: string;
  dbUuid?: string;
  name: string;
  age: string;
  nik?: string;
  rw: string;
  address?: string;
  parent?: string;
  phone?: string;
  note: string;
  reporter: string;
  kategoriAlasan?: string;
  statusDokumen?: string;
  rujukan?: string;
  buktiUrl?: string;
  catatanOperator?: string;
  alasanDitutup?: string;
  fotoDokumentasiSelesai?: string;
  urgent?: boolean;
  verifiedAt?: string;
  lat?: number; // Custom Latitude set visually by Operator
  lng?: number; // Custom Longitude set visually by Operator
};

export type AuditLog = {
  id: string;
  timestamp: string;
  timestampRaw: number;
  caseId: string;
  caseName: string;
  action: string;
  byUsername: string;
  typeBadge: "NEW" | "VERIFY" | "RUJUK" | "SELESAI" | "DELETE";
};

const COLS: { key: ColKey; title: string; accent?: string }[] = [
  { key: "baru", title: "Baru Dilaporkan", accent: "bg-signal" },
  { key: "verifikasi", title: "Diverifikasi", accent: "bg-amber-500" },
  { key: "rujuk", title: "Dirujuk PKBM", accent: "bg-sky-600" },
  { key: "selesai", title: "Selesai", accent: "bg-emerald-600" },
];

export const KATEGORI_ALASAN_OPTIONS = [
  "Faktor Ekonomi & Biaya Transportasi",
  "Pekerja Anak / Membantu Orang Tua",
  "Trauma Perundungan / Bullying",
  "Kendala Dokumen Akta & Ijazah",
  "Kondisi Kesehatan / Disabilitas",
  "Faktor Lingkungan & Keluarga",
];

export const INITIAL: Record<ColKey, Card[]> = {
  baru: [
    {
      id: "03-LH",
      name: "Lukman Hakim",
      age: "12 Tahun",
      rw: "RW 03",
      note: "Terlihat mengumpulkan barang bekas jam sekolah bersama saudaranya.",
      reporter: "RT04",
      parent: "Bambang (Ayah)",
      phone: "0812-9988-7711",
    },
    {
      id: "04-PL",
      name: "Putri Lestari",
      age: "15 Tahun",
      rw: "RW 04",
      note: "Berhenti sekolah pasca lulus SMP karena kendala ongkos & biaya transportasi.",
      reporter: "RW09",
      parent: "Suratmi (Ibu)",
      phone: "0857-1122-3344",
    },
  ],
  verifikasi: [
    {
      id: "04-AR",
      name: "Anisa Rahmawati",
      age: "14 Tahun",
      nik: "3174086101100004",
      rw: "RW 04",
      address: "RT 03 / RW 04 No. 09, Dukuh Sutorejo, Mulyorejo, Surabaya",
      parent: "Rahmat (Ayah)",
      phone: "0813-4455-6677",
      note: "Bekerja membantu di warung keluarga sejak 6 bulan lalu.",
      reporter: "Kelompok-KKN",
      kategoriAlasan: "Pekerja Anak / Membantu Orang Tua",
      statusDokumen: "KK Lengkap, Berkas Terverifikasi",
      urgent: true,
      lat: -7.2635,
      lng: 112.7890,
    },
    {
      id: "07-DK",
      name: "Deni Kurniawan",
      age: "10 Tahun",
      nik: "3174082205140002",
      rw: "RW 07",
      address: "RT 02 / RW 07 No. 15, Sutorejo Indah, Surabaya",
      parent: "Kusnadi (Ayah)",
      phone: "0819-0011-2233",
      note: "Data alamat & domisili terkonfirmasi valid oleh pengurus RT setempat.",
      reporter: "RT04",
      kategoriAlasan: "Faktor Ekonomi & Biaya Transportasi",
      statusDokumen: "Dokumen Kependudukan Lengkap",
      urgent: true,
      lat: -7.2650,
      lng: 112.7915,
    },
  ],
  rujuk: [
    {
      id: "04-SW",
      name: "Siti Wulandari",
      age: "13 Tahun",
      nik: "3174085107110001",
      rw: "RW 04",
      address: "RT 03 / RW 04 No. 24, Sutorejo Utara, Surabaya",
      parent: "Wiyono (Ayah)",
      phone: "0812-7788-9900",
      note: "Terendap kendala biaya seragam & trauma perundungan sekolah lama.",
      reporter: "Kelompok-KKN",
      kategoriAlasan: "Trauma Perundungan / Bullying",
      statusDokumen: "Surat Rujukan Terbit",
      rujukan: "Dirujuk ke PKBM Kejar Paket B & Konseling Mandiri",
      catatanOperator: "Surat rekomendasi KKN 34 & PKBM Negeri 01 diserahkan.",
      buktiUrl: "surat_rujukan_pkbm_1039.pdf",
      lat: -7.2630,
      lng: 112.7885,
    },
  ],
  selesai: [
    {
      id: "03-BS",
      name: "Budi Santoso Jr.",
      age: "11 Tahun",
      nik: "3174081902130009",
      rw: "RW 03",
      address: "RT 01 / RW 03 No. 05, Dukuh Sutorejo, Surabaya",
      parent: "Sutrisno (Ayah)",
      phone: "0818-6677-8899",
      note: "Berhasil kembali bersekolah di SMPN 12. Monitoring berkala 3 bulan.",
      reporter: "Operator-Kelurahan",
      kategoriAlasan: "Faktor Ekonomi & Biaya Transportasi",
      statusDokumen: "Aktif Kembali Bersekolah",
      rujukan: "Kasus Selesai — Pembina Monitoring",
      catatanOperator: "Anak telah aktif belajar kelas 6 di PKBM Negeri 01.",
      buktiUrl: "sk_dapodik_smpn12_0988.pdf",
      fotoDokumentasiSelesai: "foto_budi_belajar_pkbm.jpg",
      lat: -7.2612,
      lng: 112.7865,
    },
  ],
  ditutup: [
    {
      id: "04-RM",
      name: "Rian Maulana",
      age: "16 Tahun",
      nik: "3174081504090003",
      rw: "RW 04",
      address: "RT 04 / RW 04 No. 18, Sutorejo",
      parent: "Suhardi (Ayah)",
      phone: "0812-3344-5566",
      note: "Telah dilakukan 3x mediasi & pelatihan motivasi oleh Tim KKN 34.",
      reporter: "Kelompok-KKN",
      kategoriAlasan: "Pekerja Anak / Membantu Orang Tua",
      statusDokumen: "Advokasi Ditutup (Penolakan)",
      alasanDitutup: "Keluarga & anak memutuskan bekerja penuh membantu toko kelontong orang tua.",
    },
  ],
};

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "LOG-901",
    timestamp: "22 Jul 2026, 15:45 WIB",
    timestampRaw: 1784683500000,
    caseId: "1039",
    caseName: "Siti Wulandari",
    action: "Dipindahkan dari 'Diverifikasi' ➔ 'Dirujuk PKBM'",
    byUsername: "Kelompok-KKN",
    typeBadge: "RUJUK",
  },
  {
    id: "LOG-900",
    timestamp: "22 Jul 2026, 14:20 WIB",
    timestampRaw: 1784678400000,
    caseId: "1042",
    caseName: "Deni Kurniawan",
    action: "Hasil survei door-to-door valid, status diubah ke 'Diverifikasi'",
    byUsername: "RT04",
    typeBadge: "VERIFY",
  },
  {
    id: "LOG-899",
    timestamp: "22 Jul 2026, 11:15 WIB",
    timestampRaw: 1784667300000,
    caseId: "1045",
    caseName: "Lukman Hakim",
    action: "Laporan temuan baru terdaftar dari warga RW 03",
    byUsername: "RT04",
    typeBadge: "NEW",
  },
  {
    id: "LOG-898",
    timestamp: "21 Jul 2026, 16:30 WIB",
    timestampRaw: 1784599800000,
    caseId: "0988",
    caseName: "Budi Santoso Jr.",
    action: "Status advokasi tuntas, terdaftar resmi di DAPODIK",
    byUsername: "Operator-Kelurahan",
    typeBadge: "SELESAI",
  },
];

export function KanbanBoard() {
  const hydrated = useHydrated();
  const [PickerMod, setPickerMod] = useState<MapPickerMod["default"] | null>(null);

  const [board, setBoard] = useState(INITIAL);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Sorting & Filtering States
  const [logSortField, setLogSortField] = useState<"time" | "name" | "status">("time");
  const [logSortOrder, setLogSortOrder] = useState<"desc" | "asc">("desc");
  const [logSearchQuery, setLogSearchQuery] = useState("");
  const [logStatusFilter, setLogStatusFilter] = useState<string>("ALL");

  const [dragCard, setDragCard] = useState<{ id: string; from: ColKey } | null>(null);
  const [overCol, setOverCol] = useState<ColKey | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedRwFilter, setSelectedRwFilter] = useState("ALL");
  const [warningToast, setWarningToast] = useState<string | null>(null);

  // Active Username Selector
  const [activeUsername, setActiveUsername] = useState("Kelompok-KKN");

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<Card | null>(null);
  const [showProofViewerModal, setShowProofViewerModal] = useState<Card | null>(null);

  // Visual Interactive Map Picker Sub-Modal State
  const [showVisualMapPickerModal, setShowVisualMapPickerModal] = useState(false);

  // Modal Step 1: Verification Modal (`baru` -> `verifikasi`)
  const [showVerifyModal, setShowVerifyModal] = useState<{ card: Card; targetCol: ColKey } | null>(null);
  const [verifyForm, setVerifyForm] = useState({
    name: "",
    nik: "",
    address: "",
    parent: "",
    phone: "",
    kategoriAlasan: KATEGORI_ALASAN_OPTIONS[0],
    statusDokumen: "KK Lengkap, Berkas Terverifikasi",
    urgent: false,
    lat: -7.2630,
    lng: 112.7885,
  });

  // Modal Step 2: Proof Upload Modal (`verifikasi` -> `rujuk`)
  const [showProofModal, setShowProofModal] = useState<{ card: Card; targetCol: ColKey } | null>(null);
  const [proofCatatan, setProofCatatan] = useState("");
  const [proofFile, setProofFile] = useState<{ name: string; objectUrl: string } | null>(null);
  const [proofRujukan, setProofRujukan] = useState("PKBM Kejar Paket B & Konseling Mandiri");

  // Fullscreen image lightbox modal
  const [imageLightboxUrl, setImageLightboxUrl] = useState<string | null>(null);

  // Modal Step 3: Friendly Simple Closure Modal (`rujuk` -> `selesai`)
  const [showSelesaiModal, setShowSelesaiModal] = useState<{ card: Card } | null>(null);
  const [fotoBelajar, setFotoBelajar] = useState<string | null>(null);
  const [catatanSelesai, setCatatanSelesai] = useState("");

  // Modal Outcome B: Closure due to Refusal (`verifikasi` / `rujuk` -> `ditutup`)
  const [showDitutupModal, setShowDitutupModal] = useState<{ card: Card; fromCol: ColKey } | null>(null);
  const [alasanDitutupText, setAlasanDitutupText] = useState("");

  // Form Add Case State
  const [newCase, setNewCase] = useState({
    name: "",
    age: "12 Tahun",
    rw: "RW 04",
    note: "",
    phone: "",
    reporter: "Kelompok-KKN",
  });

  useEffect(() => {
    if (!hydrated) return;
    import("./MapPickerClient")
      .then((m) => setPickerMod(() => m.default))
      .catch((e) => console.error("MapPickerClient load failed:", e));
  }, [hydrated]);

  useEffect(() => {
    fetch("/api/kasus")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          // If Supabase returned live cards, populate Kanban board
          const hasAnyCards = Object.values(json.data).some((list: any) => list && list.length > 0);
          if (hasAnyCards) {
            setBoard({
              baru: json.data.baru || [],
              verifikasi: json.data.verifikasi || [],
              rujuk: json.data.rujuk || [],
              selesai: json.data.selesai || [],
              ditutup: json.data.ditutup || [],
            });
          }
        }
      })
      .catch((err) => console.error("Failed to fetch live cases for Kanban:", err));
  }, []);

  // Strict Sequential Movement Validator
  const isValidTransition = (from: ColKey, to: ColKey): boolean => {
    if (from === "baru" && to === "verifikasi") return true;
    if (from === "verifikasi" && to === "rujuk") return true;
    if (from === "rujuk" && to === "selesai") return true;
    if ((from === "verifikasi" || from === "rujuk") && to === "ditutup") return true;
    return false;
  };

  const addAuditLog = (
    caseId: string,
    caseName: string,
    actionText: string,
    username: string,
    badge: "NEW" | "VERIFY" | "RUJUK" | "SELESAI" | "DELETE"
  ) => {
    const now = new Date();
    const newLog: AuditLog = {
      id: "LOG-" + Math.floor(1000 + Math.random() * 9000),
      timestamp:
        now.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }) + " WIB",
      timestampRaw: now.getTime(),
      caseId,
      caseName,
      action: actionText,
      byUsername: username,
      typeBadge: badge,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Handle Drag & Drop with Strict Rules
  const onDrop = (to: ColKey) => {
    if (!dragCard) return;
    const { from, id } = dragCard;

    if (from === to) {
      setDragCard(null);
      setOverCol(null);
      return;
    }

    if (!isValidTransition(from, to)) {
      setWarningToast(
        `Pergerakan ditolak: Kartu tidak bisa ditarik mundur atau melompati urutan. Urutan wajib: Baru ➔ Diverifikasi ➔ Dirujuk ➔ Selesai.`
      );
      setTimeout(() => setWarningToast(null), 4500);
      setDragCard(null);
      setOverCol(null);
      return;
    }

    const targetCard = board[from].find((c) => c.id === id);
    if (!targetCard) return;

    if ((from === "verifikasi" || from === "rujuk") && to === "ditutup") {
      setAlasanDitutupText(targetCard.alasanDitutup || "Telah dilakukan mediasi & pelatihan, namun keluarga/anak memutuskan untuk tidak melanjutkan sekolah.");
      setShowDitutupModal({ card: targetCard, fromCol: from });
      setOverCol(null);
      return;
    }

    if (from === "baru" && to === "verifikasi") {
      setVerifyForm({
        name: targetCard.name,
        nik: targetCard.nik || "317408" + Math.floor(1000000000 + Math.random() * 9000000000),
        address: targetCard.address || `RT 02 / ${targetCard.rw}, Dukuh Sutorejo, Mulyorejo, Surabaya`,
        parent: targetCard.parent || "",
        phone: targetCard.parent ? (targetCard.phone || "") : "",
        kategoriAlasan: targetCard.kategoriAlasan || KATEGORI_ALASAN_OPTIONS[0],
        statusDokumen: targetCard.statusDokumen || "Dokumen Kependudukan Lengkap",
        urgent: !!targetCard.urgent,
        lat: targetCard.lat || -7.2630,
        lng: targetCard.lng || 112.7885,
      });
      setShowVerifyModal({ card: targetCard, targetCol: to });
      setOverCol(null);
      return;
    }

    if (from === "verifikasi" && to === "rujuk") {
      setProofRujukan(targetCard.rujukan || "Dirujuk ke PKBM Negeri 01 Gelombang II");
      setShowProofModal({ card: targetCard, targetCol: to });
      setOverCol(null);
      return;
    }

    if (from === "rujuk" && to === "selesai") {
      setCatatanSelesai("Anak telah berhasil kembali bersekolah & aktif belajar di kelas.");
      setShowSelesaiModal({ card: targetCard });
      setOverCol(null);
      return;
    }

    setDragCard(null);
    setOverCol(null);
  };

  const moveCardDirect = (id: string, from: ColKey, to: ColKey, extraData?: Partial<Card>) => {
    const sourceList = [...board[from]];
    const idx = sourceList.findIndex((c) => c.id === id);
    if (idx === -1) return;

    const [moved] = sourceList.splice(idx, 1);
    const updatedCard: Card = {
      ...moved,
      ...extraData,
    };

    const destList = [updatedCard, ...board[to]];

    setBoard({
      ...board,
      [from]: sourceList,
      [to]: destList,
    });

    // Send PUT request to API /api/kasus to persist status change in Supabase
    fetch("/api/kasus", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        dbUuid: moved.dbUuid,
        newStatus: to,
        name: extraData?.name || moved.name,
        address: extraData?.address || moved.address,
        parent: extraData?.parent || moved.parent,
        phone: extraData?.phone || moved.phone,
      }),
    }).catch((err) => console.error("Failed to sync case move to API:", err));

    const colTitleMap: Record<ColKey, string> = {
      baru: "Baru Dilaporkan",
      verifikasi: "Diverifikasi",
      rujuk: "Dirujuk PKBM",
      selesai: "Selesai",
      ditutup: "Advokasi Ditutup",
    };

    const typeBadgeMap: Record<ColKey, "NEW" | "VERIFY" | "RUJUK" | "SELESAI" | "DELETE"> = {
      baru: "NEW",
      verifikasi: "VERIFY",
      rujuk: "RUJUK",
      selesai: "SELESAI",
      ditutup: "DELETE",
    };

    addAuditLog(
      moved.id,
      moved.name,
      `Status dipindahkan dari '${colTitleMap[from]}' ➔ '${colTitleMap[to]}'`,
      activeUsername,
      typeBadgeMap[to]
    );
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showVerifyModal) return;

    moveCardDirect(showVerifyModal.card.id, "baru", "verifikasi", {
      name: verifyForm.name,
      nik: verifyForm.nik,
      address: verifyForm.address,
      parent: verifyForm.parent,
      phone: verifyForm.phone,
      kategoriAlasan: verifyForm.kategoriAlasan,
      statusDokumen: verifyForm.statusDokumen,
      urgent: verifyForm.urgent,
      lat: verifyForm.lat,
      lng: verifyForm.lng,
      verifiedAt: new Date().toISOString(),
    });

    setShowVerifyModal(null);
    setDragCard(null);
  };

  const handleProofSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showProofModal) return;

    moveCardDirect(showProofModal.card.id, "verifikasi", "rujuk", {
      rujukan: proofRujukan,
      catatanOperator: proofCatatan || "Berkas rujukan telah terverifikasi oleh operator.",
      // Store objectUrl so preview works in-session; name for display
      buktiUrl: proofFile?.objectUrl || proofFile?.name || "surat_rujukan_pkbm_01.pdf",
      statusDokumen: "Surat Rujukan Terbit",
    });

    setShowProofModal(null);
    setDragCard(null);
    setProofCatatan("");
    setProofFile(null);
  };

  const handleSelesaiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showSelesaiModal) return;

    moveCardDirect(showSelesaiModal.card.id, "rujuk", "selesai", {
      catatanOperator: catatanSelesai || "Advokasi tuntas, anak telah kembali bersekolah.",
      fotoDokumentasiSelesai: fotoBelajar || "foto_anak_belajar_pkbm.jpg",
      statusDokumen: "Aktif Kembali Bersekolah",
    });

    setShowSelesaiModal(null);
    setDragCard(null);
    setFotoBelajar(null);
  };

  const handleDitutupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showDitutupModal) return;

    moveCardDirect(showDitutupModal.card.id, showDitutupModal.fromCol, "ditutup", {
      alasanDitutup: alasanDitutupText || "Advokasi ditutup karena penolakan subjek/keluarga.",
      catatanOperator: alasanDitutupText || "Advokasi ditutup karena penolakan subjek/keluarga.",
      statusDokumen: "Advokasi Ditutup (Penolakan)",
    });

    setShowDitutupModal(null);
    setDragCard(null);
    setAlasanDitutupText("");
  };

  const handleCreateCaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCase.name) return;

    const newId = String(Math.floor(1000 + Math.random() * 9000));
    const createdCard: Card = {
      id: newId,
      name: newCase.name,
      age: newCase.age,
      rw: newCase.rw,
      note: newCase.note,
      phone: newCase.phone || "0812-0000-0000",
      reporter: activeUsername,
    };

    setBoard({
      ...board,
      baru: [createdCard, ...board.baru],
    });

    // Send POST request to API /api/kasus to persist new case in Supabase
    fetch("/api/kasus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newCase.name,
        age: newCase.age,
        rw: newCase.rw,
        note: newCase.note,
        reporter: activeUsername,
      }),
    }).catch((err) => console.error("Failed to save new case to API:", err));

    addAuditLog(newId, newCase.name, "Laporan kasus baru didaftarkan ke sistem", activeUsername, "NEW");

    setShowAddModal(false);
    setNewCase({
      name: "",
      age: "12 Tahun",
      rw: "RW 04",
      note: "",
      phone: "",
      reporter: activeUsername,
    });
  };

  const handleDeleteCase = (id: string, name: string, dbUuid?: string) => {
    let cardTarget: Card | undefined;
    (Object.keys(board) as ColKey[]).forEach((col) => {
      const found = board[col].find((c) => c.id === id);
      if (found) cardTarget = found;
    });

    const targetDbUuid = dbUuid || cardTarget?.dbUuid;
    const targetName = name || cardTarget?.name;

    const newBoard = { ...board };
    (Object.keys(newBoard) as ColKey[]).forEach((col) => {
      newBoard[col] = newBoard[col].filter((c) => c.id !== id);
    });

    setBoard(newBoard);

    // Send HTTP DELETE request to API /api/kasus to delete row in Supabase database
    fetch("/api/kasus", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        dbUuid: targetDbUuid,
        name: targetName,
      }),
    }).catch((err) => console.error("Failed to sync case deletion to API:", err));

    addAuditLog(id, name, "Laporan tidak valid/palsu dihapus dari sistem & database", activeUsername, "DELETE");

    setShowDeleteModal(null);
    setSelectedCard(null);
  };

  const toggleCardUrgent = (card: Card) => {
    const newBoard = { ...board };
    (Object.keys(newBoard) as ColKey[]).forEach((col) => {
      newBoard[col] = newBoard[col].map((c) => (c.id === card.id ? { ...c, urgent: !c.urgent } : c));
    });
    setBoard(newBoard);
    if (selectedCard && selectedCard.id === card.id) {
      setSelectedCard({ ...selectedCard, urgent: !selectedCard.urgent });
    }
  };

  const getFilteredCards = (cards: Card[]) => {
    if (selectedRwFilter === "ALL") return cards;
    return cards.filter((c) => c.rw.includes(selectedRwFilter));
  };

  const processedAuditLogs = auditLogs
    .filter((log) => {
      const matchSearch =
        log.caseName.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
        log.caseId.includes(logSearchQuery) ||
        log.byUsername.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(logSearchQuery.toLowerCase());

      const matchStatus = logStatusFilter === "ALL" || log.typeBadge === logStatusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (logSortField === "time") {
        return logSortOrder === "desc" ? b.timestampRaw - a.timestampRaw : a.timestampRaw - b.timestampRaw;
      }
      if (logSortField === "name") {
        return logSortOrder === "desc" ? b.caseName.localeCompare(a.caseName) : a.caseName.localeCompare(b.caseName);
      }
      if (logSortField === "status") {
        return logSortOrder === "desc" ? b.typeBadge.localeCompare(a.typeBadge) : a.typeBadge.localeCompare(b.typeBadge);
      }
      return 0;
    });

  const toggleSort = (field: "time" | "name" | "status") => {
    if (logSortField === field) {
      setLogSortOrder(logSortOrder === "desc" ? "asc" : "desc");
    } else {
      setLogSortField(field);
      setLogSortOrder("desc");
    }
  };

  const totalCount = Object.values(board).flatMap((list) => list).length;

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-10 space-y-12">
      {/* Warning Toast for Invalid Movement */}
      {warningToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 border-2 border-ink bg-amber-500 text-white p-4 shadow-[6px_6px_0_0_#121212] animate-[fade-up_0.2s_ease-out] font-mono text-xs max-w-md">
          <ShieldAlert className="size-5 shrink-0" />
          <span>{warningToast}</span>
          <button onClick={() => setWarningToast(null)} className="ml-auto font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Header Bar & Actions */}
      <div>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-signal font-bold flex items-center gap-2">
              <span className="size-2 rounded-full bg-signal animate-ping" />
              WORKSPACE OPERATOR &middot; AKSES TERPROTEKSI
            </div>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-4xl text-ink">
              Manajemen Advokasi Sensus Anak
            </h1>
            <p className="mt-2 text-sm text-ink/60 max-w-2xl font-sans leading-relaxed">
              Papan kerja operasional sekuensil. Kartu berpindah berurutan: <strong>Baru ➔ Diverifikasi ➔ Dirujuk ➔ Selesai</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 border border-ink bg-white px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider">
              <User className="size-3 text-sky-600" />
              <span className="text-ink/50">OPERATOR:</span>
              <select
                value={activeUsername}
                onChange={(e) => setActiveUsername(e.target.value)}
                className="bg-transparent text-ink font-bold focus:outline-none cursor-pointer"
              >
                <option value="Kelompok-KKN">Kelompok-KKN</option>
                <option value="RT04">RT04</option>
                <option value="RW09">RW09</option>
                <option value="Operator-Kelurahan">Operator-Kelurahan</option>
              </select>
            </div>

            <div className="flex items-center gap-2 border border-ink bg-white px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider">
              <Filter className="size-3 text-sky-600" />
              <select
                value={selectedRwFilter}
                onChange={(e) => setSelectedRwFilter(e.target.value)}
                className="bg-transparent text-ink focus:outline-none cursor-pointer"
              >
                <option value="ALL">SEMUA RW (ALL)</option>
                <option value="RW 03">RW 03</option>
                <option value="RW 04">RW 04</option>
                <option value="RW 07">RW 07</option>
                <option value="RW 09">RW 09</option>
                <option value="RW 12">RW 12</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 border border-ink bg-signal px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-[2px_2px_0_0_#121212] transition-all hover:bg-ink active:translate-y-px cursor-pointer"
            >
              <Plus className="size-3.5" strokeWidth={2.5} />
              <span>+ Tambah Kasus Baru</span>
            </button>
          </div>
        </div>

        {/* KPI Counters */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono text-[10px] uppercase tracking-widest">
          <div className="border border-ink/20 p-3.5 bg-white">
            <div className="text-ink/50 text-[9px]">TOTAL KASUS TERDATA</div>
            <div className="mt-1 font-display text-2xl font-black text-ink">{totalCount}</div>
          </div>
          <div className="border border-ink/20 p-3.5 bg-white">
            <div className="text-ink/50 text-[9px]">BARU DILAPORKAN</div>
            <div className="mt-1 font-display text-2xl font-black text-signal">{board.baru.length}</div>
          </div>
          <div className="border border-ink/20 p-3.5 bg-white">
            <div className="text-ink/50 text-[9px]">DIRUJUK PKBM</div>
            <div className="mt-1 font-display text-2xl font-black text-sky-600">{board.rujuk.length}</div>
          </div>
          <div className="border border-ink/20 p-3.5 bg-white">
            <div className="text-ink/50 text-[9px]">TERADVOKASI SELESAI</div>
            <div className="mt-1 font-display text-2xl font-black text-emerald-600">{board.selesai.length}</div>
          </div>
        </div>
      </div>

      {/* KANBAN BOARD COLUMNS GRID WITH INTERNAL SCROLL */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {COLS.map((col) => {
          const cards = getFilteredCards(board[col.key]);
          const isOver = overCol === col.key;

          return (
            <div
              key={col.key}
              onDragOver={(e) => {
                e.preventDefault();
                setOverCol(col.key);
              }}
              onDragLeave={() => setOverCol(null)}
              onDrop={() => onDrop(col.key)}
              className={`flex flex-col border border-ink/20 bg-white p-4 h-[620px] transition-all duration-200 ${
                isOver ? "border-signal bg-signal/5 ring-2 ring-signal/20" : ""
              }`}
            >
              <div className="mb-3 flex items-center justify-between border-b border-ledger pb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <span className={`size-2.5 rounded-full ${col.accent || "bg-ink"}`} />
                  <h3 className="font-display text-sm font-extrabold uppercase tracking-tight text-ink">
                    {col.title}
                  </h3>
                </div>
                <span className="font-mono text-[10px] font-bold text-ink/50 bg-paper px-2 py-0.5 border border-ink/10">
                  {cards.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                {cards.length === 0 ? (
                  <div className="py-12 text-center text-ink/40 font-mono text-[10px] uppercase">
                    Kosong
                  </div>
                ) : (
                  cards.map((c) => (
                    <div
                      key={c.id}
                      draggable
                      onDragStart={() => setDragCard({ id: c.id, from: col.key })}
                      onClick={() => setSelectedCard(c)}
                      className="group relative cursor-pointer border border-ink/15 bg-paper p-4 transition-all duration-200 hover:-translate-y-1 hover:border-ink hover:shadow-[4px_4px_0_0_#121212]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-ink/40">
                          #{c.id} &middot; {c.rw}
                        </span>
                        {c.urgent && (
                          <span className="inline-flex items-center gap-1 bg-signal text-white px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider">
                            <Flag className="size-2.5" /> Prioritas
                          </span>
                        )}
                      </div>

                      <div className="mt-2 font-display text-base font-extrabold text-ink group-hover:text-sky-600 transition-colors">
                        {c.name} ({c.age})
                      </div>

                      <p className="mt-1 text-xs text-ink/70 line-clamp-2 leading-relaxed font-sans">
                        {c.note}
                      </p>

                      {c.lat && c.lng && (
                        <div className="mt-2 text-[9px] font-mono font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 border border-emerald-200 flex items-center gap-1">
                          <MapPin className="size-2.5 text-emerald-600" />
                          <span>KOORDINAT MAPS: {c.lat.toFixed(4)}, {c.lng.toFixed(4)}</span>
                        </div>
                      )}

                      {c.kategoriAlasan && (
                        <div className="mt-1.5 text-[9px] font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 border border-amber-200 inline-block">
                          🏷️ {c.kategoriAlasan}
                        </div>
                      )}

                      {(col.key === "rujuk" || col.key === "selesai") && c.buktiUrl && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowProofViewerModal(c);
                          }}
                          className="mt-2.5 w-full flex items-center justify-center gap-1.5 border border-sky-400 bg-sky-50 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider text-sky-900 shadow-[1px_1px_0_0_#0284c7] hover:bg-sky-600 hover:text-white transition-all cursor-pointer"
                        >
                          <Eye className="size-3 shrink-0" />
                          <span>[👁️ Lihat Bukti Fisik]</span>
                        </button>
                      )}

                      <div className="mt-2.5 border-t border-ledger/80 pt-2 font-mono text-[9px] text-ink/80 space-y-0.5">
                        {col.key === "baru" ? (
                          <div className="flex items-center gap-1 font-bold text-ink">
                            <User className="size-2.5 text-sky-600 shrink-0" />
                            <span className="truncate">
                              Pelapor: {c.reporter} {c.phone && c.phone !== "-" ? `(${c.phone})` : ""}
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-1 font-bold text-ink">
                              <User className="size-2.5 text-sky-600 shrink-0" />
                              <span className="truncate">Wali: {c.parent || "Belum Ada Data Wali"}</span>
                            </div>
                            {c.phone && c.phone !== "-" && (
                              <div className="flex items-center gap-1 text-emerald-800 font-bold">
                                <Phone className="size-2.5 text-emerald-600 shrink-0" />
                                <span>WA Wali: {c.phone}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      <div className="mt-2 flex items-center justify-between border-t border-ledger pt-2 font-mono text-[9px] uppercase tracking-widest text-ink/50">
                        <span className="flex items-center gap-1 font-bold text-ink/70">
                          {col.key === "baru" ? "Baru Dilaporkan" : `Pelapor: ${c.reporter}`}
                        </span>
                        <span className="font-bold text-ink hover:underline">
                          Detail Berkas &rarr;
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* OUTCOME B: FULL-WIDTH BOTTOM KANBAN ROW FOR CLOSED ADVOCACY CASES */}
      <section
        onDragOver={(e) => {
          e.preventDefault();
          setOverCol("ditutup");
        }}
        onDragLeave={() => setOverCol(null)}
        onDrop={() => onDrop("ditutup")}
        className={`border-2 border-dashed transition-all duration-200 p-5 bg-white shadow-[8px_8px_0_0_#121212] ${
          overCol === "ditutup"
            ? "border-rose-600 bg-rose-50/80 ring-2 ring-rose-500/20"
            : "border-rose-300 bg-rose-50/30"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-rose-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="grid size-6 place-items-center bg-rose-600 text-white font-mono text-xs font-black">
              B
            </div>
            <div>
              <h3 className="font-display text-base font-extrabold uppercase tracking-tight text-rose-950 flex items-center gap-2">
                <span>OUTCOME B: ARSIP ADVOKASI DITUTUP (PENOLAKAN SUBJEK / KELUARGA)</span>
              </h3>
              <p className="text-[10px] font-mono text-rose-800/70">
                Sektor penampung kasus di mana mediasi/pelatihan telah dilakukan namun anak/keluarga memilih tidak melanjutkan sekolah. (Tarik kartu dari kolom Diverifikasi atau Dirujuk ke sini)
              </p>
            </div>
          </div>

          <span className="font-mono text-[10px] font-bold text-rose-900 bg-rose-100 px-2.5 py-1 border border-rose-300">
            {getFilteredCards(board["ditutup"] || []).length} KASUS DITUTUP
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 min-h-[90px]">
          {getFilteredCards(board["ditutup"] || []).length === 0 ? (
            <div className="col-span-full py-6 text-center text-rose-900/40 font-mono text-[10px] uppercase border border-dashed border-rose-200 bg-white/50">
              [ Belum ada kasus penolakan yang diarsipkan — Tarik kartu dari Diverifikasi / Dirujuk ke sini jika mediasi buntu ]
            </div>
          ) : (
            getFilteredCards(board["ditutup"] || []).map((c) => (
              <div
                key={c.id}
                draggable
                onDragStart={() => setDragCard({ id: c.id, from: "ditutup" })}
                onClick={() => setSelectedCard(c)}
                className="group relative cursor-pointer border border-ink/20 bg-paper p-3 transition-all duration-200 hover:-translate-y-1 hover:border-ink hover:shadow-[3px_3px_0_0_#121212] overflow-visible"
              >
                {/* TILTED VINTAGE RED STICKER AT TOP-RIGHT CORNER */}
                <div className="absolute -top-2.5 -right-2.5 bg-signal text-white px-2 py-0.5 font-mono text-[8px] font-black uppercase shadow-sm transform rotate-6 border border-ink z-10 select-none">
                  DITUTUP
                </div>

                <div className="flex items-start justify-between gap-1 pr-6">
                  <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-ink/40">
                    #{c.id} &middot; {c.rw}
                  </span>
                </div>

                <div className="mt-1 font-display text-xs font-extrabold text-ink group-hover:text-rose-600 transition-colors truncate">
                  {c.name} ({c.age})
                </div>

                <p className="mt-1 text-[10px] text-ink/70 line-clamp-1 leading-tight font-sans">
                  {c.alasanDitutup || c.note}
                </p>

                <div className="mt-2 border-t border-ledger/60 pt-1 font-mono text-[8px] text-ink/60 flex items-center justify-between">
                  <span className="truncate">Wali: {c.parent || "Warga"}</span>
                  <span className="font-bold text-rose-600 hover:underline shrink-0">
                    Detail &rarr;
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* MODERN TECHNICAL AUDIT LOG SECTION */}
      <section className="border border-ink bg-white p-6 sm:p-8 shadow-[8px_8px_0_0_#121212]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-ledger pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center bg-sky-600 text-white shadow-[2px_2px_0_0_#121212]">
              <History className="size-5" />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sky-600 font-bold flex items-center gap-1.5">
                <Clock className="size-3.5" />
                <span>KRONOLOGI REKAM JEJAK AUTOMATIS</span>
              </div>
              <h2 className="font-display text-2xl font-extrabold text-ink mt-0.5">
                Log Aktivitas Sensus &amp; Advokasi Operator
              </h2>
            </div>
          </div>

          <span className="font-mono text-[9px] uppercase tracking-widest text-sky-900 bg-sky-50 border border-sky-200 px-3 py-1.5 font-bold">
            MENAMPILKAN {processedAuditLogs.length} DARI {auditLogs.length} LOG
          </span>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-paper p-3 border border-ink/15 font-mono text-[10px] uppercase">
          <div className="flex items-center gap-2 border border-ink/20 bg-white px-3 py-1.5 flex-1 min-w-[220px]">
            <Search className="size-3.5 text-sky-600" />
            <input
              type="text"
              value={logSearchQuery}
              onChange={(e) => setLogSearchQuery(e.target.value)}
              placeholder="Cari ID Kasus, Nama Subjek, atau User Operator..."
              className="w-full bg-transparent text-xs text-ink focus:outline-none placeholder:text-ink/30"
            />
            {logSearchQuery && (
              <button onClick={() => setLogSearchQuery("")} className="text-ink/40 hover:text-ink">
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 border border-ink/20 bg-white px-2.5 py-1.5">
              <Filter className="size-3 text-sky-600" />
              <span className="text-ink/50">FILTER:</span>
              <select
                value={logStatusFilter}
                onChange={(e) => setLogStatusFilter(e.target.value)}
                className="bg-transparent font-bold text-ink focus:outline-none cursor-pointer"
              >
                <option value="ALL">SEMUA STATUS</option>
                <option value="NEW">NEW (LAPORAN)</option>
                <option value="VERIFY">VERIFY (DIVERIFIKASI)</option>
                <option value="RUJUK">RUJUK (PKBM)</option>
                <option value="SELESAI">SELESAI (DAPODIK)</option>
                <option value="DELETE">DELETE (HAPUS)</option>
              </select>
            </div>

            <button
              onClick={() => toggleSort("time")}
              className={`inline-flex items-center gap-1 border px-2.5 py-1.5 font-bold transition-all cursor-pointer ${
                logSortField === "time"
                  ? "bg-sky-600 text-white border-sky-600"
                  : "bg-white text-ink border-ink/20 hover:border-ink"
              }`}
            >
              <ArrowUpDown className="size-3" />
              <span>WAKTU {logSortField === "time" ? (logSortOrder === "desc" ? "↓" : "↑") : ""}</span>
            </button>

            <button
              onClick={() => toggleSort("name")}
              className={`inline-flex items-center gap-1 border px-2.5 py-1.5 font-bold transition-all cursor-pointer ${
                logSortField === "name"
                  ? "bg-sky-600 text-white border-sky-600"
                  : "bg-white text-ink border-ink/20 hover:border-ink"
              }`}
            >
              <ArrowUpDown className="size-3" />
              <span>NAMA SUBJEK {logSortField === "name" ? (logSortOrder === "desc" ? "Z-A" : "A-Z") : ""}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border border-ink/15">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-ink bg-sky-50/70 text-[10px] uppercase tracking-widest text-sky-900">
                <th onClick={() => toggleSort("time")} className="py-3 px-4 cursor-pointer hover:bg-sky-100">
                  Waktu &amp; Tanggal {logSortField === "time" && (logSortOrder === "desc" ? "↓" : "↑")}
                </th>
                <th onClick={() => toggleSort("name")} className="py-3 px-4 cursor-pointer hover:bg-sky-100">
                  ID &amp; Subjek Anak {logSortField === "name" && (logSortOrder === "desc" ? "↓" : "↑")}
                </th>
                <th onClick={() => toggleSort("status")} className="py-3 px-4 cursor-pointer hover:bg-sky-100">
                  Aksi Perubahan Status {logSortField === "status" && (logSortOrder === "desc" ? "↓" : "↑")}
                </th>
                <th className="py-3 px-4 text-right">Dipindahkan Oleh (User)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ledger">
              {processedAuditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-sky-50/40 transition-colors">
                  <td className="py-3 px-4 text-ink/60 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-3 px-4 font-bold text-ink whitespace-nowrap">
                    <span className="text-sky-600">#{log.caseId}</span> &middot; {log.caseName}
                  </td>
                  <td className="py-3 px-4 text-ink font-sans leading-snug">
                    <span className="inline-block border border-sky-300 bg-sky-50 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-sky-900 mr-2">
                      {log.typeBadge}
                    </span>
                    <span>{log.action}</span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 border border-sky-300 bg-sky-50/80 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-sky-900 shadow-[1px_1px_0_0_#0284c7]">
                      <User className="size-3 text-sky-600" />
                      {log.byUsername}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* DEDICATED POPUP MODAL: HIGH-RESOLUTION DOCUMENT PROOF VIEWER */}
      {showProofViewerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/75 backdrop-blur-md p-4 animate-[fade-up_0.2s_ease-out]">
          <div className="relative w-full max-w-4xl border-2 border-ink bg-white p-6 sm:p-8 shadow-[12px_12px_0_0_#0284c7] max-h-[92vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b-2 border-ink pb-4">
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center bg-sky-600 text-white shadow-[2px_2px_0_0_#121212]">
                  <FileCheck className="size-5" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 block leading-none">
                    BUKTI FISIK PENDAMPINGAN ADVOKASI
                  </span>
                  <h3 className="font-display text-xl font-black text-ink mt-0.5">
                    Kasus #{showProofViewerModal.id} &middot; {showProofViewerModal.name} ({showProofViewerModal.rw})
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setShowProofViewerModal(null)}
                className="grid size-9 place-items-center border-2 border-ink bg-paper text-ink hover:bg-signal hover:text-white transition-colors cursor-pointer shadow-[2px_2px_0_0_#121212]"
              >
                <X className="size-5" strokeWidth={2.5} />
              </button>
            </div>

            {/* TWO COLUMN LAYOUT: LEFT = INFO, RIGHT = PHOTO PREVIEW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LEFT: Case Summary Info */}
              <div className="space-y-3 font-mono text-xs">
                <div className="font-bold text-[10px] uppercase tracking-widest text-sky-600 border-b border-ink/10 pb-2">
                  📋 RINGKASAN DATA SUBJEK
                </div>
                <div className="space-y-2 text-ink">
                  <div className="flex justify-between border-b border-ledger pb-1">
                    <span className="text-ink/60 uppercase text-[10px]">ID Subjek</span>
                    <span className="font-bold">#{showProofViewerModal.id}</span>
                  </div>
                  <div className="flex justify-between border-b border-ledger pb-1">
                    <span className="text-ink/60 uppercase text-[10px]">Nama</span>
                    <span className="font-bold">{showProofViewerModal.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-ledger pb-1">
                    <span className="text-ink/60 uppercase text-[10px]">Wilayah</span>
                    <span className="font-bold">{showProofViewerModal.rw}</span>
                  </div>
                  {showProofViewerModal.kategoriAlasan && (
                    <div className="flex justify-between border-b border-ledger pb-1">
                      <span className="text-ink/60 uppercase text-[10px]">Kategori</span>
                      <span className="font-bold text-right max-w-[60%]">{showProofViewerModal.kategoriAlasan}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-ledger pb-1">
                    <span className="text-ink/60 uppercase text-[10px]">Status Advokasi</span>
                    <span className="font-bold text-sky-600">{showProofViewerModal.statusDokumen || "Terverifikasi PKBM"}</span>
                  </div>
                  <div className="flex justify-between border-b border-ledger pb-1">
                    <span className="text-ink/60 uppercase text-[10px]">Diverifikasi Oleh</span>
                    <span className="font-bold">{showProofViewerModal.reporter}</span>
                  </div>
                </div>

                {showProofViewerModal.catatanOperator && (
                  <div className="bg-sky-50 border border-sky-200 p-3 mt-2">
                    <div className="text-[9px] font-bold uppercase text-sky-600 mb-1">Catatan Operator:</div>
                    <p className="text-sky-950 text-xs leading-relaxed italic">
                      &ldquo;{showProofViewerModal.catatanOperator}&rdquo;
                    </p>
                  </div>
                )}

                {/* File info row */}
                <div className="bg-paper border border-ink/15 p-3 flex items-center gap-2 font-mono text-[10px]">
                  <FileCheck className="size-4 text-sky-600 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-ink/50 uppercase">Nama File Bukti:</div>
                    <div className="font-bold text-ink truncate">{showProofViewerModal.buktiUrl || "—"}</div>
                  </div>
                  <span className="ml-auto text-sky-600 bg-sky-100 px-2 py-0.5 font-bold uppercase shrink-0">TERVERIFIKASI</span>
                </div>
              </div>

              {/* RIGHT: Photo / Document Preview + Stamp */}
              <div className="space-y-4">
                {/* ── FOTO BUKTI SECTION ── */}
                <div className="space-y-2">
                  <div className="font-mono font-bold text-[10px] uppercase tracking-widest text-sky-600 border-b border-ink/10 pb-2">
                    📸 PRATINJAU BUKTI FOTO / DOKUMEN
                  </div>

                  {showProofViewerModal.buktiUrl ? (
                    <div className="border-2 border-sky-300 bg-[#f4f3ee] overflow-hidden">
                      <div className="bg-sky-600 text-white px-3 py-1.5 font-mono text-[9px] font-bold uppercase flex items-center justify-between">
                        <span>📄 BERKAS BUKTI RUJUKAN PKBM</span>
                        <span className="bg-white/20 px-1.5 py-0.5">
                          {(showProofViewerModal.buktiUrl.startsWith("blob:") || /\.(jpg|jpeg|png|gif|webp)$/i.test(showProofViewerModal.buktiUrl)) ? "GAMBAR" : "DOKUMEN"}
                        </span>
                      </div>

                      {/* Direct use of buktiUrl as src - works for both blob: URLs and server paths */}
                      {(showProofViewerModal.buktiUrl.startsWith("blob:") || /\.(jpg|jpeg|png|gif|webp)$/i.test(showProofViewerModal.buktiUrl)) ? (
                        <div className="p-2 space-y-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={showProofViewerModal.buktiUrl}
                            alt={`Bukti rujukan ${showProofViewerModal.name}`}
                            className="w-full h-auto max-h-52 object-contain border border-ink/20"
                          />
                          <button
                            type="button"
                            onClick={() => setImageLightboxUrl(showProofViewerModal.buktiUrl!)}
                            className="w-full border border-sky-600 bg-white text-sky-700 py-1.5 font-mono text-[9px] font-bold uppercase hover:bg-sky-600 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            🔍 Buka Ukuran Penuh (Lightbox)
                          </button>
                        </div>
                      ) : (
                        <div className="p-6 flex flex-col items-center justify-center gap-3 text-center min-h-[120px]">
                          <FileCheck className="size-10 text-sky-400" />
                          <div className="font-mono text-xs font-bold text-ink">{showProofViewerModal.buktiUrl}</div>
                          <div className="text-[10px] text-ink/60 font-mono uppercase">
                            File PDF / Dokumen — Pratinjau tidak tersedia di browser.
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border border-dashed border-ink/20 bg-paper p-8 text-center text-ink/40 font-mono text-[10px] uppercase">
                      [ Belum ada file bukti yang diunggah ]
                    </div>
                  )}

                  {/* FOTO DOKUMENTASI SELESAI */}
                  {showProofViewerModal.fotoDokumentasiSelesai && (
                    <div className="border-2 border-emerald-300 bg-[#f4f3ee] overflow-hidden">
                      <div className="bg-emerald-600 text-white px-3 py-1.5 font-mono text-[9px] font-bold uppercase">
                        📷 FOTO DOKUMENTASI ANAK BELAJAR DI PKBM
                      </div>
                      {/\.(jpg|jpeg|png|gif|webp)$/i.test(showProofViewerModal.fotoDokumentasiSelesai) ? (
                        <div className="p-2 space-y-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={showProofViewerModal.fotoDokumentasiSelesai.startsWith("blob:") ? showProofViewerModal.fotoDokumentasiSelesai : `/uploads/${showProofViewerModal.fotoDokumentasiSelesai}`}
                            alt={`Dokumentasi ${showProofViewerModal.name} belajar di PKBM`}
                            className="w-full h-auto max-h-52 object-contain border border-ink/20"
                          />
                          <button
                            type="button"
                            onClick={() => setImageLightboxUrl(showProofViewerModal.fotoDokumentasiSelesai!.startsWith("blob:") ? showProofViewerModal.fotoDokumentasiSelesai! : `/uploads/${showProofViewerModal.fotoDokumentasiSelesai!}`)}
                            className="w-full border border-emerald-600 bg-white text-emerald-700 py-1.5 font-mono text-[9px] font-bold uppercase hover:bg-emerald-600 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            🔍 Buka Ukuran Penuh (Lightbox)
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 flex items-center gap-3 min-h-[60px]">
                          <FileCheck className="size-6 text-emerald-400 shrink-0" />
                          <div className="font-mono text-xs font-bold text-ink">{showProofViewerModal.fotoDokumentasiSelesai}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ── STEMPEL DIGITAL SECTION ── */}
                <div className="space-y-2">
                  <div className="font-mono font-bold text-[10px] uppercase tracking-widest text-ink border-b border-ink/10 pb-2">
                    🪪 STEMPEL DIGITAL VERIFIKASI OPERATOR
                  </div>
                  <div className="border-2 border-ink bg-[#f4f3ee] overflow-hidden relative">
                    {/* Decorative VALID watermark */}
                    <div className="absolute -right-6 -bottom-6 opacity-[0.05] font-display text-8xl font-black uppercase tracking-tighter text-ink pointer-events-none select-none">
                      VALID
                    </div>

                    <div className="bg-ink text-paper px-4 py-2 font-mono text-[9px] font-bold uppercase flex items-center gap-2">
                      <ShieldCheck className="size-3.5" />
                      <span>BERKAS ADVOKASI RESMI TERVERIFIKASI</span>
                      <span className="ml-auto bg-sky-500 text-white px-2 py-0.5 text-[8px]">✓ VALID</span>
                    </div>

                    <div className="p-4 space-y-3 font-mono text-[10px] relative z-10">
                      {/* Header stamp row */}
                      <div className="flex items-start justify-between pb-3 border-b border-ink/15">
                        <div>
                          <div className="font-bold text-ink text-xs uppercase">TIM KKN 34 — DUKUH SUTOREJO</div>
                          <div className="text-ink/50 text-[9px] uppercase mt-0.5">Kelurahan Dukuh Sutorejo, Kec. Mulyorejo, Surabaya</div>
                        </div>
                        <div className="grid size-10 place-items-center bg-sky-600 text-white shrink-0 shadow-[2px_2px_0_0_#121212]">
                          <ShieldCheck className="size-5" />
                        </div>
                      </div>

                      {/* Data rows */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px]">
                        <div>
                          <div className="text-ink/50 uppercase text-[8px]">ID KASUS</div>
                          <div className="font-bold text-ink">#{showProofViewerModal.id}</div>
                        </div>
                        <div>
                          <div className="text-ink/50 uppercase text-[8px]">NAMA SUBJEK</div>
                          <div className="font-bold text-ink">{showProofViewerModal.name}</div>
                        </div>
                        <div>
                          <div className="text-ink/50 uppercase text-[8px]">WILAYAH</div>
                          <div className="font-bold text-ink">{showProofViewerModal.rw}</div>
                        </div>
                        <div>
                          <div className="text-ink/50 uppercase text-[8px]">STATUS DOKUMEN</div>
                          <div className="font-bold text-sky-600">{showProofViewerModal.statusDokumen || "Diverifikasi"}</div>
                        </div>
                        {showProofViewerModal.rujukan && (
                          <div className="col-span-2">
                            <div className="text-ink/50 uppercase text-[8px]">LEMBAGA RUJUKAN</div>
                            <div className="font-bold text-ink">{showProofViewerModal.rujukan}</div>
                          </div>
                        )}
                        {showProofViewerModal.kategoriAlasan && (
                          <div className="col-span-2">
                            <div className="text-ink/50 uppercase text-[8px]">KATEGORI ALASAN</div>
                            <div className="font-bold text-ink">{showProofViewerModal.kategoriAlasan}</div>
                          </div>
                        )}
                        <div>
                          <div className="text-ink/50 uppercase text-[8px]">DIVERIFIKASI OLEH</div>
                          <div className="font-bold text-ink">{showProofViewerModal.reporter}</div>
                        </div>
                      </div>

                      {showProofViewerModal.catatanOperator && (
                        <div className="border-t border-ink/15 pt-2">
                          <div className="text-ink/50 uppercase text-[8px] mb-1">CATATAN RESMI OPERATOR:</div>
                          <p className="text-ink/80 italic font-sans text-[10px] leading-relaxed">
                            &ldquo;{showProofViewerModal.catatanOperator}&rdquo;
                          </p>
                        </div>
                      )}

                      {/* Stamp footer */}
                      <div className="border-t border-ink/15 pt-2 flex items-center justify-between text-[9px]">
                        <div className="text-ink/50 uppercase">
                          RADAR ANAK — SISTEM MANAJEMEN ADVOKASI
                        </div>
                        <div className="bg-sky-600 text-white px-2 py-0.5 font-bold uppercase text-[8px]">
                          TERARSIP RESMI
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-ledger pt-4 font-mono text-xs">
              <button
                type="button"
                onClick={() => setShowProofViewerModal(null)}
                className="border-2 border-ink bg-paper px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-ink hover:bg-ink hover:text-paper transition-all cursor-pointer shadow-[3px_3px_0_0_#121212] active:translate-y-px"
              >
                ✕ TUTUP BUKTI FISIK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL: INTERACTIVE VISUAL MAP MARKER PICKER */}
      {showVisualMapPickerModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/80 backdrop-blur-md p-4 animate-[fade-up_0.2s_ease-out]">
          <div className="relative w-full max-w-2xl border-2 border-ink bg-white p-6 shadow-[14px_14px_0_0_#0284c7]">
            <div className="flex items-center justify-between border-b border-ink pb-3 mb-4">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 flex items-center gap-1.5">
                <MapIcon className="size-4" />
                <span>PILIH &amp; GESER MARKER PETA SECARA VISUAL (INTERAKTIF)</span>
              </div>
              <button
                onClick={() => setShowVisualMapPickerModal(false)}
                className="grid size-7 place-items-center border border-ink bg-paper text-ink hover:bg-signal hover:text-white transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {PickerMod ? (
              <PickerMod
                initialLat={verifyForm.lat}
                initialLng={verifyForm.lng}
                onConfirm={(selectedLat, selectedLng) => {
                  setVerifyForm({
                    ...verifyForm,
                    lat: selectedLat,
                    lng: selectedLng,
                  });
                  setShowVisualMapPickerModal(false);
                }}
              />
            ) : (
              <div className="h-[360px] grid place-items-center bg-[#efeee9] font-mono text-xs text-ink/50 uppercase">
                Memuat Peta Interaktif…
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL STEP 1: VERIFIKASI LAPANGAN (`baru` -> `verifikasi`) WITH VISUAL INTERACTIVE MAP PICKER BUTTON */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4 animate-[fade-up_0.2s_ease-out]">
          <div className="relative w-full max-w-5xl border-2 border-ink bg-white p-6 sm:p-8 shadow-[14px_14px_0_0_#0284c7] max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-ink pb-3 mb-4">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 flex items-center gap-1.5">
                <ShieldCheck className="size-4" />
                <span>STEP 1: FORMULIR VERIFIKASI LAPANGAN (DOOR-TO-DOOR) — {activeUsername}</span>
              </div>
              <button onClick={() => setShowVerifyModal(null)} className="grid size-7 place-items-center border border-ink bg-paper text-ink hover:bg-signal hover:text-white transition-colors">
                <X className="size-4" />
              </button>
            </div>

            <p className="text-xs text-ink/70 font-sans mb-6">
              Menggeser kasus <strong>{showVerifyModal.card.name}</strong> ke status <span className="font-bold text-sky-600 uppercase">&ldquo;DIVERIFIKASI&rdquo;</span>. Lengkapi semua data dari hasil survei lapangan door-to-door, lalu atur titik marker lokasi di peta interaktif.
            </p>

            <form onSubmit={handleVerifySubmit} className="font-mono text-xs">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* COLUMN LEFT: ORIGINAL REPORT RECAP + URGENT FLAG */}
                <div className="space-y-4">
                  {/* Original Report Recap */}
                  <div className="bg-[#f7f6f0] border border-ink/20 p-4 space-y-3">
                    <div className="font-mono text-[10px] font-bold text-sky-950 uppercase border-b border-ink/10 pb-2 flex items-center gap-1.5">
                      📋 DATA LAPORAN AWAL DARI PELAPOR:
                    </div>
                    <div className="space-y-1.5 text-ink text-xs">
                      <div><strong>NAMA AWAL:</strong> {showVerifyModal.card.name}</div>
                      <div><strong>USIA:</strong> {showVerifyModal.card.age}</div>
                      <div><strong>WILAYAH:</strong> {showVerifyModal.card.rw}</div>
                      <div><strong>CATATAN AWAL:</strong> {showVerifyModal.card.note}</div>
                      {showVerifyModal.card.reporter && (
                        <div><strong>DILAPORKAN OLEH:</strong> {showVerifyModal.card.reporter} {showVerifyModal.card.phone && `(${showVerifyModal.card.phone})`}</div>
                      )}
                    </div>
                  </div>

                  {/* Nama Anak */}
                  <div className="border-2 border-sky-600 bg-sky-50 p-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-sky-950 flex items-center gap-1">
                      ✏️ Nama Lengkap Subjek Anak (Koreksi Hasil Survei) *
                    </label>
                    <input
                      type="text"
                      required
                      value={verifyForm.name}
                      onChange={(e) => setVerifyForm({ ...verifyForm, name: e.target.value })}
                      placeholder="Ketik/koreksi nama lengkap asli anak..."
                      className="w-full border border-ink bg-white p-2.5 text-xs text-ink font-bold focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>

                  {/* Kategori Alasan */}
                  <div className="border-2 border-amber-500 bg-amber-50 p-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-amber-950 flex items-center gap-1">
                      🏷️ Kategori Alasan Putus Sekolah * (Untuk Grafik Transparansi)
                    </label>
                    <select
                      value={verifyForm.kategoriAlasan}
                      onChange={(e) => setVerifyForm({ ...verifyForm, kategoriAlasan: e.target.value })}
                      className="w-full border border-ink bg-white p-2.5 text-xs text-ink font-bold focus:outline-none focus:ring-2 focus:ring-amber-600 cursor-pointer"
                    >
                      {KATEGORI_ALASAN_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Urgent Flag */}
                  <div className="flex items-center gap-2 p-3 border border-signal/30 bg-signal/5">
                    <input
                      type="checkbox"
                      id="chkUrgent"
                      checked={verifyForm.urgent}
                      onChange={(e) => setVerifyForm({ ...verifyForm, urgent: e.target.checked })}
                      className="size-4 text-signal cursor-pointer"
                    />
                    <label htmlFor="chkUrgent" className="font-mono text-xs font-bold text-signal uppercase cursor-pointer flex items-center gap-1">
                      <Flag className="size-3.5" /> Tandai Kasus Sebagai Prioritas Tinggi (Urgent)
                    </label>
                  </div>
                </div>

                {/* COLUMN RIGHT: VERIFIED DATA FROM DOOR-TO-DOOR */}
                <div className="space-y-4">
                  {/* NIK & Status Dokumen */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-ink/70">
                        NIK Subjek Anak (16 Digit) *
                      </label>
                      <input
                        type="text"
                        required
                        value={verifyForm.nik}
                        onChange={(e) => setVerifyForm({ ...verifyForm, nik: e.target.value })}
                        placeholder="317408..."
                        className="w-full border border-ink bg-paper p-2.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-sky-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-ink/70">
                        Status Dokumen Kependudukan *
                      </label>
                      <input
                        type="text"
                        required
                        value={verifyForm.statusDokumen}
                        onChange={(e) => setVerifyForm({ ...verifyForm, statusDokumen: e.target.value })}
                        placeholder="Dokumen Kependudukan Lengkap"
                        className="w-full border border-ink bg-paper p-2.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-sky-600"
                      />
                    </div>
                  </div>

                  {/* Wali & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-ink/70">
                        Nama Orang Tua / Wali *
                      </label>
                      <input
                        type="text"
                        required
                        value={verifyForm.parent}
                        onChange={(e) => setVerifyForm({ ...verifyForm, parent: e.target.value })}
                        placeholder="Nama Orang Tua Kandung"
                        className="w-full border border-ink bg-paper p-2.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-sky-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-ink/70">
                        Nomor WhatsApp / Telepon Wali *
                      </label>
                      <input
                        type="tel"
                        required
                        value={verifyForm.phone}
                        onChange={(e) => setVerifyForm({ ...verifyForm, phone: e.target.value })}
                        placeholder="0812-3456-7890"
                        className="w-full border border-ink bg-paper p-2.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-sky-600"
                      />
                    </div>
                  </div>

                  {/* Alamat */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-ink/70">
                      Alamat Rumah RT/RW Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={verifyForm.address}
                      onChange={(e) => setVerifyForm({ ...verifyForm, address: e.target.value })}
                      placeholder="RT 02 / RW 04 No. 12, Dukuh Sutorejo, Mulyorejo, Surabaya"
                      className="w-full border border-ink bg-paper p-2.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>

                  {/* OPERATOR VISUAL INTERACTIVE MAP MARKER PICKER BUTTON */}
                  <div className="border-2 border-sky-600 bg-sky-50 p-4 space-y-2">
                    <div className="font-bold text-sky-950 text-[10px] uppercase flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-4 text-sky-600" /> POSISI MARKER PETA PUBLIK
                      </span>
                      <span className="bg-sky-600 text-white px-2 py-0.5 text-[9px] font-bold uppercase">
                        VISUAL MAP PICKER
                      </span>
                    </div>

                    <div className="bg-white p-2.5 border border-sky-300 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-[9px] text-ink/50 uppercase block">KOORDINAT SAAT INI:</span>
                        <span className="font-extrabold text-sky-950">
                          {verifyForm.lat.toFixed(6)}, {verifyForm.lng.toFixed(6)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowVisualMapPickerModal(true)}
                        className="border border-sky-600 bg-sky-600 text-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider shadow-[2px_2px_0_0_#121212] hover:bg-ink transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                      >
                        <MapIcon className="size-3.5" />
                        <span>📍 ATUR / GESER DI PETA</span>
                      </button>
                    </div>

                    <div className="text-[9px] text-sky-800 italic leading-tight">
                      * Klik tombol di atas untuk membuka peta interaktif. Operator cukup menggeser pin merah di peta tanpa perlu mengetik angka koordinat!
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-ledger pt-4">
                <button type="button" onClick={() => setShowVerifyModal(null)} className="border border-ink bg-paper px-4 py-2 font-bold uppercase text-ink">
                  Batal
                </button>
                <button type="submit" className="border border-ink bg-sky-600 px-6 py-2 font-bold uppercase text-white shadow-[2px_2px_0_0_#121212] hover:bg-ink">
                  Simpan Verifikasi Lapangan ({activeUsername})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL STEP 2: RUJUKAN & UPLOAD BUKTI (`verifikasi` -> `rujuk`) - ENLARGED LEGA LAYOUT */}
      {showProofModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4 animate-[fade-up_0.2s_ease-out]">
          <div className="relative w-full max-w-4xl border-2 border-ink bg-white p-6 sm:p-8 shadow-[14px_14px_0_0_#0284c7] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-ink pb-3 mb-4">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 flex items-center gap-1.5">
                <FileUp className="size-4" />
                <span>STEP 2: FORMULIR TRANSISI STATUS DIRUJUK PKBM &amp; BUKTI FISIK ({activeUsername})</span>
              </div>
              <button onClick={() => setShowProofModal(null)} className="grid size-7 place-items-center border border-ink bg-paper text-ink hover:bg-signal hover:text-white transition-colors">
                <X className="size-4" />
              </button>
            </div>

            <p className="text-xs text-ink/70 font-sans mb-6">
              Menggeser kasus <strong>{showProofModal.card.name}</strong> ({showProofModal.card.rw}) ke status <span className="font-bold text-sky-600 uppercase">&ldquo;DIRUJUK PKBM&rdquo;</span>. Lengkapi data instansi rujukan, berkas bukti pendaftaran, dan catatan pendampingan operator.
            </p>

            <form onSubmit={handleProofSubmit} className="space-y-6 font-mono text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* COLUMN LEFT: CHILD VERIFIED RECAP DATA */}
                <div className="bg-[#f7f6f0] p-4 border border-ink/20 space-y-3">
                  <div className="font-mono text-[10px] font-bold text-sky-950 uppercase border-b border-ink/10 pb-2">
                    📋 REKAP DATA TERVERIFIKASI SUBJEK:
                  </div>
                  <div className="space-y-1.5 text-ink text-xs">
                    <div><strong>NAMA:</strong> {showProofModal.card.name}</div>
                    <div><strong>USIA:</strong> {showProofModal.card.age}</div>
                    <div><strong>WILAYAH:</strong> {showProofModal.card.rw}</div>
                    <div><strong>WALI:</strong> {showProofModal.card.parent || "Terverifikasi Door-to-Door"}</div>
                    <div><strong>NO. WA:</strong> {showProofModal.card.phone || "-"}</div>
                    {showProofModal.card.address && (
                      <div><strong>ALAMAT:</strong> {showProofModal.card.address}</div>
                    )}
                  </div>
                </div>

                {/* COLUMN RIGHT: FORM INPUTS FOR PKBM & FILE UPLOAD */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-ink/70">
                      Alur Rujukan &amp; Nama Instansi PKBM *
                    </label>
                    <input
                      type="text"
                      required
                      value={proofRujukan}
                      onChange={(e) => setProofRujukan(e.target.value)}
                      placeholder="Contoh: Dirujuk ke PKBM Negeri 01 Gelombang II"
                      className="w-full border border-ink bg-paper p-2.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-ink/70">
                      Unggah Lampiran File Bukti Rujukan (Foto / Scan Formulir) *
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Revoke old object URL to avoid memory leak
                          if (proofFile?.objectUrl) URL.revokeObjectURL(proofFile.objectUrl);
                          setProofFile({ name: file.name, objectUrl: URL.createObjectURL(file) });
                        }
                      }}
                      className="w-full border border-ink bg-paper p-2 text-xs text-ink cursor-pointer"
                    />
                    {proofFile && (
                      <div className="mt-1 font-mono text-[10px] text-sky-600 font-bold flex items-center gap-1.5">
                        ✓ File Terpilih: {proofFile.name}
                        {/\.(jpg|jpeg|png|gif|webp)$/i.test(proofFile.name) && (
                          <span className="bg-sky-100 text-sky-700 px-1.5 py-0.5 text-[8px] uppercase">GAMBAR — PRATINJAU TERSEDIA</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-ink/70">
                      Catatan Ringkas Pendampingan Operator *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={proofCatatan}
                      onChange={(e) => setProofCatatan(e.target.value)}
                      placeholder="Contoh: Berkas formulir pendaftaran PKBM Negeri 01 telah disetujui pengelola &amp; diajukan."
                      className="w-full border border-ink bg-paper p-2.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-ledger pt-4">
                <button type="button" onClick={() => setShowProofModal(null)} className="border border-ink bg-paper px-4 py-2 font-bold uppercase text-ink">
                  Batal
                </button>
                <button type="submit" className="border border-ink bg-sky-600 px-6 py-2 font-bold uppercase text-white shadow-[2px_2px_0_0_#121212] hover:bg-ink">
                  Simpan Status Rujukan PKBM ({activeUsername})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL STEP 3: FRIENDLY CASE CLOSURE (`rujuk` -> `selesai`) WITH OPTIONAL LEARNING PHOTO */}
      {showSelesaiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4 animate-[fade-up_0.2s_ease-out]">
          <div className="relative w-full max-w-lg border-2 border-ink bg-white p-6 sm:p-8 shadow-[12px_12px_0_0_#059669]">
            <div className="flex items-center justify-between border-b border-ink pb-3 mb-4">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="size-4" />
                <span>STEP 3: PENUTUPAN ADVOKASI — ANAK KEMBALI SEKOLAH ({activeUsername})</span>
              </div>
              <button onClick={() => setShowSelesaiModal(null)} className="grid size-7 place-items-center border border-ink bg-paper text-ink">
                <X className="size-4" />
              </button>
            </div>

            <p className="text-xs text-ink/70 font-sans mb-4 leading-relaxed">
              Selamat! Kasus <strong>{showSelesaiModal.card.name}</strong> akan ditutup karena anak telah resmi kembali belajar di sekolah / PKBM.
            </p>

            <form onSubmit={handleSelesaiSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-ink/70 flex items-center gap-1">
                  <ImageIcon className="size-3.5 text-emerald-600" /> Foto Dokumentasi Anak Kembali Belajar / Sekolah (Opsional)
                </label>
                <input
                  type="file"
                  onChange={(e) => setFotoBelajar(e.target.files?.[0]?.name || "foto_anak_belajar_pkbm.jpg")}
                  className="w-full border border-ink bg-paper p-2 text-xs text-ink cursor-pointer"
                />
                {fotoBelajar && (
                  <div className="mt-1 font-mono text-[10px] text-emerald-600 font-bold">
                    ✓ Foto Terpilih: {fotoBelajar}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-ink/70">
                  Catatan Penutupan Kasus &amp; Ringkasan Keberhasilan Advokasi *
                </label>
                <textarea
                  rows={3}
                  required
                  value={catatanSelesai}
                  onChange={(e) => setCatatanSelesai(e.target.value)}
                  placeholder="Contoh: Anak telah aktif kembali belajar di PKBM Negeri 01 sejak 15 Juli 2026."
                  className="w-full border border-ink bg-paper p-2.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-ledger pt-4">
                <button type="button" onClick={() => setShowSelesaiModal(null)} className="border border-ink bg-paper px-4 py-2 font-bold uppercase text-ink">
                  Batal
                </button>
                <button type="submit" className="border border-ink bg-emerald-600 px-6 py-2 font-bold uppercase text-white shadow-[2px_2px_0_0_#121212] hover:bg-ink">
                  Selesaikan Advokasi Kasus ({activeUsername})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL OUTCOME B: ADVOKASI DITUTUP (PENOLAKAN SUBJEK / KELUARGA) */}
      {showDitutupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4 animate-[fade-up_0.2s_ease-out]">
          <div className="relative w-full max-w-xl border-2 border-ink bg-white p-6 sm:p-8 shadow-[12px_12px_0_0_#e11d48]">
            <div className="flex items-center justify-between border-b border-ink pb-3 mb-4">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-rose-600 flex items-center gap-1.5">
                <AlertTriangle className="size-4" />
                <span>OUTCOME B: ARSIP ADVOKASI DITUTUP ({activeUsername})</span>
              </div>
              <button onClick={() => setShowDitutupModal(null)} className="grid size-7 place-items-center border border-ink bg-paper text-ink hover:bg-signal hover:text-white transition-colors">
                <X className="size-4" />
              </button>
            </div>

            <p className="text-xs text-ink/70 font-sans mb-4">
              Kasus <strong>{showDitutupModal.card.name}</strong> ({showDitutupModal.card.rw}) akan diarsipkan ke sektor <span className="font-bold text-rose-600 uppercase">&ldquo;ADVOKASI DITUTUP (PENOLAKAN)&rdquo;</span>.
            </p>

            <form onSubmit={handleDitutupSubmit} className="space-y-4 font-mono text-xs">
              <div className="border-2 border-rose-600 bg-rose-50 p-4 space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-rose-950 flex items-center gap-1">
                  📝 Alasan Utama Advokasi Ditutup / Catatan Mediasi Terakhir *
                </label>
                <textarea
                  rows={4}
                  required
                  value={alasanDitutupText}
                  onChange={(e) => setAlasanDitutupText(e.target.value)}
                  placeholder="Jelaskan hasil mediasi/pelatihan (misal: Telah dilakukan 3x mediasi &amp; konseling motivasi oleh Tim KKN 34, namun anak dan keluarga memutuskan untuk bekerja penuh membantu usaha toko kelontong orang tua)..."
                  className="w-full border border-ink bg-white p-3 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-ledger pt-4">
                <button type="button" onClick={() => setShowDitutupModal(null)} className="border border-ink bg-paper px-4 py-2 font-bold uppercase text-ink">
                  Batal
                </button>
                <button type="submit" className="border border-ink bg-rose-600 px-6 py-2 font-bold uppercase text-white shadow-[2px_2px_0_0_#121212] hover:bg-ink">
                  Simpan &amp; Arsipkan Penolakan ({activeUsername})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH KASUS BARU */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4 animate-[fade-up_0.2s_ease-out]">
          <div className="relative w-full max-w-xl border-2 border-ink bg-white p-6 sm:p-8 shadow-[12px_12px_0_0_#121212] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-ink pb-4 mb-6">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600">
                INPUT KASUS LAPANGAN BARU (STATUS: BARU DILAPORKAN)
              </div>
              <button onClick={() => setShowAddModal(false)} className="grid size-8 place-items-center border border-ink bg-paper text-ink hover:bg-signal hover:text-white transition-colors">
                <X className="size-4" strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={handleCreateCaseSubmit} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-ink/70">
                    Nama Subjek Anak *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCase.name}
                    onChange={(e) => setNewCase({ ...newCase, name: e.target.value })}
                    placeholder="Nama / Inisial Subjek"
                    className="w-full border border-ink bg-paper p-2.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-ink/70">
                    Wilayah RW *
                  </label>
                  <select
                    value={newCase.rw}
                    onChange={(e) => setNewCase({ ...newCase, rw: e.target.value })}
                    className="w-full border border-ink bg-paper p-2.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-sky-600"
                  >
                    <option value="RW 03">RW 03 Dukuh Sutorejo</option>
                    <option value="RW 04">RW 04 Sutorejo Utara</option>
                    <option value="RW 07">RW 07 Sutorejo Indah</option>
                    <option value="RW 09">RW 09 Mulyorejo Permai</option>
                    <option value="RW 12">RW 12 Kalijudan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-ink/70">
                  Catatan Laporan Lapangan / Alasan Putus Sekolah *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newCase.note}
                  onChange={(e) => setNewCase({ ...newCase, note: e.target.value })}
                  placeholder="Jelaskan kondisi perundungan/biaya/ijazah..."
                  className="w-full border border-ink bg-paper p-2.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-ledger pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="border border-ink bg-paper px-4 py-2 font-bold uppercase text-ink hover:bg-ink hover:text-paper">
                  Batal
                </button>
                <button type="submit" className="border border-ink bg-sky-600 px-6 py-2 font-bold uppercase text-white shadow-[2px_2px_0_0_#121212] hover:bg-ink">
                  Simpan Laporan Baru ({activeUsername})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HAPUS LAPORAN PALSU */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4 animate-[fade-up_0.2s_ease-out]">
          <div className="relative w-full max-w-md border-2 border-ink bg-white p-6 shadow-[12px_12px_0_0_#0284c7]">
            <div className="flex items-center gap-2 text-sky-600 font-mono text-[10px] font-bold uppercase tracking-widest mb-3">
              <AlertTriangle className="size-5" /> HAPUS LAPORAN PALSU / TIDAK VALID
            </div>
            <h3 className="font-display text-xl font-black text-ink mb-2">
              Hapus Kasus #{showDeleteModal.id} ({showDeleteModal.name})?
            </h3>
            <p className="text-xs text-ink/70 font-sans mb-6">
              Tindakan ini akan menghapus data kasus secara permanen dari sistem dan mencatat audit oleh <strong>{activeUsername}</strong>.
            </p>
            <div className="flex justify-end gap-3 border-t border-ledger pt-4">
              <button onClick={() => setShowDeleteModal(null)} className="border border-ink bg-paper px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-ink">
                Batal
              </button>
              <button onClick={() => handleDeleteCase(showDeleteModal.id, showDeleteModal.name, showDeleteModal.dbUuid)} className="border border-ink bg-sky-600 px-5 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-white shadow-[2px_2px_0_0_#121212] hover:bg-ink">
                Ya, Hapus Permanen ({activeUsername})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETAIL RESMI DOSSIER OPERATOR */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4 animate-[fade-up_0.2s_ease-out]">
          <div className="relative w-full max-w-3xl border-2 border-ink bg-white p-6 sm:p-8 shadow-[12px_12px_0_0_#0284c7] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-ink pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="grid size-7 place-items-center bg-sky-600 text-white">
                  <FileText className="size-4" strokeWidth={2.5} />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 block leading-none">
                    BERKAS ADVOKASI RESMI OPERATOR
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-ink/50">
                    ID ARSIP: #{selectedCard.id} &middot; {selectedCard.rw}
                  </span>
                </div>
              </div>

              <button onClick={() => setSelectedCard(null)} className="grid size-8 place-items-center border border-ink bg-paper text-ink hover:bg-signal hover:text-white transition-colors cursor-pointer">
                <X className="size-4" strokeWidth={2.5} />
              </button>
            </div>

            <div className="space-y-4 font-sans text-xs">
              <div className="bg-[#efeee9] p-4 border border-ink/15 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-ink/50">
                      Nama Subjek Anak
                    </div>
                    <div className="font-display text-2xl font-black text-ink">
                      {selectedCard.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedCard.urgent && (
                      <span className="bg-signal text-white px-2 py-0.5 font-mono text-[9px] font-bold uppercase">
                        Prioritas Tinggi
                      </span>
                    )}
                    <span className="bg-ink text-paper px-2 py-1 font-mono text-[10px] font-bold">
                      {selectedCard.age}
                    </span>
                  </div>
                </div>

                {selectedCard.nik && (
                  <div className="grid grid-cols-2 gap-4 border-t border-ink/10 pt-3 mt-2 font-mono text-[10px] uppercase">
                    <div>
                      <span className="text-ink/50 block">NIK Subjek:</span>
                      <span className="font-bold text-ink">{selectedCard.nik}</span>
                    </div>
                    <div>
                      <span className="text-ink/50 block">Orang Tua / Wali:</span>
                      <span className="font-bold text-ink">{selectedCard.parent}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border border-ink/15 bg-paper p-3 font-mono text-[10px] uppercase">
                <span className="font-bold text-ink/70">PRIORITAS PENANGANAN:</span>
                <button
                  onClick={() => toggleCardUrgent(selectedCard)}
                  className={`inline-flex items-center gap-1.5 border px-3 py-1 font-bold tracking-wider cursor-pointer ${
                    selectedCard.urgent
                      ? "bg-signal text-white border-signal"
                      : "bg-white text-ink border-ink hover:bg-ink hover:text-paper"
                  }`}
                >
                  <Flag className="size-3" />
                  <span>{selectedCard.urgent ? "PRIORITAS TINGGI (URGENT)" : "+ TANDAI PRIORITAS"}</span>
                </button>
              </div>

              {selectedCard.kategoriAlasan && (
                <div className="border-l-4 border-amber-500 bg-amber-50 p-3 font-mono text-[10px] uppercase">
                  <span className="font-bold text-amber-900 block">Kategori Utama Alasan Putus Sekolah:</span>
                  <span className="text-ink font-bold">{selectedCard.kategoriAlasan}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-ink/15 p-3 bg-paper">
                  <div className="font-mono text-[9px] uppercase tracking-widest text-ink/50 flex items-center gap-1 mb-1">
                    <Home className="size-3 text-sky-600" /> Alamat Rumah Lengkap
                  </div>
                  <div className="font-semibold text-ink">{selectedCard.address || "RT/RW Belum Diverifikasi"}</div>
                </div>

                <div className="border border-ink/15 p-3 bg-paper">
                  <div className="font-mono text-[9px] uppercase tracking-widest text-ink/50 flex items-center gap-1 mb-1">
                    <Phone className="size-3 text-sky-600" /> Kontak Wali / Pelapor
                  </div>
                  <div className="font-mono font-bold text-ink">
                    {selectedCard.parent ? `${selectedCard.parent} — ` : ""}
                    {selectedCard.phone || "Tidak Ada Telepon"}
                  </div>
                </div>
              </div>

              {selectedCard.lat && selectedCard.lng && (
                <div className="border border-emerald-300 bg-emerald-50 p-3 font-mono text-[10px] uppercase flex items-center justify-between">
                  <span className="font-bold text-emerald-900 flex items-center gap-1">
                    <MapPin className="size-3.5 text-emerald-600" /> KOORDINAT TERPASANG DI PETA:
                  </span>
                  <span className="font-bold text-emerald-950">{selectedCard.lat.toFixed(6)}, {selectedCard.lng.toFixed(6)}</span>
                </div>
              )}

              {selectedCard.statusDokumen && (
                <div className="border-l-4 border-sky-600 bg-sky-50 p-3 font-mono text-[10px] uppercase">
                  <span className="font-bold text-sky-900 block">Status Dokumen Kependudukan:</span>
                  <span className="text-ink">{selectedCard.statusDokumen}</span>
                </div>
              )}

              <div>
                <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink/60 mb-1">
                  Catatan Laporan Lapangan:
                </div>
                <p className="bg-paper p-3 border border-ink/10 text-ink/80 leading-relaxed font-medium">
                  &ldquo;{selectedCard.note}&rdquo;
                </p>
              </div>

              {selectedCard.rujukan && (
                <div className="border-l-4 border-sky-600 bg-sky-500/10 p-3">
                  <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-sky-600 mb-1">
                    Rujukan &amp; Alur Tindak Lanjut:
                  </div>
                  <div className="font-semibold text-ink">{selectedCard.rujukan}</div>
                </div>
              )}

              {selectedCard.fotoDokumentasiSelesai && (
                <div className="border-2 border-emerald-300 bg-[#f4f3ee] overflow-hidden font-mono text-xs">
                  <div className="bg-emerald-600 text-white px-3 py-1.5 font-bold uppercase text-[9px] flex items-center justify-between">
                    <span>📷 FOTO DOKUMENTASI ANAK BELAJAR DI PKBM</span>
                    <button
                      type="button"
                      onClick={() => setShowProofViewerModal(selectedCard)}
                      className="border border-white/40 bg-white/20 text-white px-2 py-0.5 text-[8px] font-bold uppercase hover:bg-white hover:text-emerald-900 cursor-pointer transition-colors"
                    >
                      👁️ LIHAT PENUH
                    </button>
                  </div>
                  {/\.(jpg|jpeg|png|gif|webp)$/i.test(selectedCard.fotoDokumentasiSelesai) ? (
                    <div className="p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/uploads/${selectedCard.fotoDokumentasiSelesai}`}
                        alt={`Dokumentasi ${selectedCard.name} belajar di PKBM`}
                        className="w-full h-auto max-h-48 object-contain border border-ink/10"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                          (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "flex";
                        }}
                      />
                      <div className="hidden items-center justify-center h-24 bg-ink/5 font-mono text-[10px] text-ink/50 uppercase">
                        [ Pratinjau tidak tersedia: {selectedCard.fotoDokumentasiSelesai} ]
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 flex items-center gap-2">
                      <FileCheck className="size-5 text-emerald-400 shrink-0" />
                      <span className="font-bold text-ink text-[11px]">{selectedCard.fotoDokumentasiSelesai}</span>
                    </div>
                  )}
                </div>
              )}

              {selectedCard.alasanDitutup && (
                <div className="border-l-4 border-rose-600 bg-rose-50 p-4 font-mono text-xs space-y-1">
                  <div className="font-bold text-rose-950 uppercase flex items-center gap-1.5">
                    <AlertTriangle className="size-4 text-rose-600" />
                    <span>ALASAN UTAMA ADVOKASI DITUTUP / CATATAN MEDIASI TERAKHIR:</span>
                  </div>
                  <p className="text-rose-900 font-medium leading-relaxed font-sans text-xs">
                    &ldquo;{selectedCard.alasanDitutup}&rdquo;
                  </p>
                </div>
              )}

              {/* ─── BUKTI FISIK FOTO SECTION ─── */}
              {selectedCard.buktiUrl && (
                <div className="border-2 border-sky-300 bg-[#f4f3ee] overflow-hidden font-mono text-xs">
                  <div className="bg-sky-600 text-white px-3 py-2 font-bold uppercase text-[9px] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileCheck className="size-3.5" /> PRATINJAU BUKTI FOTO / DOKUMEN RUJUKAN PKBM
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowProofViewerModal(selectedCard)}
                      className="border border-white/40 bg-white/20 text-white px-2 py-0.5 text-[8px] font-bold uppercase hover:bg-white hover:text-sky-900 cursor-pointer transition-colors"
                    >
                      📋 DETAIL PENUH
                    </button>
                  </div>
                  {/* File name & info row */}
                  <div className="px-3 py-2 bg-white border-b border-sky-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileCheck className="size-3.5 text-sky-600 shrink-0" />
                      <span className="text-[10px] font-bold text-ink truncate">
                        {/* Show original filename if it's an object URL, otherwise show buktiUrl directly */}
                        {selectedCard.buktiUrl.startsWith("blob:") ? "Foto yang diunggah (sesi ini)" : selectedCard.buktiUrl}
                      </span>
                    </div>
                    <span className="text-[8px] bg-sky-100 text-sky-700 px-2 py-0.5 font-bold uppercase shrink-0">TERVERIFIKASI</span>
                  </div>
                  {/* Preview area - only show button, no inline thumbnail */}
                  <div className="p-4 flex items-center justify-center gap-4">
                    {(/\.(jpg|jpeg|png|gif|webp)$/i.test(selectedCard.buktiUrl) || selectedCard.buktiUrl.startsWith("blob:")) ? (
                      <button
                        type="button"
                        onClick={() => setImageLightboxUrl(selectedCard.buktiUrl!)}
                        className="flex items-center gap-2 border-2 border-sky-600 bg-white text-sky-700 px-4 py-2.5 font-mono text-[10px] font-bold uppercase hover:bg-sky-600 hover:text-white transition-all cursor-pointer shadow-[2px_2px_0_0_#0284c7]"
                      >
                        🔍 Tampilkan Pratinjau Foto (Ukuran Maksimal)
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-ink/50 font-mono text-[10px] uppercase">
                        <FileCheck className="size-5 text-sky-300" />
                        <span>File PDF / Dokumen — Klik &ldquo;Detail Penuh&rdquo; untuk melihat</span>
                      </div>
                    )}
                  </div>
                  {selectedCard.catatanOperator && (
                    <div className="px-3 pb-3">
                      <p className="text-ink/80 font-sans text-xs italic bg-white p-2 border border-sky-100">
                        &ldquo;{selectedCard.catatanOperator}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ─── STEMPEL DIGITAL VERIFIKASI OPERATOR SECTION ─── */}
              {(selectedCard.buktiUrl || selectedCard.statusDokumen) && (
                <div className="border-2 border-ink bg-[#f4f3ee] overflow-hidden font-mono text-xs">
                  <div className="bg-ink text-paper px-3 py-2 font-bold uppercase text-[9px] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5" /> STEMPEL DIGITAL VERIFIKASI OPERATOR
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowProofViewerModal(selectedCard)}
                      className="border border-paper/40 bg-paper/20 text-paper px-2 py-0.5 text-[8px] font-bold uppercase hover:bg-paper hover:text-ink cursor-pointer transition-colors"
                    >
                      📋 LIHAT PENUH
                    </button>
                  </div>
                  {/* Stamp card content */}
                  <div className="p-4 relative overflow-hidden">
                    {/* Watermark VALID */}
                    <div className="absolute -right-4 -bottom-4 opacity-[0.06] font-display text-7xl font-black uppercase tracking-tighter text-ink pointer-events-none select-none">
                      VALID
                    </div>
                    <div className="space-y-2 text-[10px] relative z-10">
                      <div className="flex items-center gap-2 border-b border-ink/10 pb-2">
                        <div className="grid size-6 place-items-center bg-sky-600 text-white shrink-0">
                          <ShieldCheck className="size-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-ink text-xs">BERKAS ADVOKASI RESMI TERVERIFIKASI</div>
                          <div className="text-ink/50 text-[9px] uppercase">Tim KKN 34 — Kelurahan Dukuh Sutorejo</div>
                        </div>
                        <div className="ml-auto bg-sky-600 text-white px-2 py-0.5 text-[8px] font-bold uppercase shrink-0">
                          ✓ VALID
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                        <div><span className="text-ink/50">ID KASUS:</span> <strong>#{selectedCard.id}</strong></div>
                        <div><span className="text-ink/50">WILAYAH:</span> <strong>{selectedCard.rw}</strong></div>
                        <div><span className="text-ink/50">SUBJEK:</span> <strong>{selectedCard.name}</strong></div>
                        <div><span className="text-ink/50">STATUS:</span> <strong className="text-sky-600">{selectedCard.statusDokumen || "Diverifikasi"}</strong></div>
                        {selectedCard.rujukan && (
                          <div className="col-span-2"><span className="text-ink/50">RUJUKAN:</span> <strong>{selectedCard.rujukan}</strong></div>
                        )}
                        <div><span className="text-ink/50">OPERATOR:</span> <strong>{selectedCard.reporter}</strong></div>
                        {selectedCard.verifiedAt && (
                          <div><span className="text-ink/50">TGL VERIFIKASI:</span> <strong>{new Date(selectedCard.verifiedAt).toLocaleDateString("id-ID")}</strong></div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-white border-t border-ink/10 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setShowProofViewerModal(selectedCard)}
                      className="flex items-center gap-2 border border-ink bg-paper text-ink px-4 py-2 font-mono text-[10px] font-bold uppercase hover:bg-ink hover:text-paper transition-all cursor-pointer shadow-[2px_2px_0_0_#121212]"
                    >
                      🪪 Tampilkan Stempel Digital Ukuran Penuh
                    </button>
                  </div>
                </div>
              )}

              {/* FOTO DOKUMENTASI SELESAI - button based, no inline thumbnail */}
              {selectedCard.fotoDokumentasiSelesai && (
                <div className="border-2 border-emerald-300 bg-[#f4f3ee] overflow-hidden font-mono text-xs">
                  <div className="bg-emerald-600 text-white px-3 py-2 font-bold uppercase text-[9px] flex items-center justify-between">
                    <span>📷 FOTO DOKUMENTASI ANAK BELAJAR DI PKBM</span>
                    <button
                      type="button"
                      onClick={() => setShowProofViewerModal(selectedCard)}
                      className="border border-white/40 bg-white/20 text-white px-2 py-0.5 text-[8px] font-bold uppercase hover:bg-white hover:text-emerald-900 cursor-pointer transition-colors"
                    >
                      📋 DETAIL PENUH
                    </button>
                  </div>
                  <div className="p-4 flex items-center justify-center">
                    {/\.(jpg|jpeg|png|gif|webp)$/i.test(selectedCard.fotoDokumentasiSelesai) ? (
                      <button
                        type="button"
                        onClick={() => setImageLightboxUrl(selectedCard.fotoDokumentasiSelesai!.startsWith("blob:") ? selectedCard.fotoDokumentasiSelesai! : `/uploads/${selectedCard.fotoDokumentasiSelesai}`)}
                        className="flex items-center gap-2 border-2 border-emerald-600 bg-white text-emerald-700 px-4 py-2.5 font-mono text-[10px] font-bold uppercase hover:bg-emerald-600 hover:text-white transition-all cursor-pointer shadow-[2px_2px_0_0_#059669]"
                      >
                        🔍 Tampilkan Foto Dokumentasi (Ukuran Maksimal)
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-ink/50 font-mono text-[10px] uppercase">
                        <FileCheck className="size-5 text-emerald-300" />
                        <span>{selectedCard.fotoDokumentasiSelesai}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-ledger pt-4 flex items-center justify-between">
              <button
                onClick={() => {
                  const cardToDelete = selectedCard;
                  setSelectedCard(null);
                  setShowDeleteModal(cardToDelete);
                }}
                className="inline-flex items-center gap-1.5 border border-sky-400 bg-sky-50 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-sky-900 hover:bg-sky-600 hover:text-white transition-colors cursor-pointer"
              >
                <Trash2 className="size-3.5" /> Hapus Laporan Palsu
              </button>

              <button
                onClick={() => setSelectedCard(null)}
                className="border border-ink bg-ink px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-paper hover:bg-sky-600 transition-colors cursor-pointer"
              >
                Tutup Berkas
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ─── FULLSCREEN IMAGE LIGHTBOX ─── */}
      {imageLightboxUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setImageLightboxUrl(null)}
        >
          <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setImageLightboxUrl(null)}
              className="absolute -top-10 right-0 grid size-9 place-items-center border-2 border-white bg-black text-white hover:bg-white hover:text-black transition-colors cursor-pointer z-10"
            >
              <X className="size-5" strokeWidth={2.5} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageLightboxUrl}
              alt="Pratinjau foto bukti ukuran penuh"
              className="max-w-[90vw] max-h-[85vh] object-contain border-2 border-white shadow-2xl"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white font-mono text-[9px] text-center py-1 uppercase tracking-widest">
              Klik di luar gambar atau tombol ✕ untuk menutup
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
