# Auditoria de Marketing & Conversão — LANDING PAGE (RoteiroApp)

**Data:** 2026-07-10
**Analista:** Nova (estrategista de marketing digital)
**Escopo:** rota `/` (`src/app/page.tsx` + `src/components/landing/landing-client.tsx` + `src/lib/landing-i18n.ts`), `/pricing` (`src/app/pricing/page.tsx`), metadata/OG (`src/app/layout.tsx`), config (`src/lib/site-config.ts`).
**Objetivo de negócio:** maximizar **cadastros (teste grátis)** e **upgrades para Premium**.

---

## 1. Resumo executivo

A landing é visualmente forte e a copy do herói é boa (dor + promessa clara, tom BR, `landing-i18n.ts`). Mas ela está **desenhada para um produto 100% gratuito** — não para um freemium com Premium. **Não existe uma única seção de planos, menção a preço, ao Premium ou link para `/pricing`** em toda a página (`landing-client.tsx` nav, footer e seções). Ou seja: metade do objetivo de negócio (upgrade) **não tem superfície nenhuma** na vitrine principal. A `/pricing` existe e é boa, mas é uma ilha órfã sem tráfego de entrada.

As 3 alavancas mais importantes agora:
1. **Adicionar seção de planos (Free vs Premium) na landing** + link "Planos" no nav e footer → cria o caminho para o upgrade, hoje inexistente.
2. **Trocar a única seção-âncora de prova social** (depoimentos com nomes inventados — risco legal/credibilidade) por prova verificável e adicionar sinais de confiança (números reais, segurança, garantia).
3. **CTA único e coerente ao rolar** com ancoragem de valor Premium — hoje todos os CTAs empurram só para `/register`, sem nenhuma menção ao que o upgrade entrega.

---

## 2. Pontos fortes (não regredir)

- **Herói com fórmula dor→solução** funcionando: badge "100% gratuito · sem cartão" + headline "Chega de aba esquecida e planilha que ninguém entende" + subhead com benefício claro ("gastar mais tempo viajando e menos planejando"). `landing-i18n.ts:9-16`.
- **Trust bar no herói** já existe: "Sem cartão · Cancele quando quiser · Dados protegidos (LGPD)" (`hero.trust`).
- **Seção de dor com before/after** (`pain.cards`) é ótima para conversão — 27 abas → tudo num lugar.
- **i18n PT/EN/ES completo e consistente** na landing (raro e bem feito).
- **Benefício > feature** já aplicado nas seções de feature (ex.: "Num calendário que você consegue enxergar" em vez de "calendário").
- **`/pricing` bem construída**: toggle mensal/anual, "-33%", "MAIS POPULAR", "Economize R$80", FAQ com objeções (cancelar, dados, pagamento). Está subutilizada.
- **Metadata/OG técnica sólida** (`layout.tsx`): title/description/OG/Twitter/JSON-LD Organization+WebSite, canonical, keywords BR.
- **Mobile:** CTAs full-width empilhados (`flex-col sm:flex-row`), `viewportFit: cover`, imagens `loading=lazy`.

---

## 3. Problemas & oportunidades priorizados

