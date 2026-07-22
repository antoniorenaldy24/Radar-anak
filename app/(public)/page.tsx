"use client";

import { TopNav } from "@/components/radar/TopNav";
import { HeroRadar } from "@/components/radar/HeroRadar";
import { ClaimVsTemuan } from "@/components/radar/ClaimVsTemuan";
import { MinimalMap } from "@/components/radar/MinimalMap";
import { GaleriKarya } from "@/components/radar/GaleriKarya";
import { SectionAdvokasiFlow } from "@/components/radar/SectionAdvokasiFlow";
import { SectionFAQ } from "@/components/radar/SectionFAQ";
import { SectionTestimoni } from "@/components/radar/SectionTestimoni";
import { SectionDonasi } from "@/components/radar/SectionDonasi";
import { Footer } from "@/components/radar/Footer";
import { IntroCurtain } from "@/components/radar/IntroCurtain";

export default function IndexPage() {
  return (
    <div className="relative min-h-screen bg-paper text-ink selection:bg-signal selection:text-white">
      <IntroCurtain />
      <div className="paper-noise pointer-events-none fixed inset-0 z-[60]" />
      <TopNav />

      <main className="animate-[fade-up_0.5s_cubic-bezier(0.19,1,0.22,1)_both]">
        <HeroRadar />
        <ClaimVsTemuan />
        <MinimalMap />
        <GaleriKarya />
        <SectionAdvokasiFlow />
        <SectionFAQ />
        <SectionTestimoni />
        <SectionDonasi />
      </main>

      <Footer />
    </div>
  );
}
