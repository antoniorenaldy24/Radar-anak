import { NextResponse } from "next/server";

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

    return NextResponse.json({
      success: true,
      ticketId,
      message: `Laporan berhasil diterima. Nomor tiket Anda: ${ticketId}`,
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message || "Gagal mengirimkan laporan." },
      { status: 500 }
    );
  }
}
