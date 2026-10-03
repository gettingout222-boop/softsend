import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-between max-w-3xl mx-auto w-full">
        <span className="text-xl font-semibold text-soft-700">SoftSend</span>
        <Link
          href="/credits"
          className="text-sm text-soft-600 hover:text-soft-800"
        >
          Buy Credits
        </Link>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 text-center max-w-lg mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
          Make awkward messages{" "}
          <span className="text-soft-600">sound natural</span>
        </h1>
        <p className="mt-4 text-slate-600 text-lg">
          Paste any message that feels off. SoftSend rewrites it so it comes across clear, warm, and human.
        </p>

        <Link
          href="/app"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-soft-600 px-8 py-3.5 text-white font-medium shadow-lg shadow-soft-200 hover:bg-soft-700 transition"
        >
          Fix a message →
        </Link>

        <p className="mt-4 text-sm text-slate-500">
          $1 per rewrite · or save with credit packs
        </p>
      </section>

      {/* How it works */}
      <section className="px-4 py-12 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto grid gap-8 sm:grid-cols-3 text-center">
          <div>
            <div className="text-2xl mb-2">1</div>
            <h3 className="font-medium text-slate-900">Paste your message</h3>
            <p className="mt-1 text-sm text-slate-500">
              The awkward text, email, or DM you want to fix.
            </p>
          </div>
          <div>
            <div className="text-2xl mb-2">2</div>
            <h3 className="font-medium text-slate-900">Pick a tone</h3>
            <p className="mt-1 text-sm text-slate-500">
              Friendly, professional, apologetic, and more.
            </p>
          </div>
          <div>
            <div className="text-2xl mb-2">3</div>
            <h3 className="font-medium text-slate-900">Get a better version</h3>
            <p className="mt-1 text-sm text-slate-500">
              Clear, natural, and ready to send.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-6 text-center text-sm text-slate-400 border-t border-slate-100">
        <div className="flex justify-center gap-4">
          <Link href="/privacy" className="hover:text-slate-600">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-slate-600">
            Terms
          </Link>
          <Link href="/history" className="hover:text-slate-600">
            History
          </Link>
        </div>
        <p className="mt-2">© {new Date().getFullYear()} SoftSend</p>
      </footer>
    </main>
  );
}
