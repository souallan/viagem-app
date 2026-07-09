# 🚀 Plano de Lançamento, Segurança e Consolidação — RoteiroApp

> Estratégia para entregar o app **pronto, seguro e estável**, com prioridades e um plano concreto de **segurança dos dados dos clientes**. Documento vivo. Criado em 2026-07-09.

---

## 1. Lançar tudo pronto ou lançar e iterar?

**Recomendação: LANÇAR E ITERAR (soft launch) — mas com um portão de segurança/estabilidade antes de qualquer download público.**

Por quê:
- **Não espere marketing/design perfeitos.** Isso adia feedback real e receita, e você melhora muito mais rápido com usuários reais. Design e marketing são **melhoria contínua** — nunca "terminam".
- **MAS há um mínimo inegociável antes do primeiro download:** (1) **segurança dos dados**, (2) **estabilidade** (sem crash/perda de dados), (3) **fluxos essenciais funcionando**, (4) **legal** (privacidade/termos/LGPD).
- **Motivo:** cor, texto e telas você ajusta depois sem dano. **Dado de cliente exposto ou app que perde dados = quebra de confiança irreversível.** A base tem que estar sólida; o marketing escala depois.

**Faseamento recomendado:**
1. **Beta fechado** (TestFlight iOS / Google Play Internal) com os testers que já ajudaram — 1–2 semanas. Corrigir bugs e fricções.
2. **Soft launch** — publicar nas lojas com ASO básico, sem grande divulgação. Monitorar crashes, retenção e feedback.
3. **Ramp de marketing** — smart banner (pronto), página `/app` (pronta), Pinterest, `/roteiro` escalado, influenciadores, tráfego pago.

> Regra de ouro: lance **cedo o suficiente para aprender**, **tarde o suficiente para não queimar a largada** com bug ou falha de segurança.

---

## 2. Lista priorizada — o que falta

### 🔴 P0 — Antes de submeter às lojas (bloqueadores)
- **Segurança de dados** (ver seção 3): backups automáticos, rotacionar segredos expostos, storage privado de documentos.
- **Estabilidade**: testar fluxos core em device real; alertas no Sentry.
- **Build nativo**: Mac p/ iOS, Android Studio p/ APK; contas **Apple (US$99/ano)** + **Google (US$25)**.
- **Recursos nativos mínimos** (exigência Apple 4.2): câmera (foto de documentos) + push + offline (offline ✅). Câmera/push dependem de chaves (Cloudinary/FCM).
- **Legal**: privacidade (`/privacy` ✅), termos (`/terms` ✅), LGPD (export ✅, exclusão ✅) — revisar consentimento/cookies.
- **Identidade**: ícone/splash/logo em alta resolução.

### 🟠 P1 — Prontidão de loja / primeiras semanas
- **Screenshots de loja** (celular/tablet, PT/EN/ES) + **ASO** (título, keywords, descrição).
- **Câmera/upload** (Cloudinary) — foto de reservas/documentos.
- **Push** (FCM/APNs) — lembretes de viagem/check-in.
- **QA** em matriz de dispositivos + teste **offline** (modo avião).
- **GA4**: instrumentar clique de afiliado e CTA premium (plataforma ✅).

### 🟡 P2 — Pós-lançamento (iterar)
- Escalar **`/roteiro`** (4 → 20-40 cidades) — SEO.
- **Stripe** premium (checkout + webhook).
- **Tempo real** do grupo (edição ao vivo) + **saldos no perfil** (ver o que devo entre viagens).
- **Pinterest**, hreflang, link building, influenciadores, tráfego pago.
- Layouts de **tablet**, dnd-kit, refinamentos de UX/UI (Aria/Théo).
- **OTA updates** (Capgo/Appflow) — atualizar o app sem passar pela loja.

---

## 3. Segurança e confiabilidade dos dados (o ponto central)

