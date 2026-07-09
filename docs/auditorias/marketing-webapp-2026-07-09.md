# Plano de Marketing — Estratégia Web + App Coexistindo

**Autora:** Nova (estrategista de marketing digital)
**Data:** 2026-07-09
**Escopo:** estratégia de crescimento com **web (roteiroapp.com) e app mobile (Capacitor) operando juntos** — web como topo de funil (SEO/descoberta/conversão) e app como camada de retenção/engajamento.
**Base:** código real do repositório (`layout.tsx`, `roteiro/[cidade]`, `native/`, `capacitor.config.ts`, `manifest.json`, `ga-tracker.tsx`), o plano mobile (`docs/mobile-app/PLANO.md`) e a auditoria anterior (`docs/auditorias/marketing-2026-07-08.md`). Complementa — não substitui — aquele documento.

> **Como ler:** este plano assume que os P0 da auditoria de 2026-07-08 (eventos GA4, afiliados no orgânico, 404 do blog, og:image) seguem valendo. Aqui o foco é a **arquitetura web+app** e o **funil entre as duas frentes**.

---

## 1. Resumo executivo

A decisão de manter **web e app** é a correta e o código já a sustenta: o Capacitor roda em **Modelo A (WebView remoto de roteiroapp.com)** — `capacitor.config.ts` aponta `server.url = https://roteiroapp.com`. Isso significa **uma única base de código, uma única superfície de conteúdo e um único deploy**. Não há custo de "manter dois produtos": há um produto com duas embalagens. A web resolve o problema de **aquisição barata** (SEO, blog, `/roteiro/[cidade]`, GSC, sitemap — ativos que um app-store-only nunca teria); o app resolve o problema de **retenção e uso durante a viagem** (push, offline, câmera) — exatamente onde a web é fraca.

As três alavancas mais importantes agora:

1. **Construir a ponte web→app que hoje não existe.** A landing (confirmado no crawl ao vivo) **não menciona o app**, não há `apple-itunes-app` smart banner, não há página `/app`. Todo o tráfego orgânico morre na web sem oferecer o próximo passo (instalar). Essa é a maior fuga de valor da estratégia dual.
2. **Instrumentar a coexistência.** O `native.ts` já detecta plataforma (`isNativeApp()`, `getNativePlatform()`), mas **nada disso vai para o GA4** — o `GATracker` só dispara pageview. Sem uma dimensão "plataforma" (web/ios/android) em cada evento, é impossível medir web→app conversion ou retenção por plataforma, que é o KPI central desta decisão.
3. **Tratar as lojas (ASO) como um canal novo, não como "publicar e pronto".** A presença na App Store/Play agrega **credibilidade e prova social** que a web sozinha não dá ("tem app oficial") e é um canal de busca próprio. Hoje o `manifest.json` tem `screenshots: []` — nem os ativos de loja estão prontos.

---

## 2. Por que web + app (e quando "só app" seria erro)

### 2.1 A defesa da decisão (growth)

**A web é o motor de aquisição de menor custo que o produto tem — e um app não herda isso.**
- O RoteiroApp já rankeia conteúdo de cauda longa via `/roteiro/[cidade]`, `/blog` (12 artigos) e tem GSC + sitemap. Esse é tráfego **incremental de custo ~zero** e **composto** (cresce com o tempo). Um app na loja **não aparece no Google** para "roteiro Lisboa 7 dias" — a descoberta de app depende de ASO (busca dentro da loja) e de paid, ambos mais caros e menos escaláveis para conteúdo informacional.
- **Benchmark de comportamento do nicho de viagem:** o usuário **pesquisa e planeja no desktop/web** (telas grandes, muitas abas, comparação de preços, copiar/colar) e **consome/usa na rua pelo celular** (durante a viagem). Forçar planejamento inicial dentro de um app é fricção. A web ganha o "planejamento", o app ganha a "viagem".

