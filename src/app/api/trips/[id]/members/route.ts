import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getTrip(id: string, userId: string) {
  return prisma.trip.findFirst({ where: { id, userId } });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const trip = await getTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const members = await prisma.tripMember.findMany({
    where: { tripId: id },
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
  });
  const owner = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true },
  });
  return NextResponse.json({ owner, members });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const trip = await getTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { email, role } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Usuário não encontrado com este e-mail." }, { status: 404 });
  if (user.id === session.user.id) return NextResponse.json({ error: "Você já é o dono da viagem." }, { status: 400 });

  const existing = await prisma.tripMember.findUnique({ where: { tripId_userId: { tripId: id, userId: user.id } } });
  if (existing) return NextResponse.json({ error: "Este usuário já é membro." }, { status: 400 });

  const member = await prisma.tripMember.create({
    data: { tripId: id, userId: user.id, role: role ?? "VIEWER" },
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
  });
  return NextResponse.json(member, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const trip = await getTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { memberId } = await req.json();
  await prisma.tripMember.delete({ where: { id: memberId } });
  return NextResponse.json({ ok: true });
}
