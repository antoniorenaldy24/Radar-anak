export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          nama: string
          role: 'operator' | 'verifikator' | 'rt_rw' | 'admin_konten'
          wilayah_rw: string | null
          kelurahan_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nama: string
          role: 'operator' | 'verifikator' | 'rt_rw' | 'admin_konten'
          wilayah_rw?: string | null
          kelurahan_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nama?: string
          role?: 'operator' | 'verifikator' | 'rt_rw' | 'admin_konten'
          wilayah_rw?: string | null
          kelurahan_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      undangan: {
        Row: {
          id: string
          token: string
          email: string
          role: 'operator' | 'verifikator' | 'rt_rw' | 'admin_konten'
          wilayah_rw: string | null
          kelurahan_id: string | null
          status: 'pending' | 'used' | 'expired'
          expired_at: string
          created_at: string
        }
        Insert: {
          id?: string
          token: string
          email: string
          role: 'operator' | 'verifikator' | 'rt_rw' | 'admin_konten'
          wilayah_rw?: string | null
          kelurahan_id?: string | null
          status?: 'pending' | 'used' | 'expired'
          expired_at: string
          created_at?: string
        }
        Update: {
          id?: string
          token?: string
          email?: string
          role?: 'operator' | 'verifikator' | 'rt_rw' | 'admin_konten'
          wilayah_rw?: string | null
          kelurahan_id?: string | null
          status?: 'pending' | 'used' | 'expired'
          expired_at?: string
          created_at?: string
        }
      }
      kasus: {
        Row: {
          id: string
          inisial_anak: string
          wilayah_rw: string
          detail_alamat: string
          penyebab_awal: 'biaya' | 'sekolah_teman' | 'jarak' | 'lainnya'
          penyebab_final: 'biaya' | 'sekolah_teman' | 'jarak' | 'lainnya' | null
          deskripsi: string | null
          status: 'baru' | 'diverifikasi' | 'dirujuk' | 'selesai'
          pelapor_nama: string | null
          pelapor_kontak: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          inisial_anak: string
          wilayah_rw: string
          detail_alamat: string
          penyebab_awal: 'biaya' | 'sekolah_teman' | 'jarak' | 'lainnya'
          penyebab_final?: 'biaya' | 'sekolah_teman' | 'jarak' | 'lainnya' | null
          deskripsi?: string | null
          status?: 'baru' | 'diverifikasi' | 'dirujuk' | 'selesai'
          pelapor_nama?: string | null
          pelapor_kontak?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          inisial_anak?: string
          wilayah_rw?: string
          detail_alamat?: string
          penyebab_awal?: 'biaya' | 'sekolah_teman' | 'jarak' | 'lainnya'
          penyebab_final?: 'biaya' | 'sekolah_teman' | 'jarak' | 'lainnya' | null
          deskripsi?: string | null
          status?: 'baru' | 'diverifikasi' | 'dirujuk' | 'selesai'
          pelapor_nama?: string | null
          pelapor_kontak?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      verifikasi: {
        Row: {
          id: string
          kasus_id: string
          verifikator_id: string | null
          catatan: string | null
          file_bukti_path: string | null
          status_persetujuan: boolean
          verified_at: string
        }
        Insert: {
          id?: string
          kasus_id: string
          verifikator_id?: string | null
          catatan?: string | null
          file_bukti_path?: string | null
          status_persetujuan?: boolean
          verified_at?: string
        }
        Update: {
          id?: string
          kasus_id?: string
          verifikator_id?: string | null
          catatan?: string | null
          file_bukti_path?: string | null
          status_persetujuan?: boolean
          verified_at?: string
        }
      }
      audit_trail: {
        Row: {
          id: string
          kasus_id: string
          user_id: string | null
          aksi: string
          data_lama: Json | null
          data_baru: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          kasus_id: string
          user_id?: string | null
          aksi: string
          data_lama?: Json | null
          data_baru?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          kasus_id?: string
          user_id?: string | null
          aksi?: string
          data_lama?: Json | null
          data_baru?: Json | null
          created_at?: string
        }
      }
      konten: {
        Row: {
          id: string
          key: string
          content: Json
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          content: Json
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          content?: Json
          updated_by?: string | null
          updated_at?: string
        }
      }
      galeri_karya: {
        Row: {
          id: string
          judul: string
          deskripsi: string | null
          image_path: string
          created_at: string
        }
        Insert: {
          id?: string
          judul: string
          deskripsi?: string | null
          image_path: string
          created_at?: string
        }
        Update: {
          id?: string
          judul?: string
          deskripsi?: string | null
          image_path?: string
          created_at?: string
        }
      }
    }
    Views: {
      kasus_agregat: {
        Row: {
          wilayah_rw: string
          penyebab: 'biaya' | 'sekolah_teman' | 'jarak' | 'lainnya'
          status: 'baru' | 'diverifikasi' | 'dirujuk' | 'selesai'
          jumlah_kasus: number
        }
      }
    }
    Enums: {
      role_type: 'operator' | 'verifikator' | 'rt_rw' | 'admin_konten'
      status_type: 'baru' | 'diverifikasi' | 'dirujuk' | 'selesai'
      penyebab_type: 'biaya' | 'sekolah_teman' | 'jarak' | 'lainnya'
    }
  }
}
