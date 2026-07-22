import { NextResponse } from "next/server";
import { INITIAL } from "@/components/radar/KanbanBoard";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rw = searchParams.get("rw");

  // In production, fetch from Supabase:
  // const { data, error } = await supabaseServer.from("kasus").select("*");

  return NextResponse.json({
    success: true,
    data: INITIAL,
    filterRw: rw || "ALL",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, age, rw, note, reporter } = body;

    if (!name || !rw) {
      return NextResponse.json(
        { success: false, error: "Nama dan RW wajib diisi." },
        { status: 400 }
      );
    }

    const newKasus = {
      id: String(Math.floor(1000 + Math.random() * 9000)),
      name,
      age: age || "12 Tahun",
      nik: "317408" + Math.floor(1000000000 + Math.random() * 9000000000),
      rw,
      address: `RT 01 / ${rw}, Kelurahan Manggarai`,
      parent: "Orang Tua / Wali",
      phone: "0812-0000-0000",
      note: note || "Laporan baru terdaftar dari warga.",
      reporter: reporter || "Warga / Relawan RW",
      statusDokumen: "Terdaftar Lapangan",
      rujukan: "Dalam Antrean Verifikasi Operator",
      statusAdvokasi: "baru",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Kasus baru berhasil didaftarkan.",
      data: newKasus,
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message || "Gagal memproses laporan." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, newStatus } = body;

    if (!id || !newStatus) {
      return NextResponse.json(
        { success: false, error: "ID dan status baru wajib disertakan." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Status kasus #${id} berhasil diperbarui menjadi ${newStatus}.`,
      updatedAt: new Date().toISOString(),
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message || "Gagal mengupdate kasus." },
      { status: 500 }
    );
  }
}
