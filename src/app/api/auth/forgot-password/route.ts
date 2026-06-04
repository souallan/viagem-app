import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createResetToken } from "@/lib/otp";
import { sendPasswordResetEmail } from "@/lib/email";
import { rateLimit, getIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // 3 requests per IP per 15 minutes
  const rl = await rateLimit({ key: `forgot:${getIp(req)}`, limit: 3, windowMs: 15 * 60 * 1000 });
  if (!rl.success) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde alguns minutos." }, { status: 429 });
  }

  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email obrigatório." }, { status: 400 });

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    // Always return OK to avoid user enumeration
    if (user && user.password) {
      const token = await createResetToken(normalizedEmail);
      await sendPasswordResetEmail(normalizedEmail, token, user.name).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
