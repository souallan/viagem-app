import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { auditLog } from "@/lib/audit";

async function requireAdmin() {
  const session = await auth();
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "ADMIN";
  return { session, isAdmin };
}

export async function GET() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const comments = await prisma.routeComment.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true, content: true, userName: true, createdAt: true,
      route: { select: { id: true, title: true, destination: true } },
      user: { select: { id: true, email: true } },
    },
  });
  return NextResponse.json(comments);
}

export async function DELETE(req: NextRequest) {
  const { session, isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.routeComment.delete({ where: { id } });

  await auditLog({
    actorId: session!.user!.id!,
    actorEmail: session!.user!.email ?? "",
    action: "COMMENT_DELETE",
    targetId: id,
    targetType: "RouteComment",
    detail: `Comentário excluído pelo admin`,
    ip: req.headers.get("x-forwarded-for") ?? undefined,
  });

  return NextResponse.json({ ok: true });
}
