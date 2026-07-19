// Affiliate partner configuration
// Set your referral codes in .env.local (and Railway variables):
//   NEXT_PUBLIC_WISE_REF=your_wise_referral_code
//   NEXT_PUBLIC_NOMAD_REF=your_nomad_referral_code
//   NEXT_PUBLIC_SEGUROS_PROMO_ID=your_seguros_promo_parceiro_id
//   NEXT_PUBLIC_ASSISTCARD_REF=your_assistcard_ref_code
//   NEXT_PUBLIC_BOOKING_AID=your_booking_affiliate_id
//   NEXT_PUBLIC_SKYSCANNER_REF=your_skyscanner_partner_id
//   NEXT_PUBLIC_GYG_PARTNER_ID=your_getyourguide_partner_id
//   NEXT_PUBLIC_AIRALO_REF=your_airalo_ref_code
//   NEXT_PUBLIC_RENTCARS_REF=your_rentcars_affiliate_code

const W    = process.env.NEXT_PUBLIC_WISE_REF;
const N    = process.env.NEXT_PUBLIC_NOMAD_REF;
const SP   = process.env.NEXT_PUBLIC_SEGUROS_PROMO_ID;
const AC   = process.env.NEXT_PUBLIC_ASSISTCARD_REF;
const BK   = process.env.NEXT_PUBLIC_BOOKING_AID;
const SKY  = process.env.NEXT_PUBLIC_SKYSCANNER_REF;
const GYG  = process.env.NEXT_PUBLIC_GYG_PARTNER_ID;
const AIR  = process.env.NEXT_PUBLIC_AIRALO_REF;
const RC   = process.env.NEXT_PUBLIC_RENTCARS_REF;

export interface AffiliatePartner {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  badge: string;
  badgeColor: string;
  borderColor: string;
  url: string;
  /** Optional: build a context-aware URL given a destination string */
  buildUrl?: (destination: string) => string;
}

