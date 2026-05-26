import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const trip = await prisma.trip.findFirst({
    where: { shareToken: token },
    include: {
      activities:     { orderBy: [{ date: "asc" }, { startTime: "asc" }] },
      accommodations: { orderBy: { checkIn: "asc" } },
      transports:     { orderBy: { departureTime: "asc" } },
    },
  });

  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Strip sensitive fields before returning public data
  const { userId, shareToken, budget, ...publicTrip } = trip;
  void userId; void shareToken; void budget;
  return NextResponse.json(publicTrip);
}
