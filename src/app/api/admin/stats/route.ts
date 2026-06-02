import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await auth();
  return (session?.user as { role?: string } | undefined)?.role === "ADMIN";
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const now = new Date();
  const ago7  = new Date(now.getTime() - 7  * 86400000);
  const ago30 = new Date(now.getTime() - 30 * 86400000);

  const [
    totalUsers,
    totalTrips,
    totalExperiences,
    totalRoutes,
    totalSubscribers,
    recentUsers,
    recentTrips,
    tripsByStatus,
    newUsers7d,
    newUsers30d,
    activeUsers7d,
    activeUsers30d,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.trip.count(),
    prisma.experience.count(),
    prisma.communityRoute.count(),
    prisma.newsletterSubscriber.count(),
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
    prisma.trip.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    // New signups last 7 days
    prisma.user.count({ where: { createdAt: { gte: ago7 } } }),
    // New signups last 30 days
    prisma.user.count({ where: { createdAt: { gte: ago30 } } }),
    // Active = created a trip or activity in last 7 days (distinct users)
    prisma.trip.findMany({
      where: { createdAt: { gte: ago7 } },
      select: { userId: true },
      distinct: ["userId"],
    }).then((rows) => rows.length),
    // Active = created a trip or activity in last 30 days
    prisma.trip.findMany({
      where: { createdAt: { gte: ago30 } },
      select: { userId: true },
      distinct: ["userId"],
    }).then((rows) => rows.length),
  ]);

  return NextResponse.json({
    totals: { users: totalUsers, trips: totalTrips, experiences: totalExperiences, routes: totalRoutes, subscribers: totalSubscribers },
    recentUsers,
    recentTrips,
    tripsByStatus,
    activity: {
      newUsers7d,
      newUsers30d,
      activeUsers7d,
      activeUsers30d,
    },
  });
}
