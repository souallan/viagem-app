import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — Dicas e Guias de Viagem",
  description: "Artigos gratuitos com dicas de viagem, roteiros e guias de destinos para viajantes brasileiros.",
  openGraph: {
    title: "Blog RoteiroApp — Dicas e Guias de Viagem",
    description: "Artigos gratuitos com dicas de viagem, roteiros e guias de destinos para viajantes brasileiros.",
  },
};

const ARTICLES = [
  {
    slug: "como-organizar-roteiro-de-viagem",
    title: "Como organizar um roteiro de viagem do zero",
    excerpt: "Passo a passo para planejar sua viagem: escolha do destino, orçamento, hospedagem, transporte e atividades. Tudo o que você precisa saber antes de partir.",
    date: "2025-05-15",
    readTime: "8 min",
    category: "Planejamento",
    emoji: "🗺️",
    content: `
Organizar um roteiro de viagem pode parecer complicado, mas com um método claro fica simples. Veja as etapas essenciais:

**1. Defina o destino e as datas**
Comece escolhendo o destino com base em seu orçamento e período disponível. Considere a temporada — alta temporada tem preços maiores mas clima mais previsível; baixa temporada é mais barata mas exige pesquisa extra.

**2. Monte o orçamento total**
Divida o orçamento em categorias: passagem, hospedagem, alimentação, atrações e compras. Uma regra prática: passagem consome 30–40% do total, hospedagem 25–35%.

**3. Reserve passagem e hospedagem com antecedência**
Para destinos populares, reserve com 3–6 meses de antecedência. Use ferramentas como Skyscanner para passagens e Booking.com para hospedagem.

**4. Liste as atividades dia a dia**
Monte um itinerário com atividades por dia, agrupando atrações próximas geograficamente. Evite encher demais — 3 a 4 atividades por dia é o ideal.

**5. Organize os documentos**
Passaporte, visto, seguro viagem e vacinas. Verifique validade mínima exigida no destino (geralmente 6 meses após o retorno).

**6. Use um app de roteiro**
Ferramentas como o RoteiroApp centralizam tudo: atividades, hospedagem, orçamento e lista de malas em um só lugar — offline.
    `,
  },
  {
    slug: "passaporte-brasileiro-destinos-sem-visto",
    title: "Passaporte brasileiro: todos os destinos sem visto em 2025",
    excerpt: "Com o passaporte brasileiro você visita mais de 170 países sem visto ou com visto na chegada. Veja a lista completa e como aproveitar ao máximo.",
    date: "2025-05-22",
    readTime: "5 min",
    category: "Documentos",
    emoji: "🛂",
    content: `
O passaporte brasileiro tem forte poder de acesso global. Em 2025, permite entrada em **170+ países** sem visto prévio ou com visto na chegada.

**Destinos populares sem visto**
- Europa (Schengen): Alemanha, França, Espanha, Itália, Portugal e mais 22 países
- Américas: EUA (90 dias com ESTA), Canadá, México, Argentina, Chile, Colômbia
- Ásia: Japão (90 dias), Tailândia (30 dias), Bali/Indonésia (30 dias)
- África: África do Sul, Marrocos, Egito (visto na chegada)

**Validade mínima do passaporte**
A maioria dos países exige passaporte válido por pelo menos **6 meses** após a data de retorno. Sempre verifique antes de viajar.

**Como tirar ou renovar o passaporte**
1. Agende pelo site da Polícia Federal
2. Compareça com documentos (RG, CPF, foto 3x4)
3. Prazo: 6 dias úteis (normal) ou 10 dias (emergencial)
4. Custo: R$ 257,25 (adulto)

**Dica**: Mantenha cópias digitais do passaporte no celular e em e-mail para emergências.
    `,
  },
  {
    slug: "seguro-viagem-vale-a-pena",
    title: "Seguro viagem: vale a pena contratar? Guia completo",
    excerpt: "Entenda quando o seguro viagem é obrigatório, o que ele cobre, quanto custa e como escolher o melhor plano para sua viagem internacional.",
    date: "2025-05-29",
    readTime: "6 min",
    category: "Segurança",
    emoji: "🛡️",
    content: `
O seguro viagem é um dos itens mais importantes — e mais ignorados — no planejamento de viagens. Veja tudo que você precisa saber.

**Quando é obrigatório?**
- Europa (Schengen): obrigatório com cobertura mínima de €30.000 para despesas médicas
- Cuba: obrigatório para todos os visitantes
- Alguns países do Caribe e Oriente Médio

**O que cobre um bom seguro viagem?**
- Despesas médicas e hospitalares
- Evacuação de emergência
- Cancelamento e interrupção de viagem
- Extravio de bagagem
- Responsabilidade civil

**Quanto custa?**
Para destinos como Europa, espere pagar R$ 30–80 por semana (adulto saudável). Para os EUA, onde o custo médico é altíssimo, o preço dobra.

**Como escolher?**
Compare coberturas pelo Seguros Promo — você vê preços de múltiplas seguradoras em uma só tela. Prefira coberturas de pelo menos US$ 100.000 para destinos como EUA e Canadá.

**Dica prática**: contrate sempre antes de embarcar. Após a viagem começar, não é possível contratar.
    `,
  },
  {
    slug: "economizar-no-cambio",
    title: "Como economizar no câmbio e gastar menos no exterior",
    excerpt: "Cartão Wise, Nomad, câmbio no Brasil ou no exterior? Guia prático para pagar menos taxas e ter mais dinheiro na viagem.",
    date: "2025-06-05",
    readTime: "7 min",
    category: "Finanças",
    emoji: "💱",
    content: `
O câmbio pode consumir 5–15% do seu dinheiro se você não tomar cuidado. Veja as melhores opções para brasileiros viajando ao exterior.

**Opção 1: Cartão Wise (melhor para maioria dos casos)**
O Wise usa a taxa de câmbio real (interbancária) sem spread — você paga somente uma pequena taxa por transação. Ideal para Europa, EUA e Ásia. Abra sua conta com antecedência pois o cartão físico leva dias para chegar.

**Opção 2: Cartão Nomad**
Voltado especificamente para brasileiros, o Nomad oferece câmbio competitivo e saque em dólares via parceiros. Boa alternativa ao Wise para quem prefere interface em português.

**Opção 3: Cartão de crédito com isenção de IOF**
Alguns cartões de crédito premium (Nubank, C6, Santander Free) isentam o IOF (6,38% sobre compras no exterior). Compense com o câmbio da operadora, geralmente 1–2% acima do real.

**O que EVITAR**
- Casas de câmbio aeroportos: até 15% mais caro
- Câmbio em hotéis: piores taxas do mercado
- Saques em caixas eletrônicos sem cartão específico: tarifas altas

**Regra de ouro**: nunca chegue ao destino sem alguma moeda local para os primeiros momentos.
    `,
  },
  {
    slug: "lista-de-malas-viagem-internacional",
    title: "Lista de malas completa para viagem internacional",
    excerpt: "O que levar na mala para não esquecer nada essencial. Lista de documentos, roupas, eletrônicos e produtos de higiene para viagem internacional.",
    date: "2025-06-12",
    readTime: "6 min",
    category: "Planejamento",
    emoji: "🧳",
    content: `
Esquecer algo importante na hora de viajar é frustrante — e caro. Use esta lista como base e adapte ao seu destino.

**Documentos essenciais**
- Passaporte (validade mínima de 6 meses após retorno)
- Visto (se necessário)
- Seguro viagem impresso ou no celular
- Passagens de ida e volta
- Vouchers de hotel
- Carteira de motorista internacional (se for alugar carro)
- Cópias de todos os documentos (e-mail ou nuvem)

**Dinheiro e cartões**
- Cartão internacional (Wise ou Nomad)
- Alguma moeda local para chegada
- Cartão de crédito emergência

**Eletrônicos**
- Carregador do celular
- Adaptador de tomada universal
- Power bank (não despachar)
- Fones de ouvido
- Câmera (se usar)

**Roupas — regra dos 3**
Leve 3 partes de baixo, 5 camisetas, 1 agasalho e 1 jaqueta impermeável. Para cada semana adicional, adicione apenas 2 peças — lave as outras.

**Higiene e saúde**
- Protetor solar (comprar no destino se for pesado)
- Remédios pessoais + analgésico + antidiarreico
- Repelente (destinos tropicais)
- Seguro saúde com contato de emergência salvo no celular

**Dica RoteiroApp**: use a lista de malas inteligente do app — ela sugere itens automaticamente pelo destino e clima da sua viagem.
    `,
  },
  {
    slug: "melhores-destinos-para-brasileiros-2025",
    title: "Melhores destinos internacionais para brasileiros em 2025",
    excerpt: "De Lisboa a Bangkok: os destinos mais procurados por brasileiros em 2025, com custo médio, melhor época para visitar e dicas de planejamento.",
    date: "2025-06-19",
    readTime: "9 min",
    category: "Destinos",
    emoji: "🌍",
    content: `
Brasileiros estão viajando mais — e o leque de destinos favoritos cresceu. Aqui estão os mais procurados em 2025.

**🇵🇹 Lisboa e Porto, Portugal**
O destino favorito dos brasileiros. Língua comum, gastronomia familiar e custo acessível para a Europa. Melhor época: abril a junho e setembro a outubro (menos turistas, bom clima).
Custo médio: R$ 8.000 – R$ 12.000 por pessoa (10 dias, voo incluso).

**🇦🇷 Buenos Aires, Argentina**
Destino clássico e acessível. Câmbio favorável, gastronomia excelente e cultura rica. Melhor época: setembro a novembro (primavera argentina).
Custo médio: R$ 4.000 – R$ 7.000 por pessoa (7 dias).

**🇹🇭 Tailândia**
O destino asiático queridinho dos brasileiros. Praias paradisíacas, comida barata e hostels de qualidade. Melhor época: novembro a fevereiro (estação seca).
Custo médio: R$ 10.000 – R$ 16.000 por pessoa (14 dias, voo incluso).

**🇮🇹 Itália**
Roma, Florença e Veneza formam o roteiro clássico. Exige planejamento com antecedência para fugir das filas nos museus. Melhor época: maio e setembro.
Custo médio: R$ 14.000 – R$ 22.000 por pessoa (12 dias).

**🇺🇸 Estados Unidos**
Florida, Nova York e California lideram. O visto ESTA é simples e rápido. Melhor época: março a maio e setembro a novembro.
Custo médio: R$ 15.000 – R$ 25.000 por pessoa (12 dias, voo incluso).

**🇯🇵 Japão**
Explosão de popularidade em 2025. Seguro, organizado e com gastronomia incrível. Melhor época: março-abril (cerejeiras) ou outubro-novembro (outono).
Custo médio: R$ 14.000 – R$ 20.000 por pessoa (12 dias).

**Dica**: independente do destino, planeje com 3–6 meses de antecedência para conseguir voos mais baratos e acomodações nas datas certas.
    `,
  },
  {
    slug: "como-viajar-mais-barato",
    title: "Como viajar mais barato: 12 dicas que realmente funcionam",
    excerpt: "Estratégias práticas para reduzir o custo das suas viagens internacionais sem abrir mão do conforto. Voos, hospedagem, câmbio e muito mais.",
    date: "2025-06-26",
    readTime: "7 min",
    category: "Finanças",
    emoji: "💰",
    content: `
Viajar mais barato não significa viajar mal. Com as estratégias certas, você viaja mais com o mesmo orçamento.

**1. Seja flexível com as datas**
Voar na terça ou quarta custa em média 20–30% menos que no final de semana. Use o calendário de preços do Google Flights ou Skyscanner para ver o mapa de preços por data.

**2. Reserve com antecedência (ou muito em cima)**
O ponto ideal para passagens internacionais é 2–4 meses antes. Se a viagem já está próxima (menos de 3 semanas), às vezes saem ofertas de última hora — mas é aposta arriscada.

**3. Use alertas de preço**
Configure alertas no Google Flights para seu destino. Você será notificado quando o preço cair.

**4. Evite alta temporada**
Viajar na baixa temporada pode reduzir o custo total em 30–50%. Julho e dezembro/janeiro são os períodos mais caros para a maioria dos destinos.

**5. Hospedagem fora do centro**
Hotéis e airbnbs a 15–20 minutos do centro custam metade do preço. Com transporte público, a diferença de tempo é mínima.

**6. Use cartões sem IOF**
O IOF de 6,38% sobre compras no exterior é um custo invisível enorme. Cartões como Wise, Nomad ou Nubank internacional eliminam esse custo.

**7. Coma onde os locais comem**
Restaurantes a 2 quarteirões dos pontos turísticos custam metade e são frequentemente melhores. Mercados locais e food courts são ótimas pedidas.

**8. City Pass e museus gratuitos**
Muitas cidades oferecem passes de museu e transporte com desconto. Em Paris, os museus são gratuitos no primeiro domingo do mês.

**9. Hospedagem alternativa**
Hostels com quartos privados, Couchsurfing ou casas de temporada pelo Airbnb podem custar 40–60% menos que hotéis tradicionais.

**10. Programe-se para bagagem de mão**
Despachar bagagem custa R$ 200–400 por trecho em companhias low-cost. Aprender a viajar só com bagagem de mão pode economizar R$ 800+ em uma viagem.

**11. Compare tudo antes de comprar**
Para cada item (voo, hotel, seguro), compare pelo menos 3 opções. A diferença entre a primeira e a melhor oferta pode ser de 30%.

**12. Use o RoteiroApp para controlar o orçamento**
Registre cada gasto na viagem e compare com o planejado. Pequenos gastos não planejados somados são os maiores vilões do orçamento de viagem.
    `,
  },
  {
    slug: "roteiro-europa-15-dias",
    title: "Roteiro pela Europa em 15 dias: guia completo para brasileiros",
    excerpt: "O roteiro ideal pela Europa em 15 dias passando por Portugal, Espanha, França e Itália. Com dicas de transporte, hospedagem e orçamento.",
    date: "2025-07-03",
    readTime: "10 min",
    category: "Roteiros",
    emoji: "🗼",
    content: `
Quinze dias na Europa é o tempo mínimo para ver o essencial sem se sentir atropelado. Este roteiro cobre 4 países com equilíbrio entre turismo e descanso.

**Visão geral**
- Dias 1–3: Lisboa, Portugal
- Dias 4–5: Madri, Espanha (trem AVE 2h30)
- Dias 6–8: Barcelona, Espanha
- Dias 9–11: Paris, França (trem TGV 6h30)
- Dias 12–15: Roma, Itália (voo 2h)

**Lisboa (Dias 1–3)**
- Dia 1: Alfama, Sé Catedral, Miradouro das Portas do Sol
- Dia 2: Belém (Torre, Pastéis, Mosteiro dos Jerônimos)
- Dia 3: Sintra (excursão de dia inteiro — reservar com antecedência)
Hospedagem: Bairro Alto ou Chiado. Orçamento: €80–140/noite (hotel 3 estrelas).

**Madri (Dias 4–5)**
- Museu do Prado (reservar ingresso online)
- Parque del Retiro
- Gran Vía e mercado de San Miguel
Hospedagem: Centro (Sol ou Gran Vía). Orçamento: €90–150/noite.

**Barcelona (Dias 6–8)**
- Sagrada Família (reservar com 1–2 meses de antecedência)
- Parque Güell, Las Ramblas, Bairro Gótico
- Dia de praia na Barceloneta
Hospedagem: Eixample ou Gràcia. Orçamento: €100–160/noite.

**Paris (Dias 9–11)**
- Torre Eiffel (reservar online — filas enormes presencialmente)
- Museu do Louvre (reservar online)
- Montmartre, Sacré-Cœur, Arc de Triomphe
Hospedagem: 9ème ou 10ème arrondissement. Orçamento: €130–200/noite.

**Roma (Dias 12–15)**
- Coliseu e Foro Romano (reservar com antecedência)
- Vaticano — Museus e Basílica (reservar com semanas de antecedência)
- Fontana di Trevi, Pantheon, Campo de' Fiori
Hospedagem: Centro Storico ou Trastevere. Orçamento: €100–160/noite.

**Orçamento estimado (por pessoa)**
- Passagens (Brasil–Lisboa, Roma–Brasil): R$ 4.000 – R$ 7.000
- Transporte interno (trens + 1 voo): €250 – €400
- Hospedagem (14 noites, hotel 3 estrelas): €1.200 – €2.000
- Alimentação: €40–70/dia
- Atrações: €200 – €350
- **Total estimado: R$ 18.000 – R$ 28.000**

**Documentos necessários**
Passaporte válido por 6 meses após retorno. Nenhum visto necessário para brasileiros. Seguro viagem com cobertura mínima de €30.000 (obrigatório para Schengen).

**Dica**: organize todo o roteiro dia a dia no RoteiroApp — incluindo reservas de atrações, transportes entre cidades e controle de gastos em euros.
    `,
  },
  {
    slug: "roteiro-lisboa-7-dias",
    title: "Roteiro Lisboa 7 dias: o guia completo para brasileiros",
    excerpt: "Sete dias em Lisboa sem perder nada importante: Alfama, Belém, Sintra, Cascais e os melhores pastelarias da cidade. Com custo estimado e dicas de transporte.",
    date: "2026-05-01",
    readTime: "10 min",
    category: "Roteiros",
    emoji: "🇵🇹",
    content: `
Lisboa é o destino favorito dos brasileiros na Europa — e não é à toa. Mesma língua, gastronomia familiar, custo acessível e uma beleza atemporal que mistura história e modernidade. Sete dias é o tempo ideal para explorar a cidade sem correr.

**Dia 1 — Alfama e o coração histórico**
Comece pelo bairro mais antigo da cidade. Suba ao Castelo de São Jorge de manhã (chegue antes das 10h para evitar filas). Desça pelas ruelas de Alfama, pare no Museu do Azulejo — um dos mais subestimados da Europa, melhor visitado logo ao abrir às 9h. No final da tarde, assista ao pôr do sol no Miradouro da Graça: menos turistas que o Portas do Sol e vista melhor.

**Dia 2 — Belém (dia inteiro)**
Pegue o elétrico 15E ou o trem de Cais do Sodré (15 min). Torre de Belém, Mosteiro dos Jerônimos (reserve ingresso online) e, claro, os Pastéis de Belém — a fila anda rápido. Volte pelo Chiado para jantar na Tasca do Chico.

**Dia 3 — Sintra (excursão)**
Acorde cedo: os ônibus para o Palácio da Pena lotam depois das 10h. Compre os ingressos online com antecedência. Palácio da Pena → Castelo dos Mouros → Palácio Nacional de Sintra. Volte para Lisboa à tarde e explore o Mercado da Ribeira.

**Dia 4 — Mouraria, Intendente e Feira da Ladra**
Mouraria é o berço do fado e tem restaurantes incríveis sem a marcação turística. A Feira da Ladra acontece somente terças e sábados — peças únicas por preços imbatíveis. Tarde livre para o Museu Nacional do Azulejo ou um passeio no Barco no Tejo.

**Dia 5 — Cascais e a Linha de Estoril**
Trem direto da estação de Cais do Sodré (40 min, €2,50). Cascais é uma vila costeira elegante com praias, restaurantes de peixe e o Boca do Inferno (formação rochosa impressionante). Almoço de peixe fresco junto ao porto.

**Dia 6 — LX Factory e Bairro Alto**
Sábado? LX Factory é o programa perfeito — mercado, design, gastronomia e livrarias em uma fábrica recuperada. À noite, o Bairro Alto acorda: bares pequenos, vinho a preços acessíveis e a cena cultural mais autêntica da cidade.

**Dia 7 — Parque das Nações e compras**
Zona moderna de Lisboa, construída para a Expo 98. Oceanário de Lisboa (reservar online), Pavilhão do Conhecimento e a arquitetura impressionante. Tarde para compras de lembranças — evite a Rua Augusta e prefira lojas no Principe Real.

**Orçamento estimado (por pessoa, 7 dias)**
- Voo Brasil–Lisboa (ida e volta): R$ 3.500 – R$ 6.000
- Hospedagem (6 noites, hotel 3 estrelas): €480 – €800
- Alimentação: €30–50/dia
- Transporte local: €30
- Atrações: €80 – €120
- **Total estimado: R$ 7.000 – R$ 14.000**

**Dica prática**: baixe o app do Metro de Lisboa, compre o cartão Viva Viagem (€0,50) e carregue com créditos — funciona no metro, tram e barco. Evite o tram 28 turístico e experimente o 15E para Belém.
    `,
  },
  {
    slug: "melhores-destinos-brasil-2026",
    title: "Melhores destinos nacionais para viajar no Brasil em 2026",
    excerpt: "De Minas Gerais ao Pará, os destinos brasileiros em alta em 2026 com custo médio, melhor época e o que não pode perder em cada um.",
    date: "2026-05-08",
    readTime: "8 min",
    category: "Destinos",
    emoji: "🇧🇷",
    content: `
O Brasil tem uma diversidade geográfica e cultural que poucos países no mundo conseguem competir. Em 2026, uma nova geração de destinos está ganhando destaque — além dos clássicos.

**🌿 Chapada dos Veadeiros (GO)**
Um dos segredos mais bem guardados do Brasil. Cachoeiras cristalinas, cânions e o maior cerrado contínuo do mundo. Melhor época: maio a setembro (seca). A cidade base é Alto Paraíso de Goiás. Custo médio: R$ 200–300/dia por pessoa (hospedagem + refeições + transporte).

**🏔️ Serra da Canastra (MG)**
Nascente do Rio São Francisco, cachoeiras e o queijo artesanal mais famoso do Brasil. Minas Gerais é a grande revelação de 2026 no turismo nacional. Acesse por São Roque de Minas. Melhor época: março a outubro. Custo: R$ 150–250/dia.

**🌊 Baía do Sancho, Fernando de Noronha (PE)**
Consistentemente eleita uma das melhores praias do mundo. Fernando de Noronha exige planejamento: TPA (Taxa de Preservação Ambiental) por dia, voos da GOL ou LATAM a partir de Recife. Custo alto, experiência única. Reserve com 6+ meses de antecedência. Custo: R$ 800–1.500/dia.

**🏜️ Lençóis Maranhenses (MA)**
Entre junho e setembro, as lagoas azuis e verdes surgem entre dunas brancas — paisagem de outro mundo. Acesse por Barreirinhas. Voos para São Luís (MA) + traslado. Custo: R$ 300–500/dia.

**🌴 Alter do Chão (PA)**
Chamada de "Caribe amazônico", tem praias de rio com água cristalina. Santarém é a cidade de chegada. Melhor época: agosto a novembro (praias expostas). Custo: R$ 200–350/dia.

**🌺 Bonito (MS)**
Ecoturismo de alta qualidade: flutuação em rios de água cristalíssima, cachoeiras e grutas. Todos os passeios são regulamentados com número limitado de visitantes — reserve com antecedência. Custo: R$ 350–600/dia (passeios + hospedagem).

**🏖️ Costa do Descobrimento (BA)**
Porto Seguro, Trancoso e Arraial d'Ajuda formam um dos destinos baianos mais completos. Melhor época: dezembro a março. Custo: R$ 250–450/dia.

**Por que viajar pelo Brasil em 2026?**
Com o dólar e o euro elevados, viajar pelo Brasil ficou relativamente mais acessível. Além disso, destinos emergentes como Chapada dos Veadeiros e Alter do Chão ainda têm infraestrutura mais barata que os clássicos. Planeje com o RoteiroApp e evite os gastos surpresa.
    `,
  },
  {
    slug: "mochilao-europa-barato",
    title: "Mochilão pela Europa com orçamento baixo: guia para brasileiros",
    excerpt: "Como fazer um mochilão pela Europa gastando menos de R$ 500 por dia. Transporte, hospedagem, alimentação e os países mais baratos para visitar.",
    date: "2026-05-15",
    readTime: "9 min",
    category: "Finanças",
    emoji: "🎒",
    content: `
Fazer um mochilão pela Europa é mais acessível do que parece — se você souber onde e como gastar. Com planejamento, é possível viver bem com €50–70 por dia.

**Os países mais baratos da Europa**
1. **Hungria (Budapeste)**: hospedagem a partir de €15/noite em hostels ótimos. A cidade mais subestimada da Europa.
2. **Polônia (Cracóvia, Varsóvia)**: refeições por €4–8, transporte barato, história incrível.
3. **República Tcheca (Praga)**: ainda acessível apesar da popularidade. Cerveja mais barata que água.
4. **Balcãs (Sérvia, Bósnia, Montenegro)**: os destinos emergentes. Belgrade tem vida noturna incrível por preços irrisórios.
5. **Portugal**: o mais barato da Europa Ocidental para brasileiros — e sem barreira linguística.

**Transporte: a maior fatia do orçamento**
- **Flixbus**: ônibus confortáveis com Wi-Fi entre cidades europeias por €5–30. O segredo do mochileiro inteligente.
- **Passes Interrail**: valem a pena se você planeja 8+ viagens de trem. Compare com trens individuais.
- **Ryanair e Wizz Air**: passagens por €10–40 entre cidades europeias. Reserve com 2–3 meses de antecedência.
- **BlaBlaCar**: caronas compartilhadas entre cidades por valores mínimos.

**Hospedagem sem gastar muito**
- **Hostels com quartos privados**: melhor custo-benefício. Use Hostelworld ou Booking. Dorms são ainda mais baratos para quem aceita.
- **Couchsurfing**: gratuito. Requer perfil bem construído e boas avaliações.
- **Booking a preços de última hora**: para destinos menos concorridos, esperar pode valer.

**Alimentação com inteligência**
- Compre frutas, pão e frios no supermercado para café da manhã e lanches (economiza €15+/dia).
- Almoço no restaurante local, fora das ruas turísticas (€8–12).
- Jantar leve ou cozinha compartilhada do hostel.
- Evite qualquer restaurante com cardápio em 5 idiomas na entrada.

**Planejamento: o diferencial do mochileiro experiente**
Organizar roteiro, hospedagem, transporte e orçamento sem planilha é um caos. Use o RoteiroApp para centralizar tudo: atividades por dia, custos em euros, documentos necessários e lista de malas.

**Exemplo de orçamento diário (Budapeste)**
- Hostel privado: €20
- Alimentação: €18
- Transporte local: €5
- Atração (museu/parque): €8
- **Total: €51/dia (~R$ 290)**
    `,
  },
  {
    slug: "roteiro-japao-10-dias",
    title: "Roteiro Japão 10 dias: Tóquio, Kyoto e Osaka para brasileiros",
    excerpt: "O roteiro clássico do Japão em 10 dias — Tóquio, Kyoto e Osaka. Com custos reais, dicas de transporte, onde comer e o que não deixar de fazer.",
    date: "2026-05-22",
    readTime: "11 min",
    category: "Roteiros",
    emoji: "🇯🇵",
    content: `
O Japão explodiu em popularidade entre brasileiros nos últimos anos — e não é surpresa. É um país seguro, limpo, com gastronomia incrível e uma cultura única. Este roteiro de 10 dias cobre o triângulo clássico.

**O básico antes de partir**
- **Visto**: não é necessário para brasileiros (até 90 dias, turismo).
- **Passaporte**: válido por 6+ meses após o retorno.
- **IC Card (Suica ou Pasmo)**: cartão de transporte recarregável, funciona em metrô, trem, ônibus e até em algumas lojas de conveniência. Compre no aeroporto de chegada.
- **Melhor época**: março-abril (cerejeiras) ou outubro-novembro (outono). Evite Golden Week (final de abril/início de maio — preços triplicam).

**Dias 1–4: Tóquio**
Tóquio é uma megalópole que desafia qualquer expectativa. Reserve ao menos 4 dias.
- Dia 1: Shibuya (cruzamento icônico), Harajuku (Takeshita Street), Yoyogi Park
- Dia 2: Shinjuku (Kabukicho à noite, Golden Gai), Templo Meiji, Museu do Anime
- Dia 3: Akihabara (eletrônicos e cultura pop), Asakusa (Sensoji), mercado Nakamise
- Dia 4: Excursão ao Monte Fuji (1 dia) ou Nikko. Reserve com agência.

**Dias 5–7: Kyoto (trem Shinkansen 2h)**
A Kyoto tradicional, a antítese moderna de Tóquio.
- Dia 5: Arashiyama (bambuzal, Templo Tenryu-ji, aluguel de bicicleta)
- Dia 6: Caminho da Filosofia, Ginkaku-ji (Templo do Pavilhão de Prata), bairro Gion (espere ver gueixas no início da manhã)
- Dia 7: Fushimi Inari-taisha (mil torii vermelhos — vá antes das 8h), Nijo Castle

**Dias 8–10: Osaka**
Osaka é a capital da gastronomia japonesa. Mais descontraída e barata que Tóquio.
- Dia 8: Dotonbori (o bairro mais animado), Takoyaki em todo lugar, Glico Man
- Dia 9: Osaka Castle, Kuromon Market (o "estômago de Osaka"), Shinsekai
- Dia 10: Excursão a Nara (1h de trem) — Cervo sagrados livres pelas ruas do Parque de Nara. Volte para Osaka para o voo.

**Custo estimado (por pessoa, 10 dias)**
- Voo Brasil–Japão (ida e volta): R$ 5.000 – R$ 9.000
- Japan Rail Pass 7 dias: ¥50.000 (~R$ 1.700) — compre ANTES de chegar ao Japão
- Hospedagem (9 noites, mistura de hotel e hostel): ¥15.000 – ¥25.000/noite
- Alimentação: ¥3.000 – ¥6.000/dia (€20–40) — Japão é mais barato que Europa para comida
- Atrações: ¥5.000 – ¥10.000
- **Total estimado: R$ 14.000 – R$ 22.000**

**Dica de ouro**: Conbinis (lojas 24h como Lawson, FamilyMart e 7-Eleven) são os melhores amigos do viajante no Japão. Onigiri, ramen instantâneo, bento boxes e sobremesas de qualidade por ¥200–600.
    `,
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao início
          </Link>
          <h1 className="text-4xl font-black text-gray-900 mb-3">Blog de Viagens</h1>
          <p className="text-lg text-gray-500 max-w-xl">
            Dicas práticas, guias de destinos e tudo que você precisa para viajar melhor.
          </p>
        </div>

        {/* Articles grid */}
        <div className="grid gap-8">
          {ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              {/* Category bar */}
              <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600" />

              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{article.emoji}</span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {article.readTime} de leitura
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h2>

                <p className="text-gray-500 text-sm leading-relaxed mb-5">
                  {article.excerpt}
                </p>

                <Link
                  href={`/blog/${article.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Ler artigo completo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-2xl bg-blue-600 text-white p-8 text-center">
          <h2 className="text-2xl font-black mb-2">Organize sua próxima viagem</h2>
          <p className="text-blue-100 text-sm mb-6">
            Crie roteiros completos, controle o orçamento e nunca esqueça nada na mala.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm"
          >
            Criar conta grátis <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-sm text-gray-400 space-x-4">
          <Link href="/" className="hover:text-gray-600 transition-colors">Início</Link>
          <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacidade</Link>
          <Link href="/terms" className="hover:text-gray-600 transition-colors">Termos</Link>
        </div>

      </div>
    </div>
  );
}
