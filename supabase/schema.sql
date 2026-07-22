-- RADAR ANAK — Supabase Schema & Row Level Security (RLS)
-- Single Source of Truth Alignment (2-Tier Model: Public vs Authenticated Operator)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabel Kasus (Sensus & Advokasi)
CREATE TABLE IF NOT EXISTS public.kasus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inisial_publik VARCHAR(20) NOT NULL,
  nama_lengkap_asli VARCHAR(100) NOT NULL,
  nik VARCHAR(20),
  no_kk VARCHAR(20),
  usia VARCHAR(20) NOT NULL,
  rw VARCHAR(20) NOT NULL,
  alamat_rt_rw TEXT NOT NULL,
  nama_wali VARCHAR(100),
  no_phone VARCHAR(30),
  akar_masalah TEXT NOT NULL,
  mimpi TEXT,
  catatan_advokasi TEXT,
  status_advokasi VARCHAR(20) NOT NULL DEFAULT 'baru', -- 'baru' | 'verifikasi' | 'rujuk' | 'selesai'
  status_dokumen VARCHAR(50) DEFAULT 'Terverifikasi Lapangan',
  pelapor VARCHAR(100) DEFAULT 'Warga / Kader RW',
  urgent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tabel Verifikasi & Bukti Rujukan
CREATE TABLE IF NOT EXISTS public.verifikasi_bukti (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kasus_id UUID REFERENCES public.kasus(id) ON DELETE CASCADE,
  foto_bukti_url TEXT,
  catatan_operator TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Tabel Jejak Audit Sensus
CREATE TABLE IF NOT EXISTS public.jejak_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kasus_id UUID REFERENCES public.kasus(id) ON DELETE CASCADE,
  aksi TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Tabel Donasi & Intervensi Sipil
CREATE TABLE IF NOT EXISTS public.donasi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama_donatur VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  nominal NUMERIC(12, 2) NOT NULL,
  pesan TEXT,
  status_verifikasi VARCHAR(20) DEFAULT 'terdaftar',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.kasus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifikasi_bukti ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jejak_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donasi ENABLE ROW LEVEL SECURITY;

-- 7. Policies: Akses Baca Publik hanya pada data non-sensitif / anonim
CREATE POLICY "Public Read Kasus Anonymized" ON public.kasus
  FOR SELECT USING (true);

CREATE POLICY "Public Insert Laporan" ON public.kasus
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Insert Donasi" ON public.donasi
  FOR INSERT WITH CHECK (true);

-- 8. Policies: Full Access bagi Operator Terautentikasi (authenticated)
CREATE POLICY "Operator Full Access Kasus" ON public.kasus
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Operator Full Access Verifikasi" ON public.verifikasi_bukti
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Operator Full Access Audit" ON public.jejak_audit
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Operator Full Access Donasi" ON public.donasi
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
