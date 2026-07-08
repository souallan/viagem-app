# Auditoria de Marketing — RoteiroApp

**Autora:** Nova (estrategista de marketing digital)
**Data:** 2026-07-08
**Escopo:** SEO técnico e de conteúdo, conversão, afiliados, aquisição, CRM, analytics e mensagem.
**Base da análise:** código real do repositório + pesquisa de concorrentes/boas práticas 2026 (WebSearch).
**Limitação importante:** o site `roteiroapp.com` está FORA DO AR (incidente DNS/SSL). Não houve crawl ao vivo nem acesso a GA4/GSC/Resend. Tudo abaixo é derivado do código e de benchmarks; itens que exigem dados ao vivo estão marcados como **[precisa de dados ao vivo]**.

---

## 1. Resumo executivo

O RoteiroApp tem uma **base técnica de SEO acima da média** para um produto neste estágio (metadata com template, OpenGraph/Twitter, JSON-LD Organization/WebSite/Article, sitemap, robots, PWA, i18n PT/EN/ES na landing) e uma **landing page de conversão bem construída** (dor→solução, prints premium, prova social, CTAs claros). O motor de receita por afiliados (`src/lib/affiliates.ts`) está tecnicamente pronto, com 9 parceiros e URLs contextuais por destino.

Porém, três coisas estão sabotando o retorno de tudo isso:

1. **A medição está cega.** O GA4 só registra pageview. Não há um único evento de conversão (cadastro, clique no CTA, newsletter, clique em afiliado). Sem funil, não dá para otimizar nada nem provar CAC/ROI.
2. **A receita de afiliados está trancada atrás do login.** Os links de afiliado só aparecem nas páginas autenticadas de viagem (`(app)/trips/[id]/*`). As páginas que recebem tráfego orgânico — `/blog`, `/roteiro/[cidade]`, `/tips` — mencionam Booking, Skyscanner, Wise, Nomad e Seguros Promo **como texto puro, sem link de afiliado**. O tráfego orgânico não monetiza.
3. **Há URLs indexadas que retornam 404.** O sitemap e a listagem `/blog` anunciam 12 artigos, mas a página `/blog/[slug]` só contém 8. Quatro artigos (`roteiro-lisboa-7-dias`, `melhores-destinos-brasil-2026`, `mochilao-europa-barato`, `roteiro-japao-10-dias`) linkam para páginas que caem em `notFound()`. É bug de SEO ativo — links quebrados e soft-404 em páginas prioritárias.

As três alavancas mais importantes agora: **(a) instrumentar eventos GA4**, **(b) monetizar o conteúdo orgânico com afiliados + disclosure**, **(c) corrigir e escalar a rede de páginas programáticas `/roteiro`** (hoje só 4 cidades, contra concorrentes que ganham em "roteiro X em N dias").

---

## 2. Pontos fortes (não regredir)

- **SEO técnico sólido para o estágio.** `src/app/layout.tsx`: title template `%s | RoteiroApp`, description, keywords, OG + Twitter card, `metadataBase`, canonical, manifest, robots index/follow. JSON-LD Organization + WebSite (com SearchAction). `robots.ts` e `sitemap.ts` presentes e coerentes.
- **JSON-LD por tipo de página.** Artigos do blog têm schema `Article` (`src/app/blog/[slug]/page.tsx`); cidades têm `generateStaticParams` + `generateMetadata` dinâmico com keywords de cauda longa (`src/app/roteiro/[cidade]/page.tsx`).
- **Landing de alta conversão** (`src/components/landing/landing-client.tsx`): estrutura clássica que funciona — badge de prova, headline/subhead, CTA duplo, faixa de números, seção de dor com antes/depois, 4 blocos de feature com bullets e CTA, banner de experiências, depoimentos 5★, CTA final, captura de newsletter. Prints com moldura de browser dão percepção premium. Copy é específica e boa ("Quanto custa em reais? Na hora.").
- **i18n PT/EN/ES** na landing e nos textos de dicas — raro e valioso para um público que inclui LATAM.
- **Conteúdo de qualidade real.** Os artigos e as páginas de cidade têm dicas concretas ("use o 15E, não o tram 28", "reserve a Sagrada Família com 1-2 meses") — exatamente o tipo de material que o Google (e os motores de IA) premiam. Boa matéria-prima.
- **Infra de afiliados pronta e bem modelada** (`src/lib/affiliates.ts`): 9 parceiros por categoria (câmbio, seguro, hospedagem, voos, tours, eSIM, carro), `buildUrl(destination)` contextual, fallback quando não há código de referência. Falta só distribuir nos lugares certos.
- **Freemium com limites claros e página de pricing honesta** (`src/app/pricing/page.tsx`): free vs premium bem diferenciados, toggle anual (-33%), FAQ. Ancoragem de preço competente.

