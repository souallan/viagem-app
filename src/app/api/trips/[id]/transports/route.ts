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

  const items = await prisma.transport.findMany({
    where: { tripId: id },
    orderBy: { departureTime: "asc" },
  });

  return NextResponse.json(items);
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
    const { type, from, to, departureTime, arrivalTime, carrier, bookingRef, seat, cost, notes } = body;

    if (!from || !to || !departureTime) {
      return NextResponse.json({ error: "Origem, destino e horário de partida são obrigatórios" }, { status: 400 });
    }

    const item = await prisma.transport.create({
      data: {
        tripId: id,
        type: type ?? "FLIGHT",
        from,
        to,
        departureTime: new Date(departureTime),
        arrivalTime: arrivalTime ? new Date(arrivalTime) : null,
        carrier,
        bookingRef,
        seat,
        cost: cost ? parseFloat(cost) : null,
        notes,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar transporte" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const { itemId } = await req.json();

  await prisma.transport.deleteMany({ where: { id: itemId, tripId: id } });
  return NextResponse.json({ success: true });
}
