import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  const expenses = await prisma.expense.findMany({
    where: { tripId: id },
    orderBy: { date: "desc" },
    include: { shares: { select: { participantId: true } } },
  });

  return NextResponse.json(expenses);
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
    const { title, category, amount, currency, date, notes, paidBy, paidById, sharedBy } = body;

    if (!title || !amount || !date) {
      return NextResponse.json({ error: "Título, valor e data são obrigatórios" }, { status: 400 });
    }

    const expense = await prisma.expense.create({
      data: {
        tripId: id,
        title,
        category: category ?? "OTHER",
        amount: parseFloat(amount),
        currency: currency ?? trip.currency,
        date: new Date(date),
        notes,
        paidBy,
        paidById: paidById || null,
      },
    });

    if (Array.isArray(sharedBy) && sharedBy.length > 0) {
      await prisma.expenseShare.createMany({
        data: sharedBy.map((pid: string) => ({ expenseId: expense.id, participantId: pid })),
      });
    }

    return NextResponse.json(expense, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar despesa" }, { status: 500 });
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
    const { expenseId, title, category, amount, currency, date, notes, paidBy, paidById, sharedBy } = body;

    if (!expenseId || !title || !amount || !date) {
      return NextResponse.json({ error: "ID, título, valor e data são obrigatórios" }, { status: 400 });
    }

    const owns = await prisma.expense.findFirst({ where: { id: expenseId, tripId: id }, select: { id: true } });
    if (!owns) return NextResponse.json({ error: "Despesa não encontrada" }, { status: 404 });

    await prisma.expense.update({
      where: { id: expenseId },
      data: {
        title,
        category: category ?? "OTHER",
        amount: parseFloat(amount),
        currency: currency ?? trip.currency,
        date: new Date(date),
        notes: notes || null,
        paidBy: paidBy || null,
        paidById: paidById || null,
      },
    });

    if (Array.isArray(sharedBy)) {
      await prisma.expenseShare.deleteMany({ where: { expenseId } });
      if (sharedBy.length > 0) {
        await prisma.expenseShare.createMany({
          data: sharedBy.map((pid: string) => ({ expenseId, participantId: pid })),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar despesa" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const { expenseId } = await req.json();

  await prisma.expense.deleteMany({ where: { id: expenseId, tripId: id } });
  return NextResponse.json({ success: true });
}
