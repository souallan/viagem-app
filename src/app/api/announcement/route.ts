import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const announcement = await prisma.siteAnnouncement.findFirst({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(announcement);
}
