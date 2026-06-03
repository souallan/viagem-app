import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────────────────────────
// ONE-TIME endpoint — DELETE THIS FILE after use.
// Protected by ADMIN_SETUP_SECRET environment variable.
// ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const secret = process.env.ADMIN_SETUP_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "ADMIN_SETUP_SECRET not configured." }, { status: 503 });
  }

  let body: { secret?: string; email?: string; password?: string; name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (body.secret !== secret) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const name = (body.name ?? "Admin").trim();

  if (!email || !password) {
    return NextResponse.json({ error: "email and password are required." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashed,
      role: "ADMIN",
      emailVerified: new Date(),
      name,
    },
    create: {
      email,
      name,
      password: hashed,
      role: "ADMIN",
      emailVerified: new Date(),
    },
    select: { id: true, email: true, name: true, role: true, emailVerified: true },
  });

  return NextResponse.json({ ok: true, user });
}
