import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const route = await prisma.communityRoute.findUnique({
    where: { id },
    include: { activities: { orderBy: [{ day: "asc" }, { startTime: "asc" }] } },
  });
  if (!route) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(route);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const route = await prisma.communityRoute.findUnique({ where: { id } });
  if (!route) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (route.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.communityRoute.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
