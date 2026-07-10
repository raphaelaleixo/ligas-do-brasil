# Handoff: Ligas do Brasil — Redesign

## Overview
"Ligas do Brasil" é um portfólio-manifesto que defende uma reforma estrutural do futebol brasileiro: substituir os campeonatos estaduais + Brasileirão por **6 Ligas Regionais** (18 clubes na Série A + 18 na Série B cada) mais duas copas nacionais em mata-mata (**Copa dos Campeões** no formato Libertadores, e **Copa do Brasil** com 216 clubes). O site tem 5 páginas: uma home (tese + widgets de evidência), o manifesto (long-read), as tabelas das ligas regionais, o calendário anual por arquétipo de clube, e a estrutura das copas nacionais.

Este pacote é o **redesign completo** das 5 páginas — uma reinvenção visual "broadcast manifesto": tipografia expandida pesada, paleta vívida brasileira, e visualizações de dados com estética de apresentação (não dashboard).

## About the Design Files
Os arquivos deste bundle são **referências de design criadas em HTML** — protótipos que mostram a aparência e o comportamento pretendidos, **não código de produção para copiar diretamente**. Eles são "Design Components" (`.dc.html`): HTML com estilos inline e uma pequena classe de lógica JS, renderizados por um runtime próprio (`support.js`).

A tarefa é **recriar estes designs no ambiente do codebase de destino** (React, Vue, Svelte, etc.), usando os padrões e bibliotecas já estabelecidos lá. O projeto original (pasta `futebol-br`) é **HTML/CSS/JS vanilla com ES modules, sem build step** — CSS em camadas (`@layer`), container queries, `light-dark()`, view transitions. Se for continuar nesse mesmo ambiente vanilla, o redesign pode ser portado 1:1 para os arquivos CSS/JS existentes. Se migrar para um framework, use os valores abaixo como fonte da verdade.

> **Importante:** os estilos inline dos `.dc.html` e a classe `Component` são um artefato do runtime de preview. Não copie `support.js` nem a estrutura `<x-dc>` para produção — extraia os **valores** (cores, tipografia, espaçamento, lógica de dados) e reimplemente com CSS/componentes reais.

## Fidelity
**Alta fidelidade (hifi).** Cores, tipografia, espaçamento e interações são finais. Recrie a UI fielmente usando as bibliotecas/padrões do codebase. Os números exibidos (tabelas, métricas, calendário) são **dados reais** — ver seção Dados.

---

## Design Tokens

### Cores
| Token | Hex | Uso |
|---|---|---|
| `--ink` | `#0C0E0A` | Fundo escuro, texto principal, seções "ato escuro" |
| `--paper` | `#F4EFE3` | Fundo claro (cream), texto sobre escuro |
| `--green` | `#00A85A` | Verde vívido — acento primário, Liga Regional, zona de classificação |
| `--green-deep` | `#046B38` | Verde escuro — eyebrows sobre cream, deltas positivos, Libertadores |
| `--gold` | `#FFCB05` | Ouro — CTAs, destaques, Copa dos Campeões, seleção de texto |
| `--blue` | `#0A46B0` | Azul bandeira — Copa do Brasil, seção manifesto (home) |
| `--terra` | `#D8552F` | Terracota — "modelo atual", zona de rebaixamento, Sul-Americana, objeções |

`::selection` = fundo `--gold`, texto `--ink`.

### Tipografia (Google Fonts)
- **Archivo Expanded** (700/800/900) — títulos/headlines, uppercase, `letter-spacing:-0.02em` a `-0.03em`, `line-height:0.9–1.05`.
- **Archivo** (400–900) — corpo, números tabulares (`font-variant-numeric:tabular-nums`), UI.
- **Space Mono** (400/700) — eyebrows, labels de dados, índices de seção, nav. `letter-spacing:0.04em–0.28em`, `text-transform:uppercase`.

Import: `https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400..900;1,400..600&family=Archivo+Expanded:wght@600..900&family=Space+Mono:wght@400;700&display=swap`

### Escala de tamanhos (fluida, clamp)
- Hero h1: `clamp(3rem,10vw,9rem)` (home), `clamp(2.1rem,5.5vw,4.25rem)` (manifesto)
- Título de página: `clamp(2.4rem,7vw,5.5rem)`
- Título de seção (h2): `clamp(1.6rem,4vw,3.5rem)`
- Números grandes (métricas): `clamp(3rem,6vw,4.75rem)`
- Corpo: `clamp(1rem,1.6vw,1.28rem)`, line-height 1.5–1.7
- Eyebrow/label mono: `0.66rem–0.8rem`

