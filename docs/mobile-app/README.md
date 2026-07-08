# 📱 RoteiroApp Mobile — Central do Projeto

Este diretório reúne **toda a documentação** da transformação do RoteiroApp (web) em **app instalável** (iOS/Android via Capacitor), mantendo a versão web. Tudo aqui é escrito para ser **entendido e auditado no futuro** — do resumo geral ao último passo executado.

## Resumo executivo

O RoteiroApp já é um Next.js 15 completo e responsivo. Em vez de reescrever em outra tecnologia, **embrulhamos o app existente com Capacitor** e adicionamos uma camada nativa (câmera, push, offline, biometria). A base de código continua **uma só**: o mesmo código serve a web e o app. O trabalho é dividido em **10 fases** (0 a 9), da fundação à publicação nas lojas e manutenção.

## Como navegar nesta pasta

| Arquivo | O que é | Quando ler |
|---|---|---|
| **[README.md](./README.md)** | Este índice + resumo + estado atual | Comece aqui |
| **[PLANO.md](./PLANO.md)** | Plano-mestre: estratégia, arquitetura e **todas as tarefas** com checkboxes | Para entender o "porquê" e ver o escopo completo |
| **[PROGRESSO.md](./PROGRESSO.md)** | Painel vivo: o que **já foi feito** e o que **falta** | A cada conversa, para retomar |
| **[DIARIO.md](./DIARIO.md)** | Diário de bordo cronológico: cada modificação com data, arquivos, motivo e commit | Para auditar passo a passo |
| **[REFERENCIAS.md](./REFERENCIAS.md)** | Modelos de apps que rodam bem + stack e padrões de referência | Ao decidir como implementar algo |

## Estado atual (rápido)

- **Branch de trabalho:** `mobile-app` (o `main` permanece intocado com a versão web estável)
- **Backup / ponto de restauração:** tag `backup-pre-mobile-app-20260708` (local **e** no GitHub)
- **Fase atual:** Fase 1 — Hardening PWA
- 👉 Para ver exatamente o que foi feito e o próximo passo, abra **[PROGRESSO.md](./PROGRESSO.md)**.

## 🔙 Como restaurar o backup (se algo der errado)

Todo o trabalho mobile está isolado na branch `mobile-app`. A versão web estável está preservada em duas formas:

```bash
# Voltar para a versão web estável (branch principal)
git checkout main

# Ou restaurar exatamente o estado do backup (tag)
git checkout backup-pre-mobile-app-20260708
```

Nada na branch `mobile-app` afeta o `main` até que uma fusão (merge) seja feita **deliberadamente**.
