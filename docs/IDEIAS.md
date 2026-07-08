# 💡 Ideias de produto — avaliadas (para registro)

> Ideias jogadas pelo Allan, analisadas contra o projeto atual, com dicas de implementação. **Não implementadas ainda** — ficam aqui para priorizar depois. Ver também `docs/BACKLOG.md`.
> Registrado em 2026-07-08.

---

## 1. Compartilhar o roteiro e ver a mesma viagem (viajar juntos)

**Status: fundação JÁ EXISTE — falta completar.**
O schema tem o modelo **`TripMember`**, há o componente `src/components/trips/trip-collaboration.tsx` no overview e a rota `/api/trips/[id]/members` (GET/POST/DELETE). Também existe o **compartilhamento público** por token (somente leitura, `TripPublicShare` + `/api/trips/[id]/share`).

**O que falta para "ver e editar a mesma viagem":**
- **Acesso compartilhado real:** hoje todas as rotas checam `trip.userId === session.user.id`. Criar um helper `canAccessTrip(userId, tripId)` que aceite **dono OU membro**, e aplicar em todas as rotas de `trips/[id]/*`.
- **Aparecer no dashboard do convidado:** a query de viagens precisa incluir `where: { OR: [{ userId }, { members: { some: { userId } } }] }`.
- **Papéis/permissões:** `owner` / `editor` / `viewer` no `TripMember.role` (editor escreve, viewer só lê).
- **Convite por e-mail:** se o e-mail já é usuário, adiciona como membro; senão, envia convite (Resend) — depende de repor o e-mail do incidente DNS.
- **Tempo real (fase 2):** para os dois verem edições ao vivo, começar com *polling* leve (revalidar a cada X s) e evoluir para **SSE** ou serviço realtime (Pusher/Supabase Realtime/Ably). MVP pode ser "recarrega e vê o mais recente".

**Dicas extras:** notificar membros quando alguém adiciona algo; log de "quem alterou o quê"; este é forte candidato a **feature premium** ("viagem em grupo").

---

## 2. Divisão de contas do grupo (estilo Splitwise, sem plágio)

**Status: NOVO — alto valor para viagem em grupo. Depende da ideia 1 (membros).**
Hoje há `Expense` por viagem (single-user) e a página de orçamento, mas nada de dividir contas entre pessoas.

**Como implementar (ideia própria, integrada ao orçamento):**
- **Schema:** adicionar em `Expense` um `paidById` (quem pagou) e a divisão. Duas opções: (a) modelo `ExpenseShare` (expenseId, userId, valor/percentual) para divisão flexível; (b) simplificado: campo `splitWith` (lista de userIds) com divisão igualitária.
- **Cálculo de saldos:** somar por pessoa (pagou × deve) → saldo líquido → **algoritmo de simplificação de dívidas** (minimizar nº de transferências: quem deve mais paga quem recebe mais).
- **UI:** ao lançar despesa, escolher **"quem pagou"** e **"dividir entre"** (membros da viagem); uma tela **"Acertar contas"** mostrando "Fulano deve R$ X a Ciclano" e botão de marcar como quitado.
- **Multi-moeda:** converter tudo para a moeda base da viagem usando o proxy `/api/exchange-rate` já existente.
- **Diferencial (não-plágio):** nasce **dentro** do planejador (já sabe destinos, membros e moeda), não é um app isolado de contas.

**Candidato a premium** ("divisão de despesas em grupo").

---

## 3. Mesma base para mobile e computador (integrados, não totalmente offline)

**Status: JÁ ATENDIDO pela arquitetura atual.**
O app mobile (Capacitor, Modelo A) **carrega o mesmo `roteiroapp.com`** e usa o **mesmo backend/DB (Railway Postgres)** que a web. Ou seja: **mesma conta, mesmos dados, em tempo real quando online** — o que você cria no celular aparece no computador e vice-versa, automaticamente. O service worker é só um **cache** por cima (offline mostra o último dado conhecido), então é "**online-first, não totalmente offline**" — exatamente o que você descreveu.

**O que NÃO temos (e só precisa se quiser editar 100% offline):**
- **Escrita offline com sincronização:** criar/editar sem internet e sincronizar depois exigiria uma **fila de sync + resolução de conflito** (mais complexo). Hoje o offline é **somente leitura** (cache). Registrar como melhoria futura se fizer sentido.

