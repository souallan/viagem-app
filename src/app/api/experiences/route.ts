import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripHtml } from "@/lib/sanitize";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const experiences = await prisma.experience.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(experiences);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, destination, tripDate, coverImage, excerpt, content, rating, mood, tags } = body;

  if (!title || !destination || !tripDate || !content) {
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
  }

  try {
    const experience = await prisma.experience.create({
      data: {
        userId:      session.user.id,
        title:       stripHtml(title),
        destination: stripHtml(destination),
        tripDate,
        coverImage:  coverImage ?? null,
        excerpt:     excerpt     ? stripHtml(excerpt)  : null,
        content:     stripHtml(content),
        rating:      rating ? parseInt(rating) : null,
        mood:        mood ?? null,
        tags:        tags  ? stripHtml(tags)   : null,
      },
    });
    return NextResponse.json(experience, { status: 201 });
  } catch (err) {
    console.error("Experience create error:", err);
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
  }
}
