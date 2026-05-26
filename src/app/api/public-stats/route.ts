import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public endpoint — no auth required
export async function GET() {
  const [users, trips, destinations] = await Promise.all([
    prisma.user.count(),
    prisma.trip.count(),
    prisma.trip.groupBy({ by: ["destination"], _count: { id: true } }),
  ]);

  return NextResponse.json(
    { users, trips, destinations: destinations.length },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}
