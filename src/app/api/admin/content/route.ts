import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await auth();
  return (session?.user as { role?: string } | undefined)?.role === "ADMIN";
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [experiences, routes, trips] = await Promise.all([
    prisma.experience.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true, title: true, destination: true, rating: true,
        publishedAsTip: true, createdAt: true,
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.communityRoute.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true, title: true, destination: true, continent: true,
        duration: true, createdAt: true,
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.trip.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true, title: true, destination: true, status: true, createdAt: true,
        owner: { select: { name: true, email: true } },
      },
    }),
  ]);

  return NextResponse.json({ experiences, routes, trips });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { type, id } = await req.json();
  if (!type || !id) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  if (type === "experience") await prisma.experience.delete({ where: { id } });
  else if (type === "route") await prisma.communityRoute.delete({ where: { id } });
  else if (type === "trip") await prisma.trip.delete({ where: { id } });
  else return NextResponse.json({ error: "Unknown type" }, { status: 400 });

  return NextResponse.json({ ok: true });
}
