# Manifesto — fontes, rodada 2 (buracos do corpo + FAQ)

**Status:** nota de pesquisa (modo `revisar-conteudo`, 2026-07-14). Continuação de [`manifesto-fontes.md`](./manifesto-fontes.md), que já resolveu o Tier 1 (Botafogo 75, Flamengo 79, Madureira 13, 20×18 clubes). Esta rodada ataca as afirmações **ainda sem link** no `manifesto.html`, cobrindo **corpo e FAQ**.

Read-only: **nada aplicado ao site**. Cada achado traz a fonte + um snippet HTML no padrão da casa (`<a href target="_blank" rel="noopener noreferrer">`) pronto para colar noutra conversa/modo. Fontes verificadas por pesquisa web (5 agentes paralelos), com nível de confiança e ressalvas.

---

## Sumário — o que ficou defensável

| Ângulo | Veredito | Confiança |
|---|---|---|
| A. População das 6 regiões (IBGE 2022) | ✅ todos batem; só o Norte é 17,3M (não 17,4M) | Alta |
| A. População Portugal/Bélgica/Holanda/Grécia | ✅ todos batem | Alta |
| A. Área: Inglaterra+Espanha+Itália ≈ Sudeste | ✅ forte, mas reformular (ver ressalva) | Alta |
| B. Craques e clubes de origem | ✅ os 5 conferem | Alta |
| C. "12 grandes, 10 no Sudeste" | ✅ G-12 é conceito real; correto — mas é convenção, não oficial | Alta (com nuance) |
| D. Copa do Nordeste lota e vende cota | ✅ com números; usar pico 2024/2025 | Alta |
| E. "6 a 8 meses sem calendário" | ✅ defensável; ancorar em "100+ clubes param, só 14% têm calendário" | Média→Alta |

---

## A — POPULAÇÃO E ÁREA

### A1. População das 6 regiões (Censo IBGE 2022)
Seção "Nova arquitetura", parágrafo "cada uma das seis regiões é mais populosa que Portugal". Hoje sem link.

Todos os valores conferem com o Censo 2022. **Única correção:** o Norte é **~17,3M**, não 17,4M (o manifesto usa "17 mi" arredondado no texto — OK; mas o doc antigo dizia 17,4M).

