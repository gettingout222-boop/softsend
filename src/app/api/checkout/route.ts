import { NextRequest, NextResponse } from "next/server";
import { stripe, CREDIT_PACKS } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { userId, mode } = await req.json();
    if (!userId || !mode) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const pack = CREDIT_PACKS.find((p) => p.id === mode);
    if (!pack) {
      return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: pack.label,
              description: pack.description,
            },
            unit_amount: pack.price,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/credits/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/credits`,
      metadata: {
        userId,
        credits: String(pack.credits),
        packId: pack.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
