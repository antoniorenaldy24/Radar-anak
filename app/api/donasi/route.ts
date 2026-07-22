import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, email, nominal, pesan } = body;

    if (!nama || !email || !nominal) {
      return NextResponse.json(
        { success: false, error: "Nama, email, dan nominal wajib diisi." },
        { status: 400 }
      );
    }

    const donasiId = "DONASI-2026-" + Math.floor(1000 + Math.random() * 9000);

    return NextResponse.json({
      success: true,
      donasiId,
      message: `Komitmen donasi sebesar Rp ${Number(nominal).toLocaleString("id-ID")} berhasil terdaftar.`,
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message || "Gagal mencatat donasi." },
      { status: 500 }
    );
  }
}
