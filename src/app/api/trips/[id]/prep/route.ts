import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getTrip(id: string, userId: string) {
  return prisma.trip.findFirst({ where: { id, OR: [{ userId }, { members: { some: { userId, role: "EDITOR" } } }] } });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const uid = session.user.id;
  const trip = await prisma.trip.findFirst({ where: { id, OR: [{ userId: uid }, { members: { some: { userId: uid } } }] } });
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const items = await prisma.tripPrepItem.findMany({
    where: { tripId: id },
    orderBy: [{ isDone: "asc" }, { category: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(items);
}

// Lembretes recomendados por fase — o prazo (dueDate) é calculado a partir da data
// de ida da viagem. É a "camada de orientação" que evita surpresas de última hora.
const RECOMMENDED_PREP: { title: string; category: string; daysBefore: number }[] = [
  { title: "Conferir validade do passaporte (mín. 6 meses)", category: "DOCUMENTOS", daysBefore: 60 },
  { title: "Verificar necessidade de visto para o destino", category: "DOCUMENTOS", daysBefore: 60 },
  { title: "Conferir vacinas exigidas (ex.: febre amarela)", category: "SAUDE", daysBefore: 30 },
  { title: "Comprar moeda estrangeira aos poucos (evite o aeroporto)", category: "FINANCEIRO", daysBefore: 30 },
  { title: "Contratar seguro viagem", category: "SAUDE", daysBefore: 21 },
  { title: "Comprar/ativar chip ou eSIM internacional", category: "OUTRO", daysBefore: 7 },
  { title: "Separar cópias (físicas e digitais) dos documentos", category: "DOCUMENTOS", daysBefore: 5 },
  { title: "Conferir bagagem e regras da companhia aérea", category: "BAGAGEM", daysBefore: 3 },
  { title: "Fazer check-in online (abre ~48h antes)", category: "TRANSPORTE", daysBefore: 2 },
  { title: "Baixar roteiro, documentos e mapa para uso offline", category: "OUTRO", daysBefore: 2 },
];

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const trip = await getTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();

  // Gerar lembretes recomendados (1 clique) — pula os que já existem pelo título.
  if (body.seed === true) {
    const existing = await prisma.tripPrepItem.findMany({ where: { tripId: id }, select: { title: true } });
    const have = new Set(existing.map((i) => i.title));
    const start = trip.startDate ? new Date(trip.startDate) : null;
    const toCreate = RECOMMENDED_PREP.filter((r) => !have.has(r.title)).map((r) => ({
      tripId: id,
      title: r.title,
      category: r.category,
      dueDate: start ? new Date(start.getTime() - r.daysBefore * 86400000) : null,
    }));
    if (toCreate.length) await prisma.tripPrepItem.createMany({ data: toCreate });
    const items = await prisma.tripPrepItem.findMany({
      where: { tripId: id },
      orderBy: [{ isDone: "asc" }, { category: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json(items, { status: 201 });
  }

  const item = await prisma.tripPrepItem.create({
    data: {
      tripId: id,
      title: body.title,
      category: body.category ?? "OUTRO",
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      notes: body.notes ?? null,
    },
  });
  return NextResponse.json(item, { status: 201 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const trip = await getTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { itemId, isDone } = await req.json();
  const item = await prisma.tripPrepItem.updateMany({
    where: { id: itemId, tripId: id },
    data: { isDone },
  });
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const trip = await getTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { itemId } = await req.json();
  await prisma.tripPrepItem.deleteMany({ where: { id: itemId, tripId: id } });
  return NextResponse.json({ ok: true });
}
