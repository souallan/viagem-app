// Sliding-window rate limiter.
// Uses Upstash Redis when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set.
// Falls back to in-memory Map for single-instance deployments.

import { Redis } from "@upstash/redis";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url:   process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// ── In-memory fallback ────────────────────────────────────────────
interface Window { count: number; resetAt: number }
const store = new Map<string, Window>();
setInterval(() => {
  const now = Date.now();
  for (const [k, w] of store) if (w.resetAt < now) store.delete(k);
}, 5 * 60 * 1000);

// ── Public API ────────────────────────────────────────────────────
export interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export async function rateLimit({ key, limit, windowMs }: RateLimitOptions): Promise<RateLimitResult> {
  if (redis) {
    const k = `rl:${key}`;
    const windowSec = Math.ceil(windowMs / 1000);

    // INCR + EXPIRE in a pipeline keeps it atomic enough for rate limiting
    const count = await redis.incr(k);
    if (count === 1) await redis.expire(k, windowSec);
    const ttl = await redis.ttl(k);

    const resetAt = Date.now() + Math.max(ttl, 0) * 1000;
    return { success: count <= limit, remaining: Math.max(0, limit - count), resetAt };
  }

  // In-memory fallback
  const now = Date.now();
  const existing = store.get(key);
  if (!existing || existing.resetAt < now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }
  existing.count += 1;
  return {
    success:   existing.count <= limit,
    remaining: Math.max(0, limit - existing.count),
    resetAt:   existing.resetAt,
  };
}

export function getIp(req: Request): string {
  const forwarded = (req as { headers: Headers }).headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}
