import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isPremium } from "@/lib/plans";

export const dynamic = "force-dynamic";

/** Endpoint leve para o selo de plano (sidebar). Lê direto do banco (sempre fresco). */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, planExpiresAt: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    plan: user.plan,
    isPremium: isPremium(user.plan, user.planExpiresAt),
  });
}
