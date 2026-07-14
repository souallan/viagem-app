# Pesquisa — Necessidades, Dúvidas e Dores de Viajantes (foco Brasil + tendências globais)

**Data:** 2026-07-11
**Objetivo:** Alimentar o RoteiroApp com base real de necessidades, dúvidas e dores de quem planeja e faz viagens, para posicionar o app como uma "experiência de viagem completa, guiada e organizada, com poucas surpresas".
**Método:** Pesquisa web (fontes brasileiras e internacionais, 2025–2026). Fontes citadas ao final e ao longo da tabela.

> **Nota:** A coluna "Já existe no RoteiroApp?" está marcada como **"a confirmar"** em todos os itens — este documento foca na pesquisa de mercado, não na auditoria do código. Uma etapa seguinte deve cruzar esta lista com as features já implementadas.

---

## 1. Contexto — o que a pesquisa revelou (síntese)

Três achados estruturais orientam tudo o que segue:

1. **Sobrecarga cognitiva é a dor nº1 do planejamento.** Mais de **70% dos viajantes** consideram estressante pelo menos uma parte do processo de reserva/planejamento; "decision-light travel" (viagem com poucas decisões) virou expectativa central, não luxo. [Advanced Adventures / The Traveler]
2. **Fragmentação de ferramentas é o "imposto" invisível.** O viajante médio usa **4 a 5 ferramentas separadas** para uma única viagem (mapa, Splitwise, planilha, WhatsApp, prints), e o custo real é a troca constante de contexto e a duplicação de dados. [Plot a Trip / TripGoGo]
3. **Ansiedade concreta antes de viajar:** **44% temem atrasos/cancelamentos** e **20% chegam a desistir de viajar** por isso; o medo se concentra em "e se eu passar mal longe de casa?" e "meu voo vai realmente sair?". [IPX1031 / The Traveler]

Para um app que promete "poucas surpresas", isso significa: **o valor não está em mais informação, e sim em orientação no momento certo, consolidação num só lugar e lembretes proativos.**

---

## 2. Tabela principal — Necessidades / Dúvidas → Feature

