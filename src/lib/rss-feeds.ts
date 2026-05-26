export interface ExternalTip {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  sourceName: string;
  lang: "pt" | "es" | "en";
  publishedAt: string;
  category: string;
  categoryColor: string;
}

export interface RssFeedConfig {
  name: string;
  url: string;
  lang: "pt" | "es" | "en";
  category: string;
  categoryColor: string;
}

export const RSS_FEEDS: RssFeedConfig[] = [
  // ── English ──────────────────────────────────────────────
  {
    name: "Nomadic Matt",
    url: "https://www.nomadicmatt.com/feed/",
    lang: "en",
    category: "Travel Tips",
    categoryColor: "bg-sky-100 text-sky-700",
  },
  {
    name: "The Broke Backpacker",
    url: "https://www.thebrokebackpacker.com/feed/",
    lang: "en",
    category: "Backpacking",
    categoryColor: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Hand Luggage Only",
    url: "https://handluggageonly.co.uk/feed/",
    lang: "en",
    category: "Destinations",
    categoryColor: "bg-violet-100 text-violet-700",
  },
  // ── Spanish ──────────────────────────────────────────────
  {
    name: "Traveler España",
    url: "https://www.traveler.es/rss/",
    lang: "es",
    category: "Viajes",
    categoryColor: "bg-amber-100 text-amber-700",
  },
  {
    name: "Viajeros.com",
    url: "https://www.viajeros.com/rss/",
    lang: "es",
    category: "Destinos",
    categoryColor: "bg-orange-100 text-orange-700",
  },
  // ── Portuguese ───────────────────────────────────────────
  {
    name: "Mochilão pelo Mundo",
    url: "https://mochilao.com.br/feed/",
    lang: "pt",
    category: "Mochila",
    categoryColor: "bg-teal-100 text-teal-700",
  },
  {
    name: "Viagem e Gastronomia",
    url: "https://www.viagemeturismo.abril.com.br/feed/",
    lang: "pt",
    category: "Gastronomia",
    categoryColor: "bg-rose-100 text-rose-700",
  },
];
