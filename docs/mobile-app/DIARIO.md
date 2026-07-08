# 📓 DIÁRIO DE BORDO — RoteiroApp Mobile

> Registro **cronológico e auditável** de cada modificação do projeto mobile (do primeiro passo ao último).
> Ordem: do mais antigo (topo) ao mais recente (fim). Cada entrada segue o mesmo modelo.

**Modelo de entrada:**
```
## [AAAA-MM-DD] Fase X · Passo N — Título
- **Objetivo:** por que este passo existe
- **O que foi feito:** mudanças concretas
- **Arquivos:** lista de arquivos criados/alterados
- **Decisões/porquê:** escolhas técnicas e alternativas descartadas
- **Como validar:** como testar que funciona
- **Commit:** mensagem/identificador do commit
- **Status:** ✅ concluído / 🟡 em andamento
```

---

## [2026-07-08] Fase 0 · Passo 0 — Backup, isolamento e documentação
- **Objetivo:** proteger a versão web estável e isolar todo o trabalho mobile antes de mudar muita coisa; criar base documental auditável.
- **O que foi feito:**
  - Criada tag de backup `backup-pre-mobile-app-20260708` no commit `0383888` (versão web estável) — enviada também ao GitHub.
  - Criada branch de trabalho `mobile-app` a partir do `main` (que fica intocado).
  - Criada a estrutura de docs em `docs/mobile-app/`: `README.md`, `PLANO.md`, `PROGRESSO.md`, `DIARIO.md`, `REFERENCIAS.md`.
- **Arquivos:** `docs/mobile-app/README.md`, `PLANO.md` (movido de `docs/mobile-app-plan.md`), `PROGRESSO.md`, `DIARIO.md`, `REFERENCIAS.md`.
- **Decisões/porquê:** usar Git (tag + branch) como mecanismo de "backup" — é reversível, versionado e não duplica arquivos. Mantida a convenção de tag já usada no projeto (`backup-pre-*`).
- **Como validar:** `git tag` mostra a tag; `git branch --show-current` mostra `mobile-app`; `git checkout main` volta à web intacta.
- **Commit:** `chore(mobile): backup tag, branch isolada e estrutura de docs`
- **Status:** ✅ concluído

---

## [2026-07-08] Fase 1 · Passo 1 — Viewport (safe-area) + utilitários de área segura
- **Objetivo:** primeiro passo do Hardening PWA — preparar o app para telas com notch/ilha dinâmica/home indicator (essencial em celulares modernos e dentro do WebView nativo). Beneficia a web também.
- **O que foi feito:**
  - Adicionado `export const viewport` (Next 15) em `src/app/layout.tsx` com `viewportFit: "cover"`, `themeColor` e escala padrão (zoom mantido por acessibilidade).
  - Adicionados utilitários de **safe-area** em `src/app/globals.css` (`.pt-safe`, `.pb-safe`, `.pl-safe`, `.pr-safe`, `.px-safe`, `.min-h-screen-safe`) usando `env(safe-area-inset-*)`, com fallback `0px`.
- **Arquivos:** `src/app/layout.tsx`, `src/app/globals.css`.
- **Decisões/porquê:** `viewport-fit: cover` é o que "liga" os `env(safe-area-inset-*)`; sem ele os utilitários não teriam efeito. **Não** desativamos zoom (`maximum-scale`/`user-scalable`) — prejudica acessibilidade e é penalizado no Lighthouse/App Store. Utilitários em CSS puro (em vez de plugin Tailwind) para mudança mínima e sem novas dependências.
- **Como validar:** `npx tsc --noEmit` e `npm run build` sem erros; no DevTools (device com notch, ex. iPhone 14 Pro) a barra superior e o FAB não ficam sob a ilha dinâmica quando os utilitários forem aplicados (aplicação nos componentes é o Passo 2).
- **Commit:** `feat(mobile): viewport-fit cover + utilitários de safe-area (Fase 1.1)`
- **Status:** ✅ concluído

---

