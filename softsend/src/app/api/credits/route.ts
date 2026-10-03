import { NextRequest, NextResponse } from "next/server";
import { getCredits } from "@/lib/redis";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const credits = await getCredits(userId);
    return NextResponse.json({ credits });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ credits: 0 });
  }
}
