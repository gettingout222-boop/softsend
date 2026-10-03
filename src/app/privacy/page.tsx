import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen max-w-2xl mx-auto px-4 py-8 prose prose-slate">
      <Link href="/" className="text-soft-600 hover:underline text-sm no-underline">
        ← SoftSend
      </Link>
      <h1 className="text-2xl font-bold mt-4">Privacy Policy</h1>
      <p className="text-sm text-slate-500">Last updated: September 25, 2026</p>

      <h2>What we collect</h2>
      <p>
        SoftSend stores a temporary anonymous user ID in your browser (localStorage) 
        so we can track your credit balance. Message content is sent to our AI provider 
        (Anthropic) only for the purpose of rewriting and is not stored permanently on our servers.
      </p>
      <p>
        History of your last 10 rewrites is stored only in your browser’s localStorage 
        and never sent to our servers.
      </p>

      <h2>Payments</h2>
      <p>
        Payments are processed by Stripe. We do not store your full card details.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy questions, contact us at privacy@softsend.app (replace with your real email).
      </p>
    </main>
  );
}