| # | Necessidade / Dúvida / Dor | Frequência / Relevância | Como o app pode ajudar (feature concreta) | Já existe no RoteiroApp? |
|---|----------------------------|-------------------------|-------------------------------------------|--------------------------|
| **DOCUMENTOS E BUROCRACIA** |
| 1 | "Meu passaporte é válido para essa viagem?" (regra dos 6 meses de validade a partir da saída) | Altíssima — erro clássico que "acaba com a viagem"; deixado pra última hora | Campo de validade do passaporte + **alerta automático** se faltarem <6 meses na data de embarque; checklist de documentos por destino | a confirmar |
| 2 | "Preciso de visto para esse país? Quanto tempo demora?" | Altíssima — varia por destino, processo pode levar semanas/meses | Base de exigências de visto por nacionalidade+destino; **contagem regressiva** com prazo recomendado para dar entrada | a confirmar |
| 3 | "O que apresentar na imigração pra não ser barrado?" (comprovante de hospedagem, passagem de volta, ~USD 1.000/mês, vínculos com o Brasil, carta-convite) | Alta — inadmissão é medo real; 214(b) e inconsistências são causas comuns | Checklist "pasta da imigração" por destino: passagem de volta, reserva, comprovante financeiro, seguro; guia do que dizer/levar | a confirmar |
| 4 | "RG serve ou preciso de passaporte?" (Mercosul aceita CIN/RG <10 anos; resto exige passaporte válido) | Média-alta — confusão frequente em viagens à América do Sul | Lógica por destino que indica documento aceito (RG/CIN vs passaporte) automaticamente | a confirmar |
| **SAÚDE E SEGURO** |
| 5 | "Preciso de seguro viagem? De quanto?" (Schengen exige cobertura mín. €30.000; obrigatório na Europa) | Altíssima — obrigatório em vários destinos, ignorado por iniciantes | Alerta "este destino exige seguro de €30k"; campo para anexar apólice; lembrete de contratar antes de emitir passagem | a confirmar |
| 6 | "Preciso de vacina? (febre amarela / CIVP)" — 47 países exigem CIVP; vacina 10 dias antes | Alta — específico por destino, prazo crítico (10 dias de antecedência) | Base de exigências de vacina por destino + **alerta de prazo** ("tome a vacina até X para valer no embarque"); onde emitir CIVP (Meu SUS Digital) | a confirmar |
| 7 | "E se eu passar mal longe de casa?" (medo nº1 global em 2026) | Altíssima (tendência global) | Ficha de emergência offline: hospitais próximos, telefone do seguro, embaixada/consulado, contato de emergência, alergias/medicamentos | a confirmar |
| **DINHEIRO E CÂMBIO** |
| 8 | "Quanto dinheiro levar? Em espécie ou cartão?" (recomendação: ~USD 200–300 em espécie + diversificar meios) | Altíssima | Calculadora de orçamento por dia/destino; sugestão de mix (espécie + cartão internacional); lembrete "não dependa de um só meio" | a confirmar |
| 9 | "Qual a melhor forma de câmbio?" (evitar câmbio de aeroporto; Wise/Nomad/conta global; comprar aos poucos) | Alta — brasileiros fecham viagem ~72 dias antes e esquecem o câmbio | Acompanhamento de cotação + dica de comprar moeda gradualmente; comparativo de meios; conversor de moeda embutido | a confirmar (há /currency e exchange-rate) |
| 10 | "Estou dentro do orçamento?" (controle de gastos durante a viagem) | Alta | Orçamento planejado vs realizado, por categoria, multimoeda; alerta quando estourar | a confirmar (há /budget e expenses) |
| **CONECTIVIDADE** |
| 11 | "Como ter internet no exterior? Chip, eSIM ou roaming?" (eSIM em alta; escolha varia por duração/roteiro) | Alta — dúvida quase universal hoje | Guia "conectividade para este destino" (eSIM vs chip vs roaming) conforme duração e nº de países; lembrete de ativar antes de embarcar | a confirmar |
| 12 | "Vou perder meu WhatsApp?" (manter número original + eSIM de dados) | Média-alta | Orientação de manter linha BR + dados locais; checklist pré-embarque de configuração do celular | a confirmar |
| **BAGAGEM E O QUE LEVAR** |
| 13 | Esquecimento de itens: adaptador de tomada (29%), medicamentos (25%), carregador portátil (17%), pijama, chinelo, escova de dente | Altíssima — dados de pesquisa PanRotas/2025 | **Lista de bagagem inteligente** gerada por clima+duração+destino+tipo de viagem, já destacando os itens mais esquecidos (adaptador, remédios, powerbank) | a confirmar (há /packing) |
| 14 | "Vou pagar excesso de bagagem?" (custo e estresse no embarque) | Alta | Regras de franquia por companhia; alerta de peso/dimensões; lembrete de despachar/levar caneta p/ formulários de imigração | a confirmar |
| 15 | Tipo de tomada / voltagem do destino | Média | Ficha do destino com padrão de tomada e voltagem | a confirmar |
| **PLANEJAMENTO DO ROTEIRO** |
| 16 | "O que fazer no destino? Como montar o roteiro dia a dia?" (erro comum: só decidir na chegada; não considerar geografia nem horários de funcionamento) | Altíssima — 75% que usam IA querem recomendações; 70% querem montar roteiro | Roteiro dia-a-dia com **otimização por localização geográfica** e horários de funcionamento; sugestões de atividades por perfil | a confirmar (há /itinerary e activities/suggest) |
| 17 | "Estou perdendo tempo indo e voltando?" (não agrupar atividades por região) | Alta | Visualização em mapa + agrupamento inteligente de atividades próximas; alerta de deslocamento ineficiente | a confirmar (há /map) |
| 18 | Fadiga de decisão / sobrecarga cognitiva no planejamento | Altíssima (tendência global — >70% acham estressante) | Modo "roteiro guiado / decision-light": app propõe um plano pronto e editável em vez de tela em branco | a confirmar |
| **RESERVAS E PRAZOS** |
| 19 | "Quando comprar passagem?" (doméstico 2–3 meses; América do Sul 3–4; longo curso 5–8 meses; véspera até 800% mais cara) | Alta | Guia de antecedência por tipo de rota + lembrete "hora ideal de comprar"; alerta de check-in (abre 48h antes) | a confirmar |
| 20 | "Quando tirar o passaporte?" (emissão 6–10 dias úteis, mas total pode passar de 1 mês) | Alta — gargalo que inviabiliza viagens | Contagem regressiva a partir da data da viagem: "dê entrada no passaporte até X"; checklist de prazos críticos | a confirmar |
| 21 | Perder check-in / conexão / prazo de reserva | Alta — atrasos e conexões perdidas entre os maiores desafios | Linha do tempo de prazos com push: check-in, reconfirmação, prazos de cancelamento grátis | a confirmar |
| **DURANTE A VIAGEM** |
| 22 | Barreira do idioma (crítico em situações médicas) | Alta | Frases essenciais offline por idioma (emergência, saúde, transporte); ficha médica traduzida | a confirmar |
| 23 | Bagagem extraviada, atrasos, conexões perdidas | Alta | Guia "o que fazer se..." (bagagem sumiu, voo atrasou, perdi conexão) + contatos do seguro/companhia à mão | a confirmar |
| 24 | Segurança no destino: golpes a turistas, bairros a evitar, transporte confiável | Alta — aeroportos/áreas turísticas são pontos quentes de golpe | Ficha de segurança por destino: golpes comuns locais, áreas a evitar à noite, "use só táxi de app/hotel", dicas de discrição | a confirmar |
| 25 | Acesso offline (sem/ com roaming caro) a mapas e documentos | Altíssima — "killer feature" citada para viajantes | Roteiro, documentos, reservas e mapa disponíveis **offline**; download antes de sair do wifi | a confirmar |
| **GRUPO E FAMÍLIA** |
| 26 | Dividir despesas em grupo sem estresse (planilhas falham; recibos se perdem) | Alta — principal fonte de atrito em viagem em grupo | Divisão de contas embutida (igual / por uso / por partes), multimoeda, saldo de quem deve a quem | a confirmar (há group-balances, expense-shares) |
| 27 | Viajar com crianças (dividir "meia" criança; itens e ritmo específicos) | Média-alta | Perfis por participante (adulto/criança) na divisão e na bagagem; sugestões de roteiro family-friendly | a confirmar (há TripParticipant) |
| 28 | Coordenação do grupo espalhada no WhatsApp/prints | Alta (parte da fragmentação) | Roteiro colaborativo compartilhado com permissões de ver/editar; tudo num lugar só | a confirmar (há /members, /share) |
| **META / EXPERIÊNCIA DO APP** |
| 29 | Fragmentação: 4–5 apps por viagem (mapa + Splitwise + planilha + WhatsApp + prints) | Altíssima (tendência global) | Posicionamento all-in-one: roteiro + orçamento + bagagem + documentos + grupo num app único e conectado | a confirmar |
| 30 | Apps atuais (Wanderlog/TripIt): parsing de e-mail falho, ficam lentos em viagens grandes, UI datada, notificações repetitivas, sem sync de calendário | Alta — motivos concretos de abandono | Import confiável de reservas, performance em roteiros longos, sync com calendário, notificações úteis (não spam), UI atual | a confirmar |

