import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const trips = await prisma.trip.findMany({
    where: { userId: session.user.id },
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
