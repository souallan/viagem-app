import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, ArrowRight } from "lucide-react";
import { AffiliateBlock } from "@/components/marketing/affiliate-block";

const CATEGORY_AFFILIATES: Record<string, ("accommodation" | "flights" | "tours" | "currency" | "insurance" | "esim" | "car")[]> = {
  "Roteiros": ["accommodation", "flights", "tours"],
  "Destinos": ["accommodation", "flights"],
  "Finanças": ["currency", "insurance"],
  "Segurança": ["insurance"],
  "Documentos": ["insurance", "esim"],
  "Planejamento": ["accommodation", "flights"],
};

const ARTICLES = [
  {
    slug: "como-organizar-roteiro-de-viagem",
    title: "Como organizar um roteiro de viagem do zero",
    excerpt: "Passo a passo para planejar sua viagem: escolha do destino, orçamento, hospedagem, transporte e atividades.",
    date: "2025-05-15",
    readTime: "8 min",
    category: "Planejamento",
    emoji: "🗺️",
    content: `Organizar um roteiro de viagem pode parecer complicado, mas com um método claro fica simples. Veja as etapas essenciais:

## 1. Defina o destino e as datas

Comece escolhendo o destino com base em seu orçamento e período disponível. Considere a temporada — alta temporada tem preços maiores mas clima mais previsível; baixa temporada é mais barata mas exige pesquisa extra.

## 2. Monte o orçamento total

Divida o orçamento em categorias: passagem, hospedagem, alimentação, atrações e compras. Uma regra prática: passagem consome 30–40% do total, hospedagem 25–35%.

## 3. Reserve passagem e hospedagem com antecedência

Para destinos populares, reserve com 3–6 meses de antecedência. Use ferramentas como Skyscanner para passagens e Booking.com para hospedagem.

## 4. Liste as atividades dia a dia

Monte um itinerário com atividades por dia, agrupando atrações próximas geograficamente. Evite encher demais — 3 a 4 atividades por dia é o ideal.

## 5. Organize os documentos

Passaporte, visto, seguro viagem e vacinas. Verifique a validade mínima exigida no destino (geralmente 6 meses após o retorno).

## 6. Use um app de roteiro

Ferramentas como o RoteiroApp centralizam tudo: atividades, hospedagem, orçamento e lista de malas em um só lugar — funciona offline também.`,
  },
  {
    slug: "passaporte-brasileiro-destinos-sem-visto",
    title: "Passaporte brasileiro: todos os destinos sem visto em 2025",
    excerpt: "Com o passaporte brasileiro você visita mais de 170 países sem visto ou com visto na chegada.",
    date: "2025-05-22",
    readTime: "5 min",
    category: "Documentos",
    emoji: "🛂",
    content: `O passaporte brasileiro tem forte poder de acesso global. Em 2025, permite entrada em **170+ países** sem visto prévio ou com visto na chegada.

## Destinos populares sem visto

- **Europa (Schengen)**: Alemanha, França, Espanha, Itália, Portugal e mais 22 países
- **Américas**: EUA (90 dias com ESTA), Canadá, México, Argentina, Chile, Colômbia
- **Ásia**: Japão (90 dias), Tailândia (30 dias), Bali/Indonésia (30 dias)
- **África**: África do Sul, Marrocos, Egito (visto na chegada)

## Validade mínima do passaporte

A maioria dos países exige passaporte válido por pelo menos **6 meses** após a data de retorno. Sempre verifique antes de viajar.

## Como tirar ou renovar o passaporte

1. Agende pelo site da Polícia Federal
2. Compareça com documentos (RG, CPF, foto 3x4)
3. Prazo: 6 dias úteis (normal) ou 10 dias (emergencial)
4. Custo: R$ 257,25 (adulto)

**Dica**: mantenha cópias digitais do passaporte no celular e em e-mail para emergências.`,
  },
  {
    slug: "seguro-viagem-vale-a-pena",
    title: "Seguro viagem: vale a pena contratar? Guia completo",
    excerpt: "Entenda quando o seguro viagem é obrigatório, o que ele cobre, quanto custa e como escolher o melhor plano.",
    date: "2025-05-29",
    readTime: "6 min",
    category: "Segurança",
    emoji: "🛡️",
    content: `O seguro viagem é um dos itens mais importantes — e mais ignorados — no planejamento de viagens.

## Quando é obrigatório?

- **Europa (Schengen)**: obrigatório com cobertura mínima de €30.000 para despesas médicas
- **Cuba**: obrigatório para todos os visitantes
- Alguns países do Caribe e Oriente Médio

## O que cobre um bom seguro viagem?

- Despesas médicas e hospitalares
- Evacuação de emergência
- Cancelamento e interrupção de viagem
- Extravio de bagagem
- Responsabilidade civil

## Quanto custa?

Para destinos como Europa, espere pagar R$ 30–80 por semana (adulto saudável). Para os EUA, onde o custo médico é altíssimo, o preço dobra.

## Como escolher?

Compare coberturas pelo Seguros Promo — você vê preços de múltiplas seguradoras em uma só tela. Prefira coberturas de pelo menos US$ 100.000 para destinos como EUA e Canadá.

**Dica prática**: contrate sempre antes de embarcar. Após a viagem começar, não é possível contratar.`,
  },
  {
    slug: "economizar-no-cambio",
    title: "Como economizar no câmbio e gastar menos no exterior",
    excerpt: "Cartão Wise, Nomad, câmbio no Brasil ou no exterior? Guia prático para pagar menos taxas.",
    date: "2025-06-05",
    readTime: "7 min",
    category: "Finanças",
    emoji: "💱",
    content: `O câmbio pode consumir 5–15% do seu dinheiro se você não tomar cuidado. Veja as melhores opções para brasileiros viajando ao exterior.

## Opção 1: Cartão Wise (melhor para maioria dos casos)

O Wise usa a taxa de câmbio real (interbancária) sem spread — você paga somente uma pequena taxa por transação. Ideal para Europa, EUA e Ásia. Abra sua conta com antecedência pois o cartão físico leva dias para chegar.

## Opção 2: Cartão Nomad

Voltado especificamente para brasileiros, o Nomad oferece câmbio competitivo e saque em dólares via parceiros. Boa alternativa ao Wise para quem prefere interface em português.

## Opção 3: Cartão de crédito com isenção de IOF

Alguns cartões de crédito premium (Nubank, C6, Santander Free) isentam o IOF (6,38% sobre compras no exterior). Compense com o câmbio da operadora, geralmente 1–2% acima do real.

## O que EVITAR

- Casas de câmbio aeroportos: até 15% mais caro
- Câmbio em hotéis: piores taxas do mercado
- Saques em caixas eletrônicos sem cartão específico: tarifas altas

**Regra de ouro**: nunca chegue ao destino sem alguma moeda local para os primeiros momentos.`,
  },
  {
    slug: "lista-de-malas-viagem-internacional",
    title: "Lista de malas completa para viagem internacional",
    excerpt: "O que levar na mala para não esquecer nada essencial. Lista de documentos, roupas, eletrônicos e produtos de higiene para viagem internacional.",
    date: "2025-06-12",
    readTime: "6 min",
    category: "Planejamento",
    emoji: "🧳",
    content: `## Documentos essenciais

- Passaporte (validade mínima de 6 meses após retorno)
- Visto (se necessário)
- Seguro viagem impresso ou no celular
- Passagens de ida e volta
- Vouchers de hotel
- Carteira de motorista internacional (se for alugar carro)
- Cópias de todos os documentos (e-mail ou nuvem)

## Dinheiro e cartões

- Cartão internacional (Wise ou Nomad)
- Alguma moeda local para chegada
- Cartão de crédito emergência

## Eletrônicos

- Carregador do celular
- Adaptador de tomada universal
- Power bank (não despachar)
- Fones de ouvido

## Roupas — regra dos 3

Leve 3 partes de baixo, 5 camisetas, 1 agasalho e 1 jaqueta impermeável. Para cada semana adicional, adicione apenas 2 peças — lave as outras.

## Higiene e saúde

- Protetor solar
- Remédios pessoais + analgésico + antidiarreico
- Repelente (destinos tropicais)
- Seguro saúde com contato de emergência salvo no celular

**Dica RoteiroApp**: use a lista de malas inteligente do app — ela sugere itens automaticamente pelo destino e clima da sua viagem.`,
  },
  {
    slug: "melhores-destinos-para-brasileiros-2025",
    title: "Melhores destinos internacionais para brasileiros em 2025",
    excerpt: "De Lisboa a Bangkok: os destinos mais procurados por brasileiros em 2025, com custo médio, melhor época para visitar e dicas de planejamento.",
    date: "2025-06-19",
    readTime: "9 min",
    category: "Destinos",
    emoji: "🌍",
    content: `Brasileiros estão viajando mais — e o leque de destinos favoritos cresceu. Aqui estão os mais procurados em 2025.

## 🇵🇹 Lisboa e Porto, Portugal

O destino favorito dos brasileiros. Língua comum, gastronomia familiar e custo acessível para a Europa. Melhor época: abril a junho e setembro a outubro.

Custo médio: R$ 8.000 – R$ 12.000 por pessoa (10 dias, voo incluso).

## 🇦🇷 Buenos Aires, Argentina

Destino clássico e acessível. Câmbio favorável, gastronomia excelente e cultura rica. Melhor época: setembro a novembro.

Custo médio: R$ 4.000 – R$ 7.000 por pessoa (7 dias).

## 🇹🇭 Tailândia

O destino asiático queridinho dos brasileiros. Praias paradisíacas, comida barata e hostels de qualidade. Melhor época: novembro a fevereiro.

Custo médio: R$ 10.000 – R$ 16.000 por pessoa (14 dias, voo incluso).

## 🇮🇹 Itália

Roma, Florença e Veneza formam o roteiro clássico. Exige planejamento com antecedência para fugir das filas nos museus. Melhor época: maio e setembro.

Custo médio: R$ 14.000 – R$ 22.000 por pessoa (12 dias).

## 🇺🇸 Estados Unidos

Florida, Nova York e California lideram. O visto ESTA é simples e rápido. Melhor época: março a maio e setembro a novembro.

Custo médio: R$ 15.000 – R$ 25.000 por pessoa (12 dias, voo incluso).

## 🇯🇵 Japão

Explosão de popularidade em 2025. Seguro, organizado e com gastronomia incrível. Melhor época: março-abril (cerejeiras) ou outubro-novembro (outono).

Custo médio: R$ 14.000 – R$ 20.000 por pessoa (12 dias).

**Dica**: independente do destino, planeje com 3–6 meses de antecedência para conseguir voos mais baratos e acomodações nas datas certas.`,
  },
  {
    slug: "como-viajar-mais-barato",
    title: "Como viajar mais barato: 12 dicas que realmente funcionam",
    excerpt: "Estratégias práticas para reduzir o custo das suas viagens internacionais sem abrir mão do conforto. Voos, hospedagem, câmbio e muito mais.",
    date: "2025-06-26",
    readTime: "7 min",
    category: "Finanças",
    emoji: "💰",
    content: `Viajar mais barato não significa viajar mal. Com as estratégias certas, você viaja mais com o mesmo orçamento.

## 1. Seja flexível com as datas

Voar na terça ou quarta custa em média 20–30% menos que no final de semana. Use o calendário de preços do Google Flights ou Skyscanner para ver o mapa de preços por data.

## 2. Reserve com antecedência

O ponto ideal para passagens internacionais é 2–4 meses antes. Configure alertas no Google Flights para seu destino.

## 3. Evite alta temporada

Viajar na baixa temporada pode reduzir o custo total em 30–50%. Julho e dezembro/janeiro são os períodos mais caros para a maioria dos destinos.

## 4. Hospedagem fora do centro

Hotéis e airbnbs a 15–20 minutos do centro custam metade do preço. Com transporte público, a diferença de tempo é mínima.

## 5. Use cartões sem IOF

O IOF de 6,38% sobre compras no exterior é um custo invisível enorme. Cartões como Wise, Nomad ou Nubank internacional eliminam esse custo.

## 6. Coma onde os locais comem

Restaurantes a 2 quarteirões dos pontos turísticos custam metade e são frequentemente melhores.

## 7. Viaje só com bagagem de mão

Despachar bagagem custa R$ 200–400 por trecho em companhias low-cost. Aprender a viajar só com bagagem de mão pode economizar R$ 800+ em uma viagem.

## 8. City Pass e museus gratuitos

Muitas cidades oferecem passes de museu e transporte com desconto. Em Paris, os museus são gratuitos no primeiro domingo do mês.

## 9. Compare sempre 3 opções

Para cada item (voo, hotel, seguro), compare pelo menos 3 opções. A diferença entre a primeira e a melhor oferta pode ser de 30%.

## 10. Controle o orçamento em tempo real

Use o RoteiroApp para registrar cada gasto durante a viagem. Pequenos gastos não planejados somados são os maiores vilões do orçamento.`,
  },
  {
    slug: "roteiro-europa-15-dias",
    title: "Roteiro pela Europa em 15 dias: guia completo para brasileiros",
    excerpt: "O roteiro ideal pela Europa em 15 dias passando por Portugal, Espanha, França e Itália. Com dicas de transporte, hospedagem e orçamento.",
    date: "2025-07-03",
    readTime: "10 min",
    category: "Roteiros",
    emoji: "🗼",
    content: `Quinze dias na Europa é o tempo mínimo para ver o essencial sem se sentir atropelado. Este roteiro cobre 4 países com equilíbrio entre turismo e descanso.

## Visão geral

- Dias 1–3: Lisboa, Portugal
- Dias 4–5: Madri, Espanha (trem AVE 2h30)
- Dias 6–8: Barcelona, Espanha
- Dias 9–11: Paris, França (trem TGV 6h30)
- Dias 12–15: Roma, Itália (voo 2h)

## Lisboa (Dias 1–3)

- Dia 1: Alfama, Sé Catedral, Miradouro das Portas do Sol
- Dia 2: Belém (Torre, Pastéis, Mosteiro dos Jerônimos)
- Dia 3: Sintra (excursão de dia inteiro — reservar com antecedência)

Hospedagem: Bairro Alto ou Chiado. Orçamento: €80–140/noite.

## Madri (Dias 4–5)

- Museu do Prado (reservar ingresso online)
- Parque del Retiro e Gran Vía

## Barcelona (Dias 6–8)

- Sagrada Família (reservar com 1–2 meses de antecedência)
- Parque Güell, Las Ramblas, Bairro Gótico
- Dia de praia na Barceloneta

## Paris (Dias 9–11)

- Torre Eiffel (reservar online — filas enormes presencialmente)
- Museu do Louvre (reservar online)
- Montmartre, Sacré-Cœur, Arc de Triomphe

## Roma (Dias 12–15)

- Coliseu e Foro Romano (reservar com antecedência)
- Vaticano — Museus e Basílica (reservar semanas antes)
- Fontana di Trevi, Pantheon, Campo de' Fiori

## Orçamento estimado por pessoa

- Passagens (Brasil–Lisboa, Roma–Brasil): R$ 4.000 – R$ 7.000
- Transporte interno (trens + 1 voo): €250 – €400
- Hospedagem (14 noites, hotel 3★): €1.200 – €2.000
- Alimentação: €40–70/dia
- Atrações: €200 – €350
- **Total estimado: R$ 18.000 – R$ 28.000**

## Documentos necessários

Passaporte válido por 6 meses após retorno. Nenhum visto necessário para brasileiros. Seguro viagem com cobertura mínima de €30.000 (obrigatório para Schengen).

**Dica**: organize todo o roteiro dia a dia no RoteiroApp — incluindo reservas de atrações, transportes entre cidades e controle de gastos em euros.`,
  },
  {
    slug: "roteiro-lisboa-7-dias",
    title: "Roteiro Lisboa 7 dias: o guia completo para brasileiros",
    excerpt: "Sete dias em Lisboa sem perder nada importante: Alfama, Belém, Sintra, Cascais e as melhores pastelarias da cidade. Com custo estimado e dicas de transporte.",
    date: "2026-05-01",
    readTime: "10 min",
    category: "Roteiros",
    emoji: "🇵🇹",
    content: `Lisboa é o destino favorito dos brasileiros na Europa — e não é à toa. Mesma língua, gastronomia familiar, custo acessível e uma beleza atemporal que mistura história e modernidade. Sete dias é o tempo ideal para explorar a cidade sem correr.

## Dia 1 — Alfama e o coração histórico

Comece pelo bairro mais antigo da cidade. Suba ao Castelo de São Jorge de manhã (chegue antes das 10h para evitar filas). Desça pelas ruelas de Alfama e pare no Museu do Azulejo, um dos mais subestimados da Europa. No fim da tarde, veja o pôr do sol no Miradouro da Graça: menos turistas que o Portas do Sol e vista melhor.

## Dia 2 — Belém

Pegue o elétrico 15E ou o trem de Cais do Sodré (15 min). Torre de Belém, Mosteiro dos Jerônimos (reserve online) e os Pastéis de Belém — a fila anda rápido. Volte pelo Chiado para jantar na Tasca do Chico.

## Dia 3 — Sintra

Acorde cedo: os ônibus para o Palácio da Pena lotam depois das 10h. Compre os ingressos online. Palácio da Pena, Castelo dos Mouros e Palácio Nacional de Sintra. Volte à tarde e explore o Mercado da Ribeira.

## Dia 4 — Mouraria e Feira da Ladra

Mouraria é o berço do fado, com restaurantes incríveis sem a marcação turística. A Feira da Ladra acontece só terças e sábados — peças únicas por preços imbatíveis. Tarde livre para o Museu Nacional do Azulejo ou um passeio de barco no Tejo.

## Dia 5 — Cascais e a Linha de Estoril

Trem direto de Cais do Sodré (40 min, €2,50). Cascais é uma vila costeira elegante, com praias, restaurantes de peixe e o Boca do Inferno. Almoço de peixe fresco junto ao porto.

## Dia 6 — LX Factory e Bairro Alto

LX Factory é o programa perfeito: mercado, design, gastronomia e livrarias numa fábrica recuperada. À noite, o Bairro Alto acorda — bares pequenos, vinho acessível e a cena cultural mais autêntica da cidade.

## Dia 7 — Parque das Nações e compras

Zona moderna construída para a Expo 98. Oceanário de Lisboa (reservar online), Pavilhão do Conhecimento e arquitetura impressionante. Tarde para lembranças — evite a Rua Augusta e prefira lojas no Príncipe Real.

## Orçamento estimado (por pessoa, 7 dias)

- Voo Brasil–Lisboa (ida e volta): R$ 3.500 – R$ 6.000
- Hospedagem (6 noites, hotel 3 estrelas): €480 – €800
- Alimentação: €30–50/dia
- Transporte local: €30
- Atrações: €80 – €120
- **Total estimado: R$ 7.000 – R$ 14.000**

## Dica prática

Compre o cartão Viva Viagem (€0,50) e carregue com créditos — funciona no metro, tram e barco. Organize o roteiro dia a dia no RoteiroApp para não perder nenhuma reserva.`,
  },
  {
    slug: "melhores-destinos-brasil-2026",
    title: "Melhores destinos nacionais para viajar no Brasil em 2026",
    excerpt: "De Minas Gerais ao Pará, os destinos brasileiros em alta em 2026 com custo médio, melhor época e o que não pode perder em cada um.",
    date: "2026-05-08",
    readTime: "8 min",
    category: "Destinos",
    emoji: "🇧🇷",
    content: `O Brasil tem uma diversidade geográfica e cultural com que poucos países no mundo conseguem competir. Em 2026, uma nova geração de destinos ganha destaque — além dos clássicos.

## Chapada dos Veadeiros (GO)

Um dos segredos mais bem guardados do país: cachoeiras cristalinas, cânions e o maior cerrado contínuo do mundo. Melhor época: maio a setembro (seca). Cidade base: Alto Paraíso de Goiás. Custo médio: R$ 200–300/dia por pessoa.

## Serra da Canastra (MG)

Nascente do Rio São Francisco, cachoeiras e o queijo artesanal mais famoso do Brasil. Minas é a revelação de 2026 no turismo nacional. Acesse por São Roque de Minas. Melhor época: março a outubro. Custo: R$ 150–250/dia.

## Fernando de Noronha (PE)

A Baía do Sancho é eleita repetidamente uma das melhores praias do mundo. Noronha exige planejamento: TPA (Taxa de Preservação Ambiental) por dia e voos a partir de Recife. Reserve com 6+ meses. Custo: R$ 800–1.500/dia.

## Lençóis Maranhenses (MA)

Entre junho e setembro, lagoas azuis e verdes surgem entre dunas brancas — paisagem de outro mundo. Acesse por Barreirinhas (voos para São Luís + traslado). Custo: R$ 300–500/dia.

## Alter do Chão (PA)

O "Caribe amazônico", com praias de rio de água cristalina. Chegada por Santarém. Melhor época: agosto a novembro (praias expostas). Custo: R$ 200–350/dia.

## Bonito (MS)

Ecoturismo de alta qualidade: flutuação em rios cristalinos, cachoeiras e grutas. Passeios regulamentados com número limitado de visitantes — reserve com antecedência. Custo: R$ 350–600/dia.

## Costa do Descobrimento (BA)

Porto Seguro, Trancoso e Arraial d'Ajuda formam um dos destinos baianos mais completos. Melhor época: dezembro a março. Custo: R$ 250–450/dia.

## Por que viajar pelo Brasil em 2026?

Com o dólar e o euro elevados, o Brasil ficou relativamente mais acessível. Destinos emergentes ainda têm infraestrutura mais barata que os clássicos. Planeje com o RoteiroApp e evite os gastos surpresa.`,
  },
  {
    slug: "mochilao-europa-barato",
    title: "Mochilão pela Europa com orçamento baixo: guia para brasileiros",
    excerpt: "Como fazer um mochilão pela Europa gastando menos de R$ 500 por dia. Transporte, hospedagem, alimentação e os países mais baratos para visitar.",
    date: "2026-05-15",
    readTime: "9 min",
    category: "Finanças",
    emoji: "🎒",
    content: `Fazer um mochilão pela Europa é mais acessível do que parece — se você souber onde e como gastar. Com planejamento, dá para viver bem com €50–70 por dia.

## Os países mais baratos da Europa

- **Hungria (Budapeste)**: hostels ótimos a partir de €15/noite. A cidade mais subestimada da Europa.
- **Polônia (Cracóvia, Varsóvia)**: refeições por €4–8, transporte barato, história incrível.
- **República Tcheca (Praga)**: ainda acessível apesar da popularidade.
- **Balcãs (Sérvia, Bósnia, Montenegro)**: destinos emergentes, com vida noturna por preços irrisórios.
- **Portugal**: o mais barato da Europa Ocidental para brasileiros — e sem barreira linguística.

## Transporte: a maior fatia do orçamento

- **Flixbus**: ônibus confortáveis com Wi-Fi entre cidades por €5–30.
- **Passes Interrail**: valem a pena se você planeja 8+ viagens de trem.
- **Ryanair e Wizz Air**: passagens por €10–40 — reserve com 2–3 meses de antecedência.
- **BlaBlaCar**: caronas compartilhadas entre cidades por valores mínimos.

## Hospedagem sem gastar muito

- **Hostels com quartos privados**: melhor custo-benefício (Hostelworld ou Booking).
- **Couchsurfing**: gratuito — requer perfil bem construído e boas avaliações.
- **Ofertas de última hora**: para destinos menos concorridos, esperar pode valer.

## Alimentação com inteligência

- Compre pão, frutas e frios no supermercado para café e lanches (economiza €15+/dia).
- Almoce no restaurante local, fora das ruas turísticas (€8–12).
- Jantar leve ou use a cozinha compartilhada do hostel.

## Exemplo de orçamento diário (Budapeste)

- Hostel privado: €20
- Alimentação: €18
- Transporte local: €5
- Atração (museu/parque): €8
- **Total: €51/dia (~R$ 290)**

## Planejamento é o diferencial

Organizar roteiro, hospedagem, transporte e orçamento sem planilha é um caos. Use o RoteiroApp para centralizar tudo: atividades por dia, custos em euros, documentos e lista de malas.`,
  },
  {
    slug: "roteiro-japao-10-dias",
    title: "Roteiro Japão 10 dias: Tóquio, Kyoto e Osaka para brasileiros",
    excerpt: "O roteiro clássico do Japão em 10 dias — Tóquio, Kyoto e Osaka. Com custos reais, dicas de transporte, onde comer e o que não deixar de fazer.",
    date: "2026-05-22",
    readTime: "11 min",
    category: "Roteiros",
    emoji: "🇯🇵",
    content: `O Japão explodiu em popularidade entre brasileiros — e não é surpresa: país seguro, limpo, com gastronomia incrível e uma cultura única. Este roteiro de 10 dias cobre o triângulo clássico.

## O básico antes de partir

- **Visto**: não é necessário para brasileiros (até 90 dias, turismo).
- **Passaporte**: válido por 6+ meses após o retorno.
- **IC Card (Suica ou Pasmo)**: cartão de transporte recarregável — compre no aeroporto de chegada.
- **Melhor época**: março-abril (cerejeiras) ou outubro-novembro (outono). Evite a Golden Week.

## Dias 1–4: Tóquio

Uma megalópole que desafia qualquer expectativa. Reserve ao menos 4 dias.

- Dia 1: Shibuya, Harajuku e Yoyogi Park
- Dia 2: Shinjuku (Kabukicho e Golden Gai à noite), Templo Meiji
- Dia 3: Akihabara, Asakusa (Sensoji) e o mercado Nakamise
- Dia 4: Excursão ao Monte Fuji ou Nikko (reserve com agência)

## Dias 5–7: Kyoto

A Kyoto tradicional, a antítese moderna de Tóquio (Shinkansen 2h).

- Dia 5: Arashiyama (bambuzal, Tenryu-ji, bicicleta)
- Dia 6: Caminho da Filosofia, Ginkaku-ji e bairro Gion
- Dia 7: Fushimi Inari-taisha (vá antes das 8h) e Castelo Nijo

## Dias 8–10: Osaka

A capital da gastronomia japonesa — mais descontraída e barata que Tóquio.

- Dia 8: Dotonbori, Takoyaki e o Glico Man
- Dia 9: Castelo de Osaka, Kuromon Market e Shinsekai
- Dia 10: Excursão a Nara (1h de trem), com cervos livres pelo parque

## Custo estimado (por pessoa, 10 dias)

- Voo Brasil–Japão (ida e volta): R$ 5.000 – R$ 9.000
- Japan Rail Pass 7 dias: ¥50.000 (~R$ 1.700) — compre ANTES de chegar
- Hospedagem (9 noites, hotel + hostel): ¥15.000 – ¥25.000/noite
- Alimentação: ¥3.000 – ¥6.000/dia
- Atrações: ¥5.000 – ¥10.000
- **Total estimado: R$ 14.000 – R$ 22.000**

## Dica de ouro

Conbinis (Lawson, FamilyMart, 7-Eleven) são os melhores amigos do viajante no Japão: onigiri, ramen, bentô e sobremesas por ¥200–600. Organize tudo no RoteiroApp e controle os gastos em ienes.`,
  },
];

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return { title: "Artigo não encontrado" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt },
  };
}

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

