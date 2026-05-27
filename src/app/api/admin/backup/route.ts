import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { auditLog } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [users, trips, experiences, routes, auditLogs] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
    prisma.trip.findMany({
      include: {
        activities: true,
        accommodations: true,
        transports: true,
        expenses: true,
        documents: true,
        packingList: { include: { items: true } },
        prepItems: true,
        journalEntries: true,
        members: true,
      },
    }),
    prisma.experience.findMany(),
    prisma.communityRoute.findMany({ include: { activities: true, comments: true } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 500 }),
  ]);

  await auditLog({
    actorId: session!.user!.id!,
    actorEmail: session!.user!.email ?? "",
    action: "ADMIN_BACKUP",
    detail: `Backup manual exportado — ${users.length} usuários, ${trips.length} viagens`,
  });

  const backup = {
    exportedAt: new Date().toISOString(),
    version: "1.0",
    stats: { users: users.length, trips: trips.length, experiences: experiences.length, routes: routes.length },
    users,
    trips,
    experiences,
    communityRoutes: routes,
    auditLogs,
  };

  return new NextResponse(JSON.stringify(backup, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="roteiroapp-backup-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
