# RoteiroApp Mobile — Plano completo (web → app instalável)

> **Objetivo:** transformar o RoteiroApp num aplicativo instalável (Google Play + App Store), otimizado para **celulares e tablets**, **reusando 100%** do que já foi construído. A **versão web continua** funcionando normalmente — a base de código é a mesma.
>
> **Status do documento:** plano vivo. Marcar `[x]` conforme concluir. Criado em 2026-07-08.

---

## 1. Estratégia e decisão arquitetural

### 1.1 Por que Capacitor (e não React Native)
O app já é um Next.js 15 completo e responsivo. Reescrever em React Native jogaria fora meses de trabalho. **Capacitor** (da Ionic) embrulha o app web num shell nativo (iOS/Android), dá acesso a APIs nativas (câmera, push, biometria, arquivos) e publica nas lojas — **mantendo uma única base de código**. É exatamente o "aproveitar tudo que já temos".

### 1.2 O ponto arquitetural decisivo
O app é **server-rendered**: `output: "standalone"`, server components, Prisma direto, rotas `/api`, várias páginas `force-dynamic`. **Não dá pra fazer `output: export` (estático) sem refatoração pesada.** Logo, duas opções:

| Modelo | Como funciona | Prós | Contras |
|---|---|---|---|
| **A. WebView remoto (hosted)** ✅ *recomendado p/ MVP* | `capacitor.config.server.url = https://roteiroapp.com`; o app nativo carrega o site hospedado + injeta plugins nativos | Reuso total, zero refatoração, deploy web = deploy app, sessão NextAuth é first-party (cookies funcionam) | Precisa de rede no cold start; offline exige camada de cache extra; Apple exige valor nativo real (ver 1.3) |
| **B. Shell estático + API remota** | Bundle de um front client-only embarcado, chamando `/api` remoto | Melhor offline/startup | Exige remover server components, auth por token, refatoração grande |

**Decisão:** começar com **Modelo A** (MVP, reuso máximo) e, com o app hardenizado como PWA robusto (Fase 1), adicionar camada offline (Fase 4). Migrar para B só se necessário no futuro.

### 1.3 Requisito Apple (guideline 4.2 — "minimum functionality")
A Apple rejeita "site embrulhado" sem valor nativo. Nós **passamos** entregando recursos nativos genuínos e úteis pra viagem: **push notifications**, **câmera** (foto de passaporte/reserva/ingresso), **acesso offline** às reservas, **login por biometria**, **notificações locais** (contagem pra viagem, lembretes) e **deep links**. Esses recursos são a Fase 4.

### 1.4 Princípios
- **Reuso primeiro** — nada de reescrever telas que já funcionam; só ajustar pra toque/tablet.
- **Web nunca quebra** — todo ajuste é progressive enhancement; `Capacitor.isNativePlatform()` gateia comportamento nativo.
- **Offline-first no que importa** — reservas, documentos, ingressos e itinerário acessíveis sem internet.
- **Tablet não é celular esticado** — usar a largura extra (master-detail, duas colunas).

---

## 2. Pré-requisitos (contas, ferramentas, custos)

- [ ] **Conta Apple Developer** — US$99/ano (obrigatória p/ App Store e TestFlight)
- [ ] **Conta Google Play Console** — US$25 (pagamento único)
- [ ] **Mac para build iOS** ⚠️ **bloqueador real** — Xcode só roda em macOS. Opções: Mac físico, Mac na nuvem (MacStadium), ou CI (Codemagic / Ionic Appflow / GitHub Actions macOS runner). Android pode ser feito no Windows atual (Android Studio).
- [ ] **Android Studio** (Windows) — SDK, emuladores, assinatura
- [ ] **Xcode** (no Mac) — simuladores iOS, assinatura, upload
- [ ] Definir **Bundle ID / Application ID**: sugerido `com.roteiroapp.app`
- [ ] Definir **nome de exibição**, esquema de **versionamento** (semver + build number) e **política de release** (fases)
- [ ] **Cloudinary** (upload de fotos) — já está no CSP/`images`; usar o free tier
- [ ] **Firebase project** (push via FCM p/ Android; APNs p/ iOS) — free tier

