import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActivePlan } from "@/lib/plans";

/** Duas datas representam o mesmo dia? (compara o dia, ignora hora/fuso) */
function mesmoDia(a: Date | null, b: Date | null): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);
}

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

    let novoDestino = destination;
    let novoInicio = startDate ? new Date(startDate) : null;
    let novoFim = endDate ? new Date(endDate) : null;

    // ── Congelamento no plano GRÁTIS ──
    // Destino e datas, uma vez preenchidos, não podem ser alterados no gratuito:
    // é o que impede reaproveitar a mesma viagem (única no grátis) para planejar
    // outra. O Premium destrava. Isto é a barreira de verdade (o cliente também
    // renderiza os campos travados, mas a regra vale no servidor).
    // Preservamos o valor atual em vez de recusar o request inteiro, para não
    // quebrar a edição de outros campos (título, descrição, orçamento).
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, planExpiresAt: true },
    });
    const isPremium = getActivePlan(user?.plan ?? "FREE", user?.planExpiresAt) === "PREMIUM";

    if (!isPremium) {
      if (trip.destination && trip.destination.trim()) novoDestino = trip.destination;
      if (trip.startDate) novoInicio = trip.startDate;
      if (trip.endDate) novoFim = trip.endDate;
    }

    const updated = await prisma.trip.update({
      where: { id },
      data: {
        title,
        destination: novoDestino,
        description,
        startDate: novoInicio,
        endDate: novoFim,
        currency,
        budget: budget ? parseFloat(budget) : null,
        status,
        coverImage,
      },
    });

    // Informa ao cliente se alguma alteração de campo travado foi ignorada, para
    // ele poder avisar o usuário em vez de fingir que salvou.
    const bloqueado = !isPremium && (
      (!!trip.destination?.trim() && destination !== trip.destination) ||
      (!!trip.startDate && !mesmoDia(novoInicio, startDate ? new Date(startDate) : null)) ||
      (!!trip.endDate && !mesmoDia(novoFim, endDate ? new Date(endDate) : null))
    );

    return NextResponse.json({ ...updated, lockedIgnored: bloqueado });
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}

// Atualização parcial (ex.: opt-in de alertas do destino) — não mexe em datas/orçamento
export async function PATCH(
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
    const data: { alertsEnabled?: boolean } = {};
    if (typeof body.alertsEnabled === "boolean") data.alertsEnabled = body.alertsEnabled;
    const updated = await prisma.trip.update({ where: { id }, data });
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
