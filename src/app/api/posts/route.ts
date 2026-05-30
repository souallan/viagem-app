import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    select: {
      id: true, title: true, slug: true, excerpt: true,
      coverImage: true, destination: true, tags: true,
      videoUrl: true, featured: true, createdAt: true,
      author: { select: { name: true } },
    },
  });
  return NextResponse.json(posts);
}
