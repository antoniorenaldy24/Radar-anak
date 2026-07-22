import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, rw, note, reporter } = body;

    if (!name || !rw) {
      return NextResponse.json(
        { success: false, error: "Nama subjek dan RW wajib diisi." },
        { status: 400 }
      );
    }

    const ticketId = "RADAR-TK-" + Math.floor(100000 + Math.random() * 900000);

    if (isSupabaseConfigured()) {
      const { error } = await (supabase as any).from("kasus").insert([
        {
          inisial_publik: name.length > 2 ? name.substring(0, 1) + "." + name.substring(name.length - 1) : name,
          nama_lengkap_asli: name,
          usia: "12 Tahun",
          rw: rw,
          alamat_rt_rw: `RT 01 / ${rw}, Dukuh Sutorejo, Mulyorejo, Surabaya`,
          akar_masalah: note || "Laporan temuan warga dari portal relawan.",
          catatan_advokasi: note || "Laporan temuan warga dari portal relawan.",
          status_advokasi: "baru",
          pelapor: reporter || "Warga / Relawan Lapangan",
        },
      ]);

      if (error) {
        console.error("Error inserting into Supabase via lapor route:", error);
      }
    }

    return NextResponse.json({
      success: true,
      ticketId,
      message: `Laporan berhasil terdaftar di database. Nomor tiket Anda: ${ticketId}`,
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message || "Gagal mengirimkan laporan." },
      { status: 500 }
    );
  }
}
