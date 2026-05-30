import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "ADMIN";
  return { session, isAdmin };
}

export async function GET() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const items = await prisma.siteAnnouncement.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { text, linkLabel, linkUrl, type } = await req.json();
  if (!text?.trim()) return NextResponse.json({ error: "Texto obrigatório." }, { status: 400 });

  // Only one active at a time — deactivate others before creating
  await prisma.siteAnnouncement.updateMany({ data: { active: false } });

  const item = await prisma.siteAnnouncement.create({
    data: { text: text.trim(), linkLabel: linkLabel || null, linkUrl: linkUrl || null, type: type || "info", active: true },
  });
  return NextResponse.json(item, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, active, text, linkLabel, linkUrl, type } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  if (active) await prisma.siteAnnouncement.updateMany({ data: { active: false } });

  const data: Record<string, unknown> = {};
  if (text !== undefined)      data.text      = text.trim();
  if (linkLabel !== undefined) data.linkLabel = linkLabel || null;
  if (linkUrl !== undefined)   data.linkUrl   = linkUrl || null;
  if (type !== undefined)      data.type      = type;
  if (active !== undefined)    data.active    = !!active;

  const item = await prisma.siteAnnouncement.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest) {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.siteAnnouncement.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
