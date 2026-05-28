// In-memory sliding-window rate limiter.
// Sufficient for a single Railway instance; upgrade to Upstash Redis if scaling to multiple replicas.

interface Window {
  count: number;
  resetAt: number;
}

const store = new Map<string, Window>();

// Purge expired entries every 5 minutes to avoid memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, w] of store) {
    if (w.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  /** Unique key (e.g. "login:1.2.3.4") */
  key: string;
  /** Maximum requests allowed in the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit({ key, limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt < now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  existing.count += 1;
  const success = existing.count <= limit;
  return { success, remaining: Math.max(0, limit - existing.count), resetAt: existing.resetAt };
}

// Helpers for specific routes
export function getIp(req: Request): string {
  const forwarded = (req as { headers: Headers }).headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}
