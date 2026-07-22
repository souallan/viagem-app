# Ficha da Google Play — RoteiroApp

Textos prontos para colar no Play Console (**Presença na loja → Listagem principal da loja**).
Idioma principal: **Português (Brasil)**.

> Regra que guiou a escrita: **nada de recurso que o app não tem**. Descrição que promete
> mais do que entrega gera review ruim (o que derruba o ranking) e pode violar a política
> de deturpação do Google. Tudo abaixo foi conferido contra o código.

---

## 1. Nome do app (máx. 30 caracteres)

```
RoteiroApp: Planejar Viagens
```
`28/30` ✅

**Por quê:** "RoteiroApp" sozinho não é pesquisado por ninguém que ainda não conhece a marca.
Colar o termo que as pessoas realmente digitam ("planejar viagens") no título é o fator de
ASO com maior peso na busca do Play.

**Alternativas** (se quiser testar depois):
- `RoteiroApp: Roteiro de Viagem` — 29/30
- `RoteiroApp: Organizar Viagem` — 28/30

---

## 2. Descrição curta (máx. 80 caracteres)

```
Roteiro dia a dia, gastos, malas, documentos e câmbio. Sua viagem organizada.
```
`77/80` ✅

**Por quê:** é o texto que aparece embaixo do nome no resultado de busca e no topo da ficha.
Vale mais listar os recursos concretos (que são os termos pesquisados) do que fazer poesia.

---

## 3. Descrição completa (máx. 4000 caracteres)

```
Planeje cada detalhe da sua viagem em um só lugar — e tenha tudo à mão na hora que importa.

O RoteiroApp reúne roteiro, reservas, gastos, malas e documentos num app só. Em vez de pular entre bloco de notas, planilha, e-mail e cinco aplicativos diferentes, você abre um e encontra tudo.

▸ ROTEIRO DIA A DIA
Monte o passo a passo de cada dia: passeios, refeições, horários e endereços. Está sem ideia? Comece de um roteiro pronto — de Paris a Tóquio — e adapte do seu jeito.

▸ HOSPEDAGEM E TRANSPORTE
Check-in, check-out e códigos de confirmação num calendário visual. Voos, ônibus, trens e aluguel de carro com horários e referências de reserva sempre à mão.

▸ GASTOS E DIVISÃO DE CONTAS
Registre o que gastou por categoria e acompanhe o orçamento. Viajando em grupo? O app divide as contas, mostra quem deve para quem e fecha tudo no fim — sem discussão e sem planilha.

▸ CÂMBIO AO VIVO
Mais de 150 moedas convertidas na hora, dentro do app. Saiba na mesma tela quanto aquele preço em euro representa em real.

▸ MALAS INTELIGENTES
Lista de bagagem que se adapta à sua viagem, com marcação do que já foi arrumado. Nunca mais descubra no aeroporto que esqueceu o carregador.

▸ DOCUMENTOS COM ALERTA DE VALIDADE
Guarde passaporte, vistos, seguro e reservas. O app avisa quando um documento está perto de vencer — antes de virar problema no embarque.

▸ MAPA E TRAJETOS
Veja seus destinos no mapa, trace a rota entre os pontos e otimize o trajeto do dia para andar menos e aproveitar mais.

▸ DIÁRIO DE VIAGEM
Registre relatos e fotos ao longo do caminho. No fim, sua viagem vira uma memória organizada em vez de mil fotos soltas na galeria.

▸ FUNCIONA SEM INTERNET
As páginas que você já abriu continuam disponíveis mesmo sem sinal — útil no metrô, no avião ou naquele país onde o roaming não pegou. Consulte roteiro e documentos offline.

▸ COMPARTILHE COM QUEM VIAJA COM VOCÊ
Convide companheiros de viagem para ver ou editar o roteiro, ou gere um link público para mostrar o plano a quem quiser.

▸ ROTEIROS DA COMUNIDADE
Veja roteiros reais criados por outros viajantes e publique os seus.

━━━━━━━━━━━━━━━━━━━━

GRATUITO DE VERDADE
O plano gratuito planeja uma viagem inteira: até 3 viagens ativas, 20 atividades por viagem, orçamento, divisão de contas, malas, documentos, diário, mapa, câmbio e exportação do roteiro em PDF. Sem cartão de crédito para começar.

PREMIUM (opcional)
Para quem viaja muito: viagens e atividades ilimitadas, roteiros da comunidade e experiências sem limite, suporte prioritário e selo de apoiador no perfil.
Assinatura recorrente com renovação automática, cobrada pelo site. Cancele quando quiser pelo próprio app — você mantém o acesso até o fim do período pago.

━━━━━━━━━━━━━━━━━━━━

Feito no Brasil, pensado para quem viaja daqui: valores em real, câmbio na moeda que você usa e tudo em português.

Sua próxima viagem começa aqui.
```

