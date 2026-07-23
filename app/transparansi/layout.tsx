import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal Transparansi Data — RADAR ANAK",
  description:
    "Portal data terbuka dan laporan statistik sensus anak putus sekolah Kelurahan Dukuh Sutorejo oleh Kelompok KKN 34 UM Surabaya 2026.",
};

export default function TransparansiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
