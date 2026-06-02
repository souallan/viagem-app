import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Curated suggestions for popular destinations — fallback when no API key
const CURATED: Record<string, Array<{ title: string; type: string; startTime: string; description: string; cost: number | null }>> = {
  "lisboa": [
    { title: "Castelo de São Jorge", type: "ACTIVITY", startTime: "09:00", description: "Fortaleza medieval com vista panorâmica de Lisboa. Chegue antes das 10h para evitar filas.", cost: 15 },
    { title: "Pastéis de Belém", type: "MEAL", startTime: "10:30", description: "A pastelaria original dos pastéis de nata, em funcionamento desde 1837.", cost: 8 },
    { title: "Mosteiro dos Jerônimos", type: "ACTIVITY", startTime: "11:30", description: "Obra-prima do estilo manuelino, Patrimônio da UNESCO. Reserve ingresso online.", cost: 10 },
    { title: "Miradouro da Graça", type: "ACTIVITY", startTime: "17:30", description: "Melhor pôr do sol de Lisboa, com menos turistas que o Portas do Sol.", cost: null },
    { title: "Tasca do Chico", type: "MEAL", startTime: "20:00", description: "Restaurante de fado ao vivo em Alfama — reservar com antecedência.", cost: 35 },
  ],
  "porto": [
    { title: "Livraria Lello", type: "ACTIVITY", startTime: "10:00", description: "Uma das mais belas livrarias do mundo. Ingresso antecipado recomendado.", cost: 5 },
    { title: "Cave Ferreira (degustação de vinho do Porto)", type: "ACTIVITY", startTime: "14:00", description: "Tour e degustação das famosas caves de vinho do Porto em Vila Nova de Gaia.", cost: 18 },
    { title: "Ribeira", type: "ACTIVITY", startTime: "16:00", description: "Bairro histórico à beira do rio Douro — Patrimônio da UNESCO.", cost: null },
    { title: "Francesinha no Café Santiago", type: "MEAL", startTime: "12:30", description: "O prato típico do Porto que todo viajante deve experimentar.", cost: 14 },
    { title: "Museu de Arte Contemporânea (Serralves)", type: "ACTIVITY", startTime: "10:00", description: "Espaço de arte contemporânea com jardins deslumbrantes.", cost: 20 },
  ],
  "buenos aires": [
    { title: "Bairro de Palermo Soho", type: "ACTIVITY", startTime: "10:00", description: "O bairro mais descolado de Buenos Aires — cafés, lojas e street art.", cost: null },
    { title: "Cemitério da Recoleta", type: "ACTIVITY", startTime: "09:30", description: "Necrópole histórica onde está sepultada Evita Perón. Gratuito.", cost: null },
    { title: "Bife de chorizo no Don Julio", type: "MEAL", startTime: "13:00", description: "Um dos melhores steakhouses de Buenos Aires. Reserve com antecedência.", cost: 30 },
    { title: "Show de tango", type: "EVENT", startTime: "20:00", description: "Espetáculo de tango com jantar incluído. La Ventana ou Rojo Tango são excelentes.", cost: 80 },
    { title: "Feira de San Telmo (domingo)", type: "ACTIVITY", startTime: "11:00", description: "Feira de artesanato e antiguidades no bairro histórico. Só aos domingos.", cost: null },
  ],
  "tokyo": [
    { title: "Senso-ji em Asakusa", type: "ACTIVITY", startTime: "08:00", description: "O templo mais antigo de Tóquio — vá cedo para evitar multidões.", cost: null },
    { title: "Shibuya Crossing", type: "ACTIVITY", startTime: "18:00", description: "O cruzamento mais movimentado do mundo. Vista do Starbucks no 2º andar.", cost: null },
    { title: "Ramen no Ichiran", type: "MEAL", startTime: "12:30", description: "Ramen em cabines individuais — a experiência mais icônica de ramen no Japão.", cost: 15 },
    { title: "Akihabara", type: "ACTIVITY", startTime: "14:00", description: "Bairro dos eletrônicos, anime e cultura pop japonesa.", cost: null },
    { title: "Meiji Shrine", type: "ACTIVITY", startTime: "07:30", description: "Santuário xintoísta no coração de Tóquio, cercado de floresta.", cost: null },
  ],
  "barcelona": [
    { title: "Sagrada Família", type: "ACTIVITY", startTime: "09:00", description: "A obra-prima de Gaudí. Reserve ingresso com 1-2 meses de antecedência!", cost: 26 },
    { title: "Parque Güell", type: "ACTIVITY", startTime: "11:30", description: "Parque temático de Gaudí com vistas de Barcelona. Reserve online.", cost: 10 },
    { title: "Las Ramblas e Bairro Gótico", type: "ACTIVITY", startTime: "14:00", description: "A artéria central de Barcelona — atenção aos bolsos na Las Ramblas.", cost: null },
    { title: "Cervecería Catalana (tapas)", type: "MEAL", startTime: "13:30", description: "Uma das melhores tapas de Barcelona, no coração do Eixample.", cost: 20 },
    { title: "Praia de Barceloneta", type: "ACTIVITY", startTime: "16:00", description: "A praia urbana mais famosa de Barcelona. Ótima ao entardecer.", cost: null },
  ],
  "paris": [
    { title: "Torre Eiffel", type: "ACTIVITY", startTime: "09:00", description: "Reserve ingresso online com antecedência — filas enormes presencialmente.", cost: 28 },
    { title: "Museu do Louvre", type: "ACTIVITY", startTime: "10:00", description: "O maior museu do mundo. Planeje no mínimo 3h. Reserve online.", cost: 22 },
    { title: "Montmartre e Sacré-Cœur", type: "ACTIVITY", startTime: "15:00", description: "O bairro dos artistas, com vista panorâmica de Paris.", cost: null },
    { title: "Bistrô do bairro (almoço francês)", type: "MEAL", startTime: "12:30", description: "Evite restaurantes turísticos — peça 'formule' (menu do dia) para economizar.", cost: 18 },
    { title: "Cruzeiro no Sena", type: "ACTIVITY", startTime: "19:00", description: "Passeio noturno com os monumentos iluminados. Bateaux Parisiens ou Bateaux Mouches.", cost: 17 },
  ],
  "roma": [
    { title: "Coliseu e Foro Romano", type: "ACTIVITY", startTime: "09:00", description: "Reserve com pelo menos 30 dias de antecedência — esgota rapidamente!", cost: 18 },
    { title: "Vaticano (Museus e Basílica)", type: "ACTIVITY", startTime: "08:00", description: "Reserve com semanas de antecedência. Melhor ir logo ao abrir.", cost: 20 },
    { title: "Fontana di Trevi", type: "ACTIVITY", startTime: "07:00", description: "Vá antes das 8h — quase sem gente. Às 10h já está lotado.", cost: null },
    { title: "Carbonara autêntica no Trattoria", type: "MEAL", startTime: "13:00", description: "Evite restaurantes na Piazza Navona. Vá 2 quarteirões para trás.", cost: 16 },
    { title: "Mercado de Campo de' Fiori", type: "ACTIVITY", startTime: "10:00", description: "Mercado matinal com produtos frescos e flores. Só pela manhã.", cost: null },
  ],
  "nova york": [
    { title: "Central Park", type: "ACTIVITY", startTime: "08:00", description: "Um pulmão de 341 hectares no coração de Manhattan.", cost: null },
    { title: "Metropolitan Museum of Art", type: "ACTIVITY", startTime: "10:00", description: "Um dos maiores museus do mundo. Planeje o dia inteiro.", cost: 30 },
    { title: "Times Square", type: "ACTIVITY", startTime: "20:00", description: "A Times Square é mais impressionante à noite.", cost: null },
    { title: "Brooklyn Bridge + DUMBO", type: "ACTIVITY", startTime: "09:00", description: "Cruzar a ponte a pé e explorar o bairro de DUMBO com vista de Manhattan.", cost: null },
    { title: "Bagel + café no Brooklyn", type: "MEAL", startTime: "08:30", description: "Café da manhã nova-iorquino clássico — o melhor de Manhattan para bagels.", cost: 12 },
  ],
  "amsterdam": [
    { title: "Museu Anne Frank", type: "ACTIVITY", startTime: "09:00", description: "Experiência emocionante. Reserve ingresso online com antecedência — esgota semanas antes.", cost: 16 },
    { title: "Rijksmuseum", type: "ACTIVITY", startTime: "10:30", description: "O museu nacional holandês com obras de Rembrandt e Vermeer.", cost: 22 },
    { title: "Passeio de barco pelos canais", type: "ACTIVITY", startTime: "15:00", description: "A melhor forma de ver Amsterdam. Canal tours saem de vários pontos.", cost: 18 },
    { title: "Mercado Albert Cuyp", type: "ACTIVITY", startTime: "11:00", description: "Maior mercado de rua da Holanda — haringen (arenque) é obrigatório.", cost: null },
    { title: "Bicicleta pelos bairros", type: "ACTIVITY", startTime: "09:00", description: "Alugar bicicleta (€12-15/dia) é a forma mais local de explorar Amsterdam.", cost: 13 },
  ],
};

