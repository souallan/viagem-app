import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, createdAt: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [trips, experiences, routes] = await Promise.all([
    prisma.trip.count({ where: { userId: session.user.id } }),
    prisma.experience.count({ where: { userId: session.user.id } }),
    prisma.communityRoute.count({ where: { userId: session.user.id } }),
  ]);

  return NextResponse.json({ ...user, stats: { trips, experiences, routes } });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, image, currentPassword, newPassword } = body;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: Record<string, unknown> = {};

  if (name !== undefined) data.name = name.trim() || user.name;
  if (image !== undefined) data.image = image || null;

  if (newPassword) {
    if (!currentPassword) return NextResponse.json({ error: "Informe a senha atual." }, { status: 400 });
    if (!user.password) return NextResponse.json({ error: "Conta sem senha local." }, { status: 400 });
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return NextResponse.json({ error: "Senha atual incorreta." }, { status: 400 });
    if (newPassword.length < 8) return NextResponse.json({ error: "A nova senha deve ter mínimo 8 caracteres." }, { status: 400 });
    data.password = await bcrypt.hash(newPassword, 12);
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: { id: true, name: true, email: true, image: true },
  });

  return NextResponse.json(updated);
}
