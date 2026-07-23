import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { auditLog } from "@/lib/audit";

async function adminSession() {
  const session = await auth();
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "ADMIN";
  return { session, isAdmin };
}

/** Fila de moderação: roteiros da comunidade e relatos aguardando aprovação. */
export async function GET() {
  const { isAdmin } = await adminSession();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [routes, experiences] = await Promise.all([
    prisma.communityRoute.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      select: {
        id: true, title: true, destination: true, authorName: true,
        duration: true, description: true, coverImage: true, createdAt: true,
        _count: { select: { activities: true } },
      },
    }),
    prisma.experience.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      select: {
        id: true, title: true, destination: true, excerpt: true, content: true,
        coverImage: true, createdAt: true,
        user: { select: { name: true, email: true } },
      },
    }),
  ]);

  return NextResponse.json({ routes, experiences });
}

const TIPOS = ["route", "experience"] as const;
const ACOES = ["APPROVE", "REJECT"] as const;

/** Aprova ou rejeita um item da fila. */
export async function PATCH(req: NextRequest) {
  const { session, isAdmin } = await adminSession();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { type, id, action } = await req.json();
  if (!TIPOS.includes(type) || !id || !ACOES.includes(action)) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const status = action === "APPROVE" ? "APPROVED" : "REJECTED";

  if (type === "route") {
    const r = await prisma.communityRoute.update({
      where: { id }, data: { status }, select: { id: true, title: true },
    });
    await auditLog({
      actorId: session!.user!.id!, actorEmail: session!.user!.email ?? "",
      action: `ROUTE_${action}`, targetId: id, targetType: "CommunityRoute",
      detail: `Roteiro "${r.title}" ${action === "APPROVE" ? "aprovado" : "rejeitado"}`,
      ip: req.headers.get("x-forwarded-for") ?? undefined,
    });
  } else {
    const e = await prisma.experience.update({
      where: { id }, data: { status }, select: { id: true, title: true },
    });
    await auditLog({
      actorId: session!.user!.id!, actorEmail: session!.user!.email ?? "",
      action: `EXPERIENCE_${action}`, targetId: id, targetType: "Experience",
      detail: `Relato "${e.title}" ${action === "APPROVE" ? "aprovado" : "rejeitado"}`,
      ip: req.headers.get("x-forwarded-for") ?? undefined,
    });
  }

  return NextResponse.json({ ok: true, status });
}