**Custo mínimo de entrada:** ~US$124 (Apple $99 + Google $25) + eventual Mac/cloud.

---

## 3. Fases e tarefas (início → fim)

### Fase 0 — Fundação do projeto
- [ ] Criar branch `mobile-app` e este doc como fonte de verdade
- [ ] Decidir Mac (físico vs. cloud CI) — destrava iOS
- [ ] Criar contas Apple/Google e configurar times/certificados
- [ ] Definir Bundle ID, nome, ícone base e paleta (já temos `#1A5FCC` / `#0E1520`)

### Fase 1 — Hardening PWA (base mobile; beneficia web **e** app)
> Tudo aqui melhora a web também e é pré-requisito do Capacitor.
- [ ] **`viewport` export** em `src/app/layout.tsx` (Next 15 `export const viewport`): `viewportFit: "cover"`, `themeColor`, `initialScale: 1`, `maximumScale` adequado
- [ ] **Safe areas**: utilitários Tailwind ou CSS `env(safe-area-inset-*)`; aplicar no top bar (`app-shell.tsx`) e no FAB do dashboard (hoje `fixed bottom-6` colide com o home indicator)
- [ ] **Ícones raster**: gerar PNG 192/512 + `maskable` + set iOS/Android (hoje o manifest é só SVG). Ferramenta: `@capacitor/assets` ou `pwa-asset-generator`
- [ ] **Service worker de verdade**: substituir `public/sw.js` manual por **Serwist** ou `@ducanh2912/next-pwa` (Workbox) com estratégias por rota (network-first p/ navegação, stale-while-revalidate p/ dados). **Gatear registro quando rodando em Capacitor**
- [ ] **Manifest polish**: `screenshots` (usar os PNGs de `public/screenshots/`), `categories`, `id`, ícones raster
- [ ] **Reconciliar CSP** (`next.config.mjs`): liberar em `connect-src` — `open.er-api.com`, `nominatim.openstreetmap.org`, `api.open-meteo.com`; em `img-src` — `*.tile.openstreetmap.org`, `cdnjs.cloudflare.com`. **Alternativa melhor:** criar proxies server-side (como já existe `api/exchange-rate`) p/ câmbio/geocode/clima e manter a CSP fechada
- [ ] Auditar **Lighthouse PWA** (instalável, offline shell, performance mobile)

### Fase 2 — UX mobile/tablet (o "feel" de app)
- [ ] **Bottom navigation bar** (mobile): barra fixa inferior com 4-5 destinos principais (Dashboard, Viagens, Rotas, Perfil) — padrão nativo; sidebar/drawer continua p/ o resto
- [ ] **Navegação da viagem** (`trip-tabs.tsx`, 13 abas em scroll horizontal): redesenhar p/ mobile — segmented control + "mais" em bottom sheet, ou dropdown de seções
- [ ] **Pass de toque**: trocar ações só-hover (editar/excluir em notificações, orçamento, documentos) por sempre-visíveis ou **swipe actions**
- [ ] **Alvos de toque** ≥ 44px; espaçamentos e fontes p/ leitura ao sol/mão
- [ ] **Tablet (layouts dedicados)**: master-detail (lista de viagens à esquerda, detalhe à direita), duas colunas onde couber, aproveitar landscape
- [ ] **Redesenho de telas apertadas no celular**:
  - [ ] `accommodation` — grid de calendário 7 colunas → visão empilhada/semana rolável
  - [ ] `compare` — tabelas largas → cards comparativos empilhados
- [ ] **Drag-and-drop touch-friendly**: substituir HTML5 DnD (reordenar destinos em `trips/new`, itinerário) por **dnd-kit** (funciona em toque/WebView)
- [ ] **Pull-to-refresh** nas listas (dashboard, viagens)
- [ ] **Transições/gestos** e microanimações (já temos `tailwindcss-animate` e skeletons)
- [ ] **Teclado**: ajustar scroll/inputs p/ não cobrir campos (será reforçado com `@capacitor/keyboard`)

