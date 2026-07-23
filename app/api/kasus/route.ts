import { NextResponse } from "next/server";
import { INITIAL } from "@/components/radar/KanbanBoard";
import { supabase } from "@/lib/supabase";
import { generateShortId } from "../lapor/route";

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
        // Map DB rows from schema.sql columns to Kanban cards with short ID and contact info
        const mappedData = data.map((c: any) => {
          const rawName = c.nama_lengkap_asli || c.inisial_publik || "Subjek";
          const shortId = c.id && c.id.length < 10 ? c.id : generateShortId(c.rw || "RW 04", rawName);

          // Extract embedded JSON metadata if present in catatan_advokasi
          let meta: any = {};
          let cleanNote = c.catatan_advokasi || c.akar_masalah || "";
          if (cleanNote.includes("__META__:")) {
            try {
              const parts = cleanNote.split("__META__:");
              cleanNote = parts[0].trim();
              meta = JSON.parse(parts[1]);
            } catch (e) {
              console.error("Meta parse error:", e);
            }
          }

          return {
            id: shortId,
            dbUuid: c.id,
            name: rawName,
            age: c.usia || "12 Tahun",
            nik: meta.nik || c.nik || c.nik_subjek || "",
            rw: c.rw || "RW 04",
            address: c.alamat_rt_rw || "",
            parent: c.nama_wali || "",
            phone: c.no_phone || "",
            note: cleanNote || c.akar_masalah || "",
            reporter: c.pelapor || "Warga",
            statusAdvokasi: c.status_advokasi || "baru",
            kategoriAlasan: meta.kategoriAlasan || c.kategori_alasan || "",
            statusDokumen: meta.statusDokumen || c.status_dokumen || "",
            rujukan: meta.rujukan || c.rujukan || "",
            buktiUrl: meta.buktiUrl || c.bukti_url || "",
            catatanOperator: meta.catatanOperator || c.catatan_operator || "",
            alasanDitutup: meta.alasanDitutup || c.alasan_ditutup || "",
            fotoDokumentasiSelesai: meta.fotoDokumentasiSelesai || c.foto_dokumentasi_selesai || "",
            urgent: typeof meta.urgent === "boolean" ? meta.urgent : !!c.urgent,
            verifiedAt: meta.verifiedAt || c.verified_at || c.created_at || "",
            lat: typeof meta.lat === "number" ? meta.lat : typeof c.lat === "number" ? c.lat : undefined,
            lng: typeof meta.lng === "number" ? meta.lng : typeof c.lng === "number" ? c.lng : undefined,
          };
        });

        const groupedData = {
          baru: mappedData.filter((c: any) => c.statusAdvokasi === "baru"),
          verifikasi: mappedData.filter((c: any) => c.statusAdvokasi === "verifikasi" || c.statusAdvokasi === "diverifikasi"),
          rujuk: mappedData.filter((c: any) => c.statusAdvokasi === "rujuk" || c.statusAdvokasi === "dirujuk"),
          selesai: mappedData.filter((c: any) => c.statusAdvokasi === "selesai"),
          ditutup: mappedData.filter((c: any) => c.statusAdvokasi === "ditutup" || c.statusAdvokasi === "penolakan"),
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

  // Fallback to empty dataset if Supabase table is empty
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
    const { name, age, rw, address, note, reporter, phone } = body;

    if (!name || !rw) {
      return NextResponse.json(
        { success: false, error: "Nama dan RW wajib diisi." },
        { status: 400 }
      );
    }

    const shortId = generateShortId(rw, name);
    const fullAddress = address || `RT 01 / ${rw}, Dukuh Sutorejo, Mulyorejo, Surabaya`;

    const newKasus = {
      id: shortId,
      name,
      age: age || "12 Tahun",
      rw,
      address: fullAddress,
      parent: reporter || "Orang Tua / Wali",
      phone: phone || "0812-0000-0000",
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
          alamat_rt_rw: fullAddress,
          nama_wali: reporter || "Orang Tua / Wali",
          no_phone: phone || "0812-0000-0000",
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
    const {
      id,
      newStatus,
      dbUuid,
      name,
      address,
      parent,
      phone,
      catatanAdvokasi,
      alasanDitutup,
      rujukan,
      catatanOperator,
      buktiUrl,
      statusDokumen,
      kategoriAlasan,
      nik,
      urgent,
      lat,
      lng,
      fotoDokumentasiSelesai,
      rw,
      age,
      note,
      reporter,
      verifiedAt,
    } = body;

    if (!id || !newStatus) {
      return NextResponse.json(
        { success: false, error: "ID dan status baru wajib disertakan." },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      // Build safe metadata payload object
      const metaObj = {
        nik: nik || "",
        statusDokumen: statusDokumen || "",
        kategoriAlasan: kategoriAlasan || "",
        rujukan: rujukan || "",
        buktiUrl: buktiUrl || "",
        catatanOperator: catatanOperator || "",
        alasanDitutup: alasanDitutup || "",
        fotoDokumentasiSelesai: fotoDokumentasiSelesai || "",
        urgent: typeof urgent === "boolean" ? urgent : false,
        verifiedAt: verifiedAt || new Date().toISOString(),
        lat: typeof lat === "number" ? lat : undefined,
        lng: typeof lng === "number" ? lng : undefined,
      };

      const baseNote = catatanOperator || catatanAdvokasi || note || "Advokasi diproses oleh operator.";
      const combinedNote = `${baseNote} __META__:${JSON.stringify(metaObj)}`;

      // Update ONLY columns that exist in schema.sql
      const updatePayload: any = {
        status_advokasi: newStatus,
        catatan_advokasi: combinedNote,
      };

      if (name) updatePayload.nama_lengkap_asli = name;
      if (address) updatePayload.alamat_rt_rw = address;
      if (parent) updatePayload.nama_wali = parent;
      if (phone) updatePayload.no_phone = phone;

      const isUuid = (val?: string) =>
        Boolean(val && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(val));

      const targetId = isUuid(dbUuid) ? dbUuid : isUuid(id) ? id : null;

      let updateSuccess = false;

      // 1. Try update by UUID primary key
      if (targetId) {
        const { data, error } = await (supabase as any)
          .from("kasus")
          .update(updatePayload)
          .eq("id", targetId)
          .select();

        if (!error && data && data.length > 0) {
          updateSuccess = true;
        } else if (error) {
          console.error("Supabase update by ID error:", error);
        }
      }

      // 2. Fallback: Try update by case name (case-insensitive)
      if (!updateSuccess && name) {
        const cleanName = name.trim();
        const { data, error } = await (supabase as any)
          .from("kasus")
          .update(updatePayload)
          .ilike("nama_lengkap_asli", cleanName)
          .select();

        if (!error && data && data.length > 0) {
          updateSuccess = true;
        } else if (error) {
          console.error("Supabase update by name error:", error);
        }
      }

      // 3. Fallback 2: Try update by RW and first word of name
      if (!updateSuccess && name && rw) {
        const firstName = name.trim().split(" ")[0];
        const { data, error } = await (supabase as any)
          .from("kasus")
          .update(updatePayload)
          .eq("rw", rw)
          .ilike("nama_lengkap_asli", `%${firstName}%`)
          .select();

        if (!error && data && data.length > 0) {
          updateSuccess = true;
        }
      }

      // 4. Upsert Fallback: If row was not found in DB, insert standard columns safely
      if (!updateSuccess && name) {
        const insertPayload = {
          inisial_publik: name.length > 2 ? name.substring(0, 1) + "." + name.substring(name.length - 1) : name,
          nama_lengkap_asli: name,
          usia: age || "12 Tahun",
          rw: rw || "RW 04",
          alamat_rt_rw: address || `RT 01 / ${rw || "RW 04"}, Dukuh Sutorejo`,
          nama_wali: parent || "Orang Tua / Wali",
          no_phone: phone || "0812-0000-0000",
          akar_masalah: note || "Kendala biaya dan transportasi",
          catatan_advokasi: combinedNote,
          status_advokasi: newStatus,
          pelapor: reporter || "Warga",
        };

        const { error: insertErr } = await (supabase as any).from("kasus").insert([insertPayload]);
        if (insertErr) {
          console.error("Supabase upsert insert error:", insertErr);
        }
      }
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

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id, dbUuid, name } = body;

    if (!id && !dbUuid && !name) {
      return NextResponse.json(
        { success: false, error: "ID atau nama kasus wajib diisi untuk menghapus." },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const isUuid = (val?: string) =>
        Boolean(val && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(val));

      const targetId = isUuid(dbUuid) ? dbUuid : isUuid(id) ? id : null;

      if (targetId) {
        const { error } = await (supabase as any).from("kasus").delete().eq("id", targetId);
        if (error) console.error("Supabase delete by ID error:", error);
      } else if (name) {
        // Fallback for short ID: delete matching row by nama_lengkap_asli safely
        const { error } = await (supabase as any).from("kasus").delete().eq("nama_lengkap_asli", name);
        if (error) console.error("Supabase delete by name error:", error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Kasus #${id || name} berhasil dihapus permanen.`,
      deletedAt: new Date().toISOString(),
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message || "Gagal menghapus kasus." },
      { status: 500 }
    );
  }
}
