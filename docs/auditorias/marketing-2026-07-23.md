# Auditoria de Marketing — RoteiroApp

**Data:** 2026-07-23 · **Analista:** Nova (estrategista de marketing) · **Versão:** 1.0

---

## 1. Resumo executivo

O RoteiroApp já tem a *fundação* de aquisição orgânica montada (blog com ~12 posts, `/roteiro/[cidade]` com 14 destinos, SEO técnico, GA4, referral embutido, infra de afiliados pronta com `rel="sponsored"` + disclosure). O problema não é falta de estrutura — é que **quase tudo está desligado ou subutilizado**. As 3 alavancas mais importantes agora:

1. **Ligar a receita de afiliados** — o código está pronto, mas todos os links caem na URL genérica (sem código) porque os `NEXT_PUBLIC_*` não estão setados. Hoje o app manda tráfego de alta intenção de graça para Booking/GYG/Airalo. Cadastrar 4 programas nesta semana é dinheiro na mesa.
2. **Corrigir o buraco de SEO nacional** — os 14 roteiros são 100% internacionais. O brasileiro busca MUITO mais "roteiro Rio de Janeiro", "quantos dias em Fernando de Noronha", "o que fazer em Gramado". Isso é volume de cauda longa barato e sazonal (dez/jan = alta procura nacional).
3. **Transformar o referral em loop real** — hoje `referredBy` é gravado mas **não gera nenhuma recompensa** (verificado em `api/register/route.ts`). Um loop de indicação sem incentivo é cosmético. Adicionar "ganhe 30 dias de Premium por indicação convertida" transforma isso num canal de crescimento composto.

Orçamento ~zero e 1 fundador = o plano prioriza **reaproveitamento** (1 conteúdo → 5 canais) e **automação** (CRM, loops no produto) sobre esforço manual recorrente.

---

## 2. Pontos fortes (não regredir)

- **Afiliados bem implementados tecnicamente**: `AffiliateBlock` já tem `rel="noopener noreferrer sponsored"`, disclosure em texto, `buildUrl` contextual por destino e `trackEvent("affiliate_click")`. Só falta ligar os códigos. Isso é raro num indie — está pronto pra escalar.
- **SEO técnico presente**: metadata dinâmica por destino, `generateStaticParams`, keywords, OG, JSON-LD, sitemap. Base sólida.
- **`/roteiro/[cidade]` é um bom template de conversão**: info cards (visto, custo/dia, melhor época) + roteiro dia a dia + bloco de afiliados + CTA "criar roteiro grátis". Só precisa de mais páginas e de destinos nacionais.
- **Produto tem loops nativos possíveis**: compartilhar roteiro (`/share/[token]`), comunidade (`CommunityRoute`), relatos (`Experience`), referral. A mecânica existe — falta ativá-la e instrumentá-la.
- **Freemium bem calibrado**: FREE = 1 viagem / 20 atividades cria pressão de upgrade natural sem ser hostil.

---

## 3. Problemas e oportunidades priorizados

| # | Item | Área | Impacto | Esforço | Prioridade |
|---|------|------|---------|---------|------------|
| 1 | Afiliados sem código (`NEXT_PUBLIC_*` vazios) → 0 receita apesar do tráfego | Afiliados | Alto | Baixo | **P0** |
| 2 | Referral não dá recompensa → loop morto | Loop de produto | Alto | Médio | **P0** |
| 3 | Zero roteiros nacionais (BR) → perde a maior massa de busca | SEO conteúdo | Alto | Médio | **P0** |
| 4 | Sem ASO estruturado p/ Google Play (título/keywords/screenshots) | ASO | Alto | Médio | **P1** |
| 5 | Blog com 12 posts hardcoded, sem cadência nem cauda longa "quantos dias em X" | SEO conteúdo | Alto | Médio | **P1** |
| 6 | Sem sequência de e-mail de ativação/reengajamento (Resend existe) | CRM | Médio | Médio | **P1** |
| 7 | Compartilhamento de roteiro não é loop viral (sem CTA de cadastro forte no `/share`) | Loop de produto | Médio | Baixo | **P1** |
| 8 | Sem presença de conteúdo em Pinterest/TikTok (canais de descoberta de viagem) | Social | Médio | Médio | **P2** |
| 9 | Pedido de review na loja não instrumentado (hora certa) | ASO/retenção | Médio | Baixo | **P2** |
| 10 | Sem lançamento em comunidades de makers (Product Hunt/BR) | Aquisição | Médio | Baixo | **P2** |
| 11 | Afiliados só em `/roteiro` — faltam nas páginas de produto (currency, transport, prep, budget) | Afiliados | Médio | Baixo | **P2** |

