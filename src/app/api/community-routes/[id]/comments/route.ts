import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comments = await prisma.routeComment.findMany({
    where: { routeId: id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(comments);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const route = await prisma.communityRoute.findUnique({ where: { id } });
  if (!route) return NextResponse.json({ error: "Route not found" }, { status: 404 });

  const { content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Conteúdo obrigatório" }, { status: 400 });

  try {
    const comment = await prisma.routeComment.create({
      data: {
        routeId: id,
        userId: session.user.id,
        userName: session.user.name ?? "Viajante",
        content: content.trim(),
      },
    });
    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao salvar comentário" }, { status: 500 });
  }
}
