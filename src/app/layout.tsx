import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
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
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "RoteiroApp — Planejador de Viagens" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RoteiroApp — Planejador de Viagens",
    description: "Planeje roteiros, controle orçamento, organize documentos e compartilhe suas viagens.",
    images: ["/og-image.png"],
    creator: "@roteiroapp",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
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