**O app é o motor de retenção que a web não consegue ser.**
- Web mobile **não tem push confiável** (iOS Safari é limitado e o usuário não "abre o site" espontaneamente), **não tem ícone na home com presença de marca**, **não funciona offline de forma robusta**, e **não acessa câmera/arquivos com boa UX**. O plano mobile (`PLANO.md` Fase 4) entrega justamente push, offline, câmera (foto de passaporte/reserva/ingresso) e biometria. Esses recursos criam o **hábito e a recorrência** — o ponto fraco de qualquer produto só-web.
- Retenção D30 típica de app instalado >> retenção de "voltar ao site". O ícone na tela inicial é grátis de marca, todo dia.

**O custo marginal de manter os dois é baixo — este é o argumento decisivo.**
- Modelo A (WebView remoto): `deploy web = deploy app` (o `PLANO.md` documenta isso). Uma correção de conteúdo, um novo artigo, um novo `/roteiro/[cidade]` aparece **simultaneamente** na web e dentro do app, sem review de loja. Não é "dobro de trabalho de produto"; é a **mesma superfície** com um envelope nativo por cima.

### 2.2 Divisão de papéis no funil

| Etapa | Frente | Papel |
|---|---|---|
| Descoberta | **Web** | SEO (`/roteiro`, `/blog`), Pinterest, social, AI Overviews |
| Consideração / 1º planejamento | **Web** | Landing, criar conta, criar 1ª viagem (desktop confortável) |
| Ativação profunda | **Web → App** | Momento de instalar: "sua viagem está próxima, leve na mão" |
| Uso durante a viagem | **App** | Offline, push, câmera, mapa, câmbio, check-in |
| Retenção / recompra (próxima viagem) | **App** | Push de reengajamento, ícone na home |
| Monetização (afiliados + premium) | **Ambos** | Web converte no desktop; app converte no contexto |

### 2.3 Quando "só app" seria um erro (e quando seria tentador)

**Seria erro agora** porque:
- Jogaria fora o ativo de SEO já construído (o canal mais barato).
- O público BR de viagem inclui muita gente que planeja no trabalho/notebook e não quer instalar nada para "só dar uma olhada". App-gating na descoberta = perda de topo de funil.
- Afiliados de viagem (Booking, Skyscanner) convertem muito bem em **desktop na fase de pesquisa** — fechar isso num app reduz receita.
- App-store-only significa **taxa da loja (15-30%)** no premium via Stripe/IAP e dependência do ranking de loja para crescer.

**"Só app" só faria sentido** se o produto virasse puramente utilitário-de-viagem-em-tempo-real (sem conteúdo de descoberta) — o que **não é o caso**, dado o investimento em blog e páginas programáticas. Portanto: **web+app é a leitura correta.**

---

## 3. Funil web → app (a ponte que falta) — maior alavanca

Hoje **não existe nenhum mecanismo** levando o visitante web ao app. Grep por `apple-itunes-app`/`smart-app-banner` retorna zero no `src/`. A landing não cita app. Prioridade máxima quando o app publicar (e parte já dá para preparar antes).

### 3.1 Smart App Banner (iOS) + banner Android — Quick win
- **O quê:** meta `apple-itunes-app` no `<head>` do `layout.tsx` (iOS Safari mostra faixa nativa "Ver no App Store") + um componente próprio de banner para Android/Chrome que aparece **só na web mobile** (usar `getNativePlatform() === "web"` + detecção de mobile; **nunca** mostrar dentro do próprio app, senão o WebView oferece instalar o app que já é).
- **Por quê:** captura a intenção no exato momento em que o usuário está no celular lendo um roteiro — maior taxa de instalação com esforço mínimo.
- **Como:** meta tag condicional; componente `<AppInstallBanner>` gateado por `isNativeApp() === false`. Disparar evento GA4 `app_banner_view` / `app_banner_click`.

