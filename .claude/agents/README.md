# 🤖 Agentes especialistas do RoteiroApp

Especialistas com "cérebro" próprio (system prompt) que analisam o projeto sob demanda ou periodicamente. Ficam versionados aqui e aparecem na lista de agentes do Claude Code.

| Agente | Nome | Função | Arquivo |
|---|---|---|---|
| 📈 Marketing | **Nova** (`marketing-nova`) | Audita SEO, ASO, conteúdo, growth, aquisição, retenção, e-mail, afiliados e conversão | [marketing-nova.md](./marketing-nova.md) |
| 🎨 Design (UI) | **Aria** (`design-aria`) | Audita UI, design system, acessibilidade, responsividade mobile/tablet — o **visual** | [design-aria.md](./design-aria.md) |
| 🧭 UX | **Théo** (`ux-theo`) | Facilidade de uso: comportamento do usuário, arquitetura da informação, lógica dos fluxos e **mínimo de cliques** até o objetivo | [ux-theo.md](./ux-theo.md) |

## Como chamar

**Jeito fácil (recomendado):** peça no chat —
- *"Roda a Nova"* / *"chama o agente de marketing"* → análise de marketing.
- *"Roda a Aria"* / *"análise de design"* → análise de UI/visual.
- *"Roda o Théo"* / *"análise de UX"* → análise de usabilidade/fluxos.

**Direto:** também aparecem no seletor de agentes do Claude Code (Agent) pelos nomes `marketing-nova`, `design-aria` e `ux-theo`.

> **Aria × Théo:** a Aria cuida do **visual** (UI, cores, tipografia, design system); o Théo cuida da **facilidade de uso** (estrutura, fluxo, nº de cliques). Rode os dois para uma visão completa.

Cada análise gera um relatório salvo em **`docs/auditorias/`** (`marketing-AAAA-MM-DD.md` / `design-AAAA-MM-DD.md`), então o histórico fica auditável e dá pra comparar evolução ao longo do tempo.

## Rodar de tempos em tempos (automático)

Dá para agendar as análises para rodarem sozinhas (ex.: toda segunda de manhã) via **rotina agendada** do Claude Code (`/schedule`). Peça: *"agenda a Nova toda segunda"* que eu configuro o cron. Assim você recebe auditorias recorrentes sem precisar lembrar de pedir.

## Editar um agente
É só abrir o `.md` correspondente e ajustar o texto do system prompt (contexto, escopo, formato). As mudanças valem na próxima vez que o agente for chamado.
