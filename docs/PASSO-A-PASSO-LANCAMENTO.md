# 🚦 Passo a passo — Caminho crítico de lançamento (RoteiroApp)

> Guia acionável dos itens que **só você pode destravar** (contas/chaves/máquina).
> Onde diz **🤖 eu faço**, é só você me passar o dado e eu executo (tenho acesso ao Railway).
> **Ordem recomendada:** 1 → 2 → 3 → 4 (segurança primeiro, loja por último).
> Atualizado: 2026-07-09

**Legenda:** ⬜ a fazer · ✅ feito · 🤖 eu executo a parte técnica

---

## ✅ 1. Rotacionar os 3 segredos expostos — CONCLUÍDO (2026-07-09)

> Resend: chave nova setada no Railway (`re_cMxfLv5v…`) + antigas deletadas. Cloudflare e Railway tokens revogados. **Efeito colateral esperado:** revogar o token do Railway derrubou meu acesso via MCP — para eu voltar a setar variáveis (Cloudinary/Stripe), reconecte o MCP do Railway ou setará você mesmo no painel.

<details><summary>Passo a passo original (referência)</summary>

### 1.0 Rotacionar os 3 segredos expostos (15 min)

Esses tokens apareceram no nosso chat, então precisam ser **trocados** (o antigo revogado, um novo gerado). Não é opcional: com eles, alguém poderia mexer no seu Railway, DNS e e-mail.

### 1.1 Resend (chave de e-mail) — `re_RY5…`
1. Acesse **https://resend.com/api-keys** (logado).
2. Ache a chave atual → menu **⋯** → **Delete** (revoga a antiga).
3. Clique **Create API Key** → nome `roteiroapp-prod` → permissão **Full access** → **Create**.
4. **Copie a nova chave** (`re_…`) — ela só aparece uma vez.
5. **🤖 me mande a nova chave** que eu atualizo `RESEND_API_KEY` no Railway e disparo o redeploy. (Ou você mesmo: Railway → serviço → **Variables** → `RESEND_API_KEY` → colar → Deploy.)

### 1.2 Cloudflare (token de DNS) — `cfat_…`
1. Acesse **https://dash.cloudflare.com/profile/api-tokens**.
2. Ache o token que criamos (permissão *Edit zone DNS*) → **⋯** → **Delete** (ou **Roll** para gerar novo valor).
3. Só crie um token novo se for usar de novo; senão, deixe deletado. **Não precisa** ficar guardado no app.

### 1.3 Railway (token de projeto) — `12c36365-…`
1. Acesse **https://railway.com/account/tokens** (ou *Project Settings → Tokens* se for token de projeto).
2. Ache o token → **Delete/Revoke**.
3. Se quiser que eu continue gerenciando o Railway por MCP, isso usa a **sua sessão autenticada**, não esse token — pode revogar sem medo.

> ✅ **Concluído quando:** as 3 chaves antigas estão deletadas e o `RESEND_API_KEY` novo está no Railway (login por e-mail voltando a funcionar).

</details>

---

## 💾 2. Backup automático do Postgres (URGENTE — 20 min)

Hoje, se o banco corromper, **os dados dos clientes se perdem**. Precisa de snapshot automático + 1 teste de restauração.

### 2.1 Ativar backup agendado no Railway
1. Railway → seu projeto → clique no serviço **Postgres**.
2. Aba **Backups** (ou **Settings → Backups**, dependendo da versão do painel).
3. Ative **Scheduled backups** → frequência **Daily** → retenção **7 dias** (ou mais).
4. Salve. O primeiro snapshot roda na próxima janela; force um **"Backup now"** para ter um já.

### 2.2 (Reforço) Dump manual externo — recomendado
Backup dentro do mesmo provedor não protege contra o provedor cair. Um dump semanal fora:
1. Railway → Postgres → **Variables/Connect** → copie a **`DATABASE_URL`** (a pública/`PUBLIC_URL`).
2. Numa máquina com `pg_dump` instalado (Postgres client):
   ```bash
   pg_dump "COLE_A_DATABASE_URL_AQUI" -Fc -f roteiroapp_2026-07-09.dump
   ```
3. Guarde o arquivo `.dump` num lugar seguro (Google Drive/HD externo).
4. **🤖 posso** montar um script `scripts/backup-db.ps1` pronto pra você rodar/agendar.

### 2.3 Testar a restauração (o passo que quase todo mundo pula)
1. Crie um **banco Postgres novo e vazio** (Railway → New → Database → Postgres, ou local).
2. Restaure o dump nele:
   ```bash
   pg_restore --clean --no-owner -d "URL_DO_BANCO_DE_TESTE" roteiroapp_2026-07-09.dump
   ```
3. Confirme que as tabelas/registros vieram. Deu certo? Pode apagar o banco de teste.

> ✅ **Concluído quando:** backup diário ligado **e** você já restaurou 1 dump com sucesso.

---

## 🖼️ 3. Cloudinary — ligar os uploads de foto (10 min)

O código de upload (documentos, hospedagem, atividades) **já está pronto**; só falta a conta e 2 variáveis. Fluxo *unsigned* = seguro, sem segredo no servidor.

