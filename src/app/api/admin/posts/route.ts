import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { auditLog } from "@/lib/audit";

async function requireAdmin() {
  const session = await auth();
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "ADMIN";
  return { session, isAdmin };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function GET(req: NextRequest) {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const published = searchParams.get("published");

  const posts = await prisma.post.findMany({
    where: published ? { published: published === "true" } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true, title: true, slug: true, excerpt: true, coverImage: true,
      destination: true, published: true, featured: true, tags: true,
      videoUrl: true, createdAt: true, updatedAt: true,
      author: { select: { name: true, email: true } },
    },
  });

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const { session, isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { title, content, excerpt, coverImage, destination, videoUrl, published, featured, tags } = body;

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "Título e conteúdo são obrigatórios." }, { status: 400 });
  }

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let suffix = 0;
  while (await prisma.post.findUnique({ where: { slug } })) {
    suffix++;
    slug = `${baseSlug}-${suffix}`;
  }

  const post = await prisma.post.create({
    data: {
      title: title.trim(),
      slug,
      content: content.trim(),
      excerpt: excerpt?.trim() || null,
      coverImage: coverImage || null,
      destination: destination?.trim() || null,
      videoUrl: videoUrl || null,
      published: !!published,
      featured: !!featured,
      tags: tags || "",
      authorId: session!.user!.id!,
    },
  });

  await auditLog({
    actorId: session!.user!.id!,
    actorEmail: session!.user!.email ?? "",
    action: "POST_CREATE",
    targetId: post.id,
    targetType: "Post",
    detail: `Post criado: "${post.title}"`,
    ip: req.headers.get("x-forwarded-for") ?? undefined,
  });

  return NextResponse.json(post, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { session, isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { id, title, content, excerpt, coverImage, destination, videoUrl, published, featured, tags } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (title !== undefined)       data.title       = title.trim();
  if (content !== undefined)     data.content     = content.trim();
  if (excerpt !== undefined)     data.excerpt     = excerpt?.trim() || null;
  if (coverImage !== undefined)  data.coverImage  = coverImage || null;
  if (destination !== undefined) data.destination = destination?.trim() || null;
  if (videoUrl !== undefined)    data.videoUrl    = videoUrl || null;
  if (published !== undefined)   data.published   = !!published;
  if (featured !== undefined)    data.featured    = !!featured;
  if (tags !== undefined)        data.tags        = tags;

  const post = await prisma.post.update({ where: { id }, data });

  await auditLog({
    actorId: session!.user!.id!,
    actorEmail: session!.user!.email ?? "",
    action: "POST_UPDATE",
    targetId: id,
    targetType: "Post",
    detail: `Post atualizado: "${post.title}"`,
    ip: req.headers.get("x-forwarded-for") ?? undefined,
  });

  return NextResponse.json(post);
}

export async function DELETE(req: NextRequest) {
  const { session, isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const post = await prisma.post.findUnique({ where: { id }, select: { title: true } });
  await prisma.post.delete({ where: { id } });

  await auditLog({
    actorId: session!.user!.id!,
    actorEmail: session!.user!.email ?? "",
    action: "POST_DELETE",
    targetId: id,
    targetType: "Post",
    detail: `Post deletado: "${post?.title}"`,
    ip: req.headers.get("x-forwarded-for") ?? undefined,
  });

  return NextResponse.json({ ok: true });
}
