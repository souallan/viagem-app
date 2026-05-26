import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const experiences = await prisma.experience.findMany({
    where: { publishedAsTip: true },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      destination: true,
      tripDate: true,
      coverImage: true,
      excerpt: true,
      content: true,
      rating: true,
      mood: true,
      tags: true,
      createdAt: true,
      user: { select: { name: true } },
    },
  });

  return NextResponse.json(experiences);
}
