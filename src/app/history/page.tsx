"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getHistory } from "@/lib/history";
import type { RewriteHistoryItem } from "@/lib/types";

export default function HistoryPage() {
  const [items, setItems] = useState<RewriteHistoryItem[]>([]);

  useEffect(() => {
    setItems(getHistory());
  }, []);

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

      <h1 className="text-2xl font-bold text-slate-900 mb-1">History</h1>
      <p className="text-slate-500 text-sm mb-6">
        Last 10 rewrites (stored only on this device)
      </p>

      {items.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p>No rewrites yet.</p>
          <Link href="/app" className="mt-2 inline-block text-soft-600 hover:underline">
            Fix your first message
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-soft-600 uppercase">
                  {item.tone}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-slate-900 line-clamp-3 whitespace-pre-wrap">
                {item.rewritten}
              </p>
              <details className="mt-2">
                <summary className="text-xs text-slate-400 cursor-pointer">
                  Original
                </summary>
                <p className="mt-1 text-xs text-slate-500 whitespace-pre-wrap">
                  {item.original}
                </p>
              </details>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
