"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { addToHistory } from "@/lib/history";
import type { Tone } from "@/lib/types";

interface ResultData {
  original: string;
  rewritten: string;
  tone: Tone;
}

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<ResultData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("softsend_result");
    if (!raw) {
      router.replace("/app");
      return;
    }
    try {
      const parsed = JSON.parse(raw) as ResultData;
      setData(parsed);
      // Save to local history
      addToHistory(parsed.original, parsed.rewritten, parsed.tone);
    } catch {
      router.replace("/app");
    }
  }, [router]);

  function handleCopy() {
    if (!data) return;
    navigator.clipboard.writeText(data.rewritten);
    toast.success("Copied to clipboard");
  }

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col max-w-lg mx-auto px-4 py-6">
      <header className="flex items-center justify-between mb-6">
        <Link href="/" className="text-lg font-semibold text-soft-700">
          SoftSend
        </Link>
        <Link href="/app" className="text-sm text-soft-600 hover:underline">
          New rewrite
        </Link>
      </header>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Here’s your improved message
      </h1>

      {/* Rewritten */}
      <div className="rounded-xl border border-soft-200 bg-soft-50 p-4 mb-4">
        <p className="text-xs font-medium text-soft-600 mb-2 uppercase tracking-wide">
          Rewritten · {data.tone}
        </p>
        <p className="text-slate-900 whitespace-pre-wrap leading-relaxed">
          {data.rewritten}
        </p>
      </div>

      <button
        onClick={handleCopy}
        className="w-full rounded-full bg-soft-600 py-3.5 text-white font-medium shadow-lg shadow-soft-200 hover:bg-soft-700 transition mb-6"
      >
        Copy rewritten message
      </button>

      {/* Original (collapsed style) */}
      <details className="rounded-xl border border-slate-200 bg-white p-4">
        <summary className="text-sm font-medium text-slate-600 cursor-pointer">
          View original
        </summary>
        <p className="mt-3 text-slate-500 text-sm whitespace-pre-wrap">
          {data.original}
        </p>
      </details>

      <div className="mt-8 flex gap-3 justify-center text-sm">
        <Link href="/app" className="text-soft-600 hover:underline">
          Fix another
        </Link>
        <span className="text-slate-300">·</span>
        <Link href="/history" className="text-soft-600 hover:underline">
          History
        </Link>
        <span className="text-slate-300">·</span>
        <Link href="/credits" className="text-soft-600 hover:underline">
          Buy credits
        </Link>
      </div>
    </main>
  );
}
