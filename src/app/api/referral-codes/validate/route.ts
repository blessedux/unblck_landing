import { NextResponse } from "next/server";
import { validateReferralCode } from "@/lib/referral-codes";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { code?: string };

    if (!body.code?.trim()) {
      return NextResponse.json(
        { valid: false, error: "Referral code is required." },
        { status: 400 },
      );
    }

    const result = await validateReferralCode(body.code);

    if (!result.valid) {
      return NextResponse.json(
        { valid: false, error: result.error },
        { status: 400 },
      );
    }

    return NextResponse.json({ valid: true, code: result.code });
  } catch (error) {
    console.error("Referral code validation error:", error);
    return NextResponse.json(
      { valid: false, error: "Server configuration error" },
      { status: 500 },
    );
  }
}
