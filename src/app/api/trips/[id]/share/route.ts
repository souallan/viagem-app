import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const trip = await prisma.trip.findFirst({ where: { id, userId: session.user.id } });
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const token = trip.shareToken ?? randomBytes(12).toString("hex");
  await prisma.trip.update({ where: { id }, data: { shareToken: token } });
  return NextResponse.json({ token });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const trip = await prisma.trip.findFirst({ where: { id, userId: session.user.id } });
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.trip.update({ where: { id }, data: { shareToken: null } });
  return NextResponse.json({ ok: true });
}
