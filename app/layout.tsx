import type { Metadata } from "next";
import { Inter_Tight, Inter, JetBrains_Mono } from "next/font/google";
import "../styles/globals.css";

const displayFont = Inter_Tight({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const sansFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RADAR ANAK - Sistem Deteksi Dini Hak Sekolah",
  description: "Investigasi sipil dan sistem deteksi dini anak putus sekolah berbasis wilayah RW.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${displayFont.variable} ${sansFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink selection:bg-signal selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
