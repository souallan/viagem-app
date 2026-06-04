import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

function detectContinent(destination: string): string {
  const d = destination.toLowerCase();
  if (/(brasil|argentina|chile|colombia|peru|venezuela|uruguai|bolivia|equador|paraguai|america do sul|mexico|canada|estados unidos|cuba|jamaica|costa rica|america central|caribe)/.test(d)) return "Américas";
  if (/(franca|espanha|italia|alemanha|portugal|reino unido|holanda|belgica|suica|austria|polonia|republica tcheca|grecia|turquia|europa)/.test(d)) return "Europa";
  if (/(japao|china|coreia|tailandia|vietna|indonesia|india|singapura|malásia|filipinas|asia)/.test(d)) return "Ásia";
  if (/(dubai|emirados|arabia|israel|egipto|marrocos|africa do sul|quenia|africa|oriente medio)/.test(d)) return "Oriente Médio";
  return "Outros";
}

function destinationFlag(destination: string): string {
  const d = destination.toLowerCase();
  if (d.includes("brasil") || d.includes("brazil")) return "🇧🇷";
  if (d.includes("franca") || d.includes("france") || d.includes("paris")) return "🇫🇷";
  if (d.includes("italia") || d.includes("italy") || d.includes("roma") || d.includes("milao")) return "🇮🇹";
  if (d.includes("espanha") || d.includes("spain") || d.includes("madrid") || d.includes("barcelona")) return "🇪🇸";
  if (d.includes("portugal") || d.includes("lisboa") || d.includes("porto")) return "🇵🇹";
  if (d.includes("japao") || d.includes("japan") || d.includes("toquio") || d.includes("tokyo")) return "🇯🇵";
  if (d.includes("estados unidos") || d.includes("usa") || d.includes("new york") || d.includes("miami")) return "🇺🇸";
  if (d.includes("argentina") || d.includes("buenos aires")) return "🇦🇷";
  if (d.includes("colombia") || d.includes("bogota") || d.includes("cartagena")) return "🇨🇴";
  if (d.includes("dubai") || d.includes("emirados")) return "🇦🇪";
  return "📍";
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const trip = await prisma.trip.findFirst({
    where: { id, userId: session.user.id },
    include: {
      activities: { orderBy: [{ date: "asc" }, { startTime: "asc" }] },
    },
  });
  if (!trip) return NextResponse.json({ error: "Viagem não encontrada" }, { status: 404 });

  const body = await req.json();
  const { title, description, tags, estimatedBudget } = body;

  if (!title || !description) {
    return NextResponse.json({ error: "Título e descrição são obrigatórios" }, { status: 400 });
  }

  // Calculate duration in days
  let duration = 1;
  if (trip.startDate && trip.endDate) {
    duration = Math.max(1, Math.ceil((trip.endDate.getTime() - trip.startDate.getTime()) / 86400000));
  } else if (trip.activities.length > 0) {
    const dates = [...new Set(trip.activities.map((a) => a.date.toISOString().slice(0, 10)))];
    duration = Math.max(1, dates.length);
  }

  // Map trip activities to community activities (day number from date order)
  const sortedDates = [...new Set(trip.activities.map((a) => a.date.toISOString().slice(0, 10)))].sort();
  const dateToDay: Record<string, number> = {};
  sortedDates.forEach((d, i) => { dateToDay[d] = i + 1; });

  const destination = trip.destination.split(" → ")[0].trim();
  const continent = detectContinent(trip.destination);
  const flag = destinationFlag(trip.destination);

  try {
    const route = await prisma.communityRoute.create({
      data: {
        userId: session.user.id,
        authorName: session.user.name ?? "Viajante",
        title,
        destination: trip.destination,
        country: destination,
        continent,
        flag,
        duration,
        coverImage: trip.coverImage ?? null,
        description,
        tags: tags ?? "",
        highlights: JSON.stringify([]),
        currency: trip.currency,
        estimatedBudget: estimatedBudget ?? "",
        activities: {
          create: trip.activities.map((a) => ({
            title: a.title,
            type: a.type,
            day: dateToDay[a.date.toISOString().slice(0, 10)] ?? 1,
            startTime: a.startTime ?? null,
            endTime: a.endTime ?? null,
            location: a.location ?? null,
            description: a.description ?? null,
            cost: a.cost ?? null,
          })),
        },
      },
      include: { activities: true },
    });
    return NextResponse.json(route, { status: 201 });
  } catch (err) {
    logger.error("Share route error", { err: String(err) });
    return NextResponse.json({ error: "Erro ao compartilhar roteiro" }, { status: 500 });
  }
}
