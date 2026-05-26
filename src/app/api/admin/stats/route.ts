import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await auth();
  return (session?.user as { role?: string } | undefined)?.role === "ADMIN";
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [
    totalUsers,
    totalTrips,
    totalExperiences,
    totalRoutes,
    recentUsers,
    recentTrips,
    usersByMonth,
    tripsByStatus,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.trip.count(),
    prisma.experience.count(),
    prisma.communityRoute.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
    prisma.trip.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, destination: true, status: true, createdAt: true, owner: { select: { name: true, email: true } } },
    }),
    prisma.user.groupBy({
      by: ["createdAt"],
      _count: { id: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.trip.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
  ]);

  return NextResponse.json({
    totals: { users: totalUsers, trips: totalTrips, experiences: totalExperiences, routes: totalRoutes },
    recentUsers,
    recentTrips,
    tripsByStatus,
  });
}
