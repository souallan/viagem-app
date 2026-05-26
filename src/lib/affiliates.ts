// Affiliate partner configuration
// Set your referral codes in .env.local:
//   NEXT_PUBLIC_WISE_REF=your_wise_referral_code
//   NEXT_PUBLIC_NOMAD_REF=your_nomad_referral_code
//   NEXT_PUBLIC_SEGUROS_PROMO_ID=your_seguros_promo_parceiro_id
//   NEXT_PUBLIC_ASSISTCARD_REF=your_assistcard_ref_code

const W  = process.env.NEXT_PUBLIC_WISE_REF;
const N  = process.env.NEXT_PUBLIC_NOMAD_REF;
const SP = process.env.NEXT_PUBLIC_SEGUROS_PROMO_ID;
const AC = process.env.NEXT_PUBLIC_ASSISTCARD_REF;

export interface AffiliatePartner {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  badge: string;
  badgeColor: string;
  borderColor: string;
  url: string;
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
      badgeColor: "bg-sky-100 text-sky-700",
      borderColor: "border-sky-200",
      url: AC ? `https://www.assistcard.com/br?ref=${AC}` : "https://www.assistcard.com/br",
    },
  ] as AffiliatePartner[],
};
