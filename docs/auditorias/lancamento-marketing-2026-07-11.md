# Plano de Divulgação do LANÇAMENTO — RoteiroApp
> Nova (marketing) · 2026-07-11 · baseado em leitura do código em produção (não em suposições de produto)

---

## 1. Resumo executivo

O produto está mais pronto do que a **máquina de monetização e de medição**. Stripe live funciona (`src/app/api/stripe/checkout/route.ts`), a landing já tem planos/FAQ/CTA (correções da auditoria de 10/07 aplicadas), e há base de SEO (14 cidades em `/roteiro`, 12 artigos, sitemap, JSON-LD). Mas: **dos 4 limites do plano grátis anunciados em `/pricing`, só 1 é aplicado** (viagens=3, em `src/app/api/trips/route.ts:37`); atividades/rotas/experiências são ilimitadas de fato, e o "Exportar PDF" vendido como Premium é o `window.print()` liberado para todos (`src/app/(app)/trips/[id]/summary/page.tsx:291`). Ou seja: **hoje ninguém tem motivo racional para pagar** — e ainda há risco de CDC (vender feature que o grátis já entrega).

As 3 alavancas agora, nesta ordem:
1. **Fechar o funil de dinheiro antes de trazer tráfego** (gating real + paywall contextual + trial de 7 dias + oferta de fundador). Trazer 1.000 visitas para um funil furado é queimar o único tiro de novidade.
2. **Instrumentar o funil no GA4** (falta `paywall_view`, `checkout_started`, `purchase` com valor, `activity_added`, `login`, UTM padronizado). Sem isso você não saberá qual canal vale a pena e vai decidir no achismo.
3. **Lançar em dois tempos**: **Lançamento 1 = Web (agora, ~27/07)** com comunidades + SEO + Pinterest; **Lançamento 2 = App nas lojas** (quando as contas saírem) usando a waitlist + Product Hunt. Não gaste as duas cartas no mesmo dia.

Janela de tempo: SEO leva 3-6 meses para maturar. Publicando conteúdo **agora**, você colhe o pico de planejamento de **férias de dezembro/janeiro** (maior sazonalidade do viajante BR). Atrasar 2 meses = perder o pico.

---

## 2. Pontos fortes (não regredir)

- **Stripe live testado** com cobrança real; portal do cliente (`/api/stripe/portal`) e webhook funcionando. Poucos indies chegam aqui.
- **Landing madura**: planos na página, FAQ, i18n PT/EN/ES (`src/lib/landing-i18n.ts`), CTA rastreado por posição (`cta_click`), waitlist do app.
- **Base de SEO real**: `sitemap.ts` com 12 posts + 14 cidades, `robots.ts`, JSON-LD de Organization/WebSite (`src/app/layout.tsx`) e Article no blog, OG image.
- **Ponte web→app já construída antes do app existir**: `/app`, `AppBanner`, smart banner iOS condicionado ao `SITE_CONFIG.app.iosAppId`. É só preencher a config no dia.
- **Afiliados instrumentados** (`affiliate_click` com partner+destino) e blocos contextuais nas páginas de destino.
- **Legal/LGPD em ordem** (privacidade, termos, consentimento de cookies, export/exclusão) — pré-requisito para loja e para anúncio pago.
- **Referral existe** (`/api/referral`, código único, contador no perfil).

---

## 3. Problemas & oportunidades priorizados

