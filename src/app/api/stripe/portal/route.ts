import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

/** Abre o portal de cobrança da Stripe para o cliente gerenciar/cancelar a assinatura. */
export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Pagamentos ainda não estão disponíveis." }, { status: 503 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Faça login." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: "Nenhuma assinatura encontrada." }, { status: 400 });
  }

  const origin =
    req.headers.get("origin") || process.env.NEXTAUTH_URL || "https://roteiroapp.com";

  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${origin}/profile`,
  });

  return NextResponse.json({ url: portal.url });
}