### Layout
- Largura máxima de conteúdo: `1180px` (páginas de dados), `720px` (coluna de leitura do manifesto), `960px` (heros de texto).
- Padding de seção: `clamp(2.5rem,6vw,7rem)` vertical, `clamp(1.25rem,4vw,3.5rem)` horizontal.
- Padrão de "grid com hairlines": `display:grid; gap:1px; background:rgba(.,.,.,0.14); border:1px solid rgba(.,.,.,0.14)` com cada célula em fundo sólido — cria linhas de 1px sem borders individuais.
- Nav sticky: altura 64px, `background:rgba(12,14,10,0.88)`, `backdrop-filter:blur(10px)`.

### Motivo de marca
Mini-campo de futebol em SVG (retângulo + linha central + círculo central em ouro) no wordmark. Versão grande (tactical board verde com círculo central ouro) no hero da home. **Substituiu** os hexágonos originais a pedido — não reintroduzir hexágonos.

---

## Screens / Views

### 1. Início (`Início.dc.html`)
Home / landing com a tese e widgets de evidência. Sequência de "atos" alternando fundos ink / green / paper / blue.
- **Hero** (ink): eyebrow "Manifesto · 2026", h1 "O problema não é o calendário. **É a escala.**" (payoff em ouro), parágrafo, CTA ouro. SVG de campo à direita.
- **01 Escala** (green): comparação Brasil (20 clubes elite, 8,5M km², 214M) vs Portugal (18, 92k km², 10M); punchline "2 clubes a mais... 92× maior... 21× maior".
- **02 Analogia** (paper): tabela 6 ligas ↔ 6 países europeus por população (Nordestina/Itália 54M↔59M, Paulista/Inglaterra 44M↔57M, Central/Espanha 37M↔48M, Sulista/Ucrânia 30M↔32M, Rio-Capixaba/Países Baixos 20M↔18M, Amazônica/Portugal 18M↔10M).
- **03 Impacto** (ink): 5 métricas em números verdes gigantes — 216 clubes / 63 teto de jogos / 10 meses / 0 desempregados em abril / >50% redução de voos.
- **04 Jogos** (paper): barras de workload, terracota (atual) vs verde (reforma). Elite finalista 75→63 (−16%); Base 13→35 (+169%).
- **05 Gigantes** (ink): **waffle charts** de público (cada célula = 1.000 pessoas, células ouro sobre cinza). Remo 32k, Paysandu 30k, Sport 28k, Santa Cruz 22k, Coritiba 20k, Goiás 18k, Náutico 17k, Vila Nova 14k, América-RN 8k.
- **06 Ídolos** (paper): cards de jogadores revelados (Romário/Olaria, Ronaldo/São Cristóvão, Rivaldo/Santa Cruz, Lúcio/Guará, Cafu/Itaquaquecetuba, Roberto Carlos/União São João).
- **07 Manifesto** (blue): quote-payoff + tiles de navegação.

> Nota: o usuário preferiu **waffle charts** às barras na seção Gigantes — manter waffle.

### 2. Manifesto (`Manifesto.dc.html`)
Long-read editorial. Foco em experiência de leitura.
- Hero ink (thesis em ouro), coluna de leitura centrada 720px sobre paper, marcadores de seção numerados 01–06.
- Seções: 01 funil estreito, 02 nova arquitetura (lista das 6 ligas como grid colorido), 03 laboratório de ídolos, pull-quote verde (teto 63 jogos), 04 menos jogos/voos, 05 três objeções (cada uma: quote itálico terracota + refutação), 06 reforma de escala.
- Finale ink: "Parte da **forma**." + links para Ligas e Copas.
- **Template-only** (sem lógica JS). Todo o texto é copy verbatim — preservar exatamente.

### 3. Ligas Regionais (`Ligas.dc.html`)
Tabelas de classificação. Tabs para as 6 ligas.
- Title band ink + tabs (aba ativa = ouro).
- **Tabela Série A** (18 clubes): colunas #, Clube, J, V, E, D, GP, GC, SG, Pts. Zona verde (Copa dos Campeões, borda-esquerda + tint) e terracota (rebaixamento). Números tabulares.
- Sidebar meta: população da região, equivalente europeu, vagas na Copa dos Campeões (card verde), vaga Sul-Americana, Série B.
- **Lê dados de `data/season-default.json`** via `fetch` (ver Dados). Estado: `sel` (índice da liga).

### 4. Calendário (`Calendario.dc.html`)
Calendário anual de 46 semanas por arquétipo de clube. 4 tabs.
- Title band ink + tabs: Elite finalista / Vaga Sul-Americana / Regional Série A / Série B.
- Header do arquétipo: subtitle + 3 counters (Reforma / Modelo atual / Diferença).
- Legenda de cores por competição.
- **Grid de 46 semanas**: colunas Semana | Fim-de-semana | Meio-de-semana. Cada slot colorido pela competição; finais com borda ink de 3px.
- Toda a lógica de calendário está **portada de `archetypes.js`** para a classe `Component` (datas ancoradas em 2024, FIFA breaks, rest weekends, mapas de rodadas por arquétipo). Estado: `arch`.