| # | Item | Área | Impacto | Esforço | Prioridade |
|---|------|------|---------|---------|------------|
| 1 | **Limites do grátis não aplicados**: só `trips` é checado. Atividades (20), rotas da comunidade (1), experiências (5) e sugestões de IA são ilimitadas na prática | Monetização | Alto | Médio | **P0 — antes de lançar** |
| 2 | **"Exportar PDF" vendido como Premium já é grátis** (`window.print()` no summary) — sem valor exclusivo + risco CDC | Monetização/Legal | Alto | Baixo | **P0 — antes** |
| 3 | **Zero paywall contextual**: o 403 `PLAN_LIMIT` volta como texto; nenhuma tela oferece upgrade no momento da dor. Único caminho: badge na sidebar e link no perfil | Conversão | Alto | Médio | **P0 — antes** |
| 4 | **Sem evento `purchase`/`checkout_started` no GA4** — receita não é atribuível a canal; `success_url` (`/dashboard?upgrade=success`) não dispara nada | Analytics | Alto | Baixo | **P0 — antes** |
| 5 | **Waitlist do app e newsletter no mesmo balde** (`NewsletterSubscriber` não tem `source`; `/api/newsletter` grava tudo igual) — não dá para segmentar o e-mail de lançamento | CRM | Alto | Baixo | **P0 — antes** |
| 6 | **Nenhum e-mail de ciclo de vida** — Resend só envia OTP/reset/verificação (`src/lib/email.ts`). Sem boas-vindas, sem nurture, sem broadcast de lançamento | CRM | Alto | Médio | **P0/P1** |
| 7 | **Sem trial e sem oferta de lançamento** — preço cheio para um app sem marca conhecida | Conversão | Alto | Baixo | **P0 — antes** |
| 8 | **`/roteiro` com só 14 cidades e sem JSON-LD/canonical** — é o ativo de aquisição mais barato e está subexplorado | SEO | Alto | Médio | P1 |
| 9 | **Referral sem recompensa** — código existe, prêmio não. Sem incentivo, ninguém compartilha | Aquisição | Médio | Baixo | P1 |
| 10 | **Zero prova social pública** (0 reviews, 0 depoimentos reais, sem números) — mata conversão de quem nunca ouviu falar | Conversão | Alto | Médio | P1 (coletar desde o dia 1) |
| 11 | **Pinterest inexistente** — canal de maior ROI orgânico para viagem BR, com 12 posts + 14 cidades prontos para virar 60-100 pins | Aquisição | Alto | Médio | P1 |
| 12 | **INPI pendente** — investir em marketing de marca sem a marca protegida | Marca/Risco | Médio | Baixo | P1 |
| 13 | **`robots.ts` bloqueia `/tips` e `/routes/`** — conteúdo de comunidade fora do índice | SEO | Baixo | Baixo | P2 |
| 14 | **Sem hreflang** apesar de PT/EN/ES na landing (i18n é client-side, então o Google só vê PT) | SEO i18n | Baixo | Alto | P3 (não é prioridade: foco é BR) |
| 15 | **ASO não preparado** (textos, screenshots de loja, Data Safety/Privacy Labels) | ASO | Alto (no L2) | Médio | P1 (preparar já) |

---

## 4. Plano de lançamento (sequência executável)

**Premissa de datas:** D0 (lançamento público da web) = **segunda, 27/07/2026**. O lançamento do app é um **segundo evento**, quando as contas Apple/Google saírem.

### FASE 0 — Pré-lançamento (D-14 a D-1) — "consertar o funil e carregar a arma"

**Semana 1 (13 a 19/07) — produto/monetização (nada disso é marketing, mas sem isso o marketing vaza)**
1. **Aplicar os limites do grátis** nas rotas: `activities` (20/viagem), `community-routes` (1), `experiences` (5), `activities/suggest` (3 sugestões de IA/mês). Mesmo padrão do `/api/trips`.
2. **Paywall contextual** (componente único `UpgradeDialog`, aberto no 403 `PLAN_LIMIT`): título = a dor ("Você chegou a 3 viagens"), 3 bullets do que destrava, preço **anual em destaque** + "7 dias grátis", botão → `/api/stripe/checkout`. Disparar `paywall_view {gate}` ao abrir.
3. **Diferenciar Premium de verdade** — escolher 3 destas e travar: (a) **PDF/exportação de roteiro** real (gerado, com capa e offline) e limitar o `window.print()` do grátis, ou remover a promessa de PDF do `/pricing`; (b) **sugestões de IA ilimitadas** (grátis: 3/mês); (c) **membros na viagem** (grátis: 1 acompanhante; Premium: ilimitado); (d) **anexos/documentos** (grátis: 5 arquivos).
4. **Trial de 7 dias** no Stripe (`trial_period_days: 7`) + **cupom FUNDADOR**: primeiros 100 assinantes → **R$ 99 no primeiro ano** (renova a R$159). Urgência real, receita já.
5. **GA4**: adicionar `checkout_started`, `purchase` (valor, no `?upgrade=success` + confirmação server-side via webhook), `paywall_view`, `activity_added`, `login`, `referral_share`, `newsletter_subscribe {source}`. Marcar `sign_up`, `trip_created`, `purchase` como conversões.
6. **Segmentar a waitlist**: campo `source` em `NewsletterSubscriber` (`app_waitlist` | `newsletter` | `blog`) — sem isso o e-mail do Lançamento 2 vai para a lista errada.

