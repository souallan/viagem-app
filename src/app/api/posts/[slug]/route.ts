import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    select: {
      id: true, title: true, slug: true, content: true, excerpt: true,
      coverImage: true, destination: true, tags: true, videoUrl: true,
      featured: true, createdAt: true,
      author: { select: { name: true } },
    },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}
