import { NextRequest, NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/otp";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) {
    return NextResponse.redirect(new URL("/verify-email?error=invalid", req.url));
  }

  const ok = await verifyEmailToken(decodeURIComponent(email), token);
  if (!ok) {
    return NextResponse.redirect(new URL("/verify-email?error=expired", req.url));
  }

  return NextResponse.redirect(new URL("/verify-email?success=1", req.url));
}