---

## 3. Momentos-chave onde um lembrete/orientação evita problema

Estes são os "gatilhos" de maior valor para engajamento e para a promessa de "poucas surpresas":

| Momento | Prazo típico | Lembrete que o app deve disparar |
|---------|-------------|----------------------------------|
| Emissão de passaporte | 6–10 dias úteis (real: até 1 mês+) | "Dê entrada no passaporte já" ao criar viagem internacional |
| Validade do passaporte | Regra dos 6 meses | Alerta se validade < 6 meses da data de saída |
| Solicitação de visto | Semanas a meses | Contagem regressiva por destino |
| Vacina febre amarela / CIVP | Vacina ≥10 dias antes | "Vacine-se até X para valer no embarque" |
| Seguro viagem | Antes de emitir passagem / obrigatório Schengen | "Este destino exige seguro de €30k — contrate" |
| Compra de passagem | Longo curso 5–8 meses; barato ~30–40 dias antes | "Janela ideal de compra se aproximando" |
| Câmbio | Comprar gradualmente, não no aeroporto | Acompanhamento de cotação + lembrete de comprar aos poucos |
| Ativar eSIM/chip | Antes de embarcar | Checklist pré-embarque de conectividade |
| Check-in | Abre ~48h antes | Push "check-in abriu" |
| Download offline | Antes de sair do wifi | "Baixe roteiro, mapa e documentos para uso offline" |

