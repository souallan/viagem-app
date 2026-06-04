import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await auth();
  return (session?.user as { role?: string } | undefined)?.role === "ADMIN";
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const start = Date.now();

  const [userCount, tripCount, dbMs] = await Promise.all([
    prisma.user.count(),
    prisma.trip.count(),
    prisma.$queryRaw`SELECT 1`.then(() => Date.now() - start),
  ]);

  // Recent 24h new users
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const since7d  = new Date(Date.now() - 7  * 24 * 60 * 60 * 1000);

  const [newUsers24h, newUsers7d, newTrips7d] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: since24h } } }),
    prisma.user.count({ where: { createdAt: { gte: since7d  } } }),
    prisma.trip.count({ where: { createdAt: { gte: since7d  } } }),
  ]);

  return NextResponse.json({
    db: { ok: true, latencyMs: dbMs },
    totals: { users: userCount, trips: tripCount },
    recent: { newUsers24h, newUsers7d, newTrips7d },
    env: {
      ga4Configured:     !!process.env.NEXT_PUBLIC_GA_ID,
      sentryConfigured:  !!process.env.NEXT_PUBLIC_SENTRY_DSN,
      resendConfigured:  !!process.env.RESEND_API_KEY,
      anthropicConfigured: !!process.env.ANTHROPIC_API_KEY,
    },
  });
}