### 3.2 Página `/app` dedicada — Quick win / Curto prazo
- **O quê:** landing de produto do app em `/app` (indexável), com os **diferenciais nativos** como argumento: **push** (lembretes de voo/check-in), **offline** (reservas e documentos sem internet), **câmera** (foto de passaporte/ingresso), **biometria**. Botões App Store + Google Play + QR code (para quem está no desktop escanear e instalar).
- **Por quê:** vira destino de CTA de todo o site e das lojas/social; capta busca por "roteiroapp app"; dá SEO próprio ("app planejar viagem", "aplicativo roteiro de viagem offline"). O desktop precisa de **QR code** porque não dá para "clicar e instalar" no notebook.
- **Como:** rota nova com metadata própria, JSON-LD `SoftwareApplication`, screenshots reais das lojas, `og:image`. Link no header/footer global e no fim de `/roteiro/[cidade]` e artigos.

### 3.3 CTAs de instalação nos momentos certos (contextuais) — Curto prazo
Não pedir instalação genérica; pedir **quando o valor nativo é óbvio**:
- **Viagem próxima:** quando a data de início de uma `Trip` está a < 14 dias, mostrar no dashboard/summary web um CTA "Leve seu roteiro na mão — instale o app para acesso offline e lembretes". Este é o gancho mais forte (offline + push valem exatamente na véspera/durante).
- **Após criar a 1ª viagem** (`trip_created`): "Pronto! Baixe o app para receber lembretes e acessar offline."
- **Ao adicionar documento/reserva:** "Tire foto do passaporte pelo app e tenha sempre à mão."
- **Por quê:** instalação com intenção alta converte e retém muito melhor que banner frio. Cada CTA amarra um recurso nativo a uma dor real.
- **Como:** componentes condicionais nas telas `(app)/trips/*`, gateados por `isNativeApp() === false` (não mostrar para quem já está no app). Evento `app_cta_click` com `context` (trip_soon / after_create / add_document).

### 3.4 Deep links (bidirecional) — Curto/Médio prazo
- **O quê:** Universal Links (iOS) + App Links (Android) servindo `.well-known/apple-app-site-association` e `assetlinks.json` a partir do site (já previsto no `PLANO.md` Fase 5). Assim um link `roteiroapp.com/trips/[id]` **abre no app se instalado**, senão na web.
- **Por quê:** e-mails, push, compartilhamento de roteiro e afiliados passam a rotear para o app quando ele existe — costura as duas frentes numa experiência só e aumenta sessões de app.
- **Como:** arquivos de associação + tratamento no `@capacitor/app` (o `native-bootstrap.tsx` já escuta o `App` plugin; adicionar listener de `appUrlOpen`).

### 3.5 Regra de ouro anti-fricção
- **Nunca** mostrar banner/CTA de instalar app **dentro do app** (`isNativeApp()` true) — bug clássico e irritante. Todo componente de aquisição-para-app deve ser gateado por `isNativeApp() === false`.

---

## 4. SEO (web) — sustenta a aquisição barata

A web é o que torna a operação inteira barata. Reforçar (muitos itens herdados da auditoria de 2026-07-08, mantidos por serem a fundação do modelo dual):

- **Escalar `/roteiro` de 4 para 20-40 cidades.** Confirmado no código: `DESTINATIONS` tem só **4 cidades** (Lisboa, Buenos Aires + 2). O template já suporta N cidades (`Record<string, DestinationData>` + `generateStaticParams`). É trabalho de conteúdo. Cada cidade nova = nova porta de entrada orgânica que depois empurra para o app. **Maior alavanca de topo de funil.**
- **Padrão de cauda longa "quantos dias em X" / "roteiro X N dias"** — queries que concorrentes (Wanderlog, viagemspot) dominam. Cada página deve terminar com CTA para `/app` e para criar conta.
- **`og:image`** (ainda ausente — `layout.tsx` não define `openGraph.images`): compartilhamento sem imagem mata CTR social, que é fonte de tráfego web. Usar `opengraph-image.tsx` dinâmico por cidade/artigo.
- **hreflang / i18n indexável (PT/EN/ES).** Hoje o idioma é client-side; Google só indexa PT. Rotas localizadas destravam LATAM — mercado que a UI já suporta. (Esforço alto, impacto alto; médio prazo.)
- **JSON-LD adicional:** `SoftwareApplication` na `/app` e `FAQPage`/`BreadcrumbList` onde couber — ajuda rich results e citação por IA, e o `SoftwareApplication` conecta o SEO à existência do app.
- **AI Overviews / GEO:** blocos pergunta-resposta ("Precisa de visto para X?", "Quantos dias em X?"). Ser citado por ChatGPT/Perplexity é canal de aquisição próprio que alimenta a web, que alimenta o app.

