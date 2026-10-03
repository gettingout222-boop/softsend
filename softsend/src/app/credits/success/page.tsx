"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { getOrCreateUserId } from "@/lib/user";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [creditsAdded, setCreditsAdded] = useState(0);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setStatus("error");
      return;
    }

    const userId = getOrCreateUserId();

    fetch("/api/verify-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, userId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setCreditsAdded(data.creditsAdded || 0);
          setStatus("success");
          toast.success(`+${data.creditsAdded} credits added!`);

          // If there was a pending single rewrite, process it
          const pending = sessionStorage.getItem("softsend_pending");
          if (pending && data.creditsAdded === 1) {
            // Will be handled by user going back to app, or we can auto-rewrite
            // For simplicity, just clear and let them go to app
          }
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [searchParams]);

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Confirming payment...</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-slate-500 mb-6">
          We couldn’t confirm the payment. Please contact support if you were charged.
        </p>
        <Link
          href="/credits"
          className="text-soft-600 hover:underline"
        >
          Back to credits
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center max-w-md mx-auto">
      <div className="text-5xl mb-4">✓</div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        Payment successful
      </h1>
      <p className="text-slate-600 mb-8">
        {creditsAdded} credit{creditsAdded !== 1 ? "s" : ""} added to your account.
      </p>
      <Link
        href="/app"
        className="inline-flex rounded-full bg-soft-600 px-8 py-3.5 text-white font-medium shadow-lg shadow-soft-200 hover:bg-soft-700 transition"
      >
        Go rewrite a message
      </Link>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
