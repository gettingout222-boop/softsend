import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { addCredits } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, userId } = await req.json();
    if (!sessionId || !userId) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ success: false, error: "Not paid" });
    }

    // Prevent double-crediting (simple check via metadata or a processed flag)
    // For production you’d store processed session IDs in Redis
    const creditsToAdd = parseInt(session.metadata?.credits || "0", 10);
    if (creditsToAdd < 1) {
      return NextResponse.json({ success: false, error: "Invalid credits" });
    }

    // Check if this session was already processed
    const alreadyProcessed = session.metadata?.processed === "true";
    if (alreadyProcessed) {
      return NextResponse.json({ success: true, creditsAdded: 0 });
    }

    await addCredits(userId, creditsToAdd);

    // Mark as processed (best-effort; for stronger guarantee use Redis set)
    await stripe.checkout.sessions.update(sessionId, {
      metadata: { ...session.metadata, processed: "true" },
    });

    return NextResponse.json({ success: true, creditsAdded: creditsToAdd });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
