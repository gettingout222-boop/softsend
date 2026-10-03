"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { getOrCreateUserId } from "@/lib/user";
import type { Tone } from "@/lib/types";

const TONES: { value: Tone; label: string; emoji: string }[] = [
  { value: "friendly", label: "Friendly", emoji: "😊" },
  { value: "professional", label: "Professional", emoji: "💼" },
  { value: "apologetic", label: "Apologetic", emoji: "🙏" },
  { value: "direct", label: "Direct", emoji: "🎯" },
  { value: "warm", label: "Warm", emoji: "🧡" },
  { value: "casual", label: "Casual", emoji: "✌️" },
];

export default function AppPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<Tone>("friendly");
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const id = getOrCreateUserId();
    setUserId(id);
    fetchCredits(id);
  }, []);

  async function fetchCredits(id: string) {
    try {
      const res = await fetch(`/api/credits?userId=${id}`);
      const data = await res.json();
      setCredits(data.credits ?? 0);
    } catch {
      setCredits(0);
    }
  }

  async function handleRewrite() {
    if (!message.trim()) {
      toast.error("Please paste a message first");
      return;
    }
    if (message.length > 2000) {
      toast.error("Message is too long (max 2000 characters)");
      return;
    }

    setLoading(true);
    try {
      // First try to use a credit
      const creditRes = await fetch("/api/use-credit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const creditData = await creditRes.json();

      if (creditData.success) {
        // Credit used – call rewrite
        const rewriteRes = await fetch("/api/rewrite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, tone, userId }),
        });
        const rewriteData = await rewriteRes.json();

        if (rewriteData.rewritten) {
          // Store temporarily and go to result
          sessionStorage.setItem(
            "softsend_result",
            JSON.stringify({
              original: message,
              rewritten: rewriteData.rewritten,
              tone,
            })
          );
          toast.success("Credit used!");
          router.push("/result");
        } else {
          toast.error(rewriteData.error || "Rewrite failed");
        }
        fetchCredits(userId);
      } else {
        // No credits – redirect to pay $1 flow
        // Store message temporarily
        sessionStorage.setItem(
          "softsend_pending",
          JSON.stringify({ message, tone })
        );
        // Create Stripe Checkout for $1
        const checkoutRes = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            mode: "single",
            message,
            tone,
          }),
        });
        const checkoutData = await checkoutRes.json();
        if (checkoutData.url) {
          window.location.href = checkoutData.url;
        } else {
          toast.error("Could not start payment");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <Link href="/" className="text-lg font-semibold text-soft-700">
          SoftSend
        </Link>
        <div className="flex items-center gap-3">
          {credits !== null && (
            <span className="text-sm bg-soft-100 text-soft-700 px-3 py-1 rounded-full font-medium">
              {credits} credit{credits !== 1 ? "s" : ""}
            </span>
          )}
          <Link
            href="/credits"
            className="text-sm text-soft-600 hover:underline"
          >
            Buy
          </Link>
        </div>
      </header>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">
        Fix an awkward message
      </h1>
      <p className="text-slate-500 text-sm mb-6">
        Paste the text that feels off. We’ll make it clearer and more natural.
      </p>

      {/* Message input */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Paste your awkward message here..."
        rows={6}
        className="w-full rounded-xl border border-slate-200 bg-white p-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-soft-400 resize-none"
      />
      <p className="text-xs text-slate-400 mt-1 text-right">
        {message.length}/2000
      </p>

      {/* Tone selector */}
      <h2 className="text-sm font-medium text-slate-700 mt-6 mb-3">
        Choose a tone
      </h2>
      <div className="grid grid-cols-3 gap-2">
        {TONES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTone(t.value)}
            className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-sm transition ${
              tone === t.value
                ? "border-soft-500 bg-soft-50 text-soft-800"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            <span className="text-xl">{t.emoji}</span>
            <span className="font-medium">{t.label}</span>
          </button>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={handleRewrite}
        disabled={loading || !message.trim()}
        className="mt-8 w-full rounded-full bg-soft-600 py-3.5 text-white font-medium shadow-lg shadow-soft-200 hover:bg-soft-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading
          ? "Working..."
          : credits && credits > 0
          ? "Rewrite with 1 credit"
          : "Rewrite for $1"}
      </button>

      <p className="mt-4 text-center text-xs text-slate-400">
        <Link href="/history" className="hover:underline">
          View history
        </Link>
        {" · "}
        <Link href="/credits" className="hover:underline">
          Credit packs
        </Link>
      </p>
    </main>
  );
}
