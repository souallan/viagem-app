import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { GATracker } from "@/components/analytics/ga-tracker";
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
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/icon.svg",
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "RoteiroApp" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://roteiroapp.com",
    siteName: "RoteiroApp",
    title: "RoteiroApp — Planejador de Viagens",
    description: "Planeje roteiros, controle orçamento, organize documentos e compartilhe suas viagens. Gratuito e fácil de usar.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RoteiroApp — Planejador de Viagens",
    description: "Planeje roteiros, controle orçamento, organize documentos e compartilhe suas viagens.",
    creator: "@roteiroapp",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
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
        {GA_ID && (
          <>
            {/* eslint-disable-next-line @next/next/no-sync-scripts */}
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
              }}
            />
          </>
        )}
      </head>
      <body className={inter.className}>
        {GA_ID && (
          <Suspense fallback={null}>
            <GATracker gaId={GA_ID} />
          </Suspense>
        )}
        {children}
        <script dangerouslySetInnerHTML={{ __html: `
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
