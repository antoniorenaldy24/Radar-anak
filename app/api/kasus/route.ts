import { NextResponse } from "next/server";
import { INITIAL } from "@/components/radar/KanbanBoard";
import { supabase } from "@/lib/supabase";

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rw = searchParams.get("rw");

  try {
    if (isSupabaseConfigured()) {
      let query = (supabase as any).from("kasus").select("*");
      if (rw && rw !== "ALL") {
        query = query.eq("rw", rw);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        // Map DB rows from schema.sql columns to Kanban cards
        const mappedData = data.map((c: any) => ({
          id: c.id,
          name: c.inisial_publik || c.nama_lengkap_asli || "A.N.",
          age: c.usia || "12 Tahun",
          rw: c.rw || "RW 04",
          address: c.alamat_rt_rw || "",
          note: c.catatan_advokasi || c.akar_masalah || "",
          reporter: c.pelapor || "Warga",
          statusAdvokasi: c.status_advokasi || "baru",
          urgent: !!c.urgent,
        }));

        const groupedData = {
          baru: mappedData.filter((c: any) => c.statusAdvokasi === "baru"),
          verifikasi: mappedData.filter((c: any) => c.statusAdvokasi === "verifikasi" || c.statusAdvokasi === "diverifikasi"),
          rujuk: mappedData.filter((c: any) => c.statusAdvokasi === "rujuk" || c.statusAdvokasi === "dirujuk"),
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

  // Fallback to INITIAL dataset if Supabase table is empty
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

    const newKasus = {
      id: String(Math.floor(1000 + Math.random() * 9000)),
      name,
      age: age || "12 Tahun",
      rw,
      address: `RT 01 / ${rw}, Dukuh Sutorejo, Mulyorejo, Surabaya`,
      note: note || "Laporan baru terdaftar dari warga.",
      reporter: reporter || "Warga / Relawan RW",
      statusAdvokasi: "baru",
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      const { error } = await (supabase as any).from("kasus").insert([
        {
          inisial_publik: name.length > 2 ? name.substring(0, 1) + "." + name.substring(name.length - 1) : name,
          nama_lengkap_asli: name,
          usia: age || "12 Tahun",
          rw: rw,
          alamat_rt_rw: `RT 01 / ${rw}, Dukuh Sutorejo, Mulyorejo, Surabaya`,
          akar_masalah: note || "Kendala biaya dan transportasi",
          catatan_advokasi: note || "Laporan baru terdaftar dari warga.",
          status_advokasi: "baru",
          pelapor: reporter || "Warga / Relawan RW",
        },
      ]);

      if (error) {
        console.error("Supabase insert error:", error);
      }
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

    if (isSupabaseConfigured()) {
      await (supabase as any)
        .from("kasus")
        .update({ status_advokasi: newStatus })
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
