import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Users who have a referral code and have referred at least someone
  const referrers = await prisma.user.findMany({
    where: { referralCode: { not: null } },
    select: { id: true, name: true, email: true, referralCode: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const withCounts = await Promise.all(
    referrers.map(async (u) => {
      const count = await prisma.user.count({ where: { referredBy: u.referralCode! } });
      return { ...u, referredCount: count };
    })
  );

  const sorted = withCounts.sort((a, b) => b.referredCount - a.referredCount);

  const totalReferred = await prisma.user.count({ where: { referredBy: { not: null } } });
  const totalWithCode = referrers.length;

  return NextResponse.json({ referrers: sorted, totalReferred, totalWithCode });
}