| # | Item | Área | Impacto | Esforço | Prioridade |
|---|------|------|---------|---------|------------|
| 1 | **Nenhuma seção de planos na landing** — Free vs Premium ausente; sem ancoragem, sem gatilho de upgrade | Pricing/Conversão | Alto | Médio | **P0** |
| 2 | **Nenhum link para `/pricing`** no nav nem footer — página de planos órfã | Conversão/Navegação | Alto | Baixo | **P0** |
| 3 | **Depoimentos com nomes/pessoas inventadas** (`testimonials.items`) — risco de credibilidade e legal | Prova social | Alto | Baixo | **P0** |
| 4 | **CTAs não mencionam valor** — todos vão a `/register` com "Criar conta grátis"; zero caminho para o valor Premium | CTA/Conversão | Alto | Baixo | **P1** |
| 5 | **Sem FAQ na landing** (só em `/pricing`) — objeções não são respondidas onde a decisão acontece | Objeções | Médio | Baixo | **P1** |
| 6 | **Sem CTA fixo/sticky no mobile** — usuário rola features longas sem botão ao alcance do polegar | Mobile/Conversão | Médio | Baixo | **P1** |
| 7 | **Stat "para sempre grátis / R$ 0"** posiciona contra o Premium — reforça que não precisa pagar | Mensagem | Médio | Baixo | **P1** |
| 8 | **Newsletter compete com o CTA final** — logo abaixo do CTA de conversão, dispersa a ação | Estrutura | Médio | Baixo | **P2** |
| 9 | **Fallback de stats fixo "15.000+"** aparece se DB=0 — número inflado/falso mina confiança | Prova social | Médio | Baixo | **P1** |
| 10 | **Sem sinais de segurança/garantia visuais** (selo Stripe, LGPD com ícone, "7 dias grátis"/reembolso) | Confiança | Médio | Baixo | **P2** |
| 11 | **OG/title não comunica gratuidade nem diferencial BR** — "Planejador de Viagens" genérico vs Wanderlog/TripIt | SEO/Share | Médio | Baixo | **P2** |
| 12 | **Herói: sem prova social imediata** abaixo do CTA (avatares/nota/"+X viajantes") | Prova social | Médio | Baixo | **P2** |
| 13 | **`/pricing` fora do visual da landing** (fundo branco vs dark) — quebra de marca no momento da compra | Marca | Baixo | Médio | **P3** |
| 14 | **Sem seção "Como funciona" em 3 passos** — reduz fricção de "vai dar trabalho?" | Estrutura | Médio | Médio | **P2** |

---

## 4. Plano de ação

### Quick wins (esta semana)

