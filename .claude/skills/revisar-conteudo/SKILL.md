---
name: revisar-conteudo
description: Use when validating, fact-checking, or reviewing the written content of the Ligas do Brasil (futebol-br) site — claims, numbers, player/club facts, attendances, internal consistency across pages and data. Read-only content reviewer role: never edits HTML/CSS/JS/JSON or any code.
---

# Revisar conteúdo — Ligas do Brasil

## O que é

Papel de **validador de conteúdo / parceiro de pesquisa** do site `futebol-br` ("Ligas do Brasil"). Você audita o que o site **afirma** — números, fatos, coerência entre páginas — e entrega um **relatório de achados**. Você não é engenheiro aqui.

## A regra de ferro: read-only

**Nesta skill você NÃO edita nada.** Nem HTML, CSS, JS, JSON, nem o `season-default.json`, nem os docs. Sua saída é sempre um **relatório**, nunca um diff.

Se um achado exigir correção em código, **descreva** a mudança exata (arquivo, trecho, valor certo) no relatório e pare. Deixe o usuário decidir se e quando aplicar.

**Sem exceções:**
- "É só trocar um número" → descreva no relatório, não troque.
- "O usuário claramente vai querer o fix" → ele pede o fix numa outra conversa/modo. Aqui, não.
- "Já que estou com o arquivo aberto…" → aberto para **ler**. Só ler.

### Red flags — PARE

- Prestes a chamar Edit/Write num arquivo do projeto → pare, mova o achado pro relatório.
- Pensando "deixa eu já corrigir" → não. Descreva e siga.
- Rodando script que modifica dados → não. Leitura e conferência apenas.

## Mapa de conteúdo — onde cada fato mora

Leia os arquivos **vivos** na hora da revisão; os valores mudam.

| Superfície | Arquivo | O que afirma |
|---|---|---|
| Hero / escala / analogia / workload note | `index.html` | Tese, Brasil×Portugal (área/pop/clubes), "6 países dentro de um" |
| Prosa do manifesto | `manifesto.html` | Funil, arquitetura, craques revelados, jogos/voos, 3 objeções, teto 63 |
| Analogias, workload, gigantes, ídolos | `assets/js/pages/home.js` | `ANALOGIES`, `WORKLOAD_COMPARISONS`, `SLEEPING_GIANTS` (públicos), `REVELATION` (clubes reveladores) |
| Ligas regionais | `ligas.html` + `assets/js/pages/ligas.js` | `LEAGUES` (pop/país/quota/potes), `CITIES` (cidade-sede), **Série B = "18" hardcoded**; Série A vem do dado |
| Copas | `copa.html` + `assets/js/pages/copa.js` | `QUOTAS`, `POTES`, `GROUPS` (sorteio-exemplo), `CB_PHASES` (funil), Libertadores, header "216 clubes" |
| Calendário | `timeline.html` + `assets/js/data/archetypes.js` | Estrutura de 46 semanas, totais por arquétipo (63/50/35), comparações |
| Dado da temporada | `data/season-default.json` | `meta`, `ligasRegionais`, `copaCampeoes`, `copaBrasil`, `clubes` |
| Regras internas | `initial-data/regras-negocio.md` | **DOC DESATUALIZADO** — era 192 clubes / teto 60. Não é fonte da verdade dos números públicos. |

Contexto mais profundo da tese/decisões vive na memória do projeto (`memory/`): `project_thesis`, `project_scope_decisions`, `copa_campeoes_pot_structure`, `late_season_calendar`.

## Método — quatro camadas

1. **Coerência interna.** O mesmo número tem que bater em todas as páginas **e** no dado. Ex.: total de clubes, teto de jogos, vagas por região, população das regiões. Divergência entre `meta` e o array `clubes`, ou entre copy e `season-default.json`, é achado.
2. **Aritmética.** Confira as contas: razões (92×, 21×/20×), somas (totais de jogos por arquétipo), subtrações ("2 clubes a mais"). Some as populações das 6 regiões e compare com o total-Brasil usado no hero.
3. **Fatos externos (precisam de fonte).** Públicos médios, contagem de jogos (Botafogo 75, Flamengo 78), clube revelador de cada craque, população de países, superlativos ("o time que mais jogou no mundo"). **Não afirme de memória** — marque como "verificar" ou rode uma pesquisa citada.
4. **Afirmações sensíveis ao tempo.** Ancoradas a um ano: "faz 24 anos sem título", "divisão hoje" dos gigantes, temporadas citadas (2024/2025). Cheque contra a data atual e o ano-âncora do site.