---

## 4. PLANO 1 — DIVULGAÇÃO EM MASSA

### QUICK WINS (próximas 2 semanas)

**QW1 — Ligar afiliados (2h).** Cadastrar e setar os códigos dos 4 primeiros programas (ver Plano 2 para a ordem). Cada visita em `/roteiro/paris` hoje é receita perdida. Setar `NEXT_PUBLIC_BOOKING_AID`, `NEXT_PUBLIC_GYG_PARTNER_ID`, `NEXT_PUBLIC_AIRALO_REF`, `NEXT_PUBLIC_SEGUROS_PROMO_ID` no Railway. **Por quê:** ROI imediato, esforço mínimo, código pronto.

**QW2 — Ativar recompensa de referral (meio dia de dev).** No `api/register`, quando um usuário indicado cria a 1ª viagem, creditar **30 dias de Premium** ao indicador (e dar algo ao indicado, ex.: 14 dias). Mostrar no `/profile` o contador + link. **Por quê:** transforma cada usuário satisfeito em canal de aquisição de custo zero; o composto é o que faz indie crescer sem ads.

**QW3 — Publicar 3 roteiros nacionais de alta busca (1 dia).** Adicionar em `destinations.ts`: **Rio de Janeiro, Gramado/Serra Gaúcha, Fernando de Noronha** (topo de busca BR, alta intenção, sazonais). Reusa 100% o template existente. **Por quê:** ataca a cauda longa nacional que hoje o app ignora, e casa com a sazonalidade dez/jan.

**QW4 — Setup Pinterest business (2h) + 10 pins.** Cada `/roteiro/[cidade]` vira 1 pin vertical (mapa do dia a dia + "Roteiro de X dias em [cidade]"). Pinterest é o canal de descoberta de viagem com maior meia-vida (pins rankeiam por meses/anos, ao contrário de Reels). **Por quê:** tráfego orgânico passivo pro site, esforço 1x.

**QW5 — Lançar em 3 comunidades sem spam (1h).** Post de VALOR (não link cru) em r/viajar, r/brasil, grupos FB "Mochileiros" / "Viagens Baratas": "Fiz um roteiro dia a dia de X, com custos reais — quem quiser o modelo é só falar". Link no comentário/DM. **Por quê:** primeiro tráfego qualificado + primeiros reviews sociais.

**QW6 — Setup ASO básico da ficha Google Play (2h).** Título: `RoteiroApp: Planejar Viagem`. Descrição curta com keywords: *roteiro de viagem, organizar viagem, planejador, orçamento, mala, câmbio*. 6 screenshots com legendas de benefício (não telas cruas). **Por quê:** teste interno vira produção logo; ficha otimizada desde o dia 1 capta busca orgânica na loja.

### CONSTRUÇÃO (3–6 meses)

**Calendário editorial realista (1 pessoa) — regra: 1 peça-âncora/semana, reaproveitada.**

Cada semana produz **1 artigo/roteiro âncora** que vira: 1 pin Pinterest + 1 carrossel Instagram + 1 Reel/Short (30s do dia a dia) + 1 e-mail newsletter. Isso é ~4h/semana de produção, não 5 canais separados.

Sazonalidade a explorar:
- **Ago–Out:** conteúdo de planejamento de fim de ano ("Onde viajar no réveillon", "Roteiro Europa no inverno", "Quanto custa passar o ano novo em X"). É quando o brasileiro PESQUISA (compra a viagem 2–4 meses antes).
- **Nov–Dez:** conteúdo nacional de alta temporada (praias BR, Gramado no Natal Luz, Noronha).
- **Jan–Fev:** carnaval + "resoluções de viagem 2027" + planejamento de julho.

Pauta de cauda longa (formato que ranqueia barato):
- `Quantos dias em [cidade]?` — para os 14 + destinos nacionais.
- `Roteiro de X dias em [cidade]` (3, 5, 7 dias — 3 páginas por destino).
- `Quanto custa viajar para [destino]` (busca transacional forte → casa com afiliados).
- `Melhor época para [destino]`, `[destino] vale a pena?`, `[destino] é seguro?`.
- `[cidade A] ou [cidade B]?` (comparativos — alto CTR).