---

## 3. Problemas e oportunidades priorizados

Prioridade = Impacto × (1/Esforço). P0 = fazer já; P1 = próximas semanas; P2 = estratégico.

| # | Item | Área | Impacto | Esforço | Prioridade |
|---|------|------|---------|---------|------------|
| 1 | 4 artigos no sitemap/listagem retornam 404 (`/blog/[slug]` só tem 8 de 12) | SEO técnico | Alto | Baixo | **P0** |
| 2 | GA4 só mede pageview — zero eventos de conversão/funil | Analytics | Alto | Baixo | **P0** |
| 3 | Afiliados ausentes nas páginas orgânicas (`/blog`, `/roteiro`, `/tips`) | Afiliados/Receita | Alto | Médio | **P0** |
| 4 | Sem `og:image` — compartilhamento social sem imagem (CTR baixo) | SEO/Social | Médio | Baixo | **P0** |
| 5 | Disclosure de afiliado + `rel="sponsored"` ausentes (compliance + trust) | Afiliados/Legal | Médio | Baixo | **P0** |
| 6 | Rede `/roteiro` tem só 4 cidades; concorrentes ganham em "roteiro X N dias" | SEO conteúdo | Alto | Médio | **P1** |
| 7 | i18n só client-side (`useState`) — Google indexa só PT; sem `/en` `/es` nem hreflang | SEO internacional | Alto | Alto | **P1** |
| 8 | Conteúdo do blog duplicado em 2 arquivos (fonte de verdade divergente → causou o bug #1) | SEO/Manutenção | Médio | Médio | **P1** |
| 9 | Premium não vende — botão "Assinar" é `alert()` placeholder (Stripe pendente) | Conversão/Receita | Alto | Alto | **P1** |
| 10 | Sem FAQ schema (pricing/roteiro) nem Breadcrumb schema | SEO/GEO | Médio | Baixo | **P1** |
| 11 | Article JSON-LD sem `dateModified` e sem `image` | SEO | Baixo | Baixo | **P1** |
| 12 | Canal social só Instagram; sem Pinterest (42M usuários BR, top fonte de tráfego de viagem) | Aquisição | Alto | Médio | **P1** |
| 13 | `/tips` bloqueado no robots (`disallow`) apesar de ser ativo de conteúdo | SEO | Médio | Baixo | **P2** |
| 14 | Depoimentos genéricos e stats com fallback fake ("+" sobre 0) — risco de credibilidade | Marca/Trust | Médio | Baixo | **P2** |
| 15 | Newsletter sem sequência de nurture / double opt-in / evento de captura | CRM | Médio | Médio | **P2** |
| 16 | Conteúdo não otimizado para GEO/AEO (citação por ChatGPT/AI Overviews) | SEO/GEO | Médio | Médio | **P2** |
| 17 | Nenhum evento de clique em afiliado → impossível medir receita por parceiro | Analytics/Afiliados | Alto | Baixo | **P1** |

---

## 4. Plano de ação

### Quick wins — esta semana (P0)

**Q1. Corrigir os 4 artigos 404 (bug ativo de SEO).**
*O quê:* A página `src/app/blog/[slug]/page.tsx` tem um array `ARTICLES` com 8 itens; `src/app/blog/page.tsx` e `src/app/sitemap.ts` têm 12. Os 4 faltantes (`roteiro-lisboa-7-dias`, `melhores-destinos-brasil-2026`, `mochilao-europa-barato`, `roteiro-japao-10-dias`) caem em `notFound()`.
*Por quê:* Google está sendo direcionado (sitemap + links internos) para páginas que retornam 404 — desperdício de crawl budget, links internos quebrados e soft-404 justamente nos artigos mais novos e mais "roteiro-shaped" (os de maior potencial). **[confirmar no GSC → Cobertura, assim que o site voltar]**
*Como:* copiar os 4 artigos (já existem em texto completo em `blog/page.tsx`) para o array de `blog/[slug]/page.tsx`. Ideal: unificar numa única fonte (ver C3).

**Q2. Instrumentar eventos GA4 essenciais.**
*O quê:* Hoje `layout.tsx` só chama `gtag('config')` e `GATracker` só re-dispara pageview. Zero eventos.
*Por quê:* Sem eventos não existe funil (visita→cadastro→viagem criada→premium), não dá para calcular taxa de conversão, CAC nem ROI de canal. É o pré-requisito para todo o resto.
*Como:* criar um helper `trackEvent(name, params)` e disparar em: `sign_up` (cadastro concluído), `cta_click` (botões "Criar conta"/hero), `newsletter_signup` (form da landing), `trip_created`, `affiliate_click` (ver Q3/#17), `begin_checkout` (quando Stripe entrar). Marcar `sign_up` e `trip_created` como conversões no GA4.

**Q3. Colocar afiliados nas páginas orgânicas + disclosure.**
*O quê:* usar `affiliates.ts` em `/roteiro/[cidade]` (Booking/Skyscanner/GetYourGuide com `buildUrl(dest.name)`), no fim de cada artigo do blog (Wise/Seguros Promo/Skyscanner conforme o tema) e em `/tips`.
*Por quê:* essas são as páginas feitas para captar orgânico — e são exatamente as que hoje citam parceiros sem monetizar. Maior alavanca de receita de curto prazo do produto.
*Como:* componente `<AffiliateCard>` reutilizável; todo link externo de afiliado com `rel="sponsored nofollow noopener"` e `target="_blank"`; disparar `affiliate_click` (partner, contexto) no GA4 (#17). Adicionar aviso de transparência ("Podemos receber comissão…") no rodapé das páginas com afiliados.

**Q4. Adicionar `og:image`.**
*O quê:* nenhuma rota define `openGraph.images`. O card do Twitter é `summary_large_image`, mas não há imagem.
*Por quê:* links compartilhados (WhatsApp, Instagram, X) aparecem sem imagem → CTR de compartilhamento muito menor. Correção de minutos, ganho recorrente.
*Como:* usar `opengraph-image.tsx` (Next 15) na raiz e por template de `/roteiro` e `/blog` (imagem dinâmica com destino/título). No mínimo, um OG estático global em `layout.tsx`.

### Curto prazo — 30 dias (P1)

- **C1. Escalar a rede `/roteiro` de 4 para 20-40 cidades** e criar o padrão "quantos dias em [cidade]" / "roteiro [cidade] [N] dias". Concorrentes citados na pesquisa (Visit a City, viagemspot, RotaSEO) dominam justamente essas queries de cauda longa. O template já existe (`Record<string, DestinationData>`); é trabalho de conteúdo, não de engenharia. Priorizar destinos BR de brasileiro (Portugal inteiro, Paris, Roma, NY, Orlando, Santiago, Cancún, Bariloche, Nordeste BR).
- **C2. Habilitar Stripe no premium** (#9). Hoje "Assinar Premium" é `alert()`. Enquanto não converte, todo esforço de aquisição só alimenta o free. Definir preço final (R$19,90/mês, R$159/ano já está na página) e ligar checkout + `begin_checkout`/`purchase` no GA4.
- **C3. Unificar fonte de verdade do conteúdo** (#8): mover os artigos para um único módulo (`src/lib/blog-data.ts`) consumido por listagem, `[slug]` e sitemap. Elimina a classe de bug do Q1 de vez.
- **C4. Schema estruturado extra** (#10, #11): `FAQPage` na `/pricing` (a FAQ já existe em texto) e nas cidades; `BreadcrumbList` em blog e roteiro; `dateModified` + `image` no `Article`. Ajuda ranking e elegibilidade a rich results / citações de IA.
- **C5. Abrir canal Pinterest** (#12): 42,2M de usuários no Brasil, plataforma que **não penaliza links de saída** e é a principal fonte de tráfego de blogs de viagem (benchmark 2026). As páginas `/roteiro/[cidade]` são pin-perfeitas (vertical, "Roteiro Lisboa 7 dias"). ROI de tráfego orgânico social muito acima de Instagram para este nicho.
- **C6. Liberar `/tips` no robots** (#13) se o conteúdo for público — hoje está em `disallow`, desperdiçando um ativo de conteúdo indexável.

### Médio prazo — 60-90 dias (P2/estratégico)

- **M1. SEO internacional de verdade** (#7): migrar o seletor de idioma client-side para rotas localizadas (`/`, `/en`, `/es`) com `alternates.languages` (hreflang). Hoje o Google só enxerga PT; EN/ES existem no bundle mas não são indexáveis. Destrava mercados LATAM/global que o produto já suporta na UI.
- **M2. GEO/AEO** (#16): estruturar artigos e cidades com blocos de pergunta-resposta explícitos ("Precisa de visto para o Japão?", "Quantos dias em Lisboa?"), listas e tabelas de custo — o formato que ChatGPT/Perplexity/AI Overviews citam. Com 900M+ de usuários semanais no ChatGPT (fev/2026), ser citado vira canal de aquisição próprio.
- **M3. Sequência de e-mail / CRM** (#15): onboarding pós-cadastro (dia 0 boas-vindas, dia 2 "crie sua 1ª viagem", dia 5 dica + afiliado, dia 7 premium), nurture da newsletter, double opt-in. **[medir deliverability/open rate no Resend]**
- **M4. Prova social real** (#14): substituir depoimentos genéricos por reais (com permissão) e trocar o fallback fake de números por um estado honesto quando a base ainda é pequena ("Novo — seja um dos primeiros"). Credibilidade > vaidade.
- **M5. Programa de indicação** já existe base (`/api/referral`, backoffice/referrals) — ativar loop viral com incentivo (ex.: meses de premium por indicação convertida) e medir no GA4.

---

## 5. Métricas para acompanhar (KPIs)

| KPI | Como medir | Meta inicial |
|-----|-----------|--------------|
| Tráfego orgânico (sessões) | GA4 + GSC | Baseline → +20%/trimestre |
| Impressões/CTR por query | GSC (Performance) | Subir CTR médio; achar queries "roteiro/quantos dias" |
| Páginas indexadas vs enviadas | GSC (Cobertura) | 100% do sitemap indexado, 0 erros (validar após Q1) |
| Funil: visita→cadastro | GA4 evento `sign_up` / sessões | Estabelecer baseline (hoje = 0, sem evento) |
| Ativação: cadastro→viagem criada | GA4 `trip_created` | > 40% em 7 dias |
| Cadastro→premium | GA4 `purchase` (após Stripe) | Estabelecer baseline |
| Cliques em afiliado + receita/parceiro | GA4 `affiliate_click` + painéis dos parceiros | Estabelecer baseline |
| Newsletter: captura e open rate | GA4 `newsletter_signup` + Resend | Open > 35%, crescimento de lista |
| Tráfego Pinterest | GA4 (source/medium) | Primeiro tráfego em 60 dias |
| Core Web Vitals | GSC + PageSpeed | LCP < 2,5s, INP < 200ms **[medir ao vivo]** |

---

## 6. Dados que preciso da próxima vez (para aprofundar)

Assim que o site voltar e os acessos forem liberados:

1. **GSC (Search Console):** relatório de Performance (queries, impressões, CTR, posição — 16 meses); Cobertura/Indexação (confirmar os 404 do Q1 e o total indexado); Core Web Vitals; Sitemaps enviados vs lidos.
2. **GA4:** fontes de tráfego (source/medium), páginas de entrada/saída, engajamento, e — quando os eventos do Q2 estiverem no ar — o funil completo com taxas de conversão por etapa e por canal.
3. **Resend:** tamanho da lista de newsletter, taxa de entrega, open/click, bounces, reputação de domínio (SPF/DKIM/DMARC).
4. **Painéis de afiliados** (Booking, Skyscanner, Wise, Nomad, GetYourGuide, Seguros Promo etc.): cliques, conversões e comissão por parceiro — para saber onde concentrar posicionamento.
5. **Instagram insights** (@roteiroapp): alcance, seguidores, posts que mais levam ao site.
6. **Stripe** (após ligar): MRR, churn, LTV, conversão de checkout.
7. **Confirmação do incidente DNS/SSL resolvido** — nada de SEO avança com o site fora do ar; a prioridade zero absoluta é o site voltar e o Google recrawlear.

---

### Fontes da pesquisa de mercado
- [11 melhores aplicativos para planejar viagem em 2026 — Seguros Promo](https://www.segurospromo.com.br/blog/confira-alguns-dos-aplicativos-de-viagem/)
- [Wanderlog — Trip Planner](https://wanderlog.com/)
- [Melhores apps para planejar viagens 2026 — Embale Para Viagem](https://www.embaleparaviagem.com.br/blog/melhores-aplicativos-para-planejar-viagens/)
- [Roteiros Turísticos Brasil 2026 — viagemspot](https://viagemspot.com/roteiros-turisticos-no-brasil/)
- [RotaSEO — SEO para blogs de viagem](https://rotaseo.com.br/)
- [Mastering Generative Engine Optimization in 2026 — Search Engine Land](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142)
- [GEO 2026 — como ser citado por ChatGPT/AI Overviews — TechTimes](https://www.techtimes.com/articles/318359/20260614/generative-engine-optimization-geo-2026-how-get-your-content-cited-chatgpt-ai-overviews.htm)
- [Pinterest para tráfego de blog de viagem — Travelpayouts](https://www.travelpayouts.com/blog/pinterest-for-getting-traffic/)
- [42 estatísticas de Pinterest 2026 — Hootsuite](https://blog.hootsuite.com/pinterest-statistics/)
