# 📊 PROGRESSO — RoteiroApp Mobile

> Painel vivo. **Atualizado a cada sessão.** Aqui você vê num relance o que **já foi feito** e o que **falta**.
> Detalhes de cada mudança ficam no **[DIARIO.md](./DIARIO.md)**. Escopo completo no **[PLANO.md](./PLANO.md)**.

**Última atualização:** 2026-07-08 · **Fase atual:** 1 (Hardening PWA)

## Visão geral por fase

| Fase | Nome | Status | Progresso |
|---|---|---|---|
| 0 | Fundação do projeto | 🟡 Em andamento | Backup + branch + docs ✅; contas/Mac pendentes |
| 1 | Hardening PWA | 🟡 Em andamento | 1 de ~7 passos |
| 2 | UX mobile/tablet | ⚪ Não iniciada | — |
| 3 | Integração Capacitor | ⚪ Não iniciada | — |
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

**Fase 1 — Hardening PWA**
- [x] **Passo 1:** `viewport` export (`viewport-fit: cover` + `themeColor`) e utilitários de safe-area (CSS) — ver DIARIO 2026-07-08

## ⏭️ Próximo passo
- **Fase 1 · Passo 2:** aplicar safe-area no top bar mobile (`app-shell.tsx`) e no FAB do dashboard; gerar ícones raster PNG (192/512 + maskable).

## ⛔ Pendências que travam fases futuras
- **Mac para build iOS** (Fase 3) — decidir físico vs. nuvem (CI)
- **Contas de loja** — Apple Developer (US$99/ano), Google Play (US$25)
- **E-mail (Resend)** — login é OTP por e-mail; repor registros DNS de e-mail (incidente Cloudflare) antes do beta

## 📌 Decisões registradas
- **Arquitetura:** Capacitor + WebView remoto (`server.url = roteiroapp.com`) para o MVP — reuso total. Ver [PLANO.md §1](./PLANO.md).
- **Isolamento:** todo trabalho na branch `mobile-app`; web (`main`) nunca é tocada até merge deliberado.