**Semana 2 (20 a 26/07) — munição de marketing**
7. **E-mails (Resend)**: (a) boas-vindas no cadastro (1 e-mail: "crie sua primeira viagem" + link direto); (b) D+3 sem viagem criada → "3 roteiros prontos para copiar"; (c) broadcast de lançamento pronto para a waitlist. Domínio já verificado.
8. **Conteúdo de largada**: 6 novas páginas `/roteiro` (Buenos Aires e Lisboa já existem — priorize **Santiago, Bariloche, Punta Cana, Fernando de Noronha, Gramado, Porto Seguro/Maceió**, alto volume BR) + 3 artigos de cauda longa com intenção de planejamento: "**quantos dias em [Paris/Lisboa/NY]**", "**quanto custa viajar para [destino] em 2026**", "**roteiro de [destino] em 7 dias**". Cada um com CTA para criar a viagem já pré-preenchida.
9. **Pinterest**: criar conta business, **verificar o domínio** (habilita rich pins), 5 boards ("Roteiros prontos", "Lista de malas", "Viagem barata", "Europa", "Brasil"), **40 pins verticais 1000x1500** reaproveitando os 12 posts + 14 cidades. Agendar 3-5 pins/dia.
10. **Prova social — pré-coleta**: convidar 10-15 pessoas (amigos, testers, Instagram) para usar a semana toda **antes** do D0 e pedir 1 frase + nome + foto. Sem depoimento real, a landing não converte frio.
11. **Comunidades — aquecer, não spammar**: entrar **agora** em r/BrasildoB? não — use: **r/viagens, r/turismobrasil, r/brasilivre (off-topic)**, fórum **Mochileiros.com**, 5-8 grupos de Facebook ("Mochileiros pelo mundo", "Brasileiros em Portugal", "Viagem em família"), 2-3 comunidades no Discord/Telegram de viagem. Regra: **10 respostas úteis antes de 1 menção ao app**. Poste roteiros reais e útil; o link vem no fim.
12. **Kit de lançamento**: 1 vídeo de 40s (gravação de tela: destino → roteiro pronto → gastos), 5 stories, 1 carrossel "5 apps de viagem vs 1", print do app funcionando offline. Instagram é vitrine, não canal de aquisição frio.
13. **INPI**: protocolar a marca (Classe 42, ~R$355). Antes de gastar em divulgação.

### D0 — Dia do lançamento (segunda-feira, 27/07 — 9h)

Ordem no dia (tudo com UTM):
1. **07h** — checar Stripe live, cadastro, criação de viagem, checkout com cupom. Um smoke test manual completo.
2. **09h** — **e-mail para a lista** (newsletter + waitlist): "O RoteiroApp abriu — e os 100 primeiros pagam R$99/ano". Link com `?utm_source=email&utm_campaign=launch`.
3. **10h** — **Instagram** (feed + stories + reels) e status no WhatsApp/rede pessoal. Pedir compartilhamento explícito.
4. **11h-16h** — **comunidades, uma por vez** (não copiar/colar o mesmo texto): post no Mochileiros.com contando a história ("fiz um planejador porque planilha não dava conta — está aberto, quero feedback"), depois Reddit, depois 2 grupos de Facebook por dia (não todos no mesmo dia — evita ban).
5. **Tarde** — cadastrar em diretórios (backlinks + tráfego de cauda): **AlternativeTo** (alternativa a Wanderlog/TripIt), **Capterra/GetApp BR**, **Product Hunt (agende p/ o Lançamento 2 do app)**, **BetaList**, **Toolify/There's An AI For That** (usa IA de sugestão), **SaaSHub**.
6. **Noite** — responder 100% dos comentários. A primeira impressão de suporte vira review depois.
7. **Não faça:** anúncio pago no D0. Espere o funil ter dados.

