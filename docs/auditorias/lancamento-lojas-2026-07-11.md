# Auditoria — Lançamento nas Lojas (Apple App Store + Google Play)

**Data:** 2026-07-11
**App:** RoteiroApp — planejador de viagens (Next.js empacotado com Capacitor, iOS + Android)
**Titular:** MEI brasileira (Carla A. A. Zausa) · Assinatura Premium vendida via **Stripe na web**
**Fontes:** documentação oficial Apple/Google + análises atualizadas 2025/2026 (links no final)

> **Aviso:** regras de loja mudam com frequência (o cenário de pagamentos externos mudou 3x só em 2025). Reconfirmar tudo na documentação oficial no dia da submissão. Este relatório reflete o estado em **julho/2026**.

---

## Resumo do contexto

- **Não é um app "reader"** (Netflix/Spotify puros de consumo). É um app funcional (planejador). Isso **importa** para as regras de pagamento.
- Vende **conteúdo digital / assinatura** (Premium) → cai nas regras de **compra dentro do app (IAP)** da Apple e no **Google Play Billing**.
- Empacotado com **Capacitor** (webview + web bundle local) → risco principal na Apple é a **Guideline 4.2 (funcionalidade mínima / "site embrulhado")**.
- Titular é **MEI** (pessoa jurídica brasileira simples) → decisão importante: entrar como **Indivíduo/Sole Proprietor** ou como **Organização** (exige D-U-N-S). Isso afeta prazo, nome de vendedor exibido e — no Google — a **isenção do teste de 12 testadores**.

---

## TABELA-MESTRE DE REQUISITOS

