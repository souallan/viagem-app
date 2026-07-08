# 🧭 REFERÊNCIAS — Modelos e padrões que rodam bem

> Base de referência: **stack técnica comprovada** + **apps mobile bem-feitos** cujos padrões vamos imitar. Consultar antes de decidir "como implementar".

## 1. Stack técnica de referência (comprovada)

**Núcleo:** Next.js (existente) + **Capacitor** (shell nativo) + WebView remoto.
Capacitor é a forma madura e mais usada para levar um app web existente às lojas mantendo uma base de código. Documentação oficial de integração com Next.js: `capacitorjs.com/solution/nextjs`.

**Plugins oficiais Capacitor a usar** (todos `@capacitor/*`):
| Plugin | Para quê | Fase |
|---|---|---|
| `@capacitor/app` | Deep links, botão voltar (Android), estado do app | 3 |
| `@capacitor/status-bar` | Cor/estilo da barra de status | 3 |
| `@capacitor/splash-screen` | Tela de abertura | 3 |
| `@capacitor/keyboard` | Ajuste de inputs/teclado | 3 |
| `@capacitor/network` | Detecção online/offline | 3 |
| `@capacitor/camera` | Foto de documentos/reservas/avatar | 4 |
| `@capacitor/push-notifications` | Push (FCM/APNs) | 4 |
| `@capacitor/local-notifications` | Lembretes offline (contagem p/ viagem) | 4 |
| `@capacitor/share` | Compartilhar roteiro nativo | 4 |
| `@capacitor/geolocation` | "Onde estou" no mapa | 4 |
| `@capacitor/preferences` | Armazenamento chave-valor (offline) | 4 |
| `@capacitor/assets` (dev) | Gerar ícones e splash de uma imagem-fonte | 1/6 |
| `@aparajita/capacitor-biometric-auth` (ou similar) | Login por Face ID/digital | 4 |

**Offline:** já temos `@tanstack/react-query` instalado — usar `persistQueryClient` + storage (Preferences) para cache persistente das reservas/itinerário. Padrão "offline-first" para os dados críticos da viagem.

**OTA (atualizar sem passar pela loja):** Capacitor Live Updates (Appflow) ou **Capgo** (open-source) — publica mudanças do bundle web direto no app.

## 2. Apps de referência (UX que funciona) — o que copiar

| App | Categoria | Padrões a imitar |
|---|---|---|
| **Wanderlog** | Planejador de viagem | Bottom-nav simples; itinerário por dia com cards; mapa integrado; funciona offline; onboarding leve |
| **TripIt** | Organizador de reservas | Acesso rápido offline a nº de reserva/voo; "próximo evento" em destaque; import por e-mail |
| **Hopper** | Voos/hotéis | Microinterações e feedback tátil; cards grandes tocáveis; cores fortes |
| **Airbnb** | Viagem/reservas | Barra inferior clara; imagens grandes; formulários mobile impecáveis; bottom sheets |
| **Google Maps / Trips (arquivado)** | Navegação/viagem | Reservas agrupadas por dia; salvar offline; chips de filtro |
| **Notion / Todoist** | Produtividade | Listas com swipe-actions; skeletons; sincronização silenciosa; estados vazios bem-feitos |

**Princípios extraídos desses apps (nosso "norte" de UX):**
1. **Bottom navigation** com 4–5 destinos — o polegar alcança tudo.
2. **"Próximo evento" sempre à mão** — durante a viagem, a tela inicial mostra o que vem agora (voo/check-in/atração).
3. **Offline no que importa** — reservas, documentos e itinerário abrem sem internet.
4. **Cards grandes e tocáveis** (alvo ≥ 44px), nada de ações escondidas só no hover.
5. **Swipe actions** para editar/excluir em listas.
6. **Bottom sheets** em vez de modais grandes no celular.
7. **Feedback imediato** — skeletons (já temos), haptics, transições curtas.
8. **Tablet ≠ celular esticado** — usar master-detail e duas colunas.

## 3. Padrões técnicos de referência
- **Safe areas:** sempre respeitar `env(safe-area-inset-*)` em barras fixas (topo/inferior) e botões flutuantes.
- **Roteamento nativo:** deep links via Universal Links (iOS) / App Links (Android) apontando para `roteiroapp.com`.
- **Sessão no WebView:** carregar o domínio real (first-party) mantém os cookies do NextAuth funcionando; biometria só protege o desbloqueio.
- **Drag-and-drop:** usar **dnd-kit** (suporta toque) em vez de HTML5 DnD nativo.
- **Ícones/splash:** gerar a partir de **uma** imagem-fonte de alta resolução com `@capacitor/assets`.

> Estas referências evoluem — adicionar aqui novos exemplos e decisões conforme o projeto avança.