### D+1 a D+30 — Pós-lançamento ("transformar tráfego em hábito e em receita")

- **Semana 1:** falar com **todos** os 30-50 primeiros cadastros (e-mail pessoal: "o que quase te fez desistir?"). Corrigir os 3 atritos mais citados. Ativar pedido de depoimento para quem criou viagem com 5+ atividades.
- **Semana 2:** ligar o **referral com recompensa** (indicou 3 → 1 mês Premium; quem entra ganha 14 dias). Já existe o código; falta o prêmio e o botão de compartilhar.
- **Semana 2-4:** ritmo de conteúdo **2 artigos + 4 cidades/semana** (não negociável — é o motor de CAC zero). Pinterest 3-5 pins/dia.
- **Semana 3:** primeiros **micro-influenciadores** (10-50k, nicho: mochilão, viagem em família, casal viajante). Oferta: Premium vitalício + **cupom com o nome dele** (rastreável) + comissão de afiliado. Barter primeiro; só pague quem provar conversão.
- **Semana 4:** ler o funil no GA4 e decidir sobre **tráfego pago** (ver §5). Só entre se `visita→cadastro ≥ 5%` e `cadastro→premium ≥ 2%`.

### Lançamento 2 — App nas lojas (quando as contas saírem)

Ordem: **beta fechado (TestFlight/Internal, 1-2 semanas)** → **soft launch** (publicar, sem alarde, corrigir crash/ASO) → **evento de lançamento**: e-mail para a waitlist segmentada + **Product Hunt** (terça/quarta, 00:01 PT) + Instagram + banner na web (`SITE_CONFIG.app.*` — já pronto, é só preencher) + pedido de review in-app nos usuários web ativos (eles instalam e avaliam no dia 1, o que puxa o ranking).

---

## 5. Canais priorizados (custo × retorno para MEI com caixa curto)

| # | Canal | Custo | Prazo p/ retorno | Retorno esperado | Veredito |
|---|-------|-------|------------------|------------------|----------|
| 1 | **SEO programático `/roteiro` + blog de cauda longa** | R$0 (seu tempo) | 3-6 meses | Maior; tráfego composto e comprador (intenção de planejar) | **Motor principal. 60% do esforço.** |
| 2 | **Comunidades (Mochileiros.com, Reddit, grupos FB, Discord)** | R$0 | Imediato | Primeiros 100-300 usuários e feedback qualitativo | **Motor do D0.** Exige mão, não escala. |
| 3 | **Pinterest** | R$0 | 1-3 meses | Alto p/ viagem BR; pin dura meses/anos; público planejando | **Melhor ROI subexplorado.** |
| 4 | **E-mail (waitlist/newsletter/nurture)** | ~R$0 (Resend free) | Imediato | Maior taxa de conversão de todas, mas depende do tamanho da lista | **Fazer. Barato demais para ignorar.** |
| 5 | **Micro-influenciadores (barter + cupom)** | R$0-500 | 2-6 semanas | Médio-alto, com prova social reaproveitável | Fazer a partir da semana 3. |
| 6 | **Instagram/TikTok/Reels orgânico** | R$0 | 3-6 meses | Baixo no frio (conta nova), alto como prova social e retenção | Manter em 2-3 posts/semana. **Não é canal de aquisição inicial.** |
| 7 | **Afiliados de viagem (Booking, GYG, Wise, Airalo)** | R$0 | Imediato (com tráfego) | Monetiza o tráfego de SEO que não vira Premium | **Ligar os IDs no `.env` já** — hoje os links caem no fallback genérico e você não ganha nada. |
| 8 | **Product Hunt / diretórios** | R$0 | 1 dia + backlinks | Baixo em usuários BR; bom para DR/SEO e selo | Guardar o PH para o **app**. Diretórios: fazer no D0. |
| 9 | **Google Ads (search)** | R$1-3/clique | Imediato | **Negativo hoje**: com CVR 6% (visita→cadastro) e 2,5% (cadastro→Premium), o CAC de um assinante fica em **~R$700-2.000** vs LTV R$159-320/ano. *(estimativa, marcar como suposição até ter dados reais)* | **Não entrar agora.** Reavaliar quando `purchase` estiver medido e o trial subir a conversão. |
| 10 | **Meta Ads** | R$0,50-1,50/clique | Imediato | Intenção fria; bom só para retargeting de quem visitou `/pricing` | Só retargeting, e só depois do pixel + volume. |