export const affiliates = {
  currency: [
    {
      id: "wise",
      name: "Wise",
      emoji: "💱",
      tagline: "Câmbio na taxa real, sem taxas escondidas",
      badge: "Mais econômico",
      badgeColor: "bg-emerald-100 text-emerald-700",
      borderColor: "border-emerald-200",
      url: W ? `https://wise.com/invite/u/${W}` : "https://wise.com/pt/travel-money",
    },
    {
      id: "nomad",
      name: "Nomad",
      emoji: "🌐",
      tagline: "Cartão de viagem para brasileiros no exterior",
      badge: "Popular no Brasil",
      badgeColor: "bg-blue-100 text-blue-700",
      borderColor: "border-blue-200",
      url: N ? `https://nomadglobal.com/?ref=${N}` : "https://nomadglobal.com",
    },
  ] as AffiliatePartner[],

  insurance: [
    {
      id: "seguros-promo",
      name: "Seguros Promo",
      emoji: "🛡️",
      tagline: "Compare preços de múltiplas seguradoras",
      badge: "Compare agora",
      badgeColor: "bg-violet-100 text-violet-700",
      borderColor: "border-violet-200",
      url: SP ? `https://www.seguros.promo/parceiro/${SP}` : "https://www.seguros.promo",
    },
    {
      id: "assistcard",
      name: "Assistcard",
      emoji: "🩺",
      tagline: "Cobertura em mais de 180 países",
      badge: "Mais vendido",
      badgeColor: "bg-primary-100 text-primary-700",
      borderColor: "border-primary-200",
      url: AC ? `https://www.assistcard.com/br?ref=${AC}` : "https://www.assistcard.com/br",
    },
  ] as AffiliatePartner[],

  accommodation: [
    {
      id: "booking",
      name: "Booking.com",
      emoji: "🏨",
      tagline: "Hotéis, pousadas e apartamentos com preço garantido",
      badge: "Mais opções",
      badgeColor: "bg-blue-100 text-blue-700",
      borderColor: "border-blue-200",
      url: BK
        ? `https://www.booking.com/index.html?aid=${BK}`
        : "https://www.booking.com",
      buildUrl: (destination: string) =>
        BK
          ? `https://www.booking.com/searchresults.html?aid=${BK}&ss=${encodeURIComponent(destination)}`
          : `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`,
    },
    {
      id: "hoteis",
      name: "Hotels.com",
      emoji: "🛎️",
      tagline: "Reserve 10 noites, ganhe 1 grátis",
      badge: "Programa fidelidade",
      badgeColor: "bg-red-100 text-red-700",
      borderColor: "border-red-200",
      url: "https://www.hotels.com/pt-br/",
      buildUrl: (destination: string) =>
        `https://www.hotels.com/pt-br/search.do?q-destination=${encodeURIComponent(destination)}`,
    },
  ] as AffiliatePartner[],

  flights: [
    {
      id: "skyscanner",
      name: "Skyscanner",
      emoji: "✈️",
      tagline: "Compare centenas de companhias e encontre o menor preço",
      badge: "Melhor preço",
      badgeColor: "bg-cyan-100 text-cyan-700",
      borderColor: "border-cyan-200",
      url: SKY
        ? `https://www.skyscanner.com.br/?referrer_pl=${SKY}`
        : "https://www.skyscanner.com.br",
      buildUrl: (destination: string) =>
        SKY
          ? `https://www.skyscanner.com.br/voos/${encodeURIComponent(destination)}/?referrer_pl=${SKY}`
          : `https://www.skyscanner.com.br/voos/${encodeURIComponent(destination)}/`,
    },
    {
      id: "decolar",
      name: "Decolar",
      emoji: "🛫",
      tagline: "Passagens aéreas com parcelamento em reais",
      badge: "Parcela em 12x",
      badgeColor: "bg-orange-100 text-orange-700",
      borderColor: "border-orange-200",
      url: "https://www.decolar.com/passagens-aereas/",
    },
  ] as AffiliatePartner[],

  tours: [
    {
      id: "getyourguide",
      name: "GetYourGuide",
      emoji: "🎯",
      tagline: "Tours, ingressos e experiências no destino",
      badge: "Cancele grátis",
      badgeColor: "bg-yellow-100 text-yellow-700",
      borderColor: "border-yellow-200",
      url: GYG
        ? `https://www.getyourguide.com.br/?partner_id=${GYG}`
        : "https://www.getyourguide.com.br",
      buildUrl: (destination: string) =>
        GYG
          ? `https://www.getyourguide.com.br/${encodeURIComponent(destination.toLowerCase())}-l/?partner_id=${GYG}`
          : `https://www.getyourguide.com.br/s/?q=${encodeURIComponent(destination)}`,
    },
    {
      id: "viator",
      name: "Viator",
      emoji: "🗺️",
      tagline: "Mais de 300 mil experiências no mundo todo",
      badge: "Mais avaliações",
      badgeColor: "bg-green-100 text-green-700",
      borderColor: "border-green-200",
      url: "https://www.viator.com/pt-BR/",
      buildUrl: (destination: string) =>
        `https://www.viator.com/pt-BR/search?text=${encodeURIComponent(destination)}`,
    },
  ] as AffiliatePartner[],

  esim: [
    {
      id: "airalo",
      name: "Airalo",
      emoji: "📱",
      tagline: "eSIM para mais de 200 países — ative antes de embarcar",
      badge: "Sem troca de chip",
      badgeColor: "bg-purple-100 text-purple-700",
      borderColor: "border-purple-200",
      url: AIR ? `https://ref.airalo.com/${AIR}` : "https://www.airalo.com/pt",
    },
  ] as AffiliatePartner[],

  car: [
    {
      id: "rentcars",
      name: "Rentcars",
      emoji: "🚗",
      tagline: "Compare aluguel de carros em todo o mundo",
      badge: "Melhor preço garantido",
      badgeColor: "bg-indigo-100 text-indigo-700",
      borderColor: "border-indigo-200",
      url: RC ? `https://www.rentcars.com/?aff=${RC}` : "https://www.rentcars.com",
    },
  ] as AffiliatePartner[],
};
