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

    const newId = String(Math.floor(1000 + Math.random() * 9000));
    const ticketId = "RADAR-TK-" + Math.floor(100000 + Math.random() * 900000);

    if (isSupabaseConfigured()) {
      const { error } = await (supabase as any).from("kasus").insert([
        {
          id: newId,
          inisial_anak: name,
          wilayah_rw: rw,
          detail_alamat: `RT 01 / ${rw}, Dukuh Sutorejo, Mulyorejo, Surabaya`,
          penyebab_awal: "biaya",
          deskripsi: note || "Laporan temuan warga dari portal relawan.",
          status: "baru",
          pelapor_nama: reporter || "Warga / Relawan Lapangan",
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