### Fase 3 — Integração Capacitor (o embrulho nativo)
- [ ] `npm i @capacitor/core @capacitor/cli` + `npx cap init` (nome, Bundle ID)
- [ ] Adicionar plataformas: `npx cap add ios` e `npx cap add android`
- [ ] `capacitor.config.ts`: `server.url = https://roteiroapp.com` (Modelo A), `allowNavigation`, esquema HTTPS
- [ ] **Splash screen** (`@capacitor/splash-screen`) + **ícones nativos** (via `@capacitor/assets`)
- [ ] **Status bar** (`@capacitor/status-bar`): cor/estilo combinando com o tema escuro
- [ ] **App plugin** (`@capacitor/app`): botão voltar Android, estado de app, deep links
- [ ] **Network** (`@capacitor/network`): detectar online/offline → banner offline
- [ ] **Keyboard** (`@capacitor/keyboard`): resize/scroll de inputs
- [ ] Gatear o `sw.js`/comportamentos web sob `Capacitor.isNativePlatform()`
- [ ] Rodar em simulador iOS e emulador Android; primeiro "hello native"

### Fase 4 — Recursos nativos (valor real + aprovação Apple)
- [ ] **Câmera/galeria** (`@capacitor/camera`): tirar foto de documento/reserva/ingresso e avatar
  - [ ] **Backend novo**: endpoint de **upload** + storage no **Cloudinary**; trocar campos `url` de Documentos/Avatar por upload real (mantendo URL como fallback)
- [ ] **Offline data layer** (crítico p/ viagem): **persistir cache do React Query** (já instalado) + guardar dados essenciais (reservas, documentos, ingressos, itinerário) em `@capacitor/preferences` ou SQLite → acessível **sem internet**
- [ ] **Push notifications** (`@capacitor/push-notifications` + FCM/APNs): lembretes de viagem, alerta no dia do voo, check-in
  - [ ] **Backend novo**: modelo Prisma `DeviceToken`, endpoint de registro, serviço de envio disparado por eventos/cron
- [ ] **Notificações locais** (`@capacitor/local-notifications`): contagem regressiva, lembretes offline
- [ ] **Compartilhar nativo** (`@capacitor/share`): substituir/complementar o `clipboard` no compartilhamento de roteiros
- [ ] **Login por biometria** (Face ID/digital): desbloqueio rápido guardando token em secure storage
- [ ] **Geolocalização** (`@capacitor/geolocation`): "onde estou" no mapa; atualizar `Permissions-Policy` (hoje bloqueia geolocation)
- [ ] **Haptics** e polimentos nativos
- [ ] **Sessão no WebView**: como carregamos `roteiroapp.com` first-party, os cookies NextAuth funcionam; adicionar ponte de token p/ plugins/offline e persistência + biometria

### Fase 5 — Ajustes de backend/infra
- [ ] Endpoint de **upload** (Cloudinary) + validação/limite de tamanho
- [ ] **Push service**: chave FCM/APNs, modelo `DeviceToken`, envio em eventos (viagem chegando, documento vencendo)
- [ ] **CSP/headers** compatíveis com origens do WebView; `frame-ancestors`/`X-Frame-Options` revisados
- [ ] **Deep links**: servir `.well-known/apple-app-site-association` e `assetlinks.json` a partir do site (associação de domínio)
- [ ] Considerar **versão de API** / resposta amigável a app antigo

### Fase 6 — Identidade visual do app
- [ ] **Ícone do app**: adaptive icon (Android) + todos os tamanhos iOS
- [ ] **Splash screens** (todas as densidades)
- [ ] **Screenshots de loja**: celular + tablet, por idioma (PT/EN/ES)
- [ ] **Feature graphic** (Google), textos promocionais, ASO (palavras-chave)

