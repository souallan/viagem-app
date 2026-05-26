import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function verifyTrip(tripId: string, userId: string) {
  return prisma.trip.findFirst({ where: { id: tripId, userId } });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const trip = await verifyTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Viagem não encontrada" }, { status: 404 });

  const activities = await prisma.activity.findMany({
    where: { tripId: id },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  return NextResponse.json(activities);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const trip = await verifyTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Viagem não encontrada" }, { status: 404 });

  try {
    const body = await req.json();
    const { title, description, type, date, startTime, endTime, city, location, address, bookingRef, cost, notes } = body;

    if (!title || !date) {
      return NextResponse.json({ error: "Título e data são obrigatórios" }, { status: 400 });
    }

    const activity = await prisma.activity.create({
      data: {
        tripId: id,
        title,
        description,
        type: type ?? "ACTIVITY",
        date: new Date(date),
        startTime,
        endTime,
        city,
        location,
        address,
        bookingRef,
        cost: cost ? parseFloat(cost) : null,
        notes,
      },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar atividade" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const trip = await verifyTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Viagem não encontrada" }, { status: 404 });

  try {
    const body = await req.json();
    const { activityId, title, description, type, date, startTime, endTime, city, location, address, bookingRef, cost, notes } = body;

    if (!activityId || !title || !date) {
      return NextResponse.json({ error: "ID, título e data são obrigatórios" }, { status: 400 });
    }

    await prisma.activity.updateMany({
      where: { id: activityId, tripId: id },
      data: {
        title,
        description: description || null,
        type: type ?? "ACTIVITY",
        date: new Date(date),
        startTime: startTime || null,
        endTime: endTime || null,
        city: city || null,
        location: location || null,
        address: address || null,
        bookingRef: bookingRef || null,
        cost: cost ? parseFloat(cost) : null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar atividade" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const { activityId } = await req.json();

  await prisma.activity.deleteMany({ where: { id: activityId, tripId: id } });
  return NextResponse.json({ success: true });
}
