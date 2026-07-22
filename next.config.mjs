/** @type {import('next').NextConfig} */
import { withSentryConfig } from "@sentry/nextjs";

const securityHeaders = [
  { key: "X-Frame-Options",           value: "DENY" },
  { key: "X-Content-Type-Options",    value: "nosniff" },
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",        value: "camera=(self), microphone=(), geolocation=(self)" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com https://www.google-analytics.com https://*.tile.openstreetmap.org https://cdnjs.cloudflare.com",
      "font-src 'self'",
      "connect-src 'self' https://api.frankfurter.app https://open.er-api.com https://nominatim.openstreetmap.org https://api.open-meteo.com https://api.cloudinary.com https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://o*.ingest.sentry.io",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async rewrites() {
    return [
      // O Android exige o arquivo exatamente em /.well-known/assetlinks.json.
      // Uma pasta iniciada por ponto dentro de app/ não vira rota, então servimos
      // pela rota de API e reescrevemos o caminho.
      { source: "/.well-known/assetlinks.json", destination: "/api/assetlinks" },
    ];
  },
};

// Only wrap with Sentry if DSN + auth token are both set (auth token needed for source map upload)
// Without auth token, skip withSentryConfig to avoid OOM during build —
// runtime monitoring still works via NEXT_PUBLIC_SENTRY_DSN in sentry.client.config.ts
const hasSentry = !!(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN);
const hasSentryAuth = !!process.env.SENTRY_AUTH_TOKEN;

export default hasSentry && hasSentryAuth
  ? withSentryConfig(nextConfig, {
      silent: true,
      hideSourceMaps: true,
      disableLogger: true,
      sourcemaps: { disable: true },
    })
  : nextConfig;
