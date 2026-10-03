"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { getOrCreateUserId } from "@/lib/user";
import { CREDIT_PACKS } from "@/lib/stripe";

export default function CreditsPage() {
  const [userId, setUserId] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const id = getOrCreateUserId();
    setUserId(id);
    fetch(`/api/credits?userId=${id}`)
      .then((r) => r.json())
      .then((d) => setCredits(d.credits ?? 0))
      .catch(() => setCredits(0));
  }, []);

  async function handleBuy(packId: string) {
    setLoading(packId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, mode: packId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Could not start checkout");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen flex flex-col max-w-lg mx-auto px-4 py-6">
      <header className="flex items-center justify-between mb-6">
        <Link href="/" className="text-lg font-semibold text-soft-700">
          SoftSend
        </Link>
        <Link href="/app" className="text-sm text-soft-600 hover:underline">
          Back to app
        </Link>
      </header>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">Buy credits</h1>
      <p className="text-slate-500 text-sm mb-2">
        Credits never expire. Use them anytime.
      </p>
      {credits !== null && (
        <p className="text-sm text-soft-700 font-medium mb-6">
          You currently have {credits} credit{credits !== 1 ? "s" : ""}
        </p>
      )}

      <div className="space-y-3">
        {CREDIT_PACKS.map((pack) => (
          <button
            key={pack.id}
            onClick={() => handleBuy(pack.id)}
            disabled={!!loading}
            className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 hover:border-soft-300 hover:bg-soft-50 transition disabled:opacity-50"
          >
            <div className="text-left">
              <p className="font-medium text-slate-900">{pack.label}</p>
              <p className="text-sm text-slate-500">{pack.description}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-soft-700">
                ${(pack.price / 100).toFixed(0)}
              </p>
              {loading === pack.id && (
                <p className="text-xs text-slate-400">Loading...</p>
              )}
            </div>
          </button>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-slate-400">
        Payments are securely processed by Stripe.
      </p>
    </main>
  );
}
