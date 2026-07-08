# 📊 PROGRESSO — RoteiroApp Mobile

> Painel vivo. **Atualizado a cada sessão.** Aqui você vê num relance o que **já foi feito** e o que **falta**.
> Detalhes de cada mudança ficam no **[DIARIO.md](./DIARIO.md)**. Escopo completo no **[PLANO.md](./PLANO.md)**.

**Última atualização:** 2026-07-08 · **Fase atual:** 3 (Integração Capacitor)

## Visão geral por fase

| Fase | Nome | Status | Progresso |
|---|---|---|---|
| 0 | Fundação do projeto | 🟡 Em andamento | Backup + branch + docs ✅; contas/Mac pendentes |
| 1 | Hardening PWA | ✅ Concluída | viewport+safe-area, ícones raster, CSP, gate SW |
| 2 | UX mobile/tablet | ⚪ Não iniciada | bottom-nav planejado |
| 3 | Integração Capacitor | 🟡 Android scaffoldado | Capacitor+Android+plugins ✅; iOS depende de Mac |
| 4 | Recursos nativos | ⚪ Não iniciada | — |
| 5 | Backend/infra | ⚪ Não iniciada | — |
| 6 | Identidade visual | ⚪ Não iniciada | — |
| 7 | QA e testes | ⚪ Não iniciada | — |
| 8 | Publicação nas lojas | ⚪ Não iniciada | — |
| 9 | Pós-lançamento | ⚪ Não iniciada | — |

Legenda: ✅ concluída · 🟡 em andamento · ⚪ não iniciada · 🔴 bloqueada

## ✅ Feito até agora

**Fase 0 — Fundação**
- [x] Tag de backup `backup-pre-mobile-app-20260708` (local + GitHub)
- [x] Branch isolada `mobile-app` criada (main preservado)
- [x] Estrutura de documentação auditável em `docs/mobile-app/`

**Fase 1 — Hardening PWA** ✅ **concluída**
- [x] Passo 1: `viewport` (`viewport-fit: cover` + `themeColor`) e utilitários de safe-area
- [x] Passo 2: safe-area aplicada no top bar mobile e no FAB do dashboard
- [x] Passo 3: ícones raster PNG (192/512/maskable/apple) + manifest atualizado (`scripts/generate-icons.mjs`)
- [x] Passo 4: CSP liberou câmbio/geocode/clima/tiles (conserta web também)
- [x] Passo 5: `src/lib/native.ts` + service worker gateado sob Capacitor

**Fase 3 — Capacitor** 🟡
- [x] Capacitor core+cli, plataformas (Android add; iOS dep instalada), 7 plugins core
- [x] `capacitor.config.ts` (appId `com.roteiroapp.app`, `server.url` roteiroapp.com), fallback `mobile/www`
- [x] `native-bootstrap.tsx` (StatusBar, SplashScreen, back button Android, Network) ligado no layout
- [ ] iOS (`npx cap add ios`) — **requer Mac**
- [ ] Build/rodar APK — requer Android Studio + SDK

## ⏭️ Próximo passo
- **Fase 2:** bottom navigation mobile. Depois **Fase 4:** offline React Query. iOS/APK quando houver Mac/SDK.

## ⛔ Pendências que travam fases futuras
- **Mac para build iOS** (Fase 3) — decidir físico vs. nuvem (CI)
- **Contas de loja** — Apple Developer (US$99/ano), Google Play (US$25)
- **E-mail (Resend)** — login é OTP por e-mail; repor registros DNS de e-mail (incidente Cloudflare) antes do beta

## 📌 Decisões registradas
- **Arquitetura:** Capacitor + WebView remoto (`server.url = roteiroapp.com`) para o MVP — reuso total. Ver [PLANO.md §1](./PLANO.md).
- **Isolamento:** todo trabalho na branch `mobile-app`; web (`main`) nunca é tocada até merge deliberado.