| Região (proposta) | Manifesto | IBGE 2022 | Fonte |
|---|---|---|---|
| Nordestina | ~54,6M | 54.644.582 | [IBGE / Agência de Notícias](https://agenciadenoticias.ibge.gov.br/agencia-noticias/2012-agencia-de-noticias/noticias/37237-de-2010-a-2022-populacao-brasileira-cresce-6-5-e-chega-a-203-1-milhoes) |
| Paulista (SP) | ~44,4M | 44.420.459 | [IBGE Cidades — SP](https://cidades.ibge.gov.br/brasil/sp) |
| Central (MG+CO) | ~36,8M | ~36,83M (MG 20,54M + CO ~16,29M) | [IBGE / Agência](https://agenciadenoticias.ibge.gov.br/agencia-noticias/2012-agencia-de-noticias/noticias/37237-de-2010-a-2022-populacao-brasileira-cresce-6-5-e-chega-a-203-1-milhoes) |
| Sulista (RS+SC+PR) | ~29,9M | ~29,9M (14,7% de 203,1M) | idem |
| Rio-Capixaba (RJ+ES) | ~19,9M | 19.888.236 (RJ 16,05M + ES 3,83M) | idem |
| Amazônica (Norte) | ~17M | **~17,3M** | [Portal Amazônia / IBGE](https://portalamazonia.com/noticias/cidadania/populacao-da-regiao-norte-chega-a-17-milhoes-aponta-censo-do-ibge) |

Âncora única (a mais limpa para linkar tudo de uma vez): a matéria da **Agência IBGE** que traz o total de 203,1M e a repartição por regiões.

### A2. População dos países europeus
Manifesto: "Portugal (10 mi), Bélgica (12 mi) e Holanda (18 mi)". Todos batem (dados ~2024, [List of European countries by population — Wikipedia](https://en.wikipedia.org/wiki/List_of_European_countries_by_population)): Portugal ~10,4M · Bélgica 11,76M · Países Baixos 18,0M · Grécia 10,25M.

> Ressalva editorial: Portugal já está em **~10,4M** e subindo (imigração). "10 mi" é defensável, mas beira o piso — se quiser folga, "~10 mi". Bélgica é 11,8M ("12 mi" é arredondamento generoso, aceitável).

**Snippet pronto (parágrafo da escala populacional):**
```html
Portugal (<a href="https://en.wikipedia.org/wiki/List_of_European_countries_by_population" target="_blank" rel="noopener noreferrer">10 mi</a>), Bélgica (12 mi) e Holanda (18 mi) sustentam ligas que revelam craques e disputam a Champions — e <strong>cada uma das seis regiões é <a href="https://agenciadenoticias.ibge.gov.br/agencia-noticias/2012-agencia-de-noticias/noticias/37237-de-2010-a-2022-populacao-brasileira-cresce-6-5-e-chega-a-203-1-milhoes" target="_blank" rel="noopener noreferrer">mais populosa que Portugal</a></strong>. A menor delas, a Amazônica (17 mi), já supera Holanda, Bélgica e Grécia.
```

### A3. Área — "Inglaterra, Espanha e Itália têm o tamanho de uma região brasileira" (FAQ "Isso já deu certo?")
⚠️ **Achado: a frase, ao pé da letra, superdimensiona.** Individualmente, só a Espanha (506 mil km²) chega perto de uma região (Sul = 577 mil km²); Itália (301 mil) e Inglaterra (130 mil) são bem menores. **O que é forte e verificável:** os três **somados** = 937,6 mil km² ≈ **Sudeste (924,6 mil km²)** — diferença de ~1,4%.

**Recomendação:** reformular para a versão somada (fica mais impactante e fica correta): *"Inglaterra, Espanha e Itália somadas cabem dentro de uma única região brasileira — o Sudeste."*

Fontes: [Regiões do Brasil — Wikipédia](https://pt.wikipedia.org/wiki/Regi%C3%B5es_do_Brasil) (Sudeste 924.608,85 km²) · [List of European countries by area — Wikipedia](https://en.wikipedia.org/wiki/List_of_European_countries_by_area) (Espanha 505.990 · Itália 301.340 · Inglaterra 130.279).

```html
<a href="https://en.wikipedia.org/wiki/List_of_European_countries_by_area" target="_blank" rel="noopener noreferrer">Inglaterra, Espanha e Itália somadas</a> cabem dentro de <a href="https://pt.wikipedia.org/wiki/Regi%C3%B5es_do_Brasil" target="_blank" rel="noopener noreferrer">uma única região brasileira — o Sudeste</a>.
```

---

## B — CRAQUES E CLUBES DE ORIGEM
Seção "Um laboratório" (corpo) e FAQ "clubes pequenos". Hoje sem link. Os cinco vínculos conferem (confiança alta).

| Craque | Clube de origem | Confirmação | Fonte |
|---|---|---|---|
| Romário | Olaria (RJ) | ✅ base do Olaria desde 1979; ao Vasco em 1981 | [Museu do Futebol](https://museudofutebol.org.br/crfb/personalidades/481134/) · [Wikipédia](https://pt.wikipedia.org/wiki/Rom%C3%A1rio) |
| Ronaldo | São Cristóvão (RJ) | ✅ descoberto por Jairzinho antes do Cruzeiro | [Wikipédia](https://pt.wikipedia.org/wiki/Ronaldo_Naz%C3%A1rio) |
| Rivaldo | Mogi Mirim (SP) | ✅ despontou no "Carrossel Caipira" (Paulistão 1992); estreia profissional foi no Santa Cruz-PE | [Wikipédia (EN)](https://en.wikipedia.org/wiki/Rivaldo) |
| Lúcio | Guará (DF) | ✅ profissionalizou-se em 1997, observado pelo Internacional | [Wikipédia](https://pt.wikipedia.org/wiki/Lucimar_da_Silva_Ferreira) |
| Roberto Carlos | União São João (Araras, SP) | ✅ titular ~1991, ao Palmeiras em 1993 | [Wikipédia](https://pt.wikipedia.org/wiki/Roberto_Carlos_(futebolista)) · [Ludopédio](https://ludopedio.org.br/museu-galeria/roberto-carlos-3/) |

Afirmação geral ("craques de 1994 e 2002 despontaram em clubes hoje sem palco") — **confirmada**: Romário (94, Olaria), Ronaldo (02, São Cristóvão), Roberto Carlos (02, União São João), Lúcio (02, Guará) são todos de clubes de baixíssima expressão hoje.

> Nota de precisão (não altera o manifesto, que não faz essas afirmações): Lúcio foi **penta (2002)**, não tetra, e **não** era o capitão — Cafu levantou a taça. Rivaldo tem Santa Cruz-PE como 1º clube profissional, mas "despontou no Mogi Mirim" está correto.

**Snippets prontos:**
```html
<!-- corpo, seção "Um laboratório" -->
Romário veio do <a href="https://museudofutebol.org.br/crfb/personalidades/481134/" target="_blank" rel="noopener noreferrer">Olaria</a>, Ronaldo do <a href="https://pt.wikipedia.org/wiki/Ronaldo_Naz%C3%A1rio" target="_blank" rel="noopener noreferrer">São Cristóvão</a>, Rivaldo do <a href="https://en.wikipedia.org/wiki/Rivaldo" target="_blank" rel="noopener noreferrer">Mogi Mirim</a>, Lúcio do <a href="https://pt.wikipedia.org/wiki/Lucimar_da_Silva_Ferreira" target="_blank" rel="noopener noreferrer">Guará</a>.
```
```html
<!-- FAQ "clubes pequenos" -->
<strong>Romário saiu do <a href="https://museudofutebol.org.br/crfb/personalidades/481134/" target="_blank" rel="noopener noreferrer">Olaria</a>, Ronaldo do <a href="https://pt.wikipedia.org/wiki/Ronaldo_Naz%C3%A1rio" target="_blank" rel="noopener noreferrer">São Cristóvão</a>, Roberto Carlos do <a href="https://pt.wikipedia.org/wiki/Roberto_Carlos_(futebolista)" target="_blank" rel="noopener noreferrer">União São João de Araras</a>.</strong>
```

---

## C — "OS 12 GRANDES, 10 NO SUDESTE"
FAQ "Por que 6 regiões". Hoje sem link.

**Confirmado:** existe o conceito **G-12** (verbete próprio em PT e EN), com a **mesma lista de 12** e a **mesma distribuição** que o manifesto afirma:

- **SP (4):** Corinthians, Palmeiras, São Paulo, Santos
- **RJ (4):** Flamengo, Fluminense, Vasco, Botafogo
- **MG (2):** Atlético-MG, Cruzeiro
- **RS/Sul (2):** Grêmio, Internacional

→ Sudeste 10, Sul 2. Aritmética e geografia corretas.

Fontes: [G-12 — Wikipédia (PT)](https://pt.wikipedia.org/wiki/G-12) · [Big Twelve — Wikipedia (EN)](https://en.wikipedia.org/wiki/Big_Twelve_(Brazilian_football)).

> **Nuance importante (para blindar a tese):** o G-12 é **convenção histórica/de imprensa, não classificação oficial da CBF**. O critério objetivo mais forte: **todos os 12 já venceram a Libertadores; nenhum clube fora do grupo venceu**. O contra-argumento mais provável é o **Bahia** (Nordeste) — único clube fora do G-12 com 2 títulos brasileiros e fundador do Clube dos 13; é o "13º" histórico. A força de "10 dos 12 no Sudeste" depende do corte em 12 — factualmente correta, mas não é a única partição possível. Vale uma ressalva reconhecendo o Bahia (antecipar fortalece).

**Snippet pronto:**
```html
dos <a href="https://pt.wikipedia.org/wiki/G-12" target="_blank" rel="noopener noreferrer">12 clubes historicamente tratados como grandes</a>, 10 estão no Sudeste — 4 em São Paulo, 4 no Rio, 2 em Minas.
```

---

## D — COPA DO NORDESTE "LOTA ESTÁDIO E VENDE COTA"
FAQ "Isso já deu certo?". Hoje sem link. Números sólidos — usar o **pico 2024/2025**.

| Dado | Valor | Fonte |
|---|---|---|
| Público médio 2024 | 7.500/jogo (555 mil pagantes até semis, +8% vs 2023) | [Placar](https://placar.com.br/placar/copa-do-nordeste-quebra-marcas-e-se-torna-mais-atrativa-em-2024/) |
| Público médio 2025 | 7.369/jogo (560 mil espectadores) | [Wikipédia 2025](https://pt.wikipedia.org/wiki/Copa_do_Nordeste_de_Futebol_de_2025) |
| Recorde de jogo | 48.184 pagantes (Bahia×Vitória, Fonte Nova, 2024) | [CNN Brasil](https://www.cnnbrasil.com.br/esportes/outros-esportes/bahia-tem-maior-media-de-publico-do-nordeste-veja-ranking/) |
| Bilheteria bruta 2024 | R$ 11 mi (+37% vs 2023) | [Placar](https://placar.com.br/placar/copa-do-nordeste-quebra-marcas-e-se-torna-mais-atrativa-em-2024/) |
| Cotas (transmissão + patrocínio) | ~R$ 51 mi | [O Tempo](https://www.otempo.com.br/entretenimento/2026/1/17/sbt-da-mais-e-renova-contrato-com-a-copa-do-nordeste) |
| Disputa por direitos | SBT superou proposta da Globo p/ 2026 (+15%) | [O Tempo](https://www.otempo.com.br/entretenimento/2026/1/17/sbt-da-mais-e-renova-contrato-com-a-copa-do-nordeste) |

> Ressalva de honestidade: a média puxa dos grandes (Bahia 20k, Fortaleza 18,7k, Ceará 17,5k históricos). A edição **2026** teve público baixo na 1ª fase (~2,6 mil/jogo) **sem o Bahia** (foi à Libertadores). Cite 2024/2025 como pico e não generalize "todo jogo lota". O valor **exato** da cota de TV atual não é divulgado pelo SBT — use "cotas ~R$ 51 mi (transmissão + patrocínio)" e/ou o fato da disputa Globo×SBT como prova de valor de mercado.

**Snippet pronto:**
```html
a <strong>Copa do Nordeste</strong> já prova que futebol regional aqui <a href="https://placar.com.br/placar/copa-do-nordeste-quebra-marcas-e-se-torna-mais-atrativa-em-2024/" target="_blank" rel="noopener noreferrer">lota estádio</a> e <a href="https://www.otempo.com.br/entretenimento/2026/1/17/sbt-da-mais-e-renova-contrato-com-a-copa-do-nordeste" target="_blank" rel="noopener noreferrer">vende cota</a>.
```

---

## E — "6 A 8 MESES SEM CALENDÁRIO"
Corpo (seção "Funil") e FAQ "clubes pequenos". Hoje sem link.

**Defensável — mas ancore na formulação mais forte.** A frase literal "6 a 8 meses" só aparece numa fonte fraca (Medium/Beta Redação). O embasamento **mais citável** é o dado estrutural, que a **própria CBF reconhece**:

| Afirmação | Fonte | Confiança |
|---|---|---|
| Clubes param após os estaduais (~abril) e só voltam no ano seguinte | [Sete nos Esportes](https://setenosesportes.com.br/fim-da-linha-mais-de-100-clubes-encerram-a-temporada-apos-os-estaduais/) | Alta |
| Mais de 100 clubes encerram a temporada em março/2025 | [Sete nos Esportes](https://setenosesportes.com.br/fim-da-linha-mais-de-100-clubes-encerram-a-temporada-apos-os-estaduais/) | Alta |
| Só ~124 clubes (~14% dos registrados) têm calendário nacional | [CBF — novo calendário](https://www.cbf.com.br/a-cbf/noticias/informes-cbf/a/cbf-anuncia-novo-calendario-do-futebol-profissional-masculino) | Alta (fonte primária) |
| "Seis a oito meses" (frase literal) | [Beta Redação / Medium](https://medium.com/betaredacao/fim-dos-estaduais-o-carrasco-dos-clubes-pequenos-20ae4d73b35f) | Média (veículo fraco) |
| Caso concreto de 8 meses (Paraná Clube) | [umDois](https://www.umdoisesportes.com.br/parana-clube/parana-oito-meses-sem-futebol/) | Alta |

> A CBF citar a inatividade prolongada como **justificativa da própria reforma de calendário** é a melhor fonte: valida o problema pela boca de quem manda. Bônus: reforça o argumento do manifesto ("as tentativas de reforma giram em torno do calendário").

**Snippet pronto (corpo, seção "Funil"):**
```html
passam <a href="https://setenosesportes.com.br/fim-da-linha-mais-de-100-clubes-encerram-a-temporada-apos-os-estaduais/" target="_blank" rel="noopener noreferrer"><strong>6 a 8 meses sem calendário</strong></a>.
```
```html
<!-- FAQ, versão com fonte primária CBF -->
passa <a href="https://www.cbf.com.br/a-cbf/noticias/informes-cbf/a/cbf-anuncia-novo-calendario-do-futebol-profissional-masculino" target="_blank" rel="noopener noreferrer"><strong>seis a oito meses sem calendário</strong></a>.
```

---

## Nota sobre o Madureira (já resolvido na rodada 1)
O agente de calendário **não** achou fonte externa cravando "13 partidas em 2024" — mas a **rodada 1 já sourceou** esse número via [Wikipédia — Carioca 2024](https://pt.wikipedia.org/wiki/Campeonato_Carioca_de_Futebol_de_2024) (11 jogos) + [Copa Rio 2024](https://pt.wikipedia.org/wiki/Copa_Rio_de_2024) (2 jogos), e o manifesto **já aplicou** esses links (linhas 303–305). Nada a fazer aqui. O agente apenas confirma, por outra via, que o Madureira é citado nominalmente entre os clubes que param após o Carioca ([Futebol Interior](https://www.futebolinterior.com.br/quais-clubes-sem-calendario-nacional/)).

---

## Contra-argumento externo mais provável a esta rodada
O ponto mais atacável não é nenhum número — é o **corte em "12 grandes"** (ângulo C). Um crítico dirá: *"vocês escolheram 12 justamente para o Sudeste dar 10; incluam Bahia, Sport, Coritiba e o desequilíbrio muda de cara."* A resposta honesta: o desequilíbrio **regional persiste** em qualquer corte razoável (o Nordeste segue com no máximo 1–2 grandes históricos vs 8 do eixo Rio-SP), mas o número redondo "10 de 12" **depende** do G-12. Reconhecer o Bahia como o "13º" no próprio texto neutraliza a objeção e, de quebra, reforça a tese regional (o Nordeste é justamente o grande sub-representado que a reforma quer irrigar).
