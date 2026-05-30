import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// One-time admin setup endpoint — DELETE THIS FILE after use
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const setupSecret = process.env.SETUP_ADMIN_SECRET;

  if (!setupSecret || secret !== setupSecret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const email = "roteiroapp.br@gmail.com";
  const tempPassword = process.env.ADMIN_TEMP_PASSWORD ?? "ChangeMe@2026!";

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    const updated = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
      select: { id: true, email: true, role: true },
    });
    return NextResponse.json({ action: "updated", user: updated });
  }

  const hashed = await bcrypt.hash(tempPassword, 12);
  const created = await prisma.user.create({
    data: { email, name: "Administrador", role: "ADMIN", password: hashed },
    select: { id: true, email: true, role: true },
  });

  return NextResponse.json({ action: "created", user: created, tempPassword });
}
