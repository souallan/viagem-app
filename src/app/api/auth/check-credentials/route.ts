import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { TRUST_COOKIE, isTrustedDeviceValid } from "@/lib/trusted-device";

export async function POST(req: NextRequest) {
  // 10 attempts per IP per 15 minutes
  const rl = await rateLimit({ key: `login:${getIp(req)}`, limit: 10, windowMs: 15 * 60 * 1000 });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde alguns minutos." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    );
  }

  try {
    const { email, password, forceOtp } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Campos obrigatórios." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: String(email).trim().toLowerCase() },
    });

    if (!user || !user.password) {
      // Timing-safe: still hash to avoid timing attacks
      await bcrypt.compare("dummy", "$2b$12$dummy.hash.that.never.matches.anything");
      return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
    }

    const valid = await bcrypt.compare(String(password), user.password);
    if (!valid) {
      return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
    }

    if (user.role === "ADMIN") {
      return NextResponse.json(
        { error: "Administradores devem acessar pelo painel exclusivo." },
        { status: 403 }
      );
    }

    // Dispositivo confiável ("confiar neste computador") → pula o OTP.
    // Só vale se o cookie httpOnly `rdt` bate com um registro válido DESTE usuário;
    // outro navegador/dispositivo/local não tem o cookie e cai no OTP normal.
    if (!forceOtp) {
      const rdt = req.cookies.get(TRUST_COOKIE)?.value;
      if (rdt && (await isTrustedDeviceValid(rdt, user.id))) {
        return NextResponse.json({ ok: true, trusted: true });
      }
    }

    // Caso padrão — gera e envia o OTP por email
    const otp = await createOtp(user.email);
    await sendOtpEmail(user.email, otp, user.name);

    return NextResponse.json({ ok: true, trusted: false });
  } catch {
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