**Contagem:** ~2.450/4000 caracteres ✅ (folga proposital — descrição gigante não ajuda ranking
e ninguém lê; os 3 primeiros parágrafos são o que aparece antes do "Ler mais")

---

## 4. Configurações da ficha

| Campo | Valor |
|---|---|
| **Categoria** | Viagens e local *(Travel & Local)* |
| **Tags** (até 5) | Planejador de viagens · Roteiro · Organizador · Orçamento · Viagem |
| **E-mail de contato** | contato@roteiroapp.com |
| **Site** | https://roteiroapp.com |
| **Política de privacidade** | https://roteiroapp.com/privacy |
| **Contém anúncios?** | **Não** ⚠️ ver observação |
| **Compras no app?** | **Não** ⚠️ ver observação |

### ⚠️ Duas respostas que exigem atenção

**"Contém anúncios"** — o app tem **links de afiliados** (Booking, Skyscanner etc.).
Isso **não** é considerado anúncio pelo Google (não são ad networks servindo banners), então a
resposta é **Não**. Mas os links precisam estar identificados como patrocinados na interface —
a auditoria jurídica já apontou isso como pendência.

**"Compras no app"** — aqui está o ponto delicado. A assinatura é cobrada **pela Stripe, no
site**, e não pelo faturamento do Google Play. Responda **Não** para compras no app, e
**não inclua botão de assinatura dentro do app Android**. A política de Pagamentos do Google
exige que conteúdo digital consumido no app seja vendido pelo faturamento do Play (taxa de 15–30%).
Vender assinatura por fora, dentro do app, é motivo de remoção.
**Caminho seguro:** o app Android não oferece nem direciona para a compra; quem quiser assinar
faz isso pelo site. É o modelo que Netflix e Spotify usam.
👉 **Isso precisa ser tratado no código antes de enviar** — hoje o app mostra "Seja Premium"
levando para `/pricing`, e no Android isso precisa sumir ou virar só informação.

---

## 5. Recursos gráficos exigidos

| Item | Especificação | Status |
|---|---|---|
| Ícone | 512×512 PNG, 32 bits | ✅ existe (gerar em alta) |
| Gráfico de destaque | 1024×500 PNG/JPG | ⬜ a fazer |
| Screenshots do celular | mín. **2**, ideal **8** · 16:9 ou 9:16 · lado maior 1920px | ⬜ a fazer |
| Screenshots do tablet | opcional (recomendado, melhora ranking em tablets) | ⬜ |

**Roteiro de screenshots sugerido** (ordem importa — as 3 primeiras são as que aparecem na busca):
1. **Dashboard** com viagens e contagem regressiva — legenda: *"Todas as suas viagens num lugar"*
2. **Roteiro dia a dia** — *"Cada dia planejado, do café ao último passeio"*
3. **Gastos + divisão de contas** — *"Saiba quanto gastou e divida com o grupo"*
4. **Mapa com trajeto** — *"Veja tudo no mapa e otimize o caminho"*
5. **Malas** — *"Nunca mais esqueça nada"*
6. **Documentos com alerta** — *"Passaporte e reservas sempre à mão"*
7. **Câmbio** — *"150+ moedas convertidas na hora"*
8. **Diário** — *"Guarde as memórias da viagem"*

---

## 6. Formulário de Segurança de Dados (Data Safety)

Declarar com base no que o app **realmente** coleta:

| Dado | Coletado | Finalidade | Obrigatório |
|---|---|---|---|
| Nome, e-mail | Sim | Conta e autenticação | Sim |
| Foto de perfil | Sim (opcional) | Personalização | Não |
| Conteúdo do usuário (viagens, fotos, documentos) | Sim | Funcionalidade do app | Sim |
| Localização aproximada | Sim (opcional) | Mapa e sugestões | Não |
| Informação de pagamento | **Não** | Processada pela Stripe, fora do app | — |
| Identificadores do dispositivo | Sim | Notificações push | Não |

Marcar também:
- ✅ Dados criptografados em trânsito (HTTPS/HSTS — confirmado)
- ✅ Usuário pode solicitar exclusão dos dados (existe em Perfil → Excluir conta)
- ✅ Existe política de privacidade pública

---

## 7. Classificação de conteúdo

Questionário do IARC. Respostas esperadas para este app: **sem** violência, sexo, drogas,
linguagem imprópria, jogos de azar ou apostas. Há **conteúdo gerado por usuários**
(roteiros e comentários da comunidade) — responder **sim** e informar que existe moderação
(o backoffice tem moderação de comentários e banimento de usuários).
Classificação esperada: **Livre / 3+**.
