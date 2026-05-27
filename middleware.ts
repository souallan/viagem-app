import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory rate limit store (per-instance; adequate for single-container Railway deployment)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function rateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

// Clean up old entries every 5 minutes to prevent memory leak
let lastCleanup = Date.now();
function maybeCleanup() {
  const now = Date.now();
  if (now - lastCleanup < 5 * 60 * 1000) return;
  lastCleanup = now;
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  }
}

export function middleware(req: NextRequest) {
  maybeCleanup();

  const { pathname } = req.nextUrl;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // Rate limiting on auth endpoints: 10 req / 60s per IP
  if (pathname.startsWith("/api/auth") || pathname === "/api/register") {
    const allowed = rateLimit(`auth:${ip}`, 10, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Muitas tentativas. Aguarde um minuto." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
  }

  const res = NextResponse.next();

  // Security headers
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com",
      "font-src 'self'",
      "connect-src 'self' https://api.frankfurter.app",
      "frame-ancestors 'none'",
    ].join("; ")
  );

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