1. Crie conta grátis em **https://cloudinary.com** (o plano free cobre bem o início).
2. No **Dashboard**, anote o **Cloud name** (ex.: `dxxxx123`).
3. Vá em **Settings (engrenagem) → Upload → Upload presets → Add upload preset**.
4. Configure:
   - **Signing Mode:** `Unsigned` ← **essencial**.
   - **Preset name:** anote (ex.: `roteiroapp_unsigned`).
   - (Opcional) **Folder:** `roteiroapp` para organizar.
5. Salve e copie o **nome do preset**.
6. **🤖 me mande `Cloud name` + `nome do preset`** que eu seto no Railway:
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
   e faço o redeploy. Depois disso, o botão de foto aparece e funciona em todo o app.

> ✅ **Concluído quando:** você consegue anexar uma foto num documento/hospedagem no app e ela abre pelo link.

---

## 💳 4. Stripe — pagamento do Premium (1–2 h)

⚠️ **Atenção:** diferente do Cloudinary, aqui **o código ainda não existe** — hoje o "Assinar Premium" é um `alert()`. São duas frentes:

### 4.A — O que **eu** faço (autônomo, posso começar já)
- Criar a rota `POST /api/stripe/checkout` (cria sessão de checkout).
- Criar a rota `POST /api/stripe/webhook` (recebe confirmação e marca `User.plan = PREMIUM`).
- Trocar o `alert()` do `/pricing` por um botão que chama o checkout.
- Deixar tudo lendo de variáveis de ambiente (não sobe nada sem suas chaves).

### 4.B — O que **você** faz (conta + chaves)
1. Crie conta em **https://stripe.com** e **ative** (dados do negócio; exige CNPJ/MEI para receber de verdade — ver item 6).
2. **Products → Add product** → nome `RoteiroApp Premium` → preço **recorrente** (ex.: mensal/anual) → salve e copie o **Price ID** (`price_…`).
3. **Developers → API keys** → copie a **Publishable key** (`pk_…`) e a **Secret key** (`sk_…`).
4. **Developers → Webhooks → Add endpoint** → URL `https://roteiroapp.com/api/stripe/webhook` → evento `checkout.session.completed` (e `customer.subscription.deleted`) → copie o **Signing secret** (`whsec_…`).
5. **🤖 me mande** `sk_…`, `whsec_…`, `pk_…` e o `price_…` que eu seto no Railway:
   `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRICE_PREMIUM`.

> ✅ **Concluído quando:** você consegue assinar em modo de teste e sua conta vira PREMIUM sozinha.

---

## 📱 5. Publicar nas lojas (depende de conta + Mac)

Nenhum é código — é conta/dinheiro/máquina.

### 5.1 Google Play (Android) — US$ 25 (pagamento único)
1. **https://play.google.com/console** → criar conta de desenvolvedor (US$ 25, uma vez).
2. Verificação de identidade (documento) — pode levar alguns dias.
3. Criar o app → preencher ficha (nome, descrição, categoria "Viagens").
4. Gerar o **APK/AAB assinado** (Capacitor + Android SDK). **🤖 posso** te dar o passo a passo do build quando chegar aqui.

### 5.2 Apple App Store (iOS) — US$ 99/ano + **Mac obrigatório**
1. **https://developer.apple.com** → Apple Developer Program (US$ 99/ano).
2. **Mac** (físico ou serviço em nuvem tipo MacinCloud) — o build iOS **só** roda em macOS.
3. Xcode → `npx cap add ios` → build → subir via **App Store Connect**.

### 5.3 Ativos das lojas (você precisa fornecer/aprovar)
- **Logo em alta resolução** quadrada (mín. 1024×1024) para ícones/splash finais.
- **Screenshots** das telas nos tamanhos de cada loja (dá pra gerar depois com o app rodando).
- Textos de ficha (título, descrição curta/longa, palavras-chave) — **🤖 a Nova redige** quando você quiser.

### 5.4 Push (opcional no 1º lançamento)
- **FCM** (Android, grátis) e **APNs** (iOS, incluso no Apple Dev) → chaves para notificação.
- **🤖 posso** codar a integração; sem as chaves, fica só o código pronto.

> ✅ **Concluído quando:** app aprovado e visível na Play Store e na App Store.

---

## ⚖️ 6. Legal / negócio (para receber dinheiro e proteger a marca)

1. **MEI ou CNPJ** — necessário para o Stripe repassar o dinheiro e emitir nota. MEI abre grátis em **https://www.gov.br/mei**.
2. **INPI — registro de marca** "RoteiroApp" (Classe 42, ~R$355) em **https://www.gov.br/inpi**. Protege o nome. *(já mapeado nas notas do projeto)*
3. **Contas de afiliado** (Booking.com, seguro viagem, etc.) → me passe os IDs de indicação e eu ligo em `NEXT_PUBLIC_*_REF` (os blocos de afiliado já estão no código).

> ✅ **Concluído quando:** CNPJ/MEI ativo, Stripe recebendo, e marca protocolada no INPI.

---

## 🎯 Resumo do que eu posso fazer assim que você me passar os dados
| Você me dá | Eu executo |
|---|---|
| Nova chave Resend | Seto `RESEND_API_KEY` no Railway + redeploy |
| Cloud name + preset Cloudinary | Seto as 2 vars + redeploy → uploads ligam |
| Chaves Stripe + Price ID | Seto as vars **e já codifico** checkout/webhook |
| "pode codar o Stripe" | Escrevo as rotas de pagamento (sem chave, fica pronto p/ ativar) |
| IDs de afiliado | Ligo os blocos de afiliado |
