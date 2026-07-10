import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

/**
 * Cliente Stripe — só existe quando STRIPE_SECRET_KEY está configurado.
 * Enquanto as chaves não estão no ambiente, `stripe` é null e as rotas
 * respondem 503 (feature inerte, sem quebrar o build/deploy).
 */
export const stripe = secretKey ? new Stripe(secretKey) : null;

/** true quando dá para processar pagamentos E validar webhooks. */
export const stripeConfigured = !!secretKey && !!process.env.STRIPE_WEBHOOK_SECRET;

/** Price IDs recorrentes criados no painel da Stripe (Products). */
export const STRIPE_PRICES = {
  monthly: process.env.STRIPE_PRICE_MONTHLY || "",
  annual: process.env.STRIPE_PRICE_ANNUAL || "",
} as const;

export function priceIdForPlan(plan: string): string {
  return plan === "monthly" ? STRIPE_PRICES.monthly : STRIPE_PRICES.annual;
}
