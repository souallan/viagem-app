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
| ✅ | Média | Ações só no hover → sempre visíveis (dismiss de notificação) |
| ✅ | Média | `<Select>` sem chevron visível (`appearance-none` sem ícone) |
| ⬜ | Média | Dialog sem foco-trap / `aria-modal` |
| ⬜ | Média | Telas apertadas: calendário de hospedagem (`text-[8px]`), 13 abas em scroll sem affordance |
| ⬜ | Baixa | Drift de marca: UI usa `sky-*` em vez do token `primary` (#1A5FCC) |
| ⬜ | Baixa | `pt-safe` no drawer lateral |
| ⬜ | Backlog | Layouts dedicados de **tablet** (master-detail, 2 colunas) |

---

## 📈 Marketing (Nova) — `docs/auditorias/marketing-2026-07-08.md`
| Status | Prioridade | Item |
|---|---|---|
| ✅ | P0 | **Eventos GA4**: `sign_up`/`trip_created`/`newsletter_signup`/`app_install_click`/`affiliate_click`/`upgrade_click` + **tag de plataforma** (web/ios/android) em todo evento |
| ✅ | P0 | **Ponte web→app**: smart banner mobile (`app-banner.tsx`, oculto até configurar lojas) + página **`/app`** + `apple-itunes-app` (condicional). Preencher `SITE_CONFIG.app` ao publicar |
| ⬜ | P0 | **Plugar afiliados no conteúdo orgânico** (blog/roteiro/tips) com `rel="sponsored"` + disclosure |
| ✅ | P1 | `og:image` — `public/og-image.png` (1200×630) + metadata OG/Twitter |
| 🟢 | P1 | Escalar `/roteiro`: **10 cidades** feitas (Lisboa, Paris, Roma, Madri, Barcelona, Buenos Aires, Santiago, Tóquio, Nova York, Cancún) em `lib/destinations.ts`; adicionar mais é só editar o arquivo |
| ⬜ | P1 | **Stripe** checkout + webhook + premium |
| ⬜ | P2 | i18n indexável com `hreflang` |
| ⬜ | P2 | Abrir **Pinterest** (principal fonte de tráfego do nicho no BR) |
| ✅ | — | Validação de e-mail RFC 5322 no newsletter |

---

## 🚀 Lançamento & conteúdo (ideias avaliadas 2026-07-08)
| Status | Item |
|---|---|
| ⬜ | Pré-lançamento: página/**waitlist de early-access do app** com recompensa premium ("seja um dos primeiros a testar") |
| ⬜ | Conteúdo **build-in-public** + reels de "perrengues de viagem" (TikTok/IG) |
| ⬜ | **Micro-influenciadores** testando em viagem real (nômades) — troca por divulgação |
| ⬜ | **Tráfego pago** segmentado (IG/TikTok: interesses viagem/turismo) — após validar retenção |

*(ASO e afiliados no orgânico já constam na seção Nova.)*

## 💰 Monetização & Produto (freemium — ideias avaliadas)
| Status | Item |
|---|---|
| ✅ | **Freemium já implementado**: `User.plan` + `src/lib/plans.ts` (FREE=3 viagens/20 ativ/1 rota/5 relatos) + gating no `/api/trips` (403). Falta só o **Stripe** para efetivar o upgrade (bloqueado em conta/chaves) |
| ✅ | **Exportar roteiro em PDF** — já existe em `/summary` (Imprimir/Salvar PDF); agora a moldura do app some na impressão (`print:hidden`) |
| ⬜ | **Viagem em grupo / compartilhamento em tempo real** (usa `TripMember`, já no schema) como premium |
| ⬜ | **Armazenamento ilimitado de PDFs/fotos de reservas** (liga com upload Cloudinary da Fase 5) |
| ⬜ | **Stripe**: avaliar assinatura mensal **e** "compra única por viagem" |

> **Já implementado / descartado (triagem 2026-07-08):** paleta azul+branco (tranquilidade) ✅ · ícones intuitivos avião/mala/cifrão/calendário (lucide) ✅ · **Figma** — não adotado: prototipamos via prévia HTML (`docs/mobile-app/preview.html`) + agentes Aria/Théo · ASO/afiliados/influenciadores/social já mapeados pela Nova.

## 🧩 Ideias de produto avaliadas — `docs/IDEIAS.md`
| Status | Item | Nota |
|---|---|---|
| 🟢 | **Compartilhar/ver a mesma viagem (grupo)** | ✅ Convidado vê a viagem no dashboard e usa **todas as abas**. ✅ **Papéis:** VIEWER = só-leitura, EDITOR/dono = edição (GET dono-ou-membro; escrita dono-ou-EDITOR). Owner-only: excluir viagem, gerenciar membros, share. Falta só: **tempo real** (edição ao vivo) |
| ✅ | **Divisão de contas do grupo** (estilo Splitwise) | Feito: `TripParticipant` + `ExpenseShare` + `Expense.paidById`; API de participantes; despesa com pagador/divisão; **"Acertar contas"** no orçamento (usa `src/lib/split.ts`) |
| ✅ | **Mesma base mobile↔web** | Já atendido: Capacitar Modelo A usa o mesmo backend/DB; offline é cache (online-first). Só abrir tarefa se quiser **edição offline com sync** |
| 🟢 | **Mapa interativo + rota** (`/map`) | ✅ transportes/aeroportos no mapa, ✅ busca por texto, ✅ rota por marcador (Google Maps/transit/Waze), ✅ "me localizar" (geolocation). Falta só: filtro por dia do itinerário |
| ✅ | **Otimizar trajeto por distância** | `src/lib/route-opt.ts` (nearest-neighbor + 2-opt); botão "Otimizar trajeto" no mapa reordena o dia pela menor distância + mostra km/dia na legenda |
| 🟢 | **Anexos por item (foto/upload)** | **Código pronto**: `PhotoUpload` (câmera no celular + arquivo na web, upload unsigned ao Cloudinary), em Documentos + Hospedagem (campo `attachmentUrl`). **Ativar:** criar *unsigned upload preset* no Cloudinary e pôr `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` + `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` no Railway |
| ⬜ | **Guia de transporte público** | Deep-link Google Maps transit + Citymapper/Moovit por cidade (não construir do zero) |

## 🧭 UX (Théo) — `docs/auditorias/ux-2026-07-08.md`
Foco: menos cliques até o objetivo. Economias mapeadas: criar viagem **6→3**, achar reserva na viagem **5→1-2**, add gasto **6→4**, add hospedagem **6→4**.
| Status | Prioridade | Item | Economia |
|---|---|---|---|
| ✅ | P0 | **13 abas da viagem** → núcleo (Visão/Itinerário/Orçamento) + **Reservas ▾** + **Mais ▾**, alvos ≥44px, barra **sticky** | Hick/Fitts |
| ✅ | P0 | **Bloco "Agora & próximo"** no overview — próximo voo/check-in/atividade com reserva/assento visível (0-1 toque), offline via cache | 3+ → 0-1 toque |
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
