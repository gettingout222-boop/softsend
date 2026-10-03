import { NextRequest, NextResponse } from "next/server";
import { useCredit } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }

    const success = await useCredit(userId);
    return NextResponse.json({ success });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
