import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function verifyTrip(tripId: string, userId: string) {
  return prisma.trip.findFirst({ where: { id: tripId, OR: [{ userId }, { members: { some: { userId, role: "EDITOR" } } }] } });
}

async function ensurePackingList(tripId: string) {
  let list = await prisma.packingList.findUnique({ where: { tripId } });
  if (!list) {
    list = await prisma.packingList.create({ data: { tripId } });
  }
  return list;
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

  const list = await prisma.packingList.findUnique({
    where: { tripId: id },
    include: { items: { orderBy: [{ category: "asc" }, { name: "asc" }] } },
  });

  return NextResponse.json(list ?? { items: [] });
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
    const { name, category, quantity } = body;

    if (!name) return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });

    const list = await ensurePackingList(id);
    const item = await prisma.packingItem.create({
      data: {
        packingListId: list.id,
        name,
        category,
        quantity: quantity ? parseInt(quantity) : 1,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao adicionar item" }, { status: 500 });
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
    const { itemId, name, category, quantity } = body;

    if (!itemId || !name) {
      return NextResponse.json({ error: "ID e nome são obrigatórios" }, { status: 400 });
    }

    // Amarra o item à viagem da URL — sem isto, um itemId de OUTRA viagem/usuário
    // seria atualizado globalmente (a verificação da viagem acima não basta).
    const owned = await prisma.packingItem.findFirst({
      where: { id: itemId, packingList: { tripId: id } },
      select: { id: true },
    });
    if (!owned) return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });

    const item = await prisma.packingItem.update({
      where: { id: itemId },
      data: {
        name,
        category: category || null,
        quantity: quantity ? parseInt(quantity) : 1,
      },
    });

    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar item" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const trip = await verifyTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Viagem não encontrada" }, { status: 404 });

  const { itemId, isPacked } = await req.json();

  const owned = await prisma.packingItem.findFirst({
    where: { id: itemId, packingList: { tripId: id } },
    select: { id: true },
  });
  if (!owned) return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });

  const item = await prisma.packingItem.update({
    where: { id: itemId },
    data: { isPacked },
  });

  return NextResponse.json(item);
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

  const { itemId } = await req.json();

  // Escopo pela viagem: só apaga itens da lista desta viagem.
  await prisma.packingItem.deleteMany({ where: { id: itemId, packingList: { tripId: id } } });
  return NextResponse.json({ success: true });
}
