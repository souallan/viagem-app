import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripHtml } from "@/lib/sanitize";

async function verifyTrip(tripId: string, userId: string) {
  return prisma.trip.findFirst({ where: { id: tripId, OR: [{ userId }, { members: { some: { userId } } }] } });
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

  const participants = await prisma.tripParticipant.findMany({
    where: { tripId: id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(participants);
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
    const name = stripHtml(String(body.name ?? "")).trim();
    if (!name) return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });

    const participant = await prisma.tripParticipant.create({
      data: { tripId: id, name, userId: body.userId || null },
    });
    return NextResponse.json(participant, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao adicionar participante" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const trip = await verifyTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Viagem não encontrada" }, { status: 404 });

  const { participantId } = await req.json();
  await prisma.tripParticipant.deleteMany({ where: { id: participantId, tripId: id } });
  return NextResponse.json({ success: true });
}
