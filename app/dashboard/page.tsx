"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OperatorNav } from "@/components/radar/OperatorNav";
import { KanbanBoard } from "@/components/radar/KanbanBoard";

export default function DashboardPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const session = localStorage.getItem("radar_operator_session");
    if (!session) {
      router.push("/login");
    } else {
      setAuthenticated(true);
    }
    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className="radar-grid flex min-h-screen w-full flex-col items-center justify-center bg-paper font-mono text-xs uppercase tracking-widest text-ink/60">
        <div className="mb-2 size-3 animate-spin rounded-full border-2 border-signal border-t-transparent" />
        Memeriksa Autentikasi Operator...
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#efeee9] text-ink selection:bg-signal selection:text-white flex flex-col">
      <OperatorNav />
      <main className="flex-1">
        <KanbanBoard />
      </main>
    </div>
  );
}
