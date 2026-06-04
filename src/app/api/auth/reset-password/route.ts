import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { verifyResetToken } from "@/lib/otp";
import { rateLimit, getIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const rl = await rateLimit({ key: `reset:${getIp(req)}`, limit: 5, windowMs: 15 * 60 * 1000 });
  if (!rl.success) {
    return NextResponse.json({ error: "Muitas tentativas." }, { status: 429 });
  }

  try {
    const { email, token, password } = await req.json();

    if (!email || !token || !password) {
      return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
    }
    if (password.length < 8 || password.length > 128) {
      return NextResponse.json({ error: "Senha deve ter entre 8 e 128 caracteres." }, { status: 400 });
    }

    const valid = await verifyResetToken(String(email).trim().toLowerCase(), String(token));
    if (!valid) {
      return NextResponse.json({ error: "Link inválido ou expirado." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { email: String(email).trim().toLowerCase() },
      data: { password: hashed },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