---

## 4. Diferenças por tipo de viagem

| Segmento | Necessidades específicas | Implicação para o app |
|----------|--------------------------|-----------------------|
| **Internacional vs Nacional** | Internacional: passaporte, visto, seguro, vacina, câmbio, imigração, conectividade. Nacional: erro comum é não planejar nada e decidir na hora | Fluxos condicionais: viagem internacional dispara o "kit burocracia"; nacional foca em roteiro e orçamento |
| **Primeira viagem internacional** | Não sabe o que não sabe; medo de imigração; câmbio; "o que ninguém te conta" | Modo iniciante: checklist guiado passo a passo + conteúdo educativo ("primeira viagem") |
| **Sozinho** | Segurança pessoal, conectividade constante, ficha de emergência | Ênfase em segurança do destino e contatos de emergência offline |
| **Família / com crianças** | Ritmo, itens extras, divisão "meia" criança, roteiro family-friendly | Perfis por participante; sugestões family-friendly; bagagem por pessoa |
| **Grupo de amigos** | Divisão de contas, coordenação, decisões coletivas | Colaboração + split de despesas + roteiro compartilhado |

---

## 5. Resumo executivo — as 10 necessidades de maior impacto

Priorizadas por frequência × relevância × alinhamento com a promessa de "poucas surpresas":

1. **Central única (anti-fragmentação).** O maior diferencial possível: consolidar roteiro + orçamento + bagagem + documentos + grupo num só app, eliminando as 4–5 ferramentas soltas. → *Posicionamento core do produto.*
2. **Timeline de prazos críticos com lembretes proativos** (passaporte, visto, vacina, seguro, check-in, câmbio, eSIM). É aqui que "poucas surpresas" se materializa. → *Feature: motor de alertas por data da viagem + destino.*
3. **Checklist de documentos e burocracia por destino** (passaporte, validade 6 meses, visto, o que levar na imigração). → *Feature: base de regras destino+nacionalidade.*
4. **Alertas de saúde e seguro** (seguro obrigatório Schengen €30k; vacina/CIVP com prazo de 10 dias). → *Feature: exigências de saúde por destino.*
5. **Lista de bagagem inteligente** por clima/duração/tipo, destacando os itens mais esquecidos (adaptador 29%, remédios 25%, powerbank 17%). → *Feature: gerador de packing + os "mais esquecidos".*
6. **Roteiro dia-a-dia otimizado por geografia e horários de funcionamento**, com sugestões por perfil (modo "decision-light" contra a fadiga de decisão). → *Feature: itinerário com otimização de rota + horários.*
7. **Orçamento e câmbio** (quanto levar, mix espécie/cartão, evitar aeroporto, planejado vs realizado multimoeda). → *Feature: calculadora + tracking + conversor.*
8. **Guia de conectividade** (eSIM vs chip vs roaming conforme roteiro; manter WhatsApp; ativar antes de embarcar). → *Feature: recomendação de conectividade + checklist pré-embarque.*
9. **Modo offline** para roteiro, documentos, reservas e mapa — "killer feature" citada para viajantes sem roaming. → *Feature: sync/download offline.*
10. **Divisão de despesas e colaboração em grupo/família** (split igual/uso/partes, multimoeda, meia-criança, roteiro compartilhado). → *Feature: split embutido + colaboração com permissões.*

