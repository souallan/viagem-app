import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createVerifyToken } from "@/lib/otp";
import { sendVerificationEmail } from "@/lib/email";
import { rateLimit, getIp } from "@/lib/rate-limit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  // 5 registrations per IP per hour
  const rl = rateLimit({ key: `register:${getIp(request)}`, limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rl.success) {
    return NextResponse.json({ error: "Muitas tentativas. Tente novamente em 1 hora." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const name: string = (body.name ?? "").trim();
    const email: string = (body.email ?? "").trim().toLowerCase();
    const password: string = body.password ?? "";

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

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: { id: true, name: true, email: true },
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