---

## 5. ASO (app) — canal novo, não afterthought

Publicar nas lojas agrega o que a web não dá: **credibilidade institucional** ("existe app oficial") e um **canal de busca próprio** (App Store/Play Search). Tratar como lançamento de canal.

- **Título + subtítulo (iOS) / título curto (Android):** carregar palavra-chave forte, não só marca. Ex.: **"RoteiroApp: Planejar Viagem"** / subtítulo "Roteiro, orçamento e malas offline". A busca de loja pesa muito o título.
- **Campo de keywords (iOS, 100 chars):** `roteiro,viagem,planejar,mala,orçamento,itinerário,câmbio,passaporte,offline,turismo` — sem repetir palavras do título, sem espaços perdidos. Pesquisar volume real com ferramenta de ASO antes de fixar.
- **Descrição:** primeiras 3 linhas (o que aparece sem "ver mais") vendem o valor nativo: offline, lembretes, tudo numa tela. Localizar PT/EN/ES (o `PLANO.md` Fase 6/8 já prevê screenshots e listagens por idioma).
- **Screenshots:** hoje `manifest.json` tem `screenshots: []` — **bloqueador de ASO**. Precisa de 5-8 screenshots com legendas de benefício ("Todas as reservas offline", "Lembrete no dia do voo", "Foto do passaporte sempre à mão"), não telas cruas. Celular + tablet.
- **Categoria:** Viagem (primária). `manifest.json` já declara `["travel","lifestyle","productivity"]` — coerente.
- **Reviews como prova social composta:** prompt de avaliação **no momento de sucesso** (ex.: ao concluir uma viagem / fechar o diário), nunca no onboarding. Responder avaliações. As notas da loja depois viram prova social **de volta na web** ("4,8★ na App Store" na landing e na `/app`).
- **Ficha de privacidade** (Apple Nutrition Labels / Google Data Safety) reaproveitando `/privacy` — requisito de publicação.

---

## 6. Retenção via app — o que só o app faz

Aqui está o ROI da decisão dual. A web trouxe o usuário barato; o app o mantém.

- **Push de ciclo de viagem** (o mais valioso): "Faltam 7 dias para [Lisboa]", "Check-in do voo abre em 24h", "Documento [visto] vence antes da viagem". Amarra ao dado que o app já tem (datas da `Trip`, documentos, transportes). Requer backend novo — modelo `DeviceToken` + serviço de envio por evento/cron (`PLANO.md` Fase 4/5).
- **Notificações locais offline** (`@capacitor/local-notifications`): contagem regressiva e lembretes que funcionam **sem rede** durante a viagem.
- **Offline real:** acessar reservas, documentos, ingressos e itinerário no modo avião. É o argumento nº1 de instalação e o que faz o usuário abrir o app **na rua** (onde a web falha). O `native-bootstrap.tsx` já tem detecção de rede (classe `is-offline`); falta a camada de cache de dados (`PLANO.md` Fase 4).
- **Câmera:** foto de passaporte/reserva/ingresso e avatar — cria dado que só o app captura confortavelmente, aumentando o valor de ter o app.
- **Reengajamento entre viagens:** push sazonal/segmentado ("Planejando as próximas férias? Veja roteiros de [destino]") para reativar — o loop de recompra que a web sozinha não dispara.
- **Biometria (Face ID/digital):** abertura rápida = mais sessões, menos fricção de login.

