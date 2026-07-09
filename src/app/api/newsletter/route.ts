import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const rl = await rateLimit({ key: `newsletter:${ip}`, limit: 3, windowMs: 60 * 60 * 1000 });
  if (!rl.success) {
    return NextResponse.json({ error: "Muitas tentativas. Tente mais tarde." }, { status: 429 });
  }

  const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  const { email } = await req.json().catch(() => ({}));
  if (!email || typeof email !== "string" || email.length > 254 || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "Email inválido." }, { status: 400 });
  }

  const normalized = email.trim().toLowerCase();

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email: normalized },
      update: {},
      create: { email: normalized },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro ao salvar. Tente novamente." }, { status: 500 });
  }
}