**Conclusão:** integração mobile↔web já é nativa da arquitetura; nada a fazer além do que já está no plano (offline de leitura ✅). Só abrir tarefa se quiser **edição offline com sync**.

---

---

# Rodada 2 — mapa, rotas, anexos, transporte (2026-07-08)

## 4. Mapa interativo: ver locais e traçar rota até o ponto

**Status: GRANDE PARTE JÁ EXISTE.** Em `/trips/[id]/map` (`src/components/trips/map-view.tsx` + `map/page.tsx`): plota **hospedagens e atividades** com ícones/categorias, tem **filtros** (todos/destinos/hospedagens/atividades) e **botão de rota no Google Maps com waypoints** (`/maps/dir/?api=1&destination=...&waypoints=...`).

**O que falta / melhorias:**
- Plotar também **transportes** (aeroportos/estações — campos `from`/`to`).
- **Busca por texto** ("hotel", "restaurante", "aeroporto") além dos filtros por categoria.
- **"Traçar rota" por marcador** (um destino específico): Google Maps `dir/?api=1&destination=...`; alternativa **Waze** (`https://waze.com/ul?q=...`).
- **"Me localizar"** (geolocation nativa — Fase 4) → rota a partir da posição atual; opção "perto de mim".
- **Filtrar o mapa por dia** do itinerário.

## 5. Ordenar atrações por distância (melhor trajeto, economizar tempo)

**Status: NOVO.** O mapa já monta rota com waypoints, mas **não otimiza a ordem**.

**Como implementar:** geocodificar os locais (Nominatim, já usado) → distâncias **haversine** → **nearest-neighbor + 2-opt** (N pequeno por dia, ≤~10) → botão **"Otimizar trajeto do dia"** que reordena as atividades a partir de um ponto de partida (a hospedagem daquele dia). Avançado: considerar **horário de funcionamento** e janelas de visita. Integra direto com o itinerário. Alto valor.

## 6. Anexos: foto da reserva / upload de documento por item

**Status: JÁ PLANEJADO (câmera/upload Cloudinary — Fase 4/5); esta ideia EXPANDE.**
Hoje Documentos são só URL. A ideia é **anexar imagem por item**: nº de reserva no hotel, bilhete de transporte, ingresso de atividade, comprovante de check-in.

**Como implementar:** tabela `Attachment(itemType, itemId, url, kind)` ou campo `attachmentUrl` por item; captura por **câmera no mobile** (`@capacitor/camera`) + upload para **Cloudinary** (depende das chaves). Casa com o "**armazenamento ilimitado de PDFs/fotos**" do premium.

## 7. Guia de transporte público (estilo Citymapper)

**Status: NOVO e AMBICIOSO.** Construir do zero exige dados de transporte (GTFS) e roteirização — inviável agora.

**Recomendação: integrar via deep-link, não construir:**
- Botão **"Como chegar (transporte público)"** por local → **Google Maps em modo transit** (`.../dir/?api=1&destination=...&travelmode=transit`).
- Card **"Transporte local"** por cidade com links para **Citymapper** (cidades suportadas), **Moovit** e o app do metrô local.
- Complemento: sugerir o **cartão de transporte** da cidade (Suica/Japão, Oyster/Londres, Viva Viagem/Lisboa) — já citado nos artigos do blog.

## Complementos sugeridos (rodada 2)
- **Waze** além do Google Maps nos deep-links de rota.
- **"Perto de mim"** com geolocation: lista locais planejados por proximidade.
- **Tempo estimado de deslocamento** entre atividades (Google/OSRM) — reforça a ideia 5.
- **Mapa offline**: cache de tiles com Leaflet/OSM é complexo — registrar como pesquisa; alternativa simples: guardar endereço/coords para abrir no app de mapas nativo (que tem offline próprio).

---

## Outras melhorias sugeridas (bônus)
- **Notificações de grupo:** avisar membros sobre mudanças/lembretes (usa o push da Fase 4).
- **Timeline de atividade da viagem:** "quem adicionou o quê" (bom para grupo).
- **Exportar acerto de contas** junto com o PDF do roteiro (liga com o item de PDF do BACKLOG).
- **Papel "viewer" para o link público** já existe — reaproveitar a UI para convidar membros com um clique.