function renderContent(content: string) {
  return content.split("\n\n").map((block, i) => {
    if (block.startsWith("## ")) {
      return <h2 key={i} className="text-xl font-black text-gray-900 mt-8 mb-3">{block.slice(3)}</h2>;
    }
    if (block.startsWith("- ")) {
      const items = block.split("\n").filter((l) => l.startsWith("- "));
      return (
        <ul key={i} className="list-disc list-inside space-y-1.5 text-gray-600 text-sm leading-relaxed mb-4">
          {items.map((item, j) => {
            const text = item.slice(2).replace(/\*\*(.+?)\*\*/g, "$1");
            const bold = item.slice(2).split("**");
            return (
              <li key={j}>
                {bold.map((part, k) => k % 2 === 1 ? <strong key={k} className="font-bold text-gray-800">{part}</strong> : part)}
              </li>
            );
          })}
        </ul>
      );
    }
    if (block.match(/^\d\./)) {
      const items = block.split("\n").filter((l) => l.match(/^\d\./));
      return (
        <ol key={i} className="list-decimal list-inside space-y-1.5 text-gray-600 text-sm leading-relaxed mb-4">
          {items.map((item, j) => <li key={j}>{item.replace(/^\d\.\s*/, "")}</li>)}
        </ol>
      );
    }
    const parts = block.split(/\*\*(.+?)\*\*/g);
    return (
      <p key={i} className="text-gray-600 text-sm leading-relaxed mb-4">
        {parts.map((part, k) => k % 2 === 1 ? <strong key={k} className="font-semibold text-gray-800">{part}</strong> : part)}
      </p>
    );
  });
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  const related = ARTICLES.filter((a) => a.slug !== slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: { "@type": "Organization", name: "RoteiroApp", url: "https://roteiroapp.com" },
    publisher: { "@type": "Organization", name: "RoteiroApp", logo: { "@type": "ImageObject", url: "https://roteiroapp.com/icon.svg" } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://roteiroapp.com/blog/${article.slug}` },
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-2xl mx-auto px-4 py-12">

        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Todos os artigos
        </Link>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{article.emoji}</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wide">
              {article.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">{article.title}</h1>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{article.date}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{article.readTime} de leitura</span>
          </div>
        </div>

        <div className="h-px bg-gray-100 mb-8" />

        <div className="prose prose-sm max-w-none">
          {renderContent(article.content)}
        </div>

        {/* Parceiros (afiliados) por categoria */}
        <AffiliateBlock groups={CATEGORY_AFFILIATES[article.category] ?? ["accommodation", "flights"]} />

        {/* CTA box */}
        <div className="mt-12 rounded-2xl bg-blue-600 text-white p-6 text-center">
          <h2 className="text-lg font-black mb-2">Organize sua próxima viagem</h2>
          <p className="text-blue-100 text-sm mb-4">Crie roteiros completos, controle o orçamento e nunca esqueça nada na mala.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-sm"
          >
            Criar conta grátis <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Leia também</h2>
            <div className="grid gap-4">
              {related.map((a) => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="group flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all"
                >
                  <span className="text-2xl shrink-0">{a.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">{a.title}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{a.excerpt}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 shrink-0 mt-0.5 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-10 text-sm text-gray-400 space-x-4">
          <Link href="/" className="hover:text-gray-600 transition-colors">Início</Link>
          <Link href="/blog" className="hover:text-gray-600 transition-colors">Blog</Link>
          <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacidade</Link>
        </div>

      </div>
    </div>
  );
}
