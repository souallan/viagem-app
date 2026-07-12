import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { GATracker } from "@/components/analytics/ga-tracker";
import { ConsentedAnalytics } from "@/components/analytics/consented-analytics";
import { CookieBanner } from "@/components/lgpd/cookie-banner";
import { NativeBootstrap } from "@/components/native/native-bootstrap";
import { AppBanner } from "@/components/marketing/app-banner";
import { SITE_CONFIG } from "@/lib/site-config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "RoteiroApp — Planejador de Viagens", template: "%s | RoteiroApp" },
  description: "Planeje roteiros, controle orçamento, organize documentos e compartilhe suas viagens. Gratuito e fácil de usar.",
  keywords: ["planejador de viagens", "roteiro de viagem", "organizar viagem", "controle de gastos viagem", "lista de malas"],
  authors: [{ name: "RoteiroApp", url: "https://roteiroapp.com" }],
  creator: "RoteiroApp",
  metadataBase: new URL("https://roteiroapp.com"),
  alternates: { canonical: "/" },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "RoteiroApp" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://roteiroapp.com",
    siteName: "RoteiroApp",
    title: "RoteiroApp — Planejador de Viagens",
    description: "Planeje roteiros, controle orçamento, organize documentos e compartilhe suas viagens. Gratuito e fácil de usar.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "RoteiroApp — Planejador de Viagens" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RoteiroApp — Planejador de Viagens",
    description: "Planeje roteiros, controle orçamento, organize documentos e compartilhe suas viagens.",
    creator: "@roteiroapp",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  // Smart banner nativo do iOS Safari (ativa quando o app for publicado e o ID preenchido)
  other: SITE_CONFIG.app.iosAppId ? { "apple-itunes-app": `app-id=${SITE_CONFIG.app.iosAppId}` } : undefined,
};

// Viewport separado (Next 15). `viewportFit: "cover"` habilita os env(safe-area-inset-*)
// usados nas barras fixas e no FAB — essencial em celulares com notch/ilha dinâmica e
// dentro do WebView nativo (Capacitor). Zoom mantido por acessibilidade.
export const viewport: Viewport = {
  themeColor: "#1A5FCC",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const GA_ID  = process.env.NEXT_PUBLIC_GA_ID;
const GSC_ID = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

const JSON_LD_ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RoteiroApp",
  url: "https://roteiroapp.com",
  logo: "https://roteiroapp.com/icon.svg",
  description: "Planejador de viagens completo e gratuito para brasileiros.",
  sameAs: ["https://instagram.com/roteiroapp"],
  contactPoint: { "@type": "ContactPoint", email: "contato@roteiroapp.com", contactType: "customer support" },
};

const JSON_LD_WEBSITE = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "RoteiroApp",
  url: "https://roteiroapp.com",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: "https://roteiroapp.com/blog?q={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* JSON-LD structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_ORGANIZATION) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_WEBSITE) }} />
        {/* Google Search Console verification */}
        {GSC_ID && <meta name="google-site-verification" content={GSC_ID} />}
        {/* GA4 NÃO é injetado aqui: <ConsentedAnalytics/> carrega apenas após consentimento (LGPD). */}
      </head>
      <body className={inter.className}>
        <NativeBootstrap />
        <AppBanner />
        <ConsentedAnalytics />
        {GA_ID && (
          <Suspense fallback={null}>
            <GATracker gaId={GA_ID} />
          </Suspense>
        )}
        {children}
        <CookieBanner />
        <script dangerouslySetInnerHTML={{ __html: `
          // Registra o service worker (web e app nativo — o WebView carrega o
          // https origin, então o SW dá cache/offline dos dados também no app).
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js').catch(() => {});
            });
          }
        `}} />
      </body>
    </html>
  );
}