### Fase 7 — QA e testes
- [ ] **Matriz de dispositivos**: iPhone pequeno (SE) + grande (Pro Max), iPad; Android pequeno/grande + tablet
- [ ] **Offline**: modo avião → abrir reservas/documentos/itinerário
- [ ] **Push**, **câmera**, **deep links**, **biometria** ponta a ponta
- [ ] **Auth OTP por e-mail** dentro do app (dependente do Resend — ver pendência de e-mail do incidente DNS)
- [ ] **Performance**: cold start, memória, jank
- [ ] **Acessibilidade**: alvos de toque, dynamic type, contraste
- [ ] **Beta**: TestFlight (iOS) + Google Play Internal Testing; convidar os testers que já deram feedback

### Fase 8 — Publicação nas lojas
- [ ] **Listagens** (PT/EN/ES): título, descrição, keywords, screenshots
- [ ] **Privacidade**: Apple Privacy Nutrition Labels + Google Data Safety; usar `/privacy` existente
- [ ] **Classificação etária** / content rating
- [ ] **Prep review Apple**: destacar recursos nativos (evita 4.2)
- [ ] **Submeter** iOS (App Store Connect) e Android (Play Console)
- [ ] Tratar rejeições e iterar
- [ ] **Rollout em fases** (staged rollout no Google; phased release na Apple)

### Fase 9 — Pós-lançamento e manutenção
- [ ] **OTA updates** (Capacitor Live Updates / Appflow / Capgo): publicar mudanças web sem review de loja
- [ ] **Monitoramento**: Sentry (já temos) + crashes nativos
- [ ] **Analytics do app**: GA4 (já temos) + eventos de app / Firebase
- [ ] **Cadência de updates**, changelog, resposta a avaliações, prompt de rating

---

## 4. MVP recomendado (o menor app publicável)
Pra lançar rápido e iterar, o **MVP** = **Fase 1** + parte essencial da **Fase 2** (bottom nav + safe areas + pass de toque) + **Fase 3** completa + de **Fase 4**: **offline cache**, **câmera/upload** e **push**. Isso já entrega valor nativo real (passa na Apple) e resolve a dor central: acompanhar a viagem na mão, inclusive offline. O resto (biometria, tablet master-detail, notificações locais avançadas) entra em updates.

**Ordem de execução:** Fase 0 → 1 → 2 → 3 → (4 essencial + 5) → 6 → 7 → 8 → 9.

---

## 5. Riscos e decisões pendentes
- ⚠️ **Mac obrigatório p/ iOS** — decidir físico vs. cloud CI antes da Fase 3
- ⚠️ **Apple 4.2** — mitigado pelos recursos nativos da Fase 4
- **Offline no Modelo A** — exige a camada de cache (Fase 4); é o item de maior esforço
- **E-mail (Resend)** — o login é OTP por e-mail; depende de repor os registros DNS de e-mail apagados no incidente do Cloudflare (ver `docs`/memória do incidente) antes do beta
- **Custos** — Apple $99/ano, Google $25, + Mac/cloud se necessário; Cloudinary/FCM no free tier

---

## 6. Referências rápidas do código atual (pontos de ataque)
- Layout raiz / metadata / SW register: `src/app/layout.tsx`
- Shell mobile (drawer/top bar): `src/components/layout/app-shell.tsx`, `sidebar.tsx`
- Abas da viagem: `src/components/trips/trip-tabs.tsx`
- Telas apertadas: `.../trips/[id]/accommodation/page.tsx` (grid 7 col), `.../compare/page.tsx` (tabelas)
- DnD HTML5: `.../trips/new/page.tsx` (e itinerário)
- Documentos/avatar (URL, virar upload): `.../documents/page.tsx`, `.../profile/page.tsx`
- Mapa/geocode/clima/câmbio (rede + CSP): `.../map-view.tsx`, `.../weather-widget.tsx`, `.../currency/page.tsx`, `api/exchange-rate/route.ts`
- Config: `next.config.mjs` (CSP, output standalone, images), `public/manifest.json`, `public/sw.js`, `tailwind.config.ts`
