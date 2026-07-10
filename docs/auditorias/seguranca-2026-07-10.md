# 🔐 Auditoria de segurança — RoteiroApp (2026-07-10)

Auditoria autônoma pré-lançamento. **Resultado geral: sólido.** Nenhuma falha crítica/alta.

## ✅ O que está bem implementado
| Área | Achado |
|---|---|
| **Login** | 2 passos: e-mail + **senha (bcrypt, 12 rounds)** → **OTP de 6 dígitos por e-mail (2FA)** |
| **OTP** | Gerado com `crypto.randomInt` (seguro), **uso único** (apagado após verificar), TTL 10 min |
| **Anti-enumeração** | `check-credentials` usa **dummy `bcrypt.compare`** quando o usuário não existe (evita timing attack) e retorna **erro genérico** ("Credenciais inválidas") — não revela se o e-mail existe |
| **Rate limiting** | Middleware limita `/api/auth/*` e `/api/register` a 10 req/60s por IP (protege brute-force de senha e OTP) |
| **Senha** | Cadastro exige 8–128 caracteres; hash bcrypt 12 |
| **Headers** | CSP, HSTS (2 anos, preload), X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| **Autorização** | Toda rota de API valida sessão + **posse (ownership)** antes de agir |
| **Segredos no client** | **Nenhum** `NEXT_PUBLIC_*` é segredo (só refs de afiliado, GA, Sentry DSN — públicos por natureza). Nenhum client component lê segredo do servidor |
| **LGPD** | Exportar dados, excluir conta, cookie banner, **audit log** |
| **`/setup-admin`** | **Não existe** (já foi removido) ✅ |
| **Admin** | 2 contas ADMIN com senha; acesso admin exige painel exclusivo |
| **Banco** | Neon gerenciado + **PITR 7 dias** + backup diário no R2 (provedor distinto) |

## 🟡 Pontos de atenção (não bloqueadores)
1. **Segundo admin com e-mail não verificado**: `roteiroapp.br@gmail.com` (ADMIN, `emailVerified = false`). Decidir: verificar, ou remover se for conta de teste. (`alandesouza.ac@gmail.com` está ADMIN e verificado.)
2. **5 vulnerabilidades `npm audit` — todas MODERADAS e transitivas de build** (OpenTelemetry via Sentry; postcss via Next). Baixo risco real (postcss roda no build, não em input de usuário). Corrigir num passo de manutenção com `npm audit fix` + build de verificação (não fizemos agora para não arriscar deps perto do lançamento).
3. **OTP sem contador de tentativas por identificador** — hoje protegido pelo rate limit por IP (adequado). Endurecimento opcional: contador por e-mail (bloquear após N erros).

## 🔴 Ação de segurança nº 1 (depende de você)
**Rotacionar os segredos que apareceram no chat nesta sessão:**
- API key do **Neon** (`napi_…`)
- **R2**: Access Key + Secret
- **Token do Railway** (`c8925cd8…`)
- **Senha do banco Neon** (`npg_…`) — aparece na `DATABASE_URL`
- **Stripe** `sk_test_…` (baixo risco por ser teste, mas trocar ao ir para produção)

## Veredito
Login e a base de segurança **estão prontos e robustos**. Para abrir a usuários reais, o pendente de segurança é **rotacionar os segredos** (crítico) + os 2 ajustes menores acima.