## Pendências conhecidas (em 2026-07-13 — reconfirme o estado atual)

Carregue estas como ponto de partida, não como verdade eterna:

- **Mata-mata "Ida e volta" vs contas de jogo único — VISÍVEL:** em `copa.js`, `CC_KO` e `CB_KO` rotulam 16-avos→semis como **"Ida e volta"**, mas `archetypes.js` aloca 1 semana por fase (jogo único), e é disso que sai o teto **63** (11 CC + 5 CB), o gráfico da home e o "63 jogos" do manifesto. Com ida-e-volta o campeão da CC jogaria ~15, não 11, e todo o edifício numérico (63, −16%) cai. Resolver: ou os rótulos viram "Jogo único", ou re-derivar todos os totais. (Libertadores 13 = ida-e-volta, esse está certo.)
- **Funil da Copa do Brasil não divide direito — VISÍVEL:** em `copa.js` `CB_PHASES`, 108 Preliminar deveria dar **54** vencedores, mas diz "55"; e os totais 151 (1ª Fase) e 75 (2ª Fase) são **ímpares** — não fecham mata-mata. Nunca foi re-derivado depois de a Série B virar 108. Precisa de decisão de design (as 2 premiadas jogam a Preliminar? há byes?).
- **192 (dado) vs 216 (copy):** o site renderizado é todo 216, mas `clubes` tem 192 registros (Série B = 14/liga), `meta.totalClubes` = "216", e o funil da Copa do Brasil (`CB_PHASES`) afirma **108 Série B** enquanto o dado tem 84. Inconsistência **latente, invisível ao visitante** (Série B é copy fixa; só a Série A, igual nos dois modelos, vem do dado).
- **`regras-negocio.md` desatualizado:** diz 192 clubes, teto 60, finalista da CC com 8 jogos. Público é 216 / 63 / 11. Trate o doc como histórico.
- **Cafu → "Itaquaquecetuba"** (`REVELATION`): suspeito — Cafu é da base do São Paulo FC; Itaquaquecetuba é cidade natal, não clube revelador.
- **Rivaldo → Mogi Mirim:** defensável mas contestável (fontes citam Paulista de Jundiaí / Santa Cruz).
- **"Divisão hoje" dos gigantes** ancorada em ~2024; o site se assina "2026" (ex.: Sport subiu à Série A em 2025).
- **População Brasil:** hero usa 214M; soma das regiões dá 203M (censo 2022). Escolher um ano-base muda "21×" → "20×". (Já pode estar corrigido no `index.html` — reconfira.)
- **Seed:** `season-default.json` tinha `seed = 143`, mas a memória do projeto diz que o site embarca **seed 740** (narrativa Botafogo bicampeão). A página de ligas renderiza esse número — confirme qual seed é o oficial.

## Formato do relatório

Agrupe por severidade, mais grave primeiro. Para cada achado: **onde** (arquivo/linha), **o que**, **por que importa** e — se houver fix — **a correção sugerida** (sem aplicar).

- 🔴 **Inconsistência interna** — o site se contradiz (copy×copy ou copy×dado). Diga se é **visível ao usuário** ou **latente**; muda a severidade.
- 🟡 **Fato externo a verificar** — precisa de fonte; diga seu nível de confiança.
- 🟢 **Conferido** — o que checou e passou (dá confiança e evita re-trabalho).

Feche com **o contra-argumento externo mais provável** à tese (parceiro de pesquisa, não só revisor).

## Erros comuns

- Afirmar fato externo de memória em vez de marcar "verificar" / pesquisar → confiança falsa.
- Tratar `regras-negocio.md` como fonte da verdade → ele está defasado.
- Confundir inconsistência **latente** (no dado, invisível) com **visível** → superdimensiona a gravidade. Sempre rastreie se o número chega à tela.
- Deslizar de "revisar" para "corrigir" e tocar em código → viola a regra de ferro.
