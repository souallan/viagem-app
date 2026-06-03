import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { stripHtml } from "@/lib/sanitize";
import { containsProfanity } from "@/lib/content-filter";

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

  const cleanTitle       = stripHtml(title);
  const cleanDestination = stripHtml(destination);
  const cleanDescription = stripHtml(description);

  if (!cleanTitle || !cleanDestination || !cleanDescription || !duration) {
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
  }

  if (containsProfanity(cleanTitle) || containsProfanity(cleanDescription)) {
    return NextResponse.json({ error: "O conteúdo contém linguagem inapropriada." }, { status: 422 });
  }

  const cleanHighlights = (Array.isArray(highlights) ? highlights : []).map(stripHtml).filter(Boolean);
  const cleanTags       = Array.isArray(tags) ? tags.map(stripHtml).filter(Boolean) : [];

  const route = await prisma.communityRoute.create({
    data: {
      userId: session.user.id,
      authorName: stripHtml(authorName) || session.user.name || "Viajante",
      title:       cleanTitle,
      destination: cleanDestination,
      country:     stripHtml(country) || "",
      continent:   stripHtml(continent) || "Outros",
      flag:        flag ?? "📍",
      duration:    Number(duration),
      coverImage:  coverImage ?? null,
      description: cleanDescription,
      tags:        cleanTags.join(","),
      highlights:  JSON.stringify(cleanHighlights),
      currency:    currency ?? "BRL",
      estimatedBudget: estimatedBudget ?? "",
      activities: {
        create: (Array.isArray(activities) ? activities : []).map((a: Record<string, unknown>) => ({
          title:       stripHtml(a.title),
          type:        String(a.type ?? "ACTIVITY"),
          day:         Number(a.day),
          startTime:   a.startTime ? String(a.startTime) : null,
          endTime:     a.endTime ? String(a.endTime) : null,
          location:    a.location ? stripHtml(a.location) : null,
          description: a.description ? stripHtml(a.description) : null,
          cost:        a.cost ? Number(a.cost) : null,
        })),
      },
    },
    include: { activities: true },
  });

  return NextResponse.json(route, { status: 201 });
}
