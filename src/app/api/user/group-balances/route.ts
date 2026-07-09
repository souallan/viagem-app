import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeBalances } from "@/lib/split";

/**
 * Saldo do usuário logado em cada viagem em grupo onde ele é participante
 * (vinculado por userId). Usado no perfil: "quanto devo / me devem".
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const uid = session.user.id;

  const myParticipations = await prisma.tripParticipant.findMany({
    where: { userId: uid },
    include: { trip: { select: { id: true, title: true, currency: true } } },
  });

  const results: { tripId: string; title: string; currency: string; net: number }[] = [];
  for (const part of myParticipations) {
    const tripId = part.tripId;
    const participants = await prisma.tripParticipant.findMany({ where: { tripId }, select: { id: true } });
    if (participants.length < 2) continue; // não é grupo
    const expenses = await prisma.expense.findMany({
      where: { tripId, paidById: { not: null } },
      include: { shares: { select: { participantId: true } } },
    });
    const splitExp = expenses.map((e) => ({
      amount: e.amount,
      paidBy: e.paidById as string,
      sharedBy: e.shares.map((s) => s.participantId),
    }));
    const balances = computeBalances(splitExp, participants.map((p) => p.id));
    results.push({
      tripId,
      title: part.trip.title,
      currency: part.trip.currency,
      net: balances[part.id] ?? 0,
    });
  }

  return NextResponse.json(results);
}