### 5. Copas Nacionais (`Copas.dc.html`)
Estrutura das duas copas. 3 tabs.
- **Copa dos Campeões**: grid de vagas por região (10/10/8/8/8/4 → 48), 4 potes, sorteio-exemplo de 12 grupos (badges por pote: P1 ouro, P2 verde, P3 azul, P4 terracota), exemplo cross-pot do Grupo A, ladder de mata-mata (16-avos→final).
- **Copa do Brasil**: **funil** (verde sobreviventes vs terracota eliminados por fase, badges BYE em ouro), bypass Conmebol, callout de byes (ink), ladder.
- **Vagas Conmebol**: Libertadores (7 vagas, cascata) + Sul-Americana (6 vagas, uma por região).
- **Template-only** de dados estáticos (todos os arrays no `renderVals`). Estado: `tab`.

---

## Interactions & Behavior
- **Tabs** (Ligas, Calendário, Copas): clique troca o conteúdo via estado local. Aba ativa = fundo ouro/texto ink; inativa = transparente/texto cream com borda sutil. Fila horizontal com scroll (scrollbar oculta).
- **Nav sticky**: link da página atual em ouro; demais em cream 70%. Links entre as 5 páginas por `<a href>` relativo.
- **CTAs / tiles**: hover translada `translateY(-2px)` ou escurece o fundo (transição 120–140ms ease).
- **`<details>`** (Copas, "Por que as cruzadas são intra-pote?"): accordion nativo.
- Sem animações de entrada/scroll — o foco é clareza e leitura.

## State Management
- **Ligas**: `sel` (0–5) — liga selecionada; `season` (JSON carregado) + `error`; derivados `rows`, `ready`, `loading`.
- **Calendário**: `arch` (chave do arquétipo) — recomputa 46 semanas em `renderVals`.
- **Copas**: `tab` (`campeoes`|`brasil`|`conmebol`).
- **Início / Manifesto**: sem estado interativo (Início tem só dados estáticos em `renderVals`).

## Dados
- **`data/season-default.json`** (incluído): temporada simulada (seed 143). Estrutura relevante: `meta` (totalClubes 216, tetoJogos 63, mesesGarantidos 10, etc.) e `ligasRegionais[]` com `nome`, `tabelaA[]` (posicao, nome, jogos, vitorias, empates, derrotas, golsPro, golsContra, saldoGols, pontos, id), `qualificadosCampeoes[]`, `rebaixados[]`.
- A página **Ligas** faz `fetch('./data/season-default.json')` no `componentDidMount`. Em produção, sirva esse JSON ou substitua pela fonte de dados real com o mesmo shape.
- No projeto original, esse JSON é **gerado por um simulador Node** (`futebol-br/src/sim/`, modelo de Poisson + RNG semeado, com testes Vitest). Se precisar regenerar dados, esse simulador é a fonte.

## Assets
- Nenhuma imagem raster. O único gráfico é o **SVG do campo de futebol** (inline, no wordmark e no hero da home) — copiável diretamente.
- Fontes via Google Fonts (Archivo, Archivo Expanded, Space Mono).
- Bandeiras são emojis (🇧🇷 🇵🇹 🇮🇹 🏴󠁧󠁢󠁥󠁮󠁧󠁿 🇪🇸 🇺🇦 🇳🇱). Se o codebase evita emoji, trocar por assets de bandeira.

## Files (neste bundle)
- `Início.dc.html`, `Manifesto.dc.html`, `Ligas.dc.html`, `Calendario.dc.html`, `Copas.dc.html` — os 5 designs.
- `data/season-default.json` — dados da temporada simulada.
- `support.js` — runtime de preview dos `.dc.html`. **Não portar para produção**; presente apenas para os arquivos abrirem/renderizarem localmente.

## Como reimplementar (resumo)
1. Escolha o ambiente (ou continue no vanilla ES-modules do projeto original).
2. Extraia os tokens acima para variáveis CSS / tema.
3. Recrie cada página com componentes reais; mova os estilos inline para CSS/classes do seu sistema.
4. Ligue a página de Ligas ao JSON (ou à fonte de dados real com o mesmo shape).
5. Porte a lógica de calendário a partir de `Calendario.dc.html` → `renderVals` (é uma cópia fiel de `archetypes.js`).
6. Preserve todo o copy em português **verbatim**.
