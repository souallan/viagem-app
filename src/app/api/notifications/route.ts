import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const userId = session.user.id;
  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 86400000);
  const in30Days = new Date(now.getTime() + 30 * 86400000);

  const [upcomingTrips, expiringDocs] = await Promise.all([
    prisma.trip.findMany({
      where: {
        userId,
        status: { in: ["PLANNING", "CONFIRMED"] },
        startDate: { gte: now, lte: in7Days },
      },
      select: { id: true, title: true, destination: true, startDate: true },
      orderBy: { startDate: "asc" },
    }),
    prisma.document.findMany({
      where: {
        trip: { userId },
        expiresAt: { gte: now, lte: in30Days },
      },
      select: { id: true, title: true, type: true, expiresAt: true, tripId: true, trip: { select: { title: true } } },
      orderBy: { expiresAt: "asc" },
    }),
  ]);

  const notifications = [
    ...upcomingTrips.map((t) => {
      const days = Math.round((new Date(t.startDate!).getTime() - now.getTime()) / 86400000);
      return {
        id: `trip-${t.id}`,
        type: "trip" as const,
        title: days === 0 ? `${t.title} começa hoje!` : days === 1 ? `${t.title} começa amanhã` : `${t.title} em ${days} dias`,
        subtitle: t.destination,
        href: `/trips/${t.id}`,
        urgency: days <= 1 ? "high" : "medium",
      };
    }),
    ...expiringDocs.map((d) => {
      const days = Math.round((new Date(d.expiresAt!).getTime() - now.getTime()) / 86400000);
      return {
        id: `doc-${d.id}`,
        type: "document" as const,
        title: `${d.title} vence em ${days} dia${days !== 1 ? "s" : ""}`,
        subtitle: d.trip.title,
        href: `/trips/${d.tripId}/documents`,
        urgency: days <= 7 ? "high" : "medium",
      };
    }),
  ];

  return NextResponse.json(notifications);
}