**Meta 6 meses:** de 14 para ~40 roteiros (metade nacional) + ~30 artigos. Cada página = ativo de SEO + slot de afiliado.

**Social sustentável:**
- **Pinterest = prioridade 1** (meia-vida longa, público planejador, tráfego pro site). 5 pins/semana reaproveitando roteiros.
- **Instagram/TikTok/Shorts = prioridade 2**, formato que gera SALVAMENTO: "Roteiro salvável de X dias", "Erros que brasileiro comete em [país]", "Quanto gastei em [destino] (planilha real)". Salvamento e compartilhamento > likes para o algoritmo. 2–3 posts/semana, todos derivados da peça-âncora.
- Não fazer stories diários / "postar mais" — insustentável p/ 1 pessoa. Foco em peças evergreen reaproveitáveis.

**Parcerias por permuta (custo zero):**
- Microinfluenciadores de viagem BR (5k–50k, alto engajamento) → oferecer Premium vitalício + código de afiliado deles no app em troca de 1 post/story mostrando o roteiro. Buscar quem já faz "roteiro dia a dia" (público idêntico).
- **Product Hunt + comunidades de makers BR** (Indie Hackers, grupos de "startup de um dev só", Nomads BR) — 1 lançamento bem preparado.
- Imprensa indie: pautar blogs de viagem BR e newsletters de nômades ("ferramenta BR grátis pra planejar viagem").

**CRM / e-mail (Resend já existe) — sequências a montar:**
- **Ativação (gatilho: cadastro sem viagem criada):** D0 boas-vindas + "crie sua 1ª viagem em 2 min"; D2 "veja um roteiro pronto de exemplo"; D5 dica de recurso (mala/câmbio).
- **Ativação→hábito (criou viagem):** dicas contextuais por etapa (adicionou destino → sugestão de atividades; adicionou datas → checklist de documentos/visto).
- **Reengajamento (30 dias inativo):** "novos roteiros de [destino que ele salvou]", conteúdo sazonal.
- **Pré-viagem (data se aproximando):** checklist de embarque → slot natural para Airalo/Seguros/câmbio (afiliado + utilidade).
- Newsletter mensal = a peça-âncora da semana compilada.

---

## 5. PLANO 2 — ATIVAÇÃO DOS AFILIADOS

### Ordem recomendada (facilidade de aprovação p/ site BR pequeno × receita p/ este público)

| Ordem | Parceiro | Aprovação (site pequeno BR) | Receita p/ público BR | Começar? |
|-------|----------|------------------------------|------------------------|----------|
| 1 | **Airalo (eSIM)** | Muito fácil (self-serve, Partnerize) | Alta margem, necessidade universal em viagem internacional | **SIM — 1ª** |
| 2 | **Seguros (Seguros Promo)** | Fácil, programa BR | Alta conversão (Schengen exige seguro; alto ticket) | **SIM — 2ª** |
| 3 | **GetYourGuide (tours)** | Fácil (self-serve) | Ticket alto, alta intenção em `/roteiro` | **SIM — 3ª** |
| 4 | **Booking (hospedagem)** | Média (exige site real, comissão só após estada) | **Maior volume total** | **SIM — 4ª (começar cedo, demora a acumular)** |
| 5 | **Wise + Nomad (câmbio)** | Fácil (invite links instantâneos) | Média, recorrente (público BR no exterior) | Semana 2 |
| 6 | **Rentcars (carro)** | Fácil (empresa BR) | Média (roadtrips: Orlando, EUA, Europa) | Semana 2–3 |
| 7 | **Skyscanner (voos)** | Fácil via Travelpayouts | **Baixa** (voo converte mal, comissão por clique) | Depois / opcional |

**Por qual começar:** **Airalo + Seguros Promo + GetYourGuide + Booking** nesta primeira semana. Os 3 primeiros aprovam rápido e têm a melhor receita-por-visitante para viajante internacional BR; o Booking entra junto porque é o de maior volume mas o mais lento a acumular comissão — quanto antes começar, antes acumula. Skyscanner fica por último (revenue baixo, não vale o esforço inicial).

### Onde cada link rende mais no produto

