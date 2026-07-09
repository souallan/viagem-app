import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getTrip(id: string, userId: string) {
  return prisma.trip.findFirst({
    where: { id, userId },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const uid = session.user.id;
  const trip = await prisma.trip.findFirst({
    where: { id, OR: [{ userId: uid }, { members: { some: { userId: uid } } }] },
    include: {
      activities: { orderBy: { date: "asc" } },
      accommodations: { orderBy: { checkIn: "asc" } },
      transports: { orderBy: { departureTime: "asc" } },
      expenses: { orderBy: { date: "desc" } },
      documents: { orderBy: { createdAt: "desc" } },
      packingList: { include: { items: { orderBy: { category: "asc" } } } },
    },
  });

  if (!trip) {
    return NextResponse.json({ error: "Viagem não encontrada" }, { status: 404 });
  }

  return NextResponse.json(trip);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const trip = await getTrip(id, session.user.id);
  if (!trip) {
    return NextResponse.json({ error: "Viagem não encontrada" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { title, destination, description, startDate, endDate, currency, budget, status, coverImage } = body;

    const updated = await prisma.trip.update({
      where: { id },
      data: {
        title,
        destination,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        currency,
        budget: budget ? parseFloat(budget) : null,
        status,
        coverImage,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const trip = await getTrip(id, session.user.id);
  if (!trip) {
    return NextResponse.json({ error: "Viagem não encontrada" }, { status: 404 });
  }

  await prisma.trip.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