| # | Item | Apple App Store | Google Play | Status / O que fazer |
|---|------|-----------------|-------------|----------------------|
| 1 | **Taxa da conta** | **US$ 99/ano** (recorrente) | **US$ 25** (pagamento único, vitalício) | Provisionar orçamento. Apple é custo anual fixo. |
| 2 | **Tipo de conta** | Individual/Sole Proprietor **ou** Organização | Personal **ou** Organization | Decidir cedo (ver #3). Nome do vendedor exibido na loja = nome legal (individual) ou razão social (org). |
| 3 | **Verificação de identidade / D-U-N-S** | Individual: nome legal + telefone + endereço (sem caixa postal), 2FA. **Organização: exige número D-U-N-S** (Dun & Bradstreet, gratuito, ~5–30 dias p/ obter) + autoridade legal p/ assinar contratos | Personal: **ID governamental** com foto (passaporte/RG), 2FA, e-mail de suporte, país. **Organization: exige D-U-N-S** + docs da empresa | **Obter D-U-N-S JÁ se for entrar como empresa** (é o gargalo de prazo). Verificação Google leva 24h–3 dias; Apple pode levar dias/semanas p/ organização. |
| 4 | **Requisito de teste antes de publicar** | **TestFlight** (interno até 100, externo até 10k com revisão do beta) — recomendado, não obrigatório p/ publicar | **Contas PERSONAL novas (criadas após 13/11/2023): obrigatório closed testing com ≥12 testadores por 14 dias consecutivos** antes de pedir acesso à produção. **Contas ORGANIZATION são ISENTAS** | **Decisão estratégica:** conta **Organization** no Google evita o gargalo dos 12 testadores. Se Personal: recrutar 12 e-mails Gmail reais e mantê-los ativos 14 dias sem quebrar a sequência. |
| 5 | **Pagamento de assinatura digital** | Regra geral: conteúdo digital consumido no app **deve** usar IAP (comissão 15–30%). **EUA (pós-Epic, mai/2025): permitido incluir link externo p/ pagar no site, sem entitlement.** Fora dos EUA: IAP **ou** entitlement de link externo (regiões designadas) | Regra geral: **Google Play Billing** obrigatório p/ digital (15–30%). EEE (DMA): billing alternativo / user-choice / external offers. EUA: mudanças em curso pós-decisões judiciais | **Ver seção "Pagamentos" abaixo — é o ponto mais delicado.** Estratégia recomendada: manter venda Premium no **site** + estratégia de link/entitlement conforme o mercado. |
| 6 | **Funcionalidade mínima (anti "site embrulhado")** | **Guideline 4.2 — motivo nº 1 de rejeição de app Capacitor.** Precisa parecer "app-like": navegação nativa, push, offline, uso de APIs nativas | Menos rígido, mas apps quebrados / "só um webview" também caem | Usar **plugins nativos Capacitor** (Push, Câmera, Haptics, Compartilhar, Offline). Bundle web **local**, não carregar URL externa full-page. |
| 7 | **Privacidade — rótulos** | **Privacy Nutrition Labels** (App Privacy) obrigatório no App Store Connect | **Data Safety form** obrigatório no Play Console | Preencher com honestidade: o que coleta, se rastreia, uso de terceiros (Stripe, analytics). Divergência com a prática = rejeição. |
| 8 | **Privacy Manifest (Apple)** | **PrivacyInfo.xcprivacy** obrigatório desde mai/2024 — declara APIs de motivo exigido e SDKs de terceiros | N/A | Capacitor e plugins precisam de manifesto. Verificar que cada plugin/SDK declara seu manifesto. |
| 9 | **Exclusão de conta (in-app)** | **Obrigatório** desde 30/06/2022: apps com criação de conta devem permitir excluir a conta **dentro do app** + apagar dados | **Obrigatório**: opção de exclusão **dentro do app** + **URL de exclusão** preenchida em campo do Play Console | RoteiroApp já tem `DELETE /api/user`. **Expor botão de excluir conta na UI do app** e cadastrar URL no Google. |
| 10 | **Política de Privacidade acessível** | Link obrigatório no App Store Connect + dentro do app | Link obrigatório no Play Console + dentro do app | Já existe `/privacy`. Garantir link público e estável (link quebrado = rejeição comum no Google). |
| 11 | **Permissões justificadas** | Cada permissão precisa de string de uso no Info.plist (ex.: NSCameraUsageDescription) | Cada permissão avaliada; permissões sensíveis exigem declaração | Só pedir o que usa. Preencher strings de uso p/ todo plugin nativo. |
| 12 | **Ícones / Splash / Screenshots** | Ícone 1024×1024 sem alpha/cantos; screenshots por tamanho de tela; sem placeholders | Ícone 512×512, **feature graphic 1024×500**, screenshots, (preview de vídeo opcional) | Gerar assets nativos (`@capacitor/assets`). Screenshots reais, sem "lorem ipsum". |
| 13 | **Versões mínimas de OS / SDK** | Buildar com SDK/Xcode recentes exigidos pela Apple (atualizam anualmente) | **targetSdkVersion** precisa atender ao mínimo vigente do Play (sobe todo ano) | Manter Capacitor e toolchains atualizados antes de submeter. |
| 14 | **Tamanhos de tela / responsivo** | Suporte a iPhone (e idealmente iPad, ou declarar iPhone-only) | Suporte a phones; tablets recomendável | Testar safe-areas, notch, telas pequenas/grandes. |
| 15 | **Faixa etária / classificação** | App Age Rating questionnaire | **Content rating (IARC)** questionnaire | Responder com honestidade; ocultar tema adulto = rejeição no Google. |
| 16 | **Estabilidade** | App não pode crashar/travar; funcionalidades completas na revisão | **Pre-launch report** roda em devices virtuais; crashes/ANRs reprovam | Testar todos os fluxos logado; sem telas "em breve"/botões mortos. |
| 17 | **Conta de teste p/ revisor** | Fornecer **login demo** se houver área logada (senão rejeição por "não conseguimos acessar") | Fornecer credenciais de teste em "App access" | Criar usuário demo com Premium ativo e documentar no formulário de revisão. |
| 18 | **HTTPS / rede** | App Transport Security (sem HTTP inseguro) | Cleartext bloqueado por padrão | Todas as chamadas de API em HTTPS (já é o caso). |
| 19 | **Prazo de revisão** | Mediana **24–48h** (90% em 48h) | Poucas horas (conta estabelecida) a alguns dias; contas novas mais lentas | Submeter com folga antes de qualquer data de marketing. |

---

## Pagamentos — a regra crítica (leia com atenção)

O app vende **Premium (assinatura digital)**. Ambas as lojas historicamente **exigem seu sistema de pagamento** (IAP / Google Play Billing) para conteúdo digital consumido no app, cobrando **15–30%** de comissão. Isso colide com a venda via **Stripe na web**. Estado atual:

### Apple
- **Regra base:** bens/assinaturas digitais usados dentro do app → **devem** usar In-App Purchase (Guideline 3.1.1). Cobrar por fora "escondido" = rejeição.
- **EUA (pós-Epic, atualização das guidelines em mai/2025):** apps na loja dos **EUA podem incluir botões/links externos** apontando para pagamento no site, **sem entitlement e sem restrição de design/posição** imposta pela Apple.
  - **Dez/2025:** tribunal de apelação decidiu que a Apple **pode voltar a cobrar uma comissão "razoável"** sobre compras feitas via link externo (percentual ainda em definição judicial). Ou seja: link externo nos EUA é permitido, mas **pode não ser 100% livre de comissão** daqui pra frente. Reconfirmar antes de submeter.
- **Fora dos EUA:** ou usa IAP, ou solicita o **StoreKit External Purchase Link Entitlement** (disponível em regiões designadas — ex.: UE pelo DMA; **verificar se o Brasil está incluído**, historicamente não estava).
- **Implementação técnica do link externo (quando permitido):** usar a API `ExternalPurchaseLink` do StoreKit; o link **precisa abrir no Safari/navegador padrão** — **não** pode abrir em `SFSafariViewController` nem em `WKWebView` (isso é reprovado na revisão). Copy do aviso é templada pela Apple. Há **obrigação de reportar transações** à Apple (até ~15 dias) para cálculo de comissão.
- **"Reader app"?** Reader apps (só consomem conteúdo comprado fora) podem usar pagamento externo exclusivo. **Um planejador de viagens NÃO é reader app** — não conte com essa isenção.

### Google
- **Regra base:** conteúdo digital → **Google Play Billing** obrigatório (15% no primeiro US$1M/ano via programa, 30% acima).
- **EEE (DMA, ago/2025):** opções de **billing alternativo**, **user-choice billing** (redução ~4%) e **External Offers Program** (link out, redução ~3%, passando por tela de aviso do Google).
- **EUA:** políticas em mudança por decisões judiciais (caso Epic v. Google) — link externo vem sendo destravado, reconfirmar estado atual.
- **Brasil:** fora do escopo do DMA. Regra base do Play Billing tende a valer. Vender digital "por fora" sem billing pode reprovar.

### Como Spotify/Netflix lidam (e o que dá pra copiar)
- Eles se enquadram (ou negociaram) como **reader apps** e/ou **removeram totalmente a compra do app**: o app **não menciona preço nem botão de assinar**, o usuário se cadastra/paga **no site** e apenas **faz login** no app. Isso reduz o atrito com as regras (embora "anti-steering" tenha limites).

### Recomendação prática para o RoteiroApp
1. **Caminho de menor atrito e menor risco de rejeição (MVP):** lançar o app com Premium adquirido **apenas via web (Stripe)**; **dentro do app, NÃO exibir preço nem botão de compra** — apenas permitir **login** de quem já é Premium e mostrar um estado "gerencie sua assinatura no site" (sem link de compra chamativo). Isto é o modelo Netflix/Spotify e minimiza confronto com 3.1.1 / Play Billing.
   - Risco residual: a Apple pode ainda pedir IAP se interpretar que você está "direcionando" à compra externa. Manter linguagem neutra.
2. **Nos EUA:** avaliar adicionar **link externo de pagamento** (entitlement StoreKit) para melhorar conversão — sabendo que comissão pode incidir.
3. **Caminho "sem dor de cabeça" para monetizar dentro do app:** implementar **IAP/Play Billing** de fato para a assinatura in-app e manter Stripe só na web. Custa 15–30%, mas elimina risco de rejeição por pagamento. Pode ser fase 2.
4. **Nunca:** colocar botão "Assine por R$ X no site" abertamente dentro do app fora dos casos permitidos — é o gatilho clássico de rejeição 3.1.1.

---

## Principais motivos de REJEIÇÃO e como evitar

### Apple (mais comuns)
1. **4.2 Funcionalidade mínima / "site embrulhado"** — nº 1 para apps Capacitor. *Evitar:* recursos nativos (push, câmera, haptics, offline, compartilhamento), navegação app-like, bundle local. Nunca descrever como "acesse nosso site no celular".
2. **3.1.1 Pagamento externo de digital sem IAP** — cobrar assinatura por fora indevidamente. *Evitar:* ver seção de pagamentos.
3. **5.1.1 Privacidade / Nutrition Labels incompletos ou divergentes** — *Evitar:* preencher App Privacy com precisão; PrivacyInfo.xcprivacy presente.
4. **2.1 App incompleto / crashes / login demo ausente** — *Evitar:* conta de teste com Premium, todos os fluxos funcionando, sem placeholders.
5. **Permissões sem justificativa (strings de uso faltando)** — *Evitar:* preencher Info.plist para cada plugin.
6. **5.1.1(v) Exclusão de conta ausente** — *Evitar:* botão de excluir conta na UI.

### Google (mais comuns)
1. **Falha no closed testing (12 testadores/14 dias)** para conta Personal nova — *Evitar:* conta Organization (isenta) ou recrutar testadores de verdade.
2. **Link de política de privacidade quebrado/ausente** — *Evitar:* URL pública estável.
3. **Data Safety incompleto/impreciso** — *Evitar:* declarar corretamente coleta e compartilhamento (Stripe, analytics).
4. **Permissões abusivas / não usadas** — *Evitar:* princípio do mínimo necessário.
5. **Crashes / ANRs no pre-launch report** — *Evitar:* testar em vários devices.
6. **Metadados enganosos / conteúdo "thin" / classificação etária escondida** — *Evitar:* descrição honesta e alinhada ao app.
7. **1.75M+ apps bloqueados em 2025 por violação de política** — manter conformidade geral.

---

## Armadilhas a evitar (específicas de Capacitor / webview)

- **Carregar a URL de produção (site) full-page dentro do webview** → Apple trata como "web clip" e reprova. **Empacote o bundle web localmente**; o webview só faz **chamadas de API**, não navega para o site inteiro.
- **App sem nenhum recurso nativo** → 4.2. Adicione pelo menos push (APNs/FCM), compartilhamento nativo e offline.
- **Esquecer PrivacyInfo.xcprivacy** dos plugins e do app → rejeição desde mai/2024.
- **Plugins que acessam device sem string de uso no Info.plist** (câmera, fotos, localização) → rejeição.
- **OTA / atualização de código não-nativo (ex.: Capacitor live update / Capgo)** — permitido só se **não** alterar funcionalidade revisada e for entregue de forma segura/criptografada; mudar comportamento por OTA viola as regras.
- **SDKs desatualizados** / target SDK antigo → reprova em ambas.
- **Deep links e safe-areas quebrados** (notch, barra inferior) → má experiência, risco no Google e 4.2 na Apple.
- **Botão de compra/preço visível no app** apontando ao Stripe web (fora dos casos permitidos) → 3.1.1 / Play Billing.
- **Divergência entre Nutrition Labels/Data Safety e o comportamento real** (ex.: usar analytics não declarado) → rejeição e risco de suspensão.
- **Login social/credenciais sem conta demo** para o revisor → "não conseguimos testar".

---

## Checklist pré-submissão

**Contas & identidade**
- [ ] Decidir Individual vs Organização (Apple) e Personal vs Organization (Google).
- [ ] Se Organização: **solicitar D-U-N-S já** (gargalo de prazo).
- [ ] Ativar 2FA nas contas Apple/Google.
- [ ] Pagar US$99 (Apple) e US$25 (Google).

**Legal & privacidade**
- [ ] Política de Privacidade e Termos públicos, links estáveis (`/privacy`, `/terms`).
- [ ] Preencher **App Privacy (Nutrition Labels)** e **Data Safety**.
- [ ] **PrivacyInfo.xcprivacy** no app e nos plugins.
- [ ] Botão **Excluir conta** dentro do app + **URL de exclusão** no Play Console.
- [ ] Strings de uso de permissões no Info.plist.

**Técnico / build**
- [ ] Ícones (1024 Apple, 512 Google) + **feature graphic 1024×500** (Google) + screenshots reais por tamanho de tela.
- [ ] Bundle web **local**; nenhum carregamento full-page da URL de produção.
- [ ] Ao menos 2–3 recursos nativos (push, share, offline, câmera) p/ passar na 4.2.
- [ ] Capacitor, Xcode e targetSdk atualizados ao mínimo vigente.
- [ ] Todas as chamadas em HTTPS; ATS ok.
- [ ] Testar safe-areas / telas pequenas e grandes / sem crashes.

**Pagamentos**
- [ ] Definir estratégia (modelo Netflix: login-only no app; ou IAP/Play Billing; ou link externo EUA).
- [ ] Garantir que o app **não exibe preço/botão de compra externo** fora dos casos permitidos.

**Submissão**
- [ ] **Conta demo com Premium** e credenciais no formulário de revisão (App access / notas).
- [ ] Descrição da loja honesta (nada de "acesse nosso site").
- [ ] Classificação etária respondida.
- [ ] Google: **closed testing 12/14 concluído** (se Personal) → pedir produção.
- [ ] Apple: (opcional recomendado) rodada de **TestFlight**.

---

## RESUMO EXECUTIVO — 8 pontos mais críticos + ordem de execução

1. **D-U-N-S é o gargalo de prazo.** Se for entrar como empresa (MEI), solicitar o D-U-N-S **agora** (pode levar semanas). Isso também isenta a conta Google do teste de 12 testadores.
2. **Guideline 4.2 (Apple) é o maior risco técnico** para app Capacitor. Sem recursos nativos e com carregamento full-page do site, reprova. Bundle local + push + share + offline.
3. **Pagamento é o maior risco de política.** Assinatura digital exige IAP/Play Billing por padrão. Estratégia MVP recomendada: **modelo Netflix** — vender Premium só no site, e no app apenas **login** (sem preço/botão de compra).
4. **Google: conta Personal nova exige 12 testadores por 14 dias** antes da produção. Conta **Organization é isenta** — decidir isso cedo muda o cronograma.
5. **Exclusão de conta in-app é obrigatória** em ambas as lojas (Apple desde 2022, Google com URL no Console). Já há endpoint; falta expor na UI.
6. **Privacidade: Nutrition Labels + Data Safety + PrivacyInfo.xcprivacy**, tudo coerente com a prática real (Stripe/analytics declarados). Link de privacidade quebrado é rejeição comum no Google.
7. **Conta demo com Premium para o revisor** é obrigatória em área logada, senão rejeição por "não conseguimos testar".
8. **Regras de pagamento externo mudaram 3x em 2025 e seguem em disputa judicial** (Epic/EUA, DMA/UE). Reconfirmar o estado exato no dia da submissão antes de decidir link externo vs IAP.

### Ordem recomendada de execução
1. **Decidir tipo de conta** (Apple + Google) e, se empresa, **solicitar D-U-N-S**. Abrir e verificar as duas contas de desenvolvedor.
2. **Definir estratégia de pagamento** (recomendado: login-only no app, Premium via Stripe web). Ajustar UI para remover qualquer botão/preço de compra dentro do app.
3. **Ajustes de conformidade in-app:** botão excluir conta, links de privacidade/termos, strings de permissão, PrivacyInfo.xcprivacy.
4. **Endurecer o build Capacitor** contra a 4.2: bundle local, push, share, offline; gerar ícones/splash/screenshots.
5. **Preencher** Nutrition Labels (Apple) e Data Safety (Google); criar **usuário demo Premium**.
6. **Google:** rodar closed testing (12/14) se Personal; **Apple:** rodar TestFlight.
7. **Submeter** com folga de prazo; reconfirmar regras de pagamento vigentes no dia.
8. Após aprovação, monitorar e planejar **fase 2** (IAP/Play Billing ou link externo EUA) se quiser vender dentro do app.

---

## Fontes

- [Apple Developer Program — Enroll](https://developer.apple.com/programs/enroll/) · [Enrollment help](https://developer.apple.com/help/account/membership/program-enrollment/) · [Comparar membresias](https://developer.apple.com/support/compare-memberships/)
- [App Review Guidelines (Apple)](https://developer.apple.com/app-store/review/guidelines/) · [Guideline 4.2 fórum](https://developer.apple.com/forums/thread/806726)
- [StoreKit External Purchase Link Entitlement (Apple docs)](https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.developer.storekit.external-purchase-link) · [External Purchase (Apple docs)](https://developer.apple.com/documentation/storekit/external-purchase)
- [Apple pode cobrar comissão em links externos — MacRumors (dez/2025)](https://www.macrumors.com/2025/12/11/apple-app-store-fees-external-payment-links/) · [RevenueCat — anti-steering ruling](https://www.revenuecat.com/blog/growth/apple-anti-steering-ruling-monetization-strategy/) · [TechCrunch — Apple muda regras EUA (mai/2025)](https://techcrunch.com/2025/05/02/apple-changes-us-app-store-rules-to-let-apps-redirect-users-to-their-own-websites-for-payments)
- [Google Play — Get started / Console](https://support.google.com/googleplay/android-developer/answer/6112435) · [Verify developer identity](https://support.google.com/googleplay/android-developer/answer/10841920)
- [Google Play — testing requirements p/ contas personal novas](https://support.google.com/googleplay/android-developer/answer/14151465) · [Comunidade — tudo sobre os 12 testadores](https://support.google.com/googleplay/android-developer/community-guide/255621488)
- [Google Play — Alternative billing EEA](https://support.google.com/googleplay/android-developer/answer/12348241) · [User choice billing](https://support.google.com/googleplay/android-developer/answer/13821247) · [External offers EEA](https://support.google.com/googleplay/android-developer/answer/16505463) · [Política p/ usuários dos EUA](https://support.google.com/googleplay/android-developer/answer/15582165)
- [Apple Privacy Labels](https://www.apple.com/privacy/labels/) · [Google Play Data Safety](https://support.google.com/googleplay/android-developer/answer/10787469) · [OneTrust — Data Safety vs Nutrition Label](https://www.onetrust.com/blog/google-data-safety-vs-apple-nutrition-label/) · [Ketch — in-app account deletion](https://www.ketch.com/blog/posts/in-app-account-deletion)
- [Capgo — Third-party libraries & Apple policy](https://capgo.app/blog/third-party-libraries-apple-policy-compliance/) · [Capgo — OTA updates approval](https://capgo.app/blog/capacitor-ota-updates-app-store-approval-guide/) · [MobiLoud — webview app review](https://www.mobiloud.com/blog/app-store-review-guidelines-webview-wrapper) · [Median — webview approval](https://median.co/blog/will-apple-approve-my-webview-app)
- [Adapty — Stripe para IAP em 2026](https://adapty.io/blog/can-you-use-stripe-for-in-app-purchases/) · [RevenueCat — app-to-web purchases](https://www.revenuecat.com/blog/engineering/app-to-web-purchase-guidelines)
