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
