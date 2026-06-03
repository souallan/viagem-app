import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripHtml } from "@/lib/sanitize";

async function getTrip(id: string, userId: string) {
  return prisma.trip.findFirst({ where: { id, userId } });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const trip = await getTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const entries = await prisma.journalEntry.findMany({
    where: { tripId: id },
    orderBy: { date: "asc" },
  });
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const trip = await getTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const entry = await prisma.journalEntry.create({
    data: {
      tripId: id,
      date:    new Date(body.date),
      title:   body.title   ? stripHtml(body.title)   : null,
      content: stripHtml(body.content),
      mood:    body.mood ?? null,
    },
  });
  return NextResponse.json(entry, { status: 201 });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const trip = await getTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const entry = await prisma.journalEntry.updateMany({
    where: { id: body.entryId, tripId: id },
    data: {
      title:   body.title   ? stripHtml(body.title)   : null,
      content: stripHtml(body.content),
      mood:    body.mood ?? null,
    },
  });
  return NextResponse.json(entry);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const trip = await getTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { entryId } = await req.json();
  await prisma.journalEntry.deleteMany({ where: { id: entryId, tripId: id } });
  return NextResponse.json({ ok: true });
}
