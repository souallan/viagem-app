import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

async function verifyTrip(tripId: string, userId: string) {
  return prisma.trip.findFirst({ where: { id: tripId, OR: [{ userId }, { members: { some: { userId, role: "EDITOR" } } }] } });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const uid = session.user.id;
  const trip = await prisma.trip.findFirst({ where: { id, OR: [{ userId: uid }, { members: { some: { userId: uid } } }] } });
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
    const { name, type, address, checkIn, checkOut, confirmationNumber, phone, website, cost, currency, notes, attachmentUrl } = body;

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
        currency: currency ?? "BRL",
        notes,
        attachmentUrl: attachmentUrl || null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error("accommodations POST failed", { msg });
    return NextResponse.json({ error: msg }, { status: 500 });
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
    const { itemId, name, type, address, checkIn, checkOut, confirmationNumber, phone, website, cost, currency, notes, attachmentUrl } = body;

    if (!itemId || !name || !checkIn || !checkOut) {
      return NextResponse.json({ error: "ID, nome, check-in e check-out são obrigatórios" }, { status: 400 });
    }

    await prisma.accommodation.updateMany({
      where: { id: itemId, tripId: id },
      data: {
        name,
        type: type ?? "HOTEL",
        address: address || null,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        confirmationNumber: confirmationNumber || null,
        phone: phone || null,
        website: website || null,
        cost: cost ? parseFloat(cost) : null,
        currency: currency ?? "BRL",
        notes: notes || null,
        attachmentUrl: attachmentUrl || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar hospedagem" }, { status: 500 });
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
