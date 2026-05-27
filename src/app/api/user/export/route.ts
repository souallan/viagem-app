import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { auditLog } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  const [user, trips, experiences, routes] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
    }),
    prisma.trip.findMany({
      where: { userId },
      include: {
        activities: true,
        accommodations: true,
        transports: true,
        expenses: true,
        documents: true,
        packingList: { include: { items: true } },
        prepItems: true,
        journalEntries: true,
      },
    }),
    prisma.experience.findMany({ where: { userId } }),
    prisma.communityRoute.findMany({
      where: { userId },
      include: { activities: true, comments: { select: { id: true, content: true, createdAt: true } } },
    }),
  ]);

  await auditLog({
    actorId: userId,
    actorEmail: session.user.email ?? "",
    action: "DATA_EXPORT",
    targetId: userId,
    targetType: "User",
    detail: "Exportação de dados pessoais (LGPD)",
  });

  const exportData = {
    exportedAt: new Date().toISOString(),
    note: "Exportação de dados pessoais conforme Lei 13.709/2018 (LGPD). Inclui todos os dados armazenados vinculados à sua conta.",
    user,
    trips,
    experiences,
    communityRoutes: routes,
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="roteiroapp-dados-${userId.slice(0, 8)}.json"`,
    },
  });
}