**Conteúdos editoriais de alto valor a criar** (reforçam SEO e a promessa guiada): "Primeira viagem internacional — passo a passo"; "O que apresentar na imigração para não ser barrado"; "Seguro viagem: quando é obrigatório e de quanto"; "eSIM vs chip vs roaming"; "Quanto dinheiro levar e como fazer câmbio"; "Os 10 itens que os brasileiros mais esquecem na mala"; "Golpes contra turistas por destino".

**Princípio de design que atravessa tudo:** o app não deve entregar mais informação — deve entregar **a orientação certa no momento certo**, de forma proativa e consolidada. É a diferença entre "mais um app de viagem" e "a experiência guiada que evita surpresas".

---

## 6. Fontes

**Documentos, visto, imigração, passaporte**
- Worldpackers — Documentos para viagem nacional/internacional: https://www.worldpackers.com/pt-BR/articles/quais-documentos-levar-para-uma-viagem-nacional-ou-internacional
- SegurosPromo — Documentos para embarque internacional: https://www.segurospromo.com.br/blog/documentos-para-embarque-internacional/
- Polícia Federal — Prazo para pegar passaporte: https://www.gov.br/pf/pt-br/assuntos/passaporte/ajuda/duvidas_/inicio/inicio-em-quantos-dias-consigo
- Mobills — Quanto tempo demora para tirar passaporte: https://www.mobills.com.br/blog/viagens/quanto-tempo-demora-para-tirar-passaporte/
- Melhores Destinos — 8 motivos que fazem brasileiros serem barrados nos EUA: https://www.melhoresdestinos.com.br/barrados-imigracao-estados-unidos.html
- MRE — Inadmissão/denegação de entrada nos EUA: https://www.gov.br/mre/pt-br/consulado-chicago/assistencia-a-brasileiros/inadmissao-nos-eua-denegacao-de-entrada

**Seguro e saúde/vacinas**
- Carpe Mundi — 20 dúvidas sobre seguro viagem: https://www.carpemundi.com.br/duvidas-sobre-seguro-viagem/
- Administradores — Viagem internacional com seguro pela primeira vez: https://www.administradores.com.br/noticias/o-que-considerar-antes-de-fazer-uma-viagem-internacional-pela-primeira-vez-com-um-seguro-de-viagem
- Anvisa — Lista de países que exigem CIVP (febre amarela): https://www.gov.br/anvisa/pt-br/assuntos/paf/certificado-internacional-de-vacinacao/arquivos/lista-simplificada-de-paises-que-exigem-o-civp-febre-amarela
- Estado de Minas — Países que exigem vacina de febre amarela em 2026: https://www.em.com.br/trends/2026/01/7340814-vai-viajar-em-2026-veja-a-lista-de-paises-que-exigem-vacina-da-febre-amarela.html
- Fui Ser Viajante — CIVP 2026, como emitir: https://www.fuiserviajante.com/planejamento/certificado-internacional-de-vacinacao/

**Erros comuns / primeira viagem**
- TSR Viajar — 5 erros na primeira viagem internacional: https://tsrviajar.com.br/planejamento-de-viagem/5-erros-comuns-viajantes-primeira-viagem-internacional/
- Mundo Viajar — 10 erros que arruínam a primeira viagem internacional: https://mundoviajar.com.br/10-erros-que-arruinam-a-primeira-viagem-internacional-e-como-evita-los/
- Universal Assistance — Primeira viagem internacional, o que ninguém te conta: https://www.universal-assistance.com/br-blog/primeira-viagem-internacional-seguro-viagem/
- Terra — Erros mais comuns segundo agentes de turismo: https://www.terra.com.br/vida-e-estilo/turismo/all-signature/os-erros-mais-comuns-dos-viajantes-de-acordo-com-agentes-de-turismo,c477dab37905f568cad11d89e1c325faspz4jgzz.html