function normalize(city: string): string {
  return city.toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[,\-]/g, " ")
    .trim();
}

function findCurated(city: string) {
  const norm = normalize(city);
  for (const [key, suggestions] of Object.entries(CURATED)) {
    if (norm.includes(key) || key.includes(norm.split(" ")[0])) {
      return suggestions;
    }
  }
  return null;
}

async function generateWithClaude(city: string, date: string): Promise<Array<{ title: string; type: string; startTime: string; description: string; cost: number | null }>> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `Você é um especialista em viagens. Sugira 5 atividades para ${city} para um turista brasileiro.
Para cada atividade, retorne um JSON com: title, type (ACTIVITY/MEAL/EVENT/OTHER), startTime (HH:MM), description (1 frase curta com dica local), cost (número em euros/moeda local ou null se gratuito).
Retorne SOMENTE um array JSON válido, sem markdown, sem explicação. Exemplo:
[{"title":"...", "type":"ACTIVITY", "startTime":"09:00", "description":"...", "cost":15}]`,
    }],
  });

  const text = msg.content[0].type === "text" ? msg.content[0].text.trim() : "[]";
  // Extract JSON array from response
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return [];
  return JSON.parse(match[0]);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const trip = await prisma.trip.findFirst({ where: { id, userId: session.user.id } });
  if (!trip) return NextResponse.json({ error: "Viagem não encontrada" }, { status: 404 });

  const { city, date } = await req.json();
  if (!city) return NextResponse.json({ error: "Cidade obrigatória" }, { status: 400 });

  // Try curated first
  const curated = findCurated(city);
  if (curated) {
    return NextResponse.json({ suggestions: curated, source: "curated" });
  }

  // Try Claude if API key is available
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const suggestions = await generateWithClaude(city, date ?? "");
      return NextResponse.json({ suggestions, source: "ai" });
    } catch {
      // Fall through to generic
    }
  }

  // Generic fallback
  return NextResponse.json({
    suggestions: [
      { title: `Centro histórico de ${city}`, type: "ACTIVITY", startTime: "09:00", description: "Explore o coração da cidade a pé.", cost: null },
      { title: `Almoço local em ${city}`, type: "MEAL", startTime: "13:00", description: "Experimente a culinária típica da região.", cost: 15 },
      { title: `Museu principal de ${city}`, type: "ACTIVITY", startTime: "10:30", description: "Conheça a história e cultura local.", cost: 12 },
      { title: `Miradouro ou ponto panorâmico`, type: "ACTIVITY", startTime: "17:00", description: "Melhor vista da cidade ao entardecer.", cost: null },
      { title: `Jantar com culinária local`, type: "MEAL", startTime: "19:30", description: "Restaurante fora da área turística para experiência autêntica.", cost: 25 },
    ],
    source: "generic",
  });
}
