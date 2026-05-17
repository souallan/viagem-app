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

  const items = await prisma.accommodation.findMany({
    where: { tripId: id },
    orderBy: { checkIn: "asc" },
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
    const { name, type, address, checkIn, checkOut, confirmationNumber, phone, website, cost, notes } = body;

    if (!name || !checkIn || !checkOut) {
      return NextResponse.json({ error: "Nome, check-in e check-out são obrigatórios" }, { status: 400 });
    }

    const item = await prisma.accommodation.create({
      data: {
        tripId: id,
        name,
        type: type ?? "HOTEL",
        address,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        confirmationNumber,
        phone,
        website,
        cost: cost ? parseFloat(cost) : null,
        notes,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar hospedagem" }, { status: 500 });
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

  await prisma.accommodation.deleteMany({ where: { id: itemId, tripId: id } });
  return NextResponse.json({ success: true });
}
