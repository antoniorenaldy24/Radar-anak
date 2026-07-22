export type SubjectProfile = {
  id: string;
  initials: string;
  age: string;
  location: string;
  dateLocked: string;
  rootProblem: string;
  dream: string;
  advocacyNote: string;
  rw: string;
  pos: [number, number];
  cases: number;
};

export const SUBJECT_DATA: SubjectProfile[] = [
  {
    id: "01",
    initials: "S.W.",
    age: "13 Tahun",
    location: "RW 04, Kelurahan Dukuh Sutorejo, Mulyorejo, Surabaya",
    dateLocked: "2026-07-05",
    rootProblem:
      "Biaya seragam, buku, dan trauma perundungan di sekolah menengah pertama sebelumnya.",
    dream:
      "Cita-cita: Menjadi Game Programmer karena sangat menyukai puzzle digital.",
    advocacyNote:
      "Dirujuk ke PKBM (Pusat Kegiatan Belajar Masyarakat) untuk Kejar Paket B guna meminimalisir trauma bullying, sekaligus pendampingan psikososial mandiri.",
    rw: "RW 04",
    pos: [-7.2635, 112.7890],
    cases: 3,
  },
  {
    id: "02",
    initials: "D.K.",
    age: "10 Tahun",
    location: "RW 07, Sutorejo Indah, Surabaya",
    dateLocked: "2026-07-02",
    rootProblem:
      "Orang tua tunggal sakit keras dan kendala biaya operasional sekolah dasar setempat.",
    dream:
      "Cita-cita: Menjadi Pelukis & Desain Grafis visual digital.",
    advocacyNote:
      "Didaftarkan ke Program Indonesia Pintar (PIP) dan bantuan alokasi donasi seragam & buku tulis lengkap.",
    rw: "RW 07",
    pos: [-7.2650, 112.7915],
    cases: 2,
  },
  {
    id: "03",
    initials: "R.P.",
    age: "11 Tahun",
    location: "RW 09, Mulyorejo Permai, Surabaya",
    dateLocked: "2026-06-28",
    rootProblem:
      "Bekerja membantu keluarga sebagai loper koran karena dokumen KK/Akta belum selesai diajukan.",
    dream:
      "Cita-cita: Menjadi Teknisi Komputer & Mekanik Otomotif.",
    advocacyNote:
      "Pendampingan pengurusan administrasi KK/Akta ke Dukcapil oleh Relawan KKN 34 serta rujukan sekolah negeri.",
    rw: "RW 09",
    pos: [-7.2595, 112.7840],
    cases: 1,
  },
  {
    id: "04",
    initials: "A.F.",
    age: "14 Tahun",
    location: "RW 12, Kalijudan, Surabaya",
    dateLocked: "2026-06-20",
    rootProblem:
      "Pendidikan terputus 1 tahun akibat migrasi tempat tinggal tempat kerja keluarga.",
    dream:
      "Cita-cita: Menjadi Guru Matematika dan pengajar bimbel.",
    advocacyNote:
      "Diterima rujukan pendaftaran PKBM Negeri 01 Gelombang II dan pendampingan pasca-sekolah.",
    rw: "RW 12",
    pos: [-7.2580, 112.7815],
    cases: 1,
  },
];
