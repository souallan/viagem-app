import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

async function ensureReferralCode(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { referralCode: true } });
  if (user?.referralCode) return user.referralCode;

  // Generate unique 8-char code, retry on collision
  let code: string;
  let attempts = 0;
  do {
    code = nanoid(8).toUpperCase();
    attempts++;
    if (attempts > 10) throw new Error("Could not generate unique referral code");
  } while (await prisma.user.findUnique({ where: { referralCode: code } }));

  await prisma.user.update({ where: { id: userId }, data: { referralCode: code } });
  return code;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const code = await ensureReferralCode(session.user.id);
  const referredCount = await prisma.user.count({ where: { referredBy: code } });

  return NextResponse.json({ code, referredCount });
}
