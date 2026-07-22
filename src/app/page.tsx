import type { Metadata } from "next";
import { LandingClient } from "@/components/landing/landing-client";
import { NativeLandingGuard } from "@/components/native/native-landing-guard";

export const metadata: Metadata = {
  title: "RoteiroApp — Planeje viagens sem 27 abas | Grátis",
  description:
    "Roteiro, orçamento, hospedagem, malas e documentos num app só. Grátis para começar, sem cartão. Feito para brasileiros. PT/EN/ES.",
  openGraph: {
    title: "RoteiroApp — Sua viagem inteira organizada, num app só",
    description:
      "Itinerário, gastos, hospedagem, malas, documentos e roteiros prontos. Comece grátis, sem cartão. PT/EN/ES.",
    url: "https://roteiroapp.com",
    siteName: "RoteiroApp",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "RoteiroApp" }],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RoteiroApp — Planeje viagens sem 27 abas",
    description: "Tudo da sua viagem num app só. Grátis para começar, sem cartão.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "https://roteiroapp.com" },
};

export default function LandingPage() {
  return (
    <>
      {/* No app nativo, manda para /dashboard em vez de mostrar marketing */}
      <NativeLandingGuard />
      <LandingClient />
    </>
  );
}
