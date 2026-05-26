import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getOwned(id: string, userId: string) {
  return prisma.experience.findFirst({ where: { id, userId } });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const exp = await getOwned(id, session.user.id);
  if (!exp) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(exp);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const exp = await getOwned(id, session.user.id);
  if (!exp) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const { title, destination, tripDate, coverImage, excerpt, content, rating, mood, tags } = body;

  const updated = await prisma.experience.update({
    where: { id },
    data: {
      title,
      destination,
      tripDate,
      coverImage: coverImage ?? null,
      excerpt: excerpt ?? null,
      content,
      rating: rating ? parseInt(rating) : null,
      mood: mood ?? null,
      tags: tags ?? null,
    },
  });

  return NextResponse.json(updated);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const exp = await getOwned(id, session.user.id);
  if (!exp) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { publishedAsTip } = await req.json();
  const updated = await prisma.experience.update({
    where: { id },
    data: { publishedAsTip: Boolean(publishedAsTip) },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const exp = await getOwned(id, session.user.id);
  if (!exp) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.experience.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
