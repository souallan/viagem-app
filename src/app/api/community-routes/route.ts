import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const routes = await prisma.communityRoute.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      activities: { orderBy: [{ day: "asc" }, { startTime: "asc" }] },
      _count: { select: { comments: true } },
    },
  });
  return NextResponse.json(routes);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, destination, country, continent, flag, duration, coverImage,
    description, tags, highlights, currency, estimatedBudget, activities, authorName } = body;

  if (!title || !destination || !description || !duration) {
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
  }

  const route = await prisma.communityRoute.create({
    data: {
      userId: session.user.id,
      authorName: authorName || session.user.name || "Viajante",
      title,
      destination,
      country: country ?? "",
      continent: continent ?? "Outros",
      flag: flag ?? "📍",
      duration: Number(duration),
      coverImage: coverImage ?? null,
      description,
      tags: Array.isArray(tags) ? tags.join(",") : (tags ?? ""),
      highlights: JSON.stringify(Array.isArray(highlights) ? highlights : []),
      currency: currency ?? "BRL",
      estimatedBudget: estimatedBudget ?? "",
      activities: {
        create: (Array.isArray(activities) ? activities : []).map((a: Record<string, unknown>) => ({
          title: String(a.title),
          type: String(a.type ?? "ACTIVITY"),
          day: Number(a.day),
          startTime: a.startTime ? String(a.startTime) : null,
          endTime: a.endTime ? String(a.endTime) : null,
          location: a.location ? String(a.location) : null,
          description: a.description ? String(a.description) : null,
          cost: a.cost ? Number(a.cost) : null,
        })),
      },
    },
    include: { activities: true },
  });

  return NextResponse.json(route, { status: 201 });
}
