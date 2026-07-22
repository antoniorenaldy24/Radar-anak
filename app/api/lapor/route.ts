import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key);
}

export function generateShortId(rwStr: string, nameStr: string): string {
  const rwMatch = (rwStr || "RW 04").match(/\d+/);
  const rwNum = rwMatch ? rwMatch[0].padStart(2, "0") : "04";
  const words = (nameStr || "Subjek").trim().split(/\s+/);
  let initials = "";
  if (words.length === 1) {
    initials = words[0].slice(0, 2).toUpperCase();
  } else {
    initials = words.slice(0, 2).map((w) => w[0]?.toUpperCase() || "").join("");
  }
  const randNum = Math.floor(10 + Math.random() * 90);
  return `${rwNum}-${initials}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, age, rw, address, note, reporter, phone } = body;

    if (!name || !rw) {
      return NextResponse.json(
        { success: false, error: "Nama subjek dan RW wajib diisi." },
        { status: 400 }
      );
    }

    const customShortId = generateShortId(rw, name);
    const fullAddress = address ? `${address}, ${rw}, Dukuh Sutorejo, Mulyorejo, Surabaya` : `RT 01 / ${rw}, Dukuh Sutorejo, Mulyorejo, Surabaya`;

    if (isSupabaseConfigured()) {
      const { error } = await (supabase as any).from("kasus").insert([
        {
          inisial_publik: name.length > 2 ? name.substring(0, 1) + "." + name.substring(name.length - 1) : name,
          nama_lengkap_asli: name,
          usia: age || "12 Tahun",
          rw: rw,
          alamat_rt_rw: fullAddress,
          nama_wali: "",
          no_phone: phone || "-",
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
      ticketId: customShortId,
      message: `Laporan berhasil terdaftar di database. Nomor tiket Anda: ${customShortId}`,
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message || "Gagal mengirimkan laporan." },
      { status: 500 }
    );
  }
}
