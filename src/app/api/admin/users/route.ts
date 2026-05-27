import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { auditLog } from "@/lib/audit";

async function adminSession() {
  const session = await auth();
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "ADMIN";
  return { session, isAdmin };
}

export async function GET() {
  const { isAdmin } = await adminSession();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      _count: { select: { trips: true, experiences: true, communityRoutes: true } },
    },
  });

  return NextResponse.json(users);
}

export async function PATCH(req: NextRequest) {
  const { session, isAdmin } = await adminSession();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, role } = await req.json();
  if (!id || !["USER", "ADMIN"].includes(role)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, email: true, role: true },
  });

  await auditLog({
    actorId: session!.user!.id!,
    actorEmail: session!.user!.email ?? "",
    action: "USER_ROLE_CHANGE",
    targetId: id,
    targetType: "User",
    detail: `Role alterado para ${role} em ${updated.email}`,
    ip: req.headers.get("x-forwarded-for") ?? undefined,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const { session, isAdmin } = await adminSession();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  if (session?.user?.id === id) {
    return NextResponse.json({ error: "Não pode excluir sua própria conta." }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id }, select: { email: true } });
  await prisma.user.delete({ where: { id } });

  await auditLog({
    actorId: session!.user!.id!,
    actorEmail: session!.user!.email ?? "",
    action: "USER_DELETE",
    targetId: id,
    targetType: "User",
    detail: `Usuário deletado: ${target?.email}`,
    ip: req.headers.get("x-forwarded-for") ?? undefined,
  });

  return NextResponse.json({ ok: true });
}