**Princípio:** cada push deve ser **útil e contextual** (baseado nos dados da viagem), nunca marketing genérico — senão vira desinstalação. Pedir permissão de push **depois** de criar a 1ª viagem, explicando o valor ("avisamos quando seu check-in abrir"), nunca no primeiro open.

---

## 7. Métricas para acompanhar a coexistência

O eixo novo é **medir por plataforma**. O `GATracker` atual só dispara `config`/pageview e **não carrega a plataforma**. Ação estruturante: adicionar `platform: getNativePlatform()` (web/ios/android) como **parâmetro em todos os eventos** e como user property no GA4.

### 7.1 O que instrumentar no GA4 (além de `sign_up`/`trip_created`/`newsletter` já previstos)

| Evento | Onde | Para quê |
|---|---|---|
| `platform` (param global em todo evento) | wrapper de `trackEvent` usando `getNativePlatform()` | Fatiar TUDO por web/ios/android |
| `app_banner_view` / `app_banner_click` | smart banner + `<AppInstallBanner>` | Eficácia da ponte web→app |
| `app_cta_click` (param `context`) | CTAs contextuais (viagem próxima etc.) | Qual gancho de instalação converte |
| `app_store_redirect` | clique nos botões App Store/Play em `/app` | Topo do funil de instalação |
| `push_permission` (granted/denied) | após 1ª viagem no app | Saúde do canal de retenção |
| `notification_open` (param tipo) | abertura via push/deep link | Retenção atribuível a push |
| `session_platform` (via user property) | bootstrap | DAU/WAU por plataforma |

### 7.2 KPIs da coexistência

| KPI | Como medir | Alvo inicial |
|---|---|---|
| **Web→App conversion** | usuários com `app_store_redirect` / usuários web mobile | estabelecer baseline; meta 3-6% dos web-mobile |
| **Instalações por fonte** | Play Console (referrer) + App Store Connect (source) + `app_cta_click.context` | ver se `trip_soon` supera banner frio |
| **Retenção D1/D7/D30 por plataforma** | GA4 fatiado por `platform` | app D30 deve superar web D30 (tese central) |
| **DAU/WAU por plataforma** | GA4 user property `platform` | web estável, app crescente |
| **Opt-in de push** | `push_permission` granted / prompts | > 50% |
| **Reativação por push** | `notification_open` → sessão → ação | atribuir % de sessões de app |
| **Avaliação nas lojas** | App Store / Play | manter ≥ 4,5★ |
| **% de viagens "usadas na viagem" no app** | sessões de app com data dentro do período da Trip | proxy do valor offline/push |
| Tráfego orgânico web (fundação) | GA4 + GSC | +20%/trimestre |

> Sem o parâmetro `platform` em cada evento, **nenhum** dos KPIs de coexistência é calculável. É o pré-requisito técnico deste plano.

---

## 8. Divisão de esforço / manutenção de marketing

Como é **uma base de código e uma superfície de conteúdo**, o esforço de marketing **não dobra**. Divisão sugerida do tempo de marketing:

- **~55% Web / topo de funil (aquisição barata e composta):** SEO de conteúdo (escalar `/roteiro`, blog, GEO), Pinterest, social, afiliados no orgânico. É o que alimenta as duas frentes — sem topo de funil, o app não tem quem instalar. **Prioridade de investimento contínuo.**
- **~25% Ponte web→app + retenção (o multiplicador):** manter e otimizar smart banner, `/app`, CTAs contextuais, sequências de push, deep links. Baixo esforço recorrente, alto impacto em LTV.
- **~20% ASO + lojas (canal novo, mais pesado no lançamento, depois manutenção):** keywords, screenshots por idioma, gestão de reviews, ficha de privacidade, iterar ranking. Concentra esforço no lançamento; depois é manutenção leve (responder reviews, atualizar screenshots por release).

**Regra operacional:** conteúdo se escreve **uma vez** e serve web e app (WebView). O trabalho "extra" do app é **canal** (lojas, push, ASO), não **conteúdo**. Isso mantém o custo marginal do app baixo — a razão de a estratégia dual fechar.