## [2026-07-08] Fase 1 · Passos 2–5 — Safe-area aplicada, ícones raster, CSP e gate do SW
- **Objetivo:** concluir o Hardening PWA — deixar o app instalável de verdade e compatível com o WebView nativo.
- **O que foi feito:**
  - **1.2** Safe-area aplicada: top bar mobile (`app-shell.tsx`) agora usa `min-h-[3.5rem] pt-safe` (cresce sob o notch sem espremer o conteúdo); FAB do dashboard usa `bottom-safe` (não colide com o home indicator).
  - **1.3** Ícones raster gerados a partir de `public/icon.svg` via `sharp` (`scripts/generate-icons.mjs`): `public/icons/icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `public/apple-touch-icon.png`. Manifest e `layout.tsx` atualizados para usar PNGs (lojas/iOS exigem raster). Adicionado `"id": "/"` no manifest.
  - **1.4** CSP reconciliada em `next.config.mjs`: `connect-src` liberou `open.er-api.com`, `nominatim.openstreetmap.org`, `api.open-meteo.com`; `img-src` liberou `*.tile.openstreetmap.org` e `cdnjs.cloudflare.com`. Conserta câmbio/mapa/clima também na web.
  - **1.5** Criado `src/lib/native.ts` (`isNativeApp`, `getNativePlatform`) sem depender do pacote em build-time; registro do service worker em `layout.tsx` agora é **pulado dentro do app nativo**.
- **Arquivos:** `src/components/layout/app-shell.tsx`, `src/app/(app)/dashboard/page.tsx`, `scripts/generate-icons.mjs`, `public/icons/*`, `public/apple-touch-icon.png`, `public/manifest.json`, `src/app/layout.tsx`, `next.config.mjs`, `src/lib/native.ts`, `package.json` (devDep `sharp`).
- **Decisões/porquê:** ícones gerados do SVG-fonte atual (o usuário pode trocar `public/icon.svg` por arte de alta resolução e rodar `node scripts/generate-icons.mjs` de novo). CSP: optou-se por liberar os domínios (mudança mínima, conserta a web) em vez de criar proxies agora. SW gateado via `window.Capacitor` — no modelo WebView remoto o bridge é injetado mesmo com conteúdo remoto.
- **Como validar:** `npx tsc --noEmit` → 0 erros. Instalar como PWA (Chrome → Instalar) deve usar ícone PNG; DevTools device com notch mostra barra/FAB fora das áreas seguras.
- **Commit:** `feat(mobile): safe-area aplicada, ícones raster, CSP e gate do SW (Fase 1.2–1.5)`
- **Status:** ✅ concluído — **Fase 1 concluída**

---

## [2026-07-08] Fase 3 · Capacitor — shell nativo Android + bootstrap
- **Objetivo:** transformar o projeto num app nativo de verdade (Android já scaffoldado; iOS depende de Mac).
- **O que foi feito:**
  - Instalados `@capacitor/core`, `@capacitor/cli` (dev), `@capacitor/android`, `@capacitor/ios` e plugins: `app`, `status-bar`, `splash-screen`, `keyboard`, `network`, `preferences`, `share`.
  - Criado `capacitor.config.ts` (Modelo A): `appId=com.roteiroapp.app`, `appName=RoteiroApp`, `server.url=https://roteiroapp.com`, `webDir=mobile/www`, config de SplashScreen/Keyboard/backgroundColor.
  - Criado fallback `mobile/www/index.html` (tela de abertura/offline).
  - `npx cap add android` → projeto nativo em `android/` com os 7 plugins detectados; config nativa confirmada (`server.url` correto).
  - Criado `src/components/native/native-bootstrap.tsx` (client) e ligado no `layout.tsx`: só no app nativo ajusta StatusBar (escura), esconde SplashScreen, trata botão voltar do Android e marca `is-offline` no `<html>` via Network.
- **Arquivos:** `capacitor.config.ts`, `mobile/www/index.html`, `android/**` (projeto nativo), `src/components/native/native-bootstrap.tsx`, `src/app/layout.tsx`, `package.json`/`package-lock.json`.
- **Decisões/porquê:** Modelo A (WebView remoto) para reuso máximo — o app carrega roteiroapp.com. `@capacitor/ios` instalado, mas `npx cap add ios` deve rodar **no Mac** (gera `ios/` + pod install). Plugins importados dinamicamente e gateados por `isNativeApp()` → não afetam a web.
- **Como validar:** `npm run build` completou sem erros com o Capacitor integrado. Para rodar no Android: Android Studio → `npx cap open android` (requer SDK).
- **O que falta do usuário:** Android Studio+SDK para buildar o APK; Mac para iOS; logo em alta resolução para ícones/splash finais; decisão de `appId` (default `com.roteiroapp.app`).
- **Commit:** `feat(mobile): Capacitor + Android nativo + bootstrap de plugins (Fase 3)`
- **Status:** ✅ scaffold concluído (Android); iOS pendente de Mac

---

## [2026-07-08] Fase 2 · Bottom navigation mobile
- **Objetivo:** navegação principal ao alcance do polegar (padrão nativo) no celular.
- **O que foi feito:**
  - Criado `src/components/layout/bottom-nav.tsx`: barra inferior fixa (`md:hidden`), 5 destinos (Viagens, Rotas, Dicas, Relatos, Perfil) com ícone+label, estado ativo por `usePathname`, `pb-safe` (home indicator), `aria-current`.
  - Ligada no `app-shell.tsx`; conteúdo ganhou `pb-[calc(3.5rem+safe)]` no mobile para não ficar sob a barra.
  - FAB do dashboard subiu para `.bottom-safe-nav` (acima da barra); utilitário novo em `globals.css`.
- **Arquivos:** `src/components/layout/bottom-nav.tsx`, `app-shell.tsx`, `src/app/(app)/dashboard/page.tsx`, `globals.css`.
- **Decisões/porquê:** reutiliza rotas/labels/ícones da `sidebar.tsx` (consistência). Labels via i18n existentes (`t.nav.*`). Reversível — a Aria pode refinar copy/itens.
- **Como validar:** `tsc` 0 erros, `next build` OK. No mobile: barra fixa, item ativo destacado, FAB acima da barra.
- **Commit:** `feat(mobile): bottom navigation mobile (Fase 2)`
- **Status:** ✅ concluído

---

## [2026-07-08] Fase 4 · Offline via service worker (dados de viagem)
- **Objetivo:** acesso offline aos dados críticos (reservas, itinerário, documentos) — a dor central da viagem. Vale para web e app.
- **O que foi feito:**
  - Reescrito `public/sw.js`: **stale-while-revalidate para GET `/api/*`** (serve cache na hora, atualiza em background; offline mostra último dado conhecido). `/api/auth/*` nunca cacheado. Navegação/assets seguem network-first + fallback `/offline`. Cache versão `v3` + `roteiroapp-api-v1`.
  - **Revisada a decisão da Fase 1.5**: o SW agora fica **ativo também no app nativo** (removido o gate em `layout.tsx`). Motivo: no Modelo A o WebView carrega o https origin real, então o SW É o mecanismo de offline no app — desligá-lo removeria o offline. `src/lib/native.ts` segue em uso pelo `native-bootstrap`.
- **Arquivos:** `public/sw.js`, `src/app/layout.tsx`.
- **Decisões/porquê:** React Query está instalado mas **não é usado** como data layer (páginas usam `fetch`+`useState`), então persistência via React Query exigiria refactor grande — o SW entrega offline com risco baixo e cobre web+nativo. Refactor para React Query fica como melhoria futura.
- **Como validar:** DevTools → Application → Service Workers ativo; Network offline → dados já visitados continuam abrindo. `next build` OK.
- **Commit:** `feat(mobile): offline via service worker (SWR em /api) (Fase 4)`
- **Status:** ✅ concluído (offline básico); recursos nativos de câmera/push ficam para próximos passos (dependem de chaves/backend)

---

## [2026-07-08] Prévia visual + quick wins das auditorias
- **Objetivo:** dar ao usuário uma forma de acompanhar o app visualmente e corrigir os achados mais valiosos/seguros das auditorias.
- **O que foi feito:**
  - **Prévia navegável** em `docs/mobile-app/preview.html` (protótipo do app num celular simulado, com o design real e 5 telas) → publicada como Artifact.
  - **Bug 404 do blog** (achado da Nova): a página de detalhe `blog/[slug]/page.tsx` só tinha 8 artigos; adicionados os 4 que faltavam (lisboa-7-dias, brasil-2026, mochilao-europa, japao-10-dias) no formato `## `. Agora 12 páginas SSG, sem 404.
  - **Contraste** (Aria): rótulo "menu" e copyright do sidebar (slate-700/800 → slate-300/400).
  - **BACKLOG central** em `docs/BACKLOG.md` — registro único de tudo que falta (fases + Nova + Aria + bugs), atualizado a cada sessão.
- **Arquivos:** `docs/mobile-app/preview.html`, `docs/BACKLOG.md`, `src/app/blog/[slug]/page.tsx`, `src/components/layout/sidebar.tsx`.
- **Como validar:** `tsc` 0 erros, `next build` OK (72 páginas estáticas). Abrir a prévia (Artifact) e navegar pelas abas.
- **Commit:** `fix+docs: bug 404 do blog, contraste, prévia mobile e BACKLOG central`
- **Status:** ✅ concluído. Demais quick wins (touch targets, select chevron, dismiss, h-4.5, GA4, afiliados) rastreados no BACKLOG.
