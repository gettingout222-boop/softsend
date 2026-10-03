import { NextRequest, NextResponse } from "next/server";
import { rewriteMessage } from "@/lib/ai";
import type { Tone } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { message, tone } = await req.json();
    if (!message || !tone) {
      return NextResponse.json({ error: "Missing message or tone" }, { status: 400 });
    }

    const rewritten = await rewriteMessage(message, tone as Tone);
    return NextResponse.json({ rewritten });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Rewrite failed" }, { status: 500 });
  }
}