---

## 9. Plano de ação priorizado (Impacto × Esforço)

### Quick wins — esta semana / preparar antes do app publicar
| Item | Área | Impacto | Esforço |
|---|---|---|---|
| Adicionar `platform` (web/ios/android) como param global em todo evento GA4 (wrapper sobre `getNativePlatform()`) | Analytics | Alto | Baixo |
| Smart App Banner iOS (`apple-itunes-app`) + `<AppInstallBanner>` Android, gateado por `isNativeApp()===false` | Funil web→app | Alto | Baixo |
| Criar página `/app` (diferenciais nativos, botões de loja + QR, JSON-LD SoftwareApplication) | Funil / SEO | Alto | Médio |
| `og:image` global + por `/roteiro`/`/blog` | SEO/Social | Médio | Baixo |
| Preencher `manifest.json` `screenshots` e preparar ativos de loja | ASO | Médio | Médio |

### Curto prazo — 30 dias
| Item | Área | Impacto | Esforço |
|---|---|---|---|
| Escalar `/roteiro` para 20-40 cidades com CTA para `/app` no rodapé | SEO / Funil | Alto | Médio |
| CTAs de instalação contextuais (viagem < 14 dias, pós-`trip_created`, ao add documento) | Funil web→app | Alto | Médio |
| Instrumentar `app_banner_*`, `app_cta_click`, `app_store_redirect` | Analytics | Alto | Baixo |
| Definir título/subtítulo/keywords ASO (PT/EN/ES) com pesquisa de volume | ASO | Alto | Médio |
| Screenshots de loja com legendas de benefício (celular + tablet) | ASO | Alto | Médio |

### Médio prazo — 60-90 dias
| Item | Área | Impacto | Esforço |
|---|---|---|---|
| Push de ciclo de viagem (backend `DeviceToken` + envio por evento) | Retenção | Alto | Alto |
| Deep links (Universal/App Links) — roteamento web↔app | Funil / Retenção | Médio | Médio |
| Retenção D1/D7/D30 por plataforma no GA4 + dashboards | Analytics | Alto | Médio |
| hreflang / rotas i18n indexáveis (destrava LATAM) | SEO internacional | Alto | Alto |
| Prompt de avaliação no momento de sucesso + gestão de reviews | ASO / Prova social | Médio | Baixo |
| Reengajamento entre viagens (push sazonal segmentado) | Retenção | Médio | Médio |

---

## 10. Dados que preciso da próxima vez

1. **GA4 com `platform` já instrumentado:** funil e retenção fatiados por web/ios/android (hoje impossível).
2. **GSC:** queries e páginas de entrada (para saber quais `/roteiro`/artigos mais empurram para `/app`).
3. **App Store Connect + Play Console:** impressões, taxa de conversão da ficha, fonte de instalação, palavras-chave que trazem instalação, avaliações.
4. **Métricas de push (após backend):** opt-in %, open rate por tipo de notificação, desinstalação pós-push.
5. **Resend:** performance das sequências que empurram instalação do app.
6. **Painéis de afiliados por plataforma:** onde o afiliado converte melhor (desktop-web vs. app) para decidir posicionamento.
7. **Status do app nas lojas:** data de publicação, versão mínima, se deep links/associação de domínio estão no ar.

---

### Suposições (marcar como tais)
- Assumo que o app **ainda não está publicado** nas lojas (o `PLANO.md` está em fase de execução e `manifest.json` tem `screenshots: []`). ASO e métricas de loja são, portanto, **preparação**, não otimização de dados existentes.
- Assumo que os P0 da auditoria de 2026-07-08 (eventos GA4 base, afiliados no orgânico, 404 do blog) estão em andamento; este plano **depende** do tracking base existir.
- Números de conversão web→app (3-6%) são **faixas de benchmark de nicho**, não medição do produto — servem só para definir baseline inicial.