| Parceiro | Melhor colocação | Motivo |
|----------|------------------|--------|
| Booking | `/roteiro/[cidade]` (já está) + página **accommodation** da viagem + **budget** | Momento de decidir onde dormir |
| GetYourGuide | `/roteiro` (tours, já está) + **itinerary** (ao sugerir atividades) | Alta intenção ao montar o dia a dia |
| Airalo | Página **prep/documents** (checklist pré-embarque) + `immigration-alerts`/`emergency-info` + `/roteiro` tips | Decisão de conectividade é pré-viagem |
| Seguros | **prep/documents** + card de "visto" no `/roteiro/[cidade]` | Seguro é item de checklist/visto (Schengen) |
| Wise / Nomad | Página **currency** (câmbio) + **budget** | Momento de pensar em dinheiro no exterior |
| Rentcars | Página **transport** + destinos de roadtrip (Orlando, EUA) | Aluguel casa com transporte |
| Skyscanner | `/roteiro` (voos) + **transport** | Pesquisa de passagem |

**Ação técnica:** hoje os afiliados só aparecem em `/roteiro`. Adicionar `AffiliateBlock` contextual nas páginas de produto acima (esforço baixo — componente já existe) multiplica os slots de receita sem criar nada novo. Cuidado: dentro do app (usuário logado/pagante) usar afiliação com parcimônia e sempre útil — não poluir a experiência premium.

### Rotulagem "link patrocinado" (exigência jurídica — CONAR/CDC/LGPD)

O `AffiliateBlock` **já atende o essencial**: `rel="sponsored"` + disclosure em texto ("Links de parceiros — ao reservar por eles, podemos receber uma comissão sem custo extra para você"). Para blindar juridicamente, ajustar:

1. **Rótulo visível e inequívoco** próximo ao título do bloco: uma tag `Publicidade` ou `Parceria` (não só o texto no rodapé do bloco). O CONAR exige identificação **clara e ostensiva** de publicidade.
2. **Manter** `rel="sponsored"` em todo link de afiliado (já está) — inclusive nos que forem adicionados nas páginas de produto.
3. **Disclosure permanente** e legível (não esconder em cinza claro minúsculo). Recomendo subir o contraste do texto atual (`text-gray-400 text-[10px]` → algo mais legível).
4. Criar uma página `/parcerias` ou seção na `/privacy` explicando o modelo de afiliados (transparência LGPD + reforça confiança).
5. Em e-mail/social com link de afiliado: usar `#publi` / "contém link de parceiro" — mesma regra do CONAR para conteúdo patrocinado.

---

## 6. Métricas para acompanhar (KPIs + como medir)

| KPI | Como medir | Meta inicial |
|-----|-----------|--------------|
| Tráfego orgânico `/roteiro` e `/blog` | GA4 + Search Console (impressões/cliques por página) | +30% em 90d |
| Cliques em afiliado + receita | `affiliate_click` (GA4, já instrumentado) cruzado com painel de cada programa | Baseline no mês 1 |
| Conversão visita→cadastro | GA4 funil (landing → /register → sucesso) | Estabelecer baseline |
| Ativação (cadastro → 1ª viagem criada) | Evento no `api/trips` (adicionar `trackEvent` server-side ou client) | >40% |
| Referral: convites → cadastros → convertidos | `referredCount` (já existe) + novo evento de recompensa | k-factor > 0.15 |
| ASO Google Play | Console: impressões da ficha, taxa de instalação, reviews/nota | Nota ≥ 4.3 |
| E-mail: abertura/clique por sequência | Resend/painel de e-mail | Abertura >35% ativação |
| Salvamentos/compartilhamentos social | Insights nativos (Pinterest saves, IG shares) | Priorizar save-rate |

---

## 7. Dados que preciso da próxima vez (para aprofundar)

1. **GA4:** páginas mais visitadas (últimos 90d), origem de tráfego (orgânico/social/direto), funil landing→cadastro→viagem, eventos `affiliate_click` por parceiro.
2. **Search Console:** top queries por impressão e por clique, páginas com CTR baixo mas muitas impressões (oportunidade de título), posição média de `/roteiro/*`.
3. **Números de base:** total de usuários, % que cria ≥1 viagem, % Premium, MRR atual, churn.
4. **Resend:** volume de e-mails enviados, taxa de abertura/clique/bounce da newsletter atual.
5. **Instagram @roteiroapp:** seguidores, alcance médio, save-rate dos últimos posts.
6. **Afiliados:** confirmar quais programas já foram aprovados e quais códigos já estão setados no Railway.
7. **Google Play:** status do teste interno, quando vai a produção, ficha atual (título/descrição/screenshots).

---

*Observação: valores de conversão/CAC não foram estimados por falta de dados reais (marcados como pendências em §7). As metas iniciais são referências de mercado para produtos freemium de viagem, a ajustar após o baseline.*
