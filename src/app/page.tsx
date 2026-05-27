import { prisma } from "@/lib/prisma";
import { LandingClient } from "@/components/landing/landing-client";

async function getStats() {
  try {
    const [users, trips, destRaw] = await Promise.all([
      prisma.user.count(),
      prisma.trip.count(),
      prisma.trip.groupBy({ by: ["destination"], _count: { id: true } }),
    ]);
    return { users, trips, destinations: destRaw.length };
  } catch {
    return { users: 0, trips: 0, destinations: 0 };
  }
}

export default async function LandingPage() {
  const stats = await getStats();
  return <LandingClient stats={stats} />;
}
