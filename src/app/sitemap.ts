import { MetadataRoute } from "next";
import { DESTINATIONS } from "@/lib/destinations";

const BASE = "https://roteiroapp.com";

const BLOG_SLUGS = [
  "como-organizar-roteiro-de-viagem",
  "passaporte-brasileiro-destinos-sem-visto",
  "seguro-viagem-vale-a-pena",
  "economizar-no-cambio",
  "lista-de-malas-viagem-internacional",
  "melhores-destinos-para-brasileiros-2025",
  "como-viajar-mais-barato",
  "roteiro-europa-15-dias",
  "roteiro-lisboa-7-dias",
  "melhores-destinos-brasil-2026",
  "mochilao-europa-barato",
  "roteiro-japao-10-dias",
];

const ROTEIRO_CIDADES = Object.keys(DESTINATIONS);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/app`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...BLOG_SLUGS.map((slug) => ({
      url: `${BASE}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${BASE}/roteiro`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...ROTEIRO_CIDADES.map((cidade) => ({
      url: `${BASE}/roteiro/${cidade}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    { url: `${BASE}/posts`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
