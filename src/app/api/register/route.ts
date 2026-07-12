import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createVerifyToken } from "@/lib/otp";
import { sendVerificationEmail } from "@/lib/email";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { stripHtml } from "@/lib/sanitize";
import { auditLog } from "@/lib/audit";

// Versão vigente dos documentos aceitos no cadastro (mantém prova do consentimento).
const LEGAL_VERSION = "2.0";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  // 5 registrations per IP per hour
  const rl = await rateLimit({ key: `register:${getIp(request)}`, limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rl.success) {
    return NextResponse.json({ error: "Muitas tentativas. Tente novamente em 1 hora." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const name: string = stripHtml((body.name ?? "").trim());
    const email: string = (body.email ?? "").trim().toLowerCase();
    const password: string = body.password ?? "";
    const refCode: string = (body.ref ?? "").trim().toUpperCase();
    const consent: boolean = body.consent === true;

    if (!consent) {
      return NextResponse.json(
        { error: "É necessário aceitar os Termos de Uso e a Política de Privacidade." },
        { status: 400 }
      );
    }

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nome, email e senha são obrigatórios" },
        { status: 400 }
      );
    }
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: "Nome deve ter entre 2 e 100 caracteres." },
        { status: 400 }
      );
    }
    if (!EMAIL_REGEX.test(email) || email.length > 254) {
      return NextResponse.json(
        { error: "Email inválido." },
        { status: 400 }
      );
    }
    if (password.length < 8 || password.length > 128) {
      return NextResponse.json(
        { error: "Senha deve ter entre 8 e 128 caracteres." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 409 }
      );
    }

    // Validate referral code if provided
    let validatedRef: string | undefined;
    if (refCode) {
      const referrer = await prisma.user.findUnique({ where: { referralCode: refCode }, select: { id: true } });
      if (referrer) validatedRef = refCode;
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, ...(validatedRef ? { referredBy: validatedRef } : {}) },
      select: { id: true, name: true, email: true },
    });

    // Registra a prova do consentimento (LGPD art. 8º, §2º): aceite dos Termos + Privacidade
    // e declaração de idade, com versão dos documentos, no momento do cadastro.
    await auditLog({
      actorId: user.id,
      actorEmail: user.email,
      action: "CONSENT_ACCEPT",
      targetId: user.id,
      targetType: "User",
      detail: `Aceitou Termos de Uso e Política de Privacidade (v${LEGAL_VERSION}) e declarou ter 13+ anos, no cadastro.`,
      ip: getIp(request),
    });

    // Send verification email (non-blocking — don't fail registration if email fails)
    try {
      const token = await createVerifyToken(email);
      await sendVerificationEmail(email, token, name);
    } catch {
      // Log but don't block registration
    }

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
