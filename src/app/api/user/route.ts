import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { auditLog } from "@/lib/audit";
import { stripHtml } from "@/lib/sanitize";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, createdAt: true, country: true, currency: true, bio: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [trips, experiences, routes] = await Promise.all([
    prisma.trip.count({ where: { userId: session.user.id } }),
    prisma.experience.count({ where: { userId: session.user.id } }),
    prisma.communityRoute.count({ where: { userId: session.user.id } }),
  ]);

  return NextResponse.json({ ...user, stats: { trips, experiences, routes } });
}

const ALLOWED_IMAGE_DOMAINS = ["images.unsplash.com", "res.cloudinary.com", "lh3.googleusercontent.com", "avatars.githubusercontent.com"];

function isAllowedImageUrl(url: string | null | undefined): boolean {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && ALLOWED_IMAGE_DOMAINS.some((d) => parsed.hostname === d);
  } catch {
    return false;
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, image, currentPassword, newPassword, country, currency, bio } = body;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: Record<string, unknown> = {};

  if (name !== undefined) {
    const trimmed = stripHtml(String(name ?? "").trim());
    if (trimmed.length < 2 || trimmed.length > 100) {
      return NextResponse.json({ error: "Nome deve ter entre 2 e 100 caracteres." }, { status: 400 });
    }
    data.name = trimmed;
  }

  if (image !== undefined) {
    if (image && !isAllowedImageUrl(image)) {
      return NextResponse.json({ error: "URL de imagem não permitida." }, { status: 400 });
    }
    data.image = image || null;
  }

  if (country !== undefined) {
    data.country = country || null;
  }

  if (currency !== undefined) {
    const VALID_CURRENCIES = ["BRL", "USD", "EUR", "GBP", "ARS", "CLP", "COP", "MXN", "PYG", "UYU", "JPY", "CNY", "AUD", "CAD"];
    if (currency && !VALID_CURRENCIES.includes(currency)) {
      return NextResponse.json({ error: "Moeda inválida." }, { status: 400 });
    }
    data.currency = currency || "BRL";
  }

  if (bio !== undefined) {
    const trimmedBio = stripHtml(String(bio ?? "").trim());
    if (trimmedBio.length > 300) {
      return NextResponse.json({ error: "Bio deve ter no máximo 300 caracteres." }, { status: 400 });
    }
    data.bio = trimmedBio || null;
  }

  if (newPassword) {
    if (!currentPassword) return NextResponse.json({ error: "Informe a senha atual." }, { status: 400 });
    if (!user.password) return NextResponse.json({ error: "Conta sem senha local." }, { status: 400 });
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return NextResponse.json({ error: "Senha atual incorreta." }, { status: 400 });
    if (newPassword.length < 8 || newPassword.length > 128) return NextResponse.json({ error: "A nova senha deve ter entre 8 e 128 caracteres." }, { status: 400 });
    data.password = await bcrypt.hash(newPassword, 12);
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: { id: true, name: true, email: true, image: true, country: true, currency: true, bio: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { password } = await req.json();
  if (!password) return NextResponse.json({ error: "Confirme com sua senha." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (user.password) {
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ error: "Senha incorreta." }, { status: 400 });
  }

  await auditLog({
    actorId: user.id,
    actorEmail: user.email,
    action: "ACCOUNT_DELETE",
    targetId: user.id,
    targetType: "User",
    detail: `Conta excluída pelo próprio usuário: ${user.email}`,
    ip: req.headers.get("x-forwarded-for") ?? undefined,
  });

  // Cascade delete via Prisma schema (onDelete: Cascade on all relations)
  await prisma.user.delete({ where: { id: user.id } });

  return NextResponse.json({ ok: true });
}
