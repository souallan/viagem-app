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

## Outras melhorias sugeridas (bônus)
- **Notificações de grupo:** avisar membros sobre mudanças/lembretes (usa o push da Fase 4).
- **Timeline de atividade da viagem:** "quem adicionou o quê" (bom para grupo).
- **Exportar acerto de contas** junto com o PDF do roteiro (liga com o item de PDF do BACKLOG).
- **Papel "viewer" para o link público** já existe — reaproveitar a UI para convidar membros com um clique.
