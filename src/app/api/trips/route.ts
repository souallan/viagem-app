import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActivePlan, PLAN_LIMITS } from "@/lib/plans";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const trips = await prisma.trip.findMany({
    where: { OR: [{ userId: session.user.id }, { members: { some: { userId: session.user.id } } }] },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { activities: true, expenses: true },
      },
    },
  });

  return NextResponse.json(trips);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    // Check plan limits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, planExpiresAt: true },
    });
    const activePlan = getActivePlan(user?.plan ?? "FREE", user?.planExpiresAt);
    const limit = PLAN_LIMITS[activePlan].trips;

    if (limit !== Infinity) {
      const count = await prisma.trip.count({ where: { userId: session.user.id } });
      if (count >= limit) {
        const msg = limit === 1
          ? "O plano gratuito inclui 1 viagem. Assine o Premium para criar quantas quiser."
          : `O plano gratuito permite até ${limit} viagens. Assine o Premium para criar quantas quiser.`;
        return NextResponse.json({ error: msg, code: "PLAN_LIMIT" }, { status: 403 });
      }
    }

    const body = await request.json();
    const { title, destination, description, startDate, endDate, currency, budget, status, coverImage } = body;

    if (!title || !destination) {
      return NextResponse.json(
        { error: "Título e destino são obrigatórios" },
        { status: 400 }
      );
    }

    const trip = await prisma.trip.create({
      data: {
        title,
        destination,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        currency: currency ?? "BRL",
        budget: budget ? parseFloat(budget) : null,
        status: status ?? "PLANNING",
        coverImage: coverImage ?? null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(trip, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar viagem" }, { status: 500 });
  }
}