- **[#2] Adicionar "Planos" ao nav e footer** (`landing-client.tsx` linhas 179-183 e `footer.links` em `landing-i18n.ts`). 15 min. Cria a porta de entrada para `/pricing`.
- **[#4] Reescrever CTAs** com valor (ver textos prontos na seção final). Trocar "Criar conta grátis" → manter no herói, mas o CTA final e a nova seção de planos devem oferecer os dois caminhos: "Começar grátis" + "Ver Premium".
- **[#3] Corrigir depoimentos:** ou marcar como ilustrativos, ou substituir por 3 reais (peça a beta users/Instagram). Enquanto não houver reais, trocar por prova neutra: "150+ moedas", "28 guias", "PT/EN/ES", "LGPD". Remove risco imediato.
- **[#9] Remover fallback inflado:** se `stats.trips === 0`, esconder o número ou mostrar prova qualitativa em vez de "15.000+". `landing-client.tsx:156-160`.
- **[#12] Micro-prova no herói:** abaixo do CTA, linha com 3-4 avatares + "★★★★★ viajantes já organizam com o RoteiroApp".
- **[#6] CTA sticky mobile:** barra fixa inferior (`fixed bottom-0`, respeitando `safe-area-inset`) com "Começar grátis" que aparece após rolar o herói.

### Curto prazo (30 dias)

- **[#1] Seção de planos na landing** (dark, coerente com a marca) entre features e CTA final: dois cards Free vs Premium com toggle mensal/anual, "MAIS POPULAR", "Economize R$80", gatilho de valor ("Viagens ilimitadas · PDF · Sem limites"). Reaproveitar os arrays `FREE_FEATURES`/`PREMIUM_FEATURES` de `pricing/page.tsx` (extrair para `src/lib/plans.ts` como fonte única).
- **[#5] FAQ na landing** (4-6 perguntas) reaproveitando as de `/pricing` + acrescentar "Preciso pagar para usar?" e "Funciona offline?".
- **[#7] Reposicionar o stat "grátis":** trocar "para sempre grátis / R$ 0" por métrica que não anule o Premium — ex.: "moedas suportadas", "guias publicados", "idiomas". Deixe a gratuidade no badge do herói, não como número-âncora.
- **[#14] Seção "Como funciona em 3 passos"** (Crie a viagem → Adicione voos/hotéis/atividades → Viaje com tudo na mão) antes dos planos.
- **[#10] Faixa de confiança:** selo "Pagamento seguro via Stripe", ícone LGPD, "Cancele quando quiser", "Seus dados são seus (exportação em 1 clique)".

### Médio prazo (60-90 dias)

- **[#13] Repaginar `/pricing` no tema dark** da landing para continuidade de marca no checkout; ou embutir a decisão de plano num modal a partir da landing.
- **Teste A/B do herói** (headline dor vs headline aspiracional) e da posição da seção de planos (antes vs depois das features) via GA4 + eventos.
- **Prova social escalável:** coletar depoimentos reais via e-mail pós-viagem/pós-1ª viagem criada; exibir foto real + destino + link.
- **[#11] OG dedicado por idioma** e title com gancho ("Planeje viagens sem 27 abas — grátis").
- **Garantia/gatilho de upgrade:** testar "7 dias de Premium grátis ao criar a 1ª viagem" (trial) para acostumar ao valor antes do paywall.

---

## 5. Estrutura proposta (seção a seção)

Ordem ideal, orientada a conversão (cadastro + upgrade):

1. **Nav** — Logo · [Planos] · [Recursos] · Idioma · **Entrar** · **Começar grátis** (adicionar "Planos").
2. **Herói** — badge gratuidade + headline dor + subhead benefício + **CTA duplo** (primário "Começar grátis", secundário "Ver planos") + trust bar + **micro-prova** (avatares/nota) + screenshot.
3. **Faixa de números reais** (sem fallback inflado) — moedas, guias, idiomas, viagens (quando houver volume).
4. **Dor (before/after)** — manter, é forte.
5. **Como funciona em 3 passos** (NOVO) — reduz fricção percebida.
6. **Benefícios/Features** — manter as 4 (hospedagem, câmbio, dicas, diário), mas encurtar 1 (a página está longa). Um bullet de cada deve sinalizar o que é Premium ("ilimitado no Premium").
7. **Prova social** — depoimentos reais OU prova neutra verificável; nota + destino.
8. **Planos (NOVO — Free vs Premium)** — cards com ancoragem, toggle anual (-33%), "MAIS POPULAR", "Economize R$80", gatilho de valor. É a peça que hoje não existe.
9. **FAQ (NOVO)** — objeções: preciso pagar? cancelar? dados? offline? pagamento?
10. **CTA final** — foco único, sem newsletter competindo. Dois caminhos (grátis / Premium).
11. **Newsletter** — mover para o footer, discreta (não competir com o CTA).
12. **Footer** — adicionar "Planos".

---

## 6. Copy pronta (colar)

### Herói — opção A (dor, recomendada para BR, mantém a linha atual)
- **Headline:** `Sua viagem inteira organizada. Sem 27 abas, sem planilha que ninguém entende.`
- **Subheadline:** `Itinerário, hospedagem, gastos, malas, documentos e roteiros prontos — tudo num só app. Comece grátis, sem cartão, e gaste seu tempo viajando (não planejando).`
- **CTA primário:** `Começar grátis`
- **CTA secundário:** `Ver planos e Premium`
- **Micro-prova (abaixo dos CTAs):** `★★★★★ Viajantes já planejam com o RoteiroApp — PT · EN · ES`

### Herói — opção B (aspiracional, para teste A/B)
- **Headline:** `Da ideia ao embarque, com tudo no lugar certo.`
- **Subheadline:** `O planejador de viagens que junta roteiro, orçamento, hospedagem e documentos num app só. Grátis para começar.`

### Seção de planos
- **Título:** `Comece grátis. Vá além quando a viagem crescer.`
- **Subtítulo:** `O plano gratuito planeja sua próxima viagem inteira. O Premium tira todos os limites.`
- **Card Free — headline de valor:** `Grátis para sempre · Até 3 viagens`
- **Card Premium — headline de valor:** `Sem limites · R$13,25/mês (anual) · Economize R$80`
- **CTA Free:** `Começar grátis`
- **CTA Premium:** `Assinar Premium` (secundário na mesma seção: `Ver tudo que vem no Premium`)
- **Gatilho de valor Premium (bullets curtos):** `Viagens e atividades ilimitadas · Roteiro em PDF · Roteiros da comunidade sem limite · Suporte prioritário`

### CTA final
- **Título:** `Sua próxima viagem começa aqui.`
- **Subtítulo:** `Crie sua conta em menos de 1 minuto. Sem cartão, sem complicação. Quando precisar de mais, o Premium está a um clique.`
- **CTA primário:** `Começar grátis agora`
- **CTA secundário:** `Comparar planos`
- **Fine print:** `Sem cartão de crédito · Cancele quando quiser · LGPD · Pagamento seguro via Stripe`

### FAQ (landing)
- **Preciso pagar para usar?** Não. O plano gratuito planeja uma viagem inteira: itinerário, gastos, malas, documentos e diário. O Premium remove limites.
- **Posso cancelar quando quiser?** Sim, a qualquer momento pelo app. Você mantém o Premium até o fim do período pago.
- **Meus dados ficam salvos se eu cancelar?** Sim. Suas viagens são preservadas; você volta aos limites do plano gratuito.
- **Funciona offline?** Sim — o app guarda seus dados em cache para acessar em viagem, mesmo sem internet.
- **Como pago?** Cartão, PIX e boleto (em breve), com processamento seguro via Stripe.

### Metadata/OG (SEO/share)
- **Title:** `RoteiroApp — Planeje viagens sem 27 abas | Grátis`
- **Description:** `Roteiro, orçamento, hospedagem, malas e documentos num app só. Grátis para começar, sem cartão. Feito para brasileiros. PT/EN/ES.`

---

## 7. Métricas para acompanhar (KPIs + como medir)

| KPI | Como medir | Meta inicial |
|-----|-----------|--------------|
| Taxa visita → cadastro | GA4: sessões `/` → evento `sign_up` (já há `trackEvent`) | baseline → +20% |
| Cliques no CTA do herói | Evento GA4 `cta_click` (adicionar em `landing-client.tsx`) por posição | medir |
| Visita landing → visita `/pricing` | GA4 path/eventos | criar (hoje ~0, sem link) |
| `/pricing` → `upgrade_click` | Já existe `trackEvent("upgrade_click")` em `pricing/page.tsx:36` | baseline |
| Upgrade → checkout Stripe iniciado/concluído | evento no retorno do `/api/stripe/checkout` | criar |
| Scroll depth até a seção de planos | GA4 scroll/section view | >40% |
| CTR CTA sticky mobile | evento dedicado | medir |
| Bounce do herói (mobile vs desktop) | GA4 engagement | reduzir |

Instrumentação faltando: eventos `cta_click` (com `location`), `plan_view`, `pricing_toggle`, `faq_open` na landing.

---

## 8. Dados que preciso da próxima vez (para aprofundar)

- **GA4:** taxa de conversão atual visita→cadastro, top páginas de saída, scroll depth na `/`, share desktop/mobile, principais fontes de tráfego.
- **Search Console:** queries que já trazem a home, CTR, posição média, impressões PT vs EN/ES.
- **Números reais do produto:** total de usuários, viagens criadas, % que cria a 1ª viagem, % que atinge algum limite do Free (3 viagens / 20 atividades) — para calibrar o gatilho de upgrade.
- **Stripe:** se já há assinantes, ticket, churn, mensal vs anual.
- **Depoimentos reais:** 3-6 usuários dispostos a aparecer (nome, destino, foto).
- **CAC/canais:** de onde vem o tráfego hoje (orgânico/Instagram/direto) para adequar a copy da landing por origem.

**Suposições (não confirmadas):** volume de usuários provavelmente baixo (fallback de stats sugere DB pequeno); Stripe ainda não plenamente ativo (checkout tem fallback "Pagamentos chegando em breve"). Confirmar antes de destacar números.
