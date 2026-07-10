import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

async function isAdmin() {
  const session = await auth();
  return (session?.user as { role?: string } | undefined)?.role === "ADMIN";
}

// Checagem AO VIVO do Stripe (chave válida + assinaturas ativas + MRR)
async function checkStripe() {
  if (!stripe) return { configured: false, ok: false, mode: null as string | null, activeSubscriptions: 0, mrrCents: 0 };
  const mode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_live") ? "live" : "test";
  try {
    const subs = await stripe.subscriptions.list({ status: "active", limit: 100 });
    let mrr = 0;
    for (const s of subs.data) {
      for (const it of s.items.data) {
        const amt = (it.price?.unit_amount ?? 0) * (it.quantity ?? 1);
        mrr += it.price?.recurring?.interval === "year" ? amt / 12 : amt;
      }
    }
    return { configured: true, ok: true, mode, activeSubscriptions: subs.data.length, mrrCents: Math.round(mrr) };
  } catch {
    return { configured: true, ok: false, mode, activeSubscriptions: 0, mrrCents: 0 };
  }
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const start = Date.now();

  let dbOk = true;
  let dbMs = 0;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbMs = Date.now() - start;
  } catch {
    dbOk = false;
  }

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [userCount, tripCount, premiumCount, newUsers24h, newUsers7d, newTrips7d, stripeHealth] = await Promise.all([
    prisma.user.count(),
    prisma.trip.count(),
    prisma.user.count({ where: { plan: "PREMIUM" } }),
    prisma.user.count({ where: { createdAt: { gte: since24h } } }),
    prisma.user.count({ where: { createdAt: { gte: since7d } } }),
    prisma.trip.count({ where: { createdAt: { gte: since7d } } }),
    checkStripe(),
  ]);

  return NextResponse.json({
    db: { ok: dbOk, latencyMs: dbMs },
    totals: { users: userCount, trips: tripCount, premium: premiumCount },
    recent: { newUsers24h, newUsers7d, newTrips7d },
    stripe: stripeHealth,
    env: {
      ga4Configured: !!process.env.NEXT_PUBLIC_GA_ID,
      sentryConfigured: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
      resendConfigured: !!process.env.RESEND_API_KEY,
      anthropicConfigured: !!process.env.ANTHROPIC_API_KEY,
      cloudinaryConfigured: !!(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET),
    },
  });
}