---

## 6. ASO — preparar desde já (para o Lançamento 2)

**Nome (Apple, 30 chars):** `RoteiroApp: Planejar Viagem` (27)
**Título (Google Play, 30 chars):** `RoteiroApp – Planejar Viagem` (28) — o campo do Play indexa; use a keyword principal.
**Subtítulo (Apple, 30 chars):** `Roteiro, gastos, mala e docs` (28) — indexado, **não repita palavras do nome**.
**Descrição curta (Play, 80 chars):** `Monte o roteiro dia a dia, controle gastos, mala e documentos. Grátis.` (69)

**Keywords iOS (100 chars, sem espaços, sem repetir nome/subtítulo, sem plurais):**
`viagem,planejador,itinerario,mochilao,turismo,ferias,orcamento,checklist,passagem,destino,offline`

**Descrição longa — estrutura (os 3 primeiros renglones são o que aparece sem "leia mais"):**
1. Frase 1 = keyword + benefício: "Planeje sua viagem inteira num lugar só: roteiro dia a dia, orçamento, mala, documentos e câmbio."
2. Diferencial BR: "Feito para brasileiros — em reais, com câmbio, seguro e documentos que você realmente precisa."
3. Blocos com emoji: ROTEIRO / GASTOS EM GRUPO / MALA / DOCUMENTOS OFFLINE / DIÁRIO / COMUNIDADE.
4. Prova social (só quando tiver: nº de viagens criadas, nota).
5. Premium: o que destrava + preço + "cancele quando quiser".
6. Links: privacidade, termos, suporte.

