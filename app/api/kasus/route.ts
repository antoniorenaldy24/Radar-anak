import { NextResponse } from "next/server";
import { INITIAL } from "@/components/radar/KanbanBoard";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rw = searchParams.get("rw");

  try {
    // If Supabase URL environment variable is provided, query real Supabase DB
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      let query = (supabase as any).from("kasus").select("*");
      if (rw && rw !== "ALL") {
        query = query.eq("wilayah_rw", rw);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        // Map DB rows to Kanban cards
        const mappedData = data.map((c: any) => ({
          id: c.id,
          name: c.inisial_anak || c.name || "A.N.",
          age: c.age || "12 Tahun",
          rw: c.wilayah_rw || c.rw || "RW 04",
          address: c.detail_alamat || c.address || "",
          note: c.deskripsi || c.note || "",
          reporter: c.pelapor_nama || c.reporter || "Warga",
          statusAdvokasi: c.status || "baru",
          lat: c.lat,
          lng: c.lng,
        }));

        const groupedData = {
          baru: mappedData.filter((c: any) => c.statusAdvokasi === "baru"),
          verifikasi: mappedData.filter((c: any) => c.statusAdvokasi === "diverifikasi" || c.statusAdvokasi === "verifikasi"),
          rujuk: mappedData.filter((c: any) => c.statusAdvokasi === "dirujuk" || c.statusAdvokasi === "rujuk"),
          selesai: mappedData.filter((c: any) => c.statusAdvokasi === "selesai"),
        };

        return NextResponse.json({
          success: true,
          data: groupedData,
          filterRw: rw || "ALL",
          timestamp: new Date().toISOString(),
          source: "supabase",
        });
      }
    }
  } catch (err) {
    console.error("Supabase fetch error, fallback to initial:", err);
  }

  // Fallback to INITIAL dataset if Supabase is initializing or empty
  return NextResponse.json({
    success: true,
    data: INITIAL,
    filterRw: rw || "ALL",
    timestamp: new Date().toISOString(),
    source: "fallback_initial",
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

    const newId = String(Math.floor(1000 + Math.random() * 9000));
    const newKasus = {
      id: newId,
      name,
      age: age || "12 Tahun",
      nik: "317408" + Math.floor(1000000000 + Math.random() * 9000000000),
      rw,
      address: `RT 01 / ${rw}, Dukuh Sutorejo, Mulyorejo, Surabaya`,
      parent: "Orang Tua / Wali",
      phone: "0812-0000-0000",
      note: note || "Laporan baru terdaftar dari warga.",
      reporter: reporter || "Warga / Relawan RW",
      statusDokumen: "Terdaftar Lapangan",
      rujukan: "Dalam Antrean Verifikasi Operator",
      statusAdvokasi: "baru",
      createdAt: new Date().toISOString(),
    };

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      await (supabase as any).from("kasus").insert([
        {
          id: newId,
          inisial_anak: name,
          wilayah_rw: rw,
          detail_alamat: `RT 01 / ${rw}, Dukuh Sutorejo, Mulyorejo, Surabaya`,
          penyebab_awal: "biaya",
          deskripsi: note,
          status: "baru",
          pelapor_nama: reporter || "Warga / Relawan RW",
        },
      ]);
    }

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

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      await (supabase as any)
        .from("kasus")
        .update({ status: newStatus })
        .eq("id", id);
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
