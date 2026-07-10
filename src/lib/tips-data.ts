import {
  Shield, Train, Globe, Smartphone, Heart, FileText,
  Map, CreditCard, Camera, Languages,
  Wifi, Luggage, Utensils, Sun, Zap,
} from "lucide-react";

export interface Tip {
  id: string;
  category: string;
  categoryColor: string;
  icon: React.ElementType;
  title: string;
  excerpt: string;
  readTime: number;
  body: string[];
  link?: { label: string; url: string };
  /** ISO date (YYYY-MM-DD) — determines in which week the tip is "new" */
  publishedAt: string;
}

// ─────────────────────────────────────────────────────────────
// To publish new tips: add entries at the TOP with publishedAt
// set to a Monday of the desired publication week.
// Tips with the same ISO-week as today appear in "Esta semana".
// All older tips are automatically moved to the archive.
// ─────────────────────────────────────────────────────────────

export const TIPS: Tip[] = [

  // ── Semana 2026-05-18 ─────────────────────────────────────
  {
    id: "google-maps-offline",
    publishedAt: "2026-05-19",
    category: "Tecnologia",
    categoryColor: "bg-sky-100 text-sky-700",
    icon: Map,
    title: "Como usar o Google Maps totalmente offline",
    excerpt: "Sem internet no exterior? Baixe o mapa da cidade antes de sair e navegue sem gastar um byte de dados.",
    readTime: 3,
    body: [
      "No Google Maps, pesquise a cidade ou região desejada. No painel inferior, toque no nome do local → 'Baixar'. Selecione a área e confirme. O mapa fica disponível sem conexão.",
      "Limite prático: áreas grandes (ex.: toda a França) pesam 500 MB+. Prefira baixar cidade por cidade. A validade do mapa offline é de 30 dias — atualize antes de viajar.",
      "Dica avançada: baixe também o Maps.me (código aberto), que ocupa menos espaço e inclui trilhas e POIs que o Google não tem.",
      "Transporte público offline: o Google Maps inclui rotas de metrô e ônibus nos mapas baixados de várias cidades europeias e asiáticas. Confira antes de partir.",
    ],
  },
  {
    id: "apps-traducao",
    publishedAt: "2026-05-19",
    category: "Tecnologia",
    categoryColor: "bg-sky-100 text-sky-700",
    icon: Languages,
    title: "Melhores apps de tradução para viajantes em 2026",
    excerpt: "Da câmera que lê cardápios ao intérprete de bolso — conheça os apps que mudam o jogo.",
    readTime: 4,
    body: [
      "Google Translate: baixe o idioma para uso offline. O modo câmera traduz cardápios, placas e documentos em tempo real — essencial em países asiáticos.",
      "DeepL: qualidade de tradução superior para textos longos, especialmente em línguas europeias. Tem versão offline paga.",
      "iTranslate Converse: modo de conversa em tempo real — fale em português, o app traduz para o outro idioma automaticamente. Ideal para negociar em mercados.",
      "Dica de ouro: leve um dicionário básico de frases impressas para quando a bateria acabar. Japonês, árabe e mandarim — as pessoas se emocionam quando tentamos falar o idioma delas.",
    ],
  },
  {
    id: "voos-baratos",
    publishedAt: "2026-05-20",
    category: "Finanças",
    categoryColor: "bg-amber-100 text-amber-700",
    icon: CreditCard,
    title: "Como encontrar voos baratos: guia definitivo 2026",
    excerpt: "Terça-feira ou domingo? VPN ou não? Desmontamos os mitos e mostramos o que realmente funciona.",
    readTime: 6,
    body: [
      "Antecedência ideal: para voos internacionais, o 'sweet spot' é entre 3 e 6 meses antes. Para domésticos, 4 a 6 semanas. Buscar na véspera raramente compensa.",
      "Ferramentas certas: use o Google Flights como ponto de partida — ative o modo explorar para ver o mapa de preços. Depois confirme no Kayak e Skyscanner.",
      "Alertas de preço: no Google Flights, ative o alerta para rotas específicas. O app avisa quando o preço cai. Já salvou centenas de reais em muitas viagens.",
      "Mito derrubado: trocar de dispositivo ou usar VPN não muda os preços de forma confiável. O que muda é a flexibilidade de datas — ser flexível em ±3 dias economiza em média 30%.",
      "Bagagem: compare o preço final (passagem + bagagem) entre companhias antes de decidir. Uma low-cost sem bagagem incluída pode ser mais cara do que uma tradicional.",
    ],
  },
  {
    id: "viagem-solo-feminina",
    publishedAt: "2026-05-20",
    category: "Segurança",
    categoryColor: "bg-red-100 text-red-700",
    icon: Shield,
    title: "Viagem solo feminina: segurança sem paranoia",
    excerpt: "Sim, o mundo é mais seguro do que as notícias fazem parecer. Mas é bom ir preparada.",
    readTime: 5,
    body: [
      "Pesquise a cultura local: em alguns países o comportamento social é diferente. Entender as normas (vestimenta, contato visual, horários) evita situações desconfortáveis.",
      "Compartilhe sua localização: apps como Life360 ou simplesmente o compartilhamento do Google Maps com um familiar de confiança. Avise sempre quando chegar ao destino.",
      "Hospedagem: para primeiras viagens solo, hostels femininos ou guesthouses bem avaliadas são ótimas opções — redes de apoio surgem naturalmente.",
      "Confie no instinto: se uma situação parece estranha, saia dela sem se sentir mal. Ninguém deve satisfações por priorizar a própria segurança.",
      "Apps essenciais: bSafe (botão de emergência), TripWhistle (números de emergência globais), e o clássico WhatsApp com contatos locais salvos.",
    ],
  },

  // ── Semana 2026-05-11 ─────────────────────────────────────
  {
    id: "trem-europa",
    publishedAt: "2026-05-12",
    category: "Transporte",
    categoryColor: "bg-blue-100 text-blue-700",
    icon: Train,
    title: "Como andar de trem na Europa sem pagar caro",
    excerpt: "Entenda a diferença entre Eurail Pass e bilhetes avulsos, e quando cada opção compensa.",
    readTime: 5,
    body: [
      "O Eurail Pass vale a pena para mais de 4 países em menos de 15 dias. Para roteiros fixos, compre bilhetes individuais pelo Omio ou Trainline — geralmente 30-50% mais barato.",
      "Reserve com antecedência: trens de alta velocidade (TGV, Thalys, ICE) vendem bilhetes com até 90 dias de antecedência, e os primeiros preços são os mais baixos.",
      "Dica de ouro: viaje em 2ª classe. A diferença de conforto é mínima e a economia chega a 40%.",
      "Apps essenciais: DB Navigator (Alemanha/Europa), Trenitalia (Itália), SNCF Connect (França).",
    ],
  },
  {
    id: "golpes-paris",
    publishedAt: "2026-05-12",
    category: "Segurança",
    categoryColor: "bg-red-100 text-red-700",
    icon: Shield,
    title: "Golpes comuns em Paris (e como evitá-los)",
    excerpt: "A cidade do amor também tem seus larápios. Conheça as ciladas mais comuns perto da Torre Eiffel.",
    readTime: 4,
    body: [
      "O golpe do anel: alguém 'encontra' um anel no chão e tenta te vender. Ignore e siga em frente.",
      "Petição falsa: pessoas pedem para assinar uma petição e enquanto sua atenção está no papel, cúmplices furtam pertences.",
      "Na Torre Eiffel e no Sacré-Cœur, grupos formam cordas de amizade e exigem pagamento. Não estenda o braço.",
      "Use pochete discreta ou mochila anti-furto com compartimento oculto. Deixe documentos originais no hotel.",
    ],
  },
  {
    id: "etias-europa",
    publishedAt: "2026-05-13",
    category: "Documentos",
    categoryColor: "bg-purple-100 text-purple-700",
    icon: FileText,
    title: "ETIAS 2026: o que brasileiros precisam saber",
    excerpt: "A nova autorização de viagem para a Europa exige cadastro prévio online.",
    readTime: 3,
    body: [
      "O ETIAS (European Travel Information and Authorization System) é obrigatório para cidadãos de países isentos de visto, incluindo brasileiros.",
      "Custa €7 e é válido por 3 anos ou até o vencimento do passaporte. A aprovação leva minutos, mas pode levar até 4 dias em casos revisados.",
      "Não confunda com visto! Com ETIAS você pode ficar até 90 dias dentro de 180 dias na área Schengen.",
      "Acesse o site oficial da Comissão Europeia para se registrar. Desconfie de sites de terceiros que cobram taxas extras.",
    ],
    link: { label: "Site oficial ETIAS", url: "https://travel-europe.europa.eu/etias_en" },
  },
  {
    id: "wifi-roaming",
    publishedAt: "2026-05-13",
    category: "Tecnologia",
    categoryColor: "bg-sky-100 text-sky-700",
    icon: Wifi,
    title: "Internet no exterior: SIM local, eSIM ou roaming?",
    excerpt: "Comparamos as opções para você nunca ficar sem sinal — e sem dinheiro — viajando.",
    readTime: 4,
    body: [
      "eSIM é a melhor opção hoje: configure antes de sair do Brasil, ative ao chegar. Apps como Airalo e Holafly oferecem planos de dados a partir de US$5.",
      "SIM local: compre no aeroporto de chegada. Na Europa, a Three UK e a Orange têm planos com roaming grátis em vários países.",
      "Roaming da operadora brasileira: geralmente o mais caro. Vivo, Claro e Tim cobram até R$60/dia pelo pacote diário.",
      "Dica: baixe mapas do Google Maps offline antes de sair do hotel. Salva bateria e dados.",
    ],
  },

  // ── Semana 2026-05-04 ─────────────────────────────────────
  {
    id: "seguro-viagem",
    publishedAt: "2026-05-05",
    category: "Saúde",
    categoryColor: "bg-emerald-100 text-emerald-700",
    icon: Heart,
    title: "Seguro viagem: o que cobre e o que não cobre",
    excerpt: "Uma consulta médica na Europa pode custar €300. Entenda o que seu seguro realmente inclui.",
    readTime: 5,
    body: [
      "Coberturas essenciais: despesas médicas (mínimo €30.000 para Schengen), extravio de bagagem, cancelamento de voo e repatriação.",
      "Atenção às exclusões: esportes de risco, doenças preexistentes e situações causadas por uso de álcool geralmente não são cobertos.",
      "Seguro obrigatório para Schengen: cobertura mínima de €30.000 para despesas médicas. Sem isso, seu visto pode ser negado.",
      "Compare no Minhas Viagens, Assist Card e Allianz. Planos básicos custam de R$8 a R$20 por dia.",
    ],
  },
  {
    id: "moeda-local",
    publishedAt: "2026-05-05",
    category: "Finanças",
    categoryColor: "bg-amber-100 text-amber-700",
    icon: Globe,
    title: "Dinheiro no exterior: como não perder na conversão",
    excerpt: "Cartão internacional, espécie, ou conta digital? A estratégia certa pode te economizar centenas de reais.",
    readTime: 4,
    body: [
      "Evite câmbio em aeroportos e hotéis — as taxas são as piores. Prefira casas de câmbio como Meu Câmbio ou Cotação antes de viajar.",
      "Cartões sem IOF: Wise, Nomad e C6 Bank não cobram IOF em compras internacionais. Essenciais para quem viaja muito.",
      "Saque no exterior: prefira caixas eletrônicos de bancos locais e saque valores maiores (menos taxas por transação).",
      "Regra 70/30: leve 70% em cartão e 30% em espécie para emergências e locais que não aceitam débito.",
    ],
  },
  {
    id: "bagagem-mao",
    publishedAt: "2026-05-06",
    category: "Transporte",
    categoryColor: "bg-blue-100 text-blue-700",
    icon: Luggage,
    title: "Como viajar só com bagagem de mão e não sofrer",
    excerpt: "Viajando com mochila de cabine você economiza tempo e dinheiro — e nunca perde mala de novo.",
    readTime: 5,
    body: [
      "Regra base: 7kg e 55x40x20cm cabe em 99% das companhias europeias. Pese a mochila vazia antes de começar a encher.",
      "Técnica roll & stack: enrole roupas ao invés de dobrar — ocupa 30% menos espaço e amassa menos.",
      "Produtos de higiene: tamanho 100ml, tudo em um saquinho transparente. Use sólidos (xampu, condicionador) para economizar volume.",
      "Kit versátil: 2 calças, 5 camisetas, 1 blusa quente, 1 vestido/camisa social e 2 pares de sapatos. Para até 10 dias.",
    ],
  },
  {
    id: "comida-local",
    publishedAt: "2026-05-06",
    category: "Cultura",
    categoryColor: "bg-rose-100 text-rose-700",
    icon: Utensils,
    title: "Como comer bem e barato em qualquer país",
    excerpt: "Turistas pagam mais. Aprenda a comer como um local e economize até 60% nas refeições.",
    readTime: 3,
    body: [
      "Mercados locais são sempre mais baratos que restaurantes turísticos. Em Paris, o Marché d'Aligre é indispensável.",
      "Menu do almoço (prix-fixe): restaurantes franceses e italianos oferecem menu completo no almoço por metade do preço do jantar.",
      "Apps para encontrar restaurantes locais: TripAdvisor (filtrar por 'Locals choice'), Yelp e Google Maps (leia avaliações em outros idiomas).",
      "Supermercado é seu amigo: café da manhã e lanches no supermercado local economizam até €15/dia por pessoa.",
    ],
  },

  // ── Semana 2026-04-27 ─────────────────────────────────────
  {
    id: "fotografia-viagem",
    publishedAt: "2026-04-28",
    category: "Cultura",
    categoryColor: "bg-rose-100 text-rose-700",
    icon: Camera,
    title: "Fotografia de viagem: tire fotos incríveis com o celular",
    excerpt: "Não precisa de câmera profissional para guardar memórias bonitas. Conheça as técnicas.",
    readTime: 4,
    body: [
      "Hora dourada: as melhores fotos acontecem 1 hora após o amanhecer e 1 hora antes do pôr do sol. A luz é suave, quente e direcional — muito mais bonita que o meio-dia.",
      "Regra dos terços: ative a grade no seu celular. Posicione horizontes e rostos nas linhas, não no centro. O resultado é imediatamente mais profissional.",
      "Modo retrato para monumentos: use o modo retrato para criar profundidade mesmo em fotos de arquitetura. Funciona bem com elementos em primeiro plano.",
      "Backup automático: configure o Google Fotos ou iCloud para fazer backup das fotos via Wi-Fi do hotel. Perder fotos de viagem é uma das maiores frustrações do viajante.",
    ],
  },
  {
    id: "jet-lag",
    publishedAt: "2026-04-28",
    category: "Saúde",
    categoryColor: "bg-emerald-100 text-emerald-700",
    icon: Sun,
    title: "Jet lag: como se adaptar ao novo fuso em 24 horas",
    excerpt: "Chegar exausto e passar 3 dias sem dormir direito arruína qualquer viagem. Tem como evitar.",
    readTime: 4,
    body: [
      "Antes de viajar: ajuste progressivamente o horário de dormir 3 dias antes da viagem — 1 hora por dia na direção do destino.",
      "No avião: sincronize o relógio com o destino assim que embarcar. Durma quando for noite lá. Evite álcool (desidrata e piora o jet lag) e beba muita água.",
      "Ao chegar: exponha-se à luz natural assim que possível. A luz solar é o principal regulador do ciclo circadiano.",
      "Melatonina: 0,5mg a 3mg, 30 minutos antes de dormir no horário do destino, nos primeiros 2 dias. Mais eficaz do que doses altas.",
    ],
  },
  {
    id: "pontos-milhas",
    publishedAt: "2026-04-29",
    category: "Finanças",
    categoryColor: "bg-amber-100 text-amber-700",
    icon: Zap,
    title: "Milhas e pontos: como acumular rápido sem mistério",
    excerpt: "Passagens grátis são possíveis. A chave é concentrar gastos no cartão certo.",
    readTime: 5,
    body: [
      "Escolha um único programa: dispersar pontos em vários programas é o maior erro. Concentre em um (Smiles, TudoAzul, Latam Pass) e acumule mais rápido.",
      "Cartão de crédito certo: cartões como Itaú Personnalité, Bradesco Elo Nanquim e Nubank Ultraviolet oferecem 2-3 pontos por real gasto.",
      "Gastos do dia a dia: use o cartão para tudo — supermercado, farmácia, contas. Pague na íntegra todo mês (dívida anula qualquer benefício).",
      "Promoções de transferência: programas como Livelo frequentemente oferecem bônus de 100% para transferir pontos. Monitore e aproveite.",
      "Onde gastar bem: passagens em executiva ou econômica long-haul (Brasil-Europa) são os melhores resgates. Evite resgatar em produtos — a relação custo-benefício é péssima.",
    ],
  },
  {
    id: "apps-viagem-essenciais",
    publishedAt: "2026-04-29",
    category: "Tecnologia",
    categoryColor: "bg-sky-100 text-sky-700",
    icon: Smartphone,
    title: "Os 10 apps que todo viajante precisa ter instalados",
    excerpt: "Desta lista, pelo menos 5 você ainda não conhece — e vão mudar como você viaja.",
    readTime: 5,
    body: [
      "TripIt: organize todos os seus reservas (voos, hotéis, carros) em um só lugar. Basta encaminhar os emails de confirmação.",
      "XE Currency: conversor de moedas offline com histórico de taxas. Mais rápido e preciso que apps bancários.",
      "Flush: encontra banheiros públicos próximos em qualquer cidade do mundo. Soa simples, salva em momentos críticos.",
      "PackPoint: gera listas de malas automaticamente baseadas no destino, duração e atividades planejadas.",
      "Splitwise: divida gastos de viagem em grupo sem confusão. Calcula quem deve a quem no final.",
      "Rome2Rio: mostra todas as formas de ir de A a B (avião, trem, ônibus, balsa) com preços e duração.",
    ],
  },
];
