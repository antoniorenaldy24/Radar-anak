-- 1. ENUMS SETUP
CREATE TYPE public.role_type AS ENUM ('operator', 'verifikator', 'rt_rw', 'admin_konten');
CREATE TYPE public.status_type AS ENUM ('baru', 'diverifikasi', 'dirujuk', 'selesai');
CREATE TYPE public.penyebab_type AS ENUM ('biaya', 'sekolah_teman', 'jarak', 'lainnya');

-- 2. TABLES SETUP
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nama TEXT NOT NULL,
    role public.role_type NOT NULL,
    wilayah_rw TEXT,
    kelurahan_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.undangan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    role public.role_type NOT NULL,
    wilayah_rw TEXT,
    kelurahan_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'used', 'expired')),
    expired_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.kasus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inisial_anak TEXT NOT NULL,
    wilayah_rw TEXT NOT NULL,
    detail_alamat TEXT NOT NULL,
    penyebab_awal public.penyebab_type NOT NULL,
    penyebab_final public.penyebab_type,
    deskripsi TEXT,
    status public.status_type NOT NULL DEFAULT 'baru',
    pelapor_nama TEXT,
    pelapor_kontak TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.verifikasi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kasus_id UUID NOT NULL REFERENCES public.kasus(id) ON DELETE CASCADE,
    verifikator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    catatan TEXT,
    file_bukti_path TEXT,
    status_persetujuan BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kasus_id UUID NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    aksi TEXT NOT NULL,
    data_lama JSONB,
    data_baru JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.konten (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    content JSONB NOT NULL,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.galeri_karya (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul TEXT NOT NULL,
    deskripsi TEXT,
    image_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. HELPER FUNCTIONS & TRIGGERS FOR AUDIT TRAIL
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.role_type AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.log_kasus_changes_fn()
RETURNS TRIGGER AS $$
DECLARE
    current_user_id UUID;
BEGIN
    BEGIN
        current_user_id := auth.uid();
    EXCEPTION WHEN OTHERS THEN
        current_user_id := NULL;
    END;

    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.audit_trail (kasus_id, user_id, aksi, data_lama, data_baru)
        VALUES (NEW.id, current_user_id, 'INSERT', NULL, to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.audit_trail (kasus_id, user_id, aksi, data_lama, data_baru)
        VALUES (NEW.id, current_user_id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.audit_trail (kasus_id, user_id, aksi, data_lama, data_baru)
        VALUES (OLD.id, current_user_id, 'DELETE', to_jsonb(OLD), NULL);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_kasus_changes
AFTER INSERT OR UPDATE OR DELETE ON public.kasus
FOR EACH ROW EXECUTE FUNCTION public.log_kasus_changes_fn();

-- 4. VIEW SETUP
CREATE OR REPLACE VIEW public.kasus_agregat AS
SELECT
    wilayah_rw,
    COALESCE(penyebab_final, penyebab_awal) AS penyebab,
    status,
    COUNT(*) AS jumlah_kasus
FROM
    public.kasus
GROUP BY
    wilayah_rw,
    COALESCE(penyebab_final, penyebab_awal),
    status;

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.undangan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kasus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifikasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.konten ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galeri_karya ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY profiles_select ON public.profiles FOR SELECT TO authenticated
USING (true);

CREATE POLICY profiles_update ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id OR public.get_my_role() = 'operator');

-- Undangan policies
CREATE POLICY undangan_all ON public.undangan FOR ALL TO authenticated
USING (public.get_my_role() = 'operator');

-- Kasus policies
CREATE POLICY kasus_select ON public.kasus FOR SELECT TO authenticated
USING (
    public.get_my_role() IN ('operator', 'verifikator') OR
    (public.get_my_role() = 'rt_rw' AND wilayah_rw = (SELECT wilayah_rw FROM public.profiles WHERE id = auth.uid()))
);

CREATE POLICY kasus_insert ON public.kasus FOR INSERT TO authenticated
WITH CHECK (
    public.get_my_role() IN ('operator') OR
    (public.get_my_role() = 'rt_rw' AND wilayah_rw = (SELECT wilayah_rw FROM public.profiles WHERE id = auth.uid()))
);

CREATE POLICY kasus_update ON public.kasus FOR UPDATE TO authenticated
USING (
    public.get_my_role() IN ('operator', 'verifikator') OR
    (public.get_my_role() = 'rt_rw' AND wilayah_rw = (SELECT wilayah_rw FROM public.profiles WHERE id = auth.uid()))
);

CREATE POLICY kasus_delete ON public.kasus FOR DELETE TO authenticated
USING (public.get_my_role() = 'operator');

-- Verifikasi policies
CREATE POLICY verifikasi_all ON public.verifikasi FOR ALL TO authenticated
USING (public.get_my_role() IN ('operator', 'verifikator'));

-- Audit trail policies
CREATE POLICY audit_trail_select ON public.audit_trail FOR SELECT TO authenticated
USING (public.get_my_role() = 'operator');

-- Konten policies
CREATE POLICY konten_select ON public.konten FOR SELECT TO public
USING (true);

CREATE POLICY konten_modify ON public.konten FOR ALL TO authenticated
USING (public.get_my_role() IN ('admin_konten', 'operator'));

-- Galeri karya policies
CREATE POLICY galeri_select ON public.galeri_karya FOR SELECT TO public
USING (true);

CREATE POLICY galeri_modify ON public.galeri_karya FOR ALL TO authenticated
USING (public.get_my_role() IN ('admin_konten', 'operator'));

-- 6. STORAGE BUCKETS POLICIES (applied to storage.objects)
-- Ensure storage buckets exist first via client or manual creation, but policies can be written now.
CREATE POLICY "Public Read Galeri" ON storage.objects FOR SELECT TO public
USING (bucket_id = 'galeri-karya');

CREATE POLICY "Public Read Laporan" ON storage.objects FOR SELECT TO public
USING (bucket_id = 'laporan-publik');

CREATE POLICY "Admin Modify Galeri" ON storage.objects FOR ALL TO authenticated
USING (
    bucket_id = 'galeri-karya' AND
    public.get_my_role() IN ('admin_konten', 'operator')
);

CREATE POLICY "Admin Modify Laporan" ON storage.objects FOR ALL TO authenticated
USING (
    bucket_id = 'laporan-publik' AND
    public.get_my_role() IN ('admin_konten', 'operator')
);

CREATE POLICY "Operator Verifikator Bukti Rujukan" ON storage.objects FOR ALL TO authenticated
USING (
    bucket_id = 'bukti-rujukan' AND
    public.get_my_role() IN ('operator', 'verifikator')
);