**Bagagem / esquecimentos**
- PanRotas — O que brasileiros priorizam e esquecem ao fazer as malas (pesquisa 2025): https://www.panrotas.com.br/mercado/pesquisas-e-estatisticas/2025/09/o-que-os-brasileiros-priorizam-e-esquecem-na-hora-de-fazer-as-malas_220994.html
- Metrópoles — O que brasileiros mais esquecem na mala: https://www.metropoles.com/vida-e-estilo/o-que-os-brasileiros-mais-esquecem-na-hora-de-fazer-a-mala
- Carpe Mundi — 10 coisas que as pessoas esquecem na mala: https://www.carpemundi.com.br/coisas-que-as-pessoas-mais-esquecem-de-colocar-na-mala/

**Conectividade (eSIM/chip/roaming)**
- Viaje na Viagem — Celular no exterior (roaming x chip x wifi x eSIM): https://www.viajenaviagem.com/celular-no-exterior/
- Nomad Global — Guia do chip internacional (eSIM e chip físico): https://www.nomadglobal.com/conteudos/chip-internacional
- Embale Para Viagem — Internet no exterior: chip, eSIM ou roaming: https://www.embaleparaviagem.com.br/blog/internet-no-exterior-chip-esim-ou-roaming/

**Câmbio / dinheiro**
- Viaje na Viagem — Cartão global para viagem: https://www.viajenaviagem.com/cartao-global-para-viagem/
- Nomad Global — Nomad ou Wise, melhor conta internacional 2026: https://www.nomadglobal.com/conteudos/nomad-ou-wise
- Melhores Destinos — Nomad x Wise comparativo: https://www.melhoresdestinos.com.br/nomad-wise-comparativo.html

**Grupo / família / divisão de despesas**
- Nomad Global — Viagem em grupo, como organizar e dividir gastos: https://www.nomadglobal.com/conteudos/viagem-em-grupo
- BlaBlaCar — Apps para dividir contas em viagem: https://blog.blablacar.com.br/dicas/app-para-dividir-contas-em-viagem
- Viajantes por Opção — Splitwise para dividir despesas: https://viajantesporopcao.com/splitwise-app-para-dividir-despesas-de-viagem/

**Segurança / golpes**
- Melhores Destinos — Dicas de segurança em viagens: https://www.melhoresdestinos.com.br/dicas-de-seguranca-viagens.html
- Melhores Destinos — 15 golpes de viagem mais comuns: https://www.melhoresdestinos.com.br/golpes-viagens-como-evitar.html
- Estado de Minas — Destinos com mais golpes contra turistas: https://www.em.com.br/emfoco/2025/07/16/os-destinos-com-mais-golpes-contra-turistas-segundo-especialistas/

**Reservas / antecedência**
- Exame — Quanto tempo antes comprar passagem mais barata: https://exame.com/casual/passagem-aerea-mais-barata/
- Onfly — Impacto da antecedência na passagem aérea: https://www.onfly.com.br/blog/antecedencia-na-passagem-aerea-melhor-preco/

**Apps de viagem / fragmentação / tendências globais**
- Plot a Trip — Your trip planning tool stack is more complex than it needs to be: https://plotatrip.app/blog/trip-planning-tool-stack
- TripGoGo — Why trip planning still feels broken: https://tripgogo.ai/content/blog/why-trip-planning-still-feels-broken/
- BluePlanit — Wanderlog vs TripIt 2026: https://blueplanit.co/blog/wanderlog-vs-tripit
- Tripstone — Wanderlog vs TripIt, real verdict: https://tripstone.app/blog/wanderlog-vs-tripit
- IPX1031 — Americans Travel Report 2026: https://www.ipx1031.com/americans-travel-report-2026/
- The Traveler — Health Emergencies and Flight Chaos Top 2026 Travel Fears: https://www.thetraveler.org/health-emergencies-and-flight-chaos-top-2026-travel-fears/
- Advanced Adventures — Top Travel Trends in 2026: https://www.advadventures.com/blog/top-travel-trends-in-2026/
- HUMAN Security — Americans' Use of AI for Travel: https://www.humansecurity.com/learn/blog/ai-use-for-travel-planning-survey/
- Travala — How many travelers use AI for booking (2026): https://www.travala.com/blog/how-many-travelers-use-ai-for-booking-key-insights-for-2026/
