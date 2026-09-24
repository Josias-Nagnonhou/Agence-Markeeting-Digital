import { NextResponse } from "next/server";
import { getFounderSeatsRemaining, getVipSeatsRemaining } from "@/lib/account";

export async function GET() {
  const [founderSeatsRemaining, vipSeatsRemaining] = await Promise.all([
    getFounderSeatsRemaining(),
    getVipSeatsRemaining(),
  ]);
  return NextResponse.json({ founderSeatsRemaining, vipSeatsRemaining });
}