### ✅ O que já temos (base boa)
- **HTTPS/TLS** (Let's Encrypt) — criptografia em trânsito.
- **Senhas** com bcrypt (12 rounds); nunca em texto puro.
- **Sessão** JWT em cookie **httpOnly**.
- **Headers de segurança**: CSP, HSTS, X-Frame-Options (DENY), Referrer-Policy, Permissions-Policy.
- **Rate limiting** (login/admin) + **admin com login separado + 2FA**.
- **Sanitização de input** (`stripHtml`) e **filtro de conteúdo** nos campos públicos.
- **Controle de acesso**: checagem de dono em todas as rotas + **papéis (RBAC)** — dono/EDITOR/VIEWER.
- **Audit log**, **Sentry** (erros), **health check**.
- **DB na rede interna do Railway** (não exposto à internet).
- **LGPD**: export de dados (`/api/user/export`) + exclusão de conta (`/api/user` DELETE).

### 🎯 Ações concretas (por prioridade)
1. 🔴 **Backups automáticos do PostgreSQL (Railway)** — diário, com retenção, e **testar a restauração**. É a **#1 de confiabilidade** (proteção contra perda/corrupção). Ativar point-in-time se disponível.
2. 🔴 **Rotacionar segredos expostos** (chave Resend `re_RY5...`, token Cloudflare `cfat_...`, token Railway antigo) + varredura de segredos no repositório. **Segredos só em env vars** (✅), nunca no código.
3. 🟠 **Storage privado de documentos** — ao entrar câmera/upload: Cloudinary com **URLs assinadas/privadas** (não públicas/indexáveis). Foto de passaporte/reserva = **dado sensível** → acesso controlado por usuário.
4. 🟠 **Criptografia em repouso** — confirmar que o volume Postgres do Railway é criptografado (Railway criptografa discos por padrão).
5. 🟠 **Rate limit multi-instância** — Upstash Redis (lib pronta, falta env) para escalar com segurança.
6. 🟡 **Monitoramento/alertas** — Sentry com alerta de erro + uptime (health ✅) + alerta de falha de deploy.
7. 🟡 **Dependências** — `npm audit` recorrente + Dependabot; manter libs atualizadas (correções de segurança).
8. 🟡 **LGPD/privacidade** — política cobrindo exatamente o que é coletado; consentimento/cookie notice; contato de privacidade; **minimizar coleta** (só o necessário).
9. 🟡 **Auth** — verificação de e-mail no cadastro, expiração de sessão, 2FA opcional para usuários (infra já existe).
10. 🟢 **Menor privilégio** — chaves de API com escopo mínimo (feito com o token Cloudflare), acesso ao DB restrito, revisar quem tem acesso ao painel Railway.

---

## 4. Checklist "app consolidado" (todas as dimensões)

- **Segurança:** as 10 ações da seção 3.
- **Confiabilidade:** backups + restore testado; health checks; restart policy (✅); sem estado crítico só no cliente.
- **Qualidade:** testes dos fluxos críticos (auth, criar viagem, divisão de contas); QA em devices reais; estados de erro/vazio tratados.
- **Performance:** Core Web Vitals; imagens otimizadas; cache/offline (SW ✅); cold start do app.
- **Observabilidade:** Sentry, GA4 (com plataforma ✅), logs estruturados (✅), audit log (✅), alertas.
- **Legal/Compliance:** privacidade, termos, LGPD (export/exclusão ✅), consentimento, classificação etária, **disclosure de afiliados** (✅).
- **Loja:** ícones/splash/screenshots, descrição/ASO, política linkada, **Data Safety** (Google) + **Privacy Labels** (Apple).
- **CI/CD:** deploy contínuo (✅ Railway), **OTA** (Capgo) para o app, versionamento (semver + build number).
- **Suporte:** canal de contato (e-mail ✅), FAQ, resposta a avaliações das lojas.
- **Negócio:** MEI/CNPJ antes de monetizar; Stripe; **INPI** (marca — pendente); política de reembolso.
