# 📋 BACKLOG central — RoteiroApp

> Registro único de **tudo que falta executar** (fases do app mobile + sugestões dos agentes Nova/Aria + bugs). **Atualizar a cada sessão.** É a resposta rápida para "o que já foi feito e o que falta".
>
> Fontes: `docs/mobile-app/` (plano mobile) · `docs/auditorias/` (relatórios Nova/Aria).
> **Última atualização:** 2026-07-08

**Legenda:** ⬜ pendente · 🔜 em andamento · ✅ feito · 🔴 bloqueado (depende de você)

---

## 🔴 Bloqueadores (dependem de você)
| Item | Detalhe |
|---|---|
| 🔴 **Site fora do ar** | DNS ok; falta o **certificado SSL do Railway** sair. Diga "testa o site" que eu confirmo. Nada de marketing/SEO avança offline. |
| 🔴 **E-mail (Resend)** | Login é OTP por e-mail; repor MX/SPF/DKIM/DMARC no Cloudflare (apagados no incidente). Necessário antes do beta. |
| 🔴 **Mac (iOS)** | `npx cap add ios` + build só em macOS (físico ou nuvem/CI). |
| 🔴 **Contas de loja** | Apple Developer US$99/ano · Google Play US$25. |
| 🔴 **Logo alta resolução** | Arte quadrada p/ ícones/splash finais (hoje gerados do SVG atual). |
| 🔴 **Chaves** | Cloudinary (upload de fotos), FCM/APNs (push), Stripe (premium). |

---

## 🐞 Bugs
| Status | Item | Fonte |
|---|---|---|
| ✅ | **4 artigos do blog davam 404** (sitemap anunciava 12, existiam 8) — adicionados à página de detalhe | Nova |
| ✅ | **FAB colidia com a bottom nav** — reposicionado (`bottom-safe-nav`) | Aria |
| ⬜ | **Classes Tailwind inválidas** `h-4.5`/`h-2.5`/`w-4.5` em ~23 arquivos (ignoradas silenciosamente → tamanhos errados) | Aria |
| ⬜ | Premium é um `alert()` placeholder (sem checkout real) | Nova |

---

## 🎨 Design (Aria) — `docs/auditorias/design-2026-07-08.md`
| Status | Prioridade | Item |
|---|---|---|
| ✅ | Alta | Contraste do menu escuro — rótulo "menu" e copyright (slate-700/800 → slate-300/400) |
| ⬜ | Alta | Contraste — demais textos slate-500/600/700 sobre navy (notificações, subtítulos) |
| ⬜ | Alta | **Alvos de toque < 44px** — abas da viagem (`trip-tabs.tsx`), sino/menu, ícones sociais/idioma do sidebar |
| ⬜ | Média | Ações só no hover → sempre visíveis (dismiss de notificação) |
| ⬜ | Média | `<Select>` sem chevron visível (`appearance-none` sem ícone) |
| ⬜ | Média | Dialog sem foco-trap / `aria-modal` |
| ⬜ | Média | Telas apertadas: calendário de hospedagem (`text-[8px]`), 13 abas em scroll sem affordance |
| ⬜ | Baixa | Drift de marca: UI usa `sky-*` em vez do token `primary` (#1A5FCC) |
| ⬜ | Baixa | `pt-safe` no drawer lateral |
| ⬜ | Backlog | Layouts dedicados de **tablet** (master-detail, 2 colunas) |

---

## 📈 Marketing (Nova) — `docs/auditorias/marketing-2026-07-08.md`
| Status | Prioridade | Item |
|---|---|---|
| ⬜ | P0 | **Eventos GA4** (cadastro, CTA, newsletter, clique em afiliado) — hoje só pageview |
| ⬜ | P0 | **Plugar afiliados no conteúdo orgânico** (blog/roteiro/tips) com `rel="sponsored"` + disclosure |
| ⬜ | P1 | `og:image` (Open Graph com imagem) |
| ⬜ | P1 | Escalar `/roteiro` de 4 → 20-40 cidades ("roteiro X em N dias") |
| ⬜ | P1 | **Stripe** checkout + webhook + premium |
| ⬜ | P2 | i18n indexável com `hreflang` |
| ⬜ | P2 | Abrir **Pinterest** (principal fonte de tráfego do nicho no BR) |
| ⬜ | — | Validação de e-mail RFC 5322 no newsletter |

---

## 🧭 UX (Théo) — `docs/auditorias/ux-2026-07-08.md`
Foco: menos cliques até o objetivo. Economias mapeadas: criar viagem **6→3**, achar reserva na viagem **5→1-2**, add gasto **6→4**, add hospedagem **6→4**.
| Status | Prioridade | Item | Economia |
|---|---|---|---|
| ⬜ | P0 | **13 abas da viagem** (`trip-tabs.tsx`): núcleo de **5 + "Mais"**, seção **"Reservas"** (Hospedagem+Transporte+Documentos), barra **sticky** | Hick/Fitts |
| ⬜ | P0 | **Bloco "Agora/Próximo evento"** no overview da viagem — nº de confirmação/voo a **1 toque** e **offline** | 3+ → 1 toque |
| ⬜ | P1 | **Quick-add global** de itens dentro da viagem (sem caçar a aba) | 6 → 4 |
| ⬜ | P1 | **Criar viagem 6→3**: auto-adicionar destino ao selecionar sugestão + remover bloqueio de validação | −3 toques |
| ⬜ | P2 | Botão "Adicionar" no topo → mover para alcance do polegar (FAB/rodapé) | Fitts |
| ⬜ | P2 | `data` default = hoje em "adicionar gasto" | −1 toque |
| ⬜ | — | Editar/excluir hospedagem em `opacity-0 group-hover` → visível no toque *(também Aria)* | — |
| ⬜ | Backlog | Sitemap proposto + onboarding de ativação *(toca a Nova)* | — |

## 📱 Fases do app mobile — `docs/mobile-app/PROGRESSO.md`
| Fase | Status |
|---|---|
| 0 Fundação (backup/branch/docs) | ✅ (contas/Mac pendentes) |
| 1 Hardening PWA | ✅ |
| 2 UX mobile — bottom nav ✅ / tablet, touch pass, telas apertadas, dnd-kit | 🔜 |
| 3 Capacitor — Android ✅ / iOS (Mac), build APK (SDK) | 🔜 |
| 4 Nativos — offline ✅ / câmera, push, share, biometria | 🔜 (dependem de chaves) |
| 5 Backend — upload Cloudinary, push service, deep links | ⬜ |
| 6 Identidade visual — ícone/splash/screenshots (logo) | ⬜ |
| 7 QA — matriz de dispositivos, beta | ⬜ |
| 8 Publicação nas lojas | ⬜ |
| 9 Pós-lançamento — OTA, monitoramento | ⬜ |

---

## ✅ Feito nesta rodada (2026-07-08)
- Mobile: Fases 1, 2, 3 (Android), 4 (offline) — 7 commits na branch `mobile-app`.
- Agentes Nova e Aria criados + 1ª auditoria de cada.
- Prévia navegável do app (`docs/mobile-app/preview.html` → Artifact).
- Bug 404 do blog corrigido; FAB reposicionado; contraste do menu.
