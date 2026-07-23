import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripHtml } from "@/lib/sanitize";
import { logger } from "@/lib/logger";
import { planLimitFor, planLimitError } from "@/lib/plan-guard";

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

  const limit = await planLimitFor(session.user.id, "experiences");
  if (limit !== Infinity) {
    const count = await prisma.experience.count({ where: { userId: session.user.id } });
    if (count >= limit) {
      // limit === 0 significa "recurso exclusivo do Premium"; dizer "permite até
      // 0 relatos" soaria como erro do sistema.
      return NextResponse.json(
        planLimitError(
          limit === 0
            ? "Publicar relatos de viagem é um recurso Premium. Seus relatos já criados continuam disponíveis."
            : `O plano gratuito permite até ${limit} relatos. Assine o Premium para publicar quantos quiser.`
        ),
        { status: 403 }
      );
    }
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
    logger.error("Experience create error", { err: String(err) });
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
  }
}
