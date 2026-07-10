// Banco único de fotos de capa prontas, organizado por região.
// Todas as URLs verificadas (HTTP 200) — Unsplash, uso livre.

export type CoverPhoto = { url: string; label: string };
export type CoverGroup = { region: string; photos: CoverPhoto[] };

const U = (id: string) => `https://images.unsplash.com/${id}?w=800&q=80`;

export const COVER_GROUPS: CoverGroup[] = [
  {
    region: "Eurotrip",
    photos: [
      { url: U("photo-1502602898657-3e91760cbb34"), label: "Paris" },
      { url: U("photo-1529260830199-42c24126f198"), label: "Roma" },
      { url: U("photo-1539037116277-4db20889f2d4"), label: "Barcelona" },
      { url: U("photo-1555881400-74d7acaacd8b"), label: "Lisboa" },
      { url: U("photo-1534351590666-13e3e96b5017"), label: "Amsterdam" },
      { url: U("photo-1513635269975-59663e0ac1ad"), label: "Londres" },
      { url: U("photo-1514890547357-a9ee288728e0"), label: "Veneza" },
      { url: U("photo-1516483638261-f4dbaf036963"), label: "Toscana" },
      { url: U("photo-1570077188670-e3a8d69ac5ff"), label: "Santorini" },
    ],
  },
  {
    region: "Leste Europeu",
    photos: [
      { url: U("photo-1519677100203-a0e668c92439"), label: "Praga" },
      { url: U("photo-1541849546-216549ae216d"), label: "Budapeste" },
      { url: U("photo-1607427293702-036933bbf746"), label: "Cracóvia" },
      { url: U("photo-1506377295352-e3154d43ea9e"), label: "Dubrovnik" },
    ],
  },
  {
    region: "Ásia & Oriente",
    photos: [
      { url: U("photo-1536098561742-ca998e48cbcc"), label: "Tóquio" },
      { url: U("photo-1537996194471-e657df975ab4"), label: "Bali" },
      { url: U("photo-1508009603885-50cf7c579365"), label: "Bangkok" },
      { url: U("photo-1528181304800-259b08848526"), label: "Tailândia" },
      { url: U("photo-1583422409516-2895a77efded"), label: "Seul" },
      { url: U("photo-1524413840807-0c3cb6fa808d"), label: "Vietnã" },
      { url: U("photo-1512453979798-5ea266f8880c"), label: "Dubai" },
      { url: U("photo-1548013146-72479768bada"), label: "Índia" },
    ],
  },
  {
    region: "Américas",
    photos: [
      { url: U("photo-1496442226666-8d4d0e62e6e9"), label: "Nova York" },
      { url: U("photo-1483729558449-99ef09a8c325"), label: "Rio de Janeiro" },
      { url: U("photo-1526392060635-9d6019884377"), label: "Machu Picchu" },
      { url: U("photo-1510097467424-192d713fd8b2"), label: "Cancún" },
      { url: U("photo-1534430480872-3498386e7856"), label: "Patagônia" },
    ],
  },
  {
    region: "África & Oriente Médio",
    photos: [
      { url: U("photo-1558618666-fcd25c85cd64"), label: "Marrocos" },
      { url: U("photo-1539768942893-daf53e448371"), label: "Egito" },
      { url: U("photo-1547471080-7cc2caa01a7e"), label: "Turquia" },
      { url: U("photo-1580060839134-75a5edca2e99"), label: "Cape Town" },
      { url: U("photo-1484318571209-661cf29a69c3"), label: "Safári" },
    ],
  },
  {
    region: "Praias & Natureza",
    photos: [
      { url: U("photo-1506929562872-bb421503ef21"), label: "Praia tropical" },
      { url: U("photo-1501952476817-d7ae22e8ee4e"), label: "Sunset tropical" },
      { url: U("photo-1476514525535-07fb3b4ae5f1"), label: "Montanhas" },
      { url: U("photo-1531366936337-7c912a4589a7"), label: "Alpes Suíços" },
      { url: U("photo-1454496522488-7a8e488e8606"), label: "Aurora Boreal" },
      { url: U("photo-1441974231531-c6227db76b6e"), label: "Floresta" },
      { url: U("photo-1469854523086-cc02fe5d8800"), label: "Estrada" },
    ],
  },
];

// Lista plana (compatibilidade / usos que não precisam de agrupamento)
export const COVER_PHOTOS: CoverPhoto[] = COVER_GROUPS.flatMap((g) => g.photos);