**Screenshots (os 2 primeiros decidem 80% da instalação):**
1. Roteiro dia a dia — legenda "Sua viagem inteira, dia a dia"
2. Gastos + divisão em grupo — "Quem pagou o quê (sem briga)"
3. Mala inteligente — "A mala pronta antes de você lembrar"
4. Documentos offline — "Passaporte e reservas sem internet"
5. Roteiros da comunidade — "Copie roteiros de quem já foi"
6. Premium/mapa — CTA
Formato: legenda grande em PT no topo, device frame, fundo da marca (#1A5FCC). Localizar PT/EN/ES. Já há material em `public/screenshots/`.

**Categoria:** Viagem (primária) · Estilo de vida (secundária).
**Preparar já:** ícone 1024×1024, promo text iOS (170 chars, editável sem review), **Data Safety (Play)** e **Privacy Labels (Apple)** — declare: e-mail, nome, conteúdo do usuário, identificadores/GA4; a `/privacy` já cobre.
**Reviews:** pedir in-app **depois de valor entregue** (ex.: ao concluir uma viagem ou ao adicionar a 10ª atividade) — nunca no onboarding. Meta: 4,6+. Responder 100% em 48h.
**No dia da publicação:** preencher `SITE_CONFIG.app.android/ios/iosAppId` — o smart banner e a `/app` já estão codados e passam a funcionar sozinhos.

---

## 7. Conversão free → Premium (sem irritar)

**Diagnóstico:** o grátis hoje entrega ~100% do valor (limites não aplicados + PDF liberado). O problema não é "pedir upgrade demais", é **não existir motivo para pagar**.

**Princípio:** o paywall só aparece **depois** de o usuário já ter recebido valor, e sempre **no momento da dor**, não antes.

**Os 5 momentos certos (e só eles):**
| Momento | Gate | Copy |
|---|---|---|
| Criar a **4ª viagem** | `trips=3` (já existe no backend) | "Você já planejou 3 viagens com a gente. A 4ª (e todas as outras) no Premium." |
| **21ª atividade** na viagem | `activitiesPerTrip=20` (implementar) | "Sua viagem passou de 20 atividades — isso é roteiro de gente grande." |
| **Exportar PDF** do roteiro | Premium (implementar de verdade) | "Leve o roteiro impresso/offline: exporte em PDF." |
| **4ª sugestão de IA no mês** | 3/mês no grátis (implementar) | "Suas 3 sugestões do mês acabaram." |
| **Convidar o 2º membro** | 1 acompanhante no grátis | "Viagem em grupo grande é Premium." |

**Mecânicas de conversão (implementar antes de lançar):**
- **Trial de 7 dias** no checkout (`trial_period_days: 7`) — o usuário já bateu no limite, o trial remove o atrito da decisão; conversão pós-trial em SaaS consumer costuma superar o upgrade direto.
- **Ancoragem anual** já está boa (-33%). Deixar o **anual pré-selecionado** também no paywall.
- **Oferta de fundador** (primeiros 100): R$99 no 1º ano, com contador real na `/pricing` ("37 das 100 vagas"). Urgência verdadeira, não fabricada.
- **Sinal de valor consumido** no app: barra discreta "14/20 atividades · 2/3 viagens" no dashboard. Educa sobre o limite **antes** de bater nele (evita a sensação de emboscada).
- **Downgrade suave:** ao cancelar, oferecer o anual com desconto (dunning) — Stripe portal já existe.
- **E-mail:** D+7 de quem tem 2 viagens criadas → "você está a 1 viagem do limite"; D+2 do fim do trial → "seu trial acaba em 2 dias".

**O que NÃO fazer:** interstitial ao abrir o app; bloquear feature já usada (mudar as regras para quem já criou 30 atividades — dê grandfathering); pop-up de upgrade antes da 1ª viagem criada.

---

## 8. Métricas — do dia 1

**North star:** *viagens ativadas por semana* = viagens criadas com ≥5 atividades. É o que prediz retenção e pagamento.

**Funil (GA4 → marcar como conversões):**
| Etapa | Evento | Meta inicial |
|---|---|---|
| Visita → cadastro | `sign_up` / sessões | 4-8% |
| Cadastro → viagem criada | `trip_created` | >60% |
| Viagem → ativada (5+ atividades) | `activity_added` (contar) | >40% |
| Ativado → viu paywall | `paywall_view {gate}` | medir |
| Paywall → checkout | `checkout_started` | >15% |
| Checkout → pago | `purchase {value, plan}` | >50% |
| Assinantes / usuários ativos | (Stripe) | 2-4% |

**Eventos GA4 que faltam** (hoje só existem `sign_up`, `trip_created`, `upgrade_click`, `cta_click`, `affiliate_click`, `app_notify`, `app_install_click`):
`login`, `activity_added`, `expense_added`, `packing_used`, `ai_suggest_used`, `pdf_export`, `trip_shared`, `member_invited`, `paywall_view {gate}`, `checkout_started {plan}`, `purchase {value, currency, plan}`, `subscription_cancelled`, `newsletter_subscribe {source}`, `referral_share`.
Além disso: **UTM em 100% dos links** (`utm_source/medium/campaign`), GA4 ↔ Search Console linkados, e `purchase` confirmado server-side (Measurement Protocol no webhook) — evento client-side sozinho perde ~20-30%.

**Outros KPIs:** MRR, churn mensal, ARPU, conversão do trial, retenção W1/W4, CAC por canal (quando houver pago), RPM de afiliados (receita por 1.000 visitas em `/roteiro` e `/blog`), impressões/cliques/posição no GSC por página de destino, taxa de resposta a reviews (loja).

---

## 9. Erros comuns que afundam lançamento de app de viagem (e o antídoto aqui)

1. **Trazer tráfego para um funil que não cobra.** É o seu risco #1 hoje. Antídoto: §4 Fase 0, semana 1.
2. **Gastar a novidade num "big bang" só.** Você tem dois eventos (web e app) — separe-os. Antídoto: Lançamento 1 e 2.
3. **Ignorar que o viajante viaja 1-2x/ano.** Sem uso entre viagens, a retenção morre e o assinante cancela. Antídoto: diário + comunidade + conteúdo por e-mail + "planeje a próxima" + câmbio/wishlist. Meça retenção W4, não só D1.
4. **Instagram como plano de aquisição.** Conta nova sem alcance = 0 usuários. Antídoto: comunidades + SEO fazem o volume; o IG faz prova social.
5. **Spam em grupo/Reddit no dia do lançamento** → ban e reputação queimada. Antídoto: 2 semanas de contribuição real antes; história pessoal, não press release.
6. **Comprar tráfego antes de medir ativação.** CAC estimado hoje (R$700-2.000/assinante) inviabiliza o pago. Antídoto: só depois de `purchase` medido.
7. **Prometer no `/pricing` o que o produto não entrega** (PDF). Antídoto: entregar ou remover — hoje é também exposição no CDC.
8. **Pedir review na hora errada** (onboarding) → nota 3,x que trava o ASO para sempre. Antídoto: pedir após valor entregue.
9. **Lançar sem marca protegida** (INPI pendente): quanto mais sucesso, maior o risco. Antídoto: protocolar antes do D0.
10. **Não segmentar a waitlist** — o e-mail mais valioso que você tem (pessoas que pediram para ser avisadas do app) hoje está misturado com a newsletter.
11. **Não capturar depoimento no pico de felicidade** (viagem concluída) → landing sem prova social eterna.

---

## 10. Fazer ANTES de lançar vs DEPOIS

**Antes (bloqueante):** limites aplicados (1) · PDF resolvido (2) · paywall contextual + trial + cupom fundador (3,7) · eventos GA4 de receita (4) · `source` na waitlist (5) · e-mail de boas-vindas + broadcast (6) · IDs de afiliado ligados · INPI protocolado · 5-10 depoimentos reais coletados.

**Depois (30-90d):** escalar `/roteiro` (14→60) · JSON-LD/FAQ nas páginas de destino · Pinterest em escala · referral com prêmio · influenciadores · reviews/prova social pública · ASO/lojas · teste de R$300 em Google Ads (só com o funil medido) · hreflang/SEO EN-ES.

---

## 11. Dados que preciso da próxima vez

1. **GA4** (últimos 30d): sessões por landing page, `sign_up`, `trip_created`, `upgrade_click`; fontes de tráfego.
2. **Search Console**: consultas, cliques, impressões, posição média — em especial por `/roteiro/*` e `/blog/*`.
3. **Stripe**: nº de assinantes, mensal vs anual, churn, MRR.
4. **Banco**: nº de usuários, % com ≥1 viagem, atividades médias por viagem, nº de e-mails na newsletter/waitlist.
5. **Afiliados**: os IDs (`NEXT_PUBLIC_*_REF`) estão setados em produção? Houve alguma comissão?
6. **Instagram**: seguidores, alcance médio, taxa de clique no link.
7. Status das contas Apple/Google (para acionar o plano do Lançamento 2).

> Suposições marcadas: estimativas de CPC/CVR/CAC (§5) e metas de funil (§8) são *benchmarks* de SaaS consumer/viagem, não dados do RoteiroApp — substituir pelos números reais assim que os eventos estiverem no ar.
