import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";
import { rateLimit, getIp } from "@/lib/rate-limit";

// Stricter rate limit for admin login: 3 attempts per IP per 15 minutes
export async function POST(req: NextRequest) {
  const rl = rateLimit({ key: `admin-login:${getIp(req)}`, limit: 3, windowMs: 15 * 60 * 1000 });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde 15 minutos." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    );
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Campos obrigatórios." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: String(email).trim().toLowerCase() },
    });

    // Always run bcrypt to prevent timing attacks regardless of outcome
    if (!user || !user.password) {
      await bcrypt.compare("dummy", "$2b$12$dummy.hash.that.never.matches.anything");
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 403 });
    }

    const valid = await bcrypt.compare(String(password), user.password);
    if (!valid || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 403 });
    }

    const otp = await createOtp(user.email);
    await sendOtpEmail(user.email, otp, user.name);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
