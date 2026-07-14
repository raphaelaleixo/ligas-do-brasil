# Correções pendentes — aplicar fora do modo revisão

**Status:** nota de pesquisa (`revisar-conteudo`, 2026-07-14). Nada aplicado ao site. Cada item traz arquivo/linha/valor atual → valor sugerido. Fontes completas em `manifesto-fontes.md`.

---

## A. Analogias populacionais — migrar de pareamento 1:1 para "piso"

**Decisão tomada:** opção 2 (converter as telas também, não só o manifesto), para não deixar contradição latente — se o manifesto usa "piso" mas as telas mantêm o par país-a-país, o crítico acha o par frouxo (Paulista≠Inglaterra) na página de ligas.

**Por quê:** as nações-futebol da Europa se agrupam em ≥47M (Big Five, média ~63M) ou ≤18M (Portugal, Bélgica, Holanda…). Vácuo entre 20–45M → Paulista (44), Central (37) e Sulista (30) não têm país-espelho com liga relevante (a Polônia tem 37M mas liga irrelevante). Detalhe e fontes em `manifesto-fontes.md`.

O pareamento 1:1 está **hardcoded em 4 superfícies**. Todas precisam mudar juntas:

### A1. `manifesto.html` — linhas 261-263 (prosa principal)
Atual:
> Cada liga regional tem escala populacional de um país europeu inteiro: Nordestina **rivaliza com** a Itália, Paulista com a Inglaterra, Central com a Espanha, Amazônica com Portugal.

Sugerido (piso, sem pares frouxos):
> Cada liga regional tem a escala populacional de um país europeu inteiro. Portugal (10 mi), Bélgica (12 mi) e Holanda (18 mi) sustentam ligas que revelam craques e disputam a Champions — e **cada uma das seis regiões é mais populosa que Portugal**. A menor delas, a Amazônica (17 mi), já supera Holanda, Bélgica e Grécia. População nunca foi o gargalo; a arquitetura era.

(Com links: ver snippet HTML pronto em `manifesto-fontes.md`.)

### A2. `index.html` — linhas 143-147 (heading + intro da tabela de analogia)
- Linha 143 `<h2>`: **"Seis países dentro de um."** → pode ficar (ainda verdadeiro sob o piso). Opcional.
- Linhas 144-147 intro: "tem população **comparável à de um país europeu inteiro**" → trocar "comparável à de um país" (implica 1:1) por algo tipo "maior que a de países europeus que sustentam ligas nacionais inteiras — Portugal, Bélgica, Holanda."

### A3. `index.html` + `assets/js/pages/home.js` + `assets/css/home/analogy-table.css`
Hoje é tabela de 4 colunas: **Liga | Pop. região | País equivalente | Pop. país**.

**DECISÃO TOMADA (2026-07-14): layout minimalista de 2 colunas + legenda-piso.** Vira **Liga | Pop. região**, com uma legenda fixa abaixo: *"Todas superam Portugal (10 mi)."* Mockup escolhido:
```
SEIS PAÍSES DENTRO DE UM.
Cada região é mais populosa que Portugal, Bélgica ou Holanda —
países que sustentam ligas nacionais inteiras.

LIGA REGIONAL              POP. REGIÃO
Nordestina                       54 mi
Paulista                         44 mi
Central                          37 mi
Sulista                          30 mi
Rio-Capixaba                     20 mi
Amazônica                        18 mi
──────────────────────────────────────
↳ Todas superam Portugal (10 mi).
```

Edições exatas:
1. **`home.js` linhas 3-10 (`ANALOGIES`):** remover os campos `pais` e `paisPop` de cada objeto (fica só `liga` + `regiaoPop`).
2. **`home.js` `renderAnalogy` (12-23):** remover os 2 `<span>` de país do template (linhas 19-20: `.analogy__country` e `.analogy__pop--secondary`).
3. **`index.html` linhas 150-155 (`.analogy__head`):** remover os 2 `<span>` de cabeçalho de país ("País equivalente" e "Pop. país"); sobram "Liga regional" + "Pop. região".
4. **`index.html` ~144-147 (intro):** trocar "tem população **comparável à de um país europeu inteiro** — que sustenta suas próprias divisões nacionais" pela frase-piso do mockup ("mais populosa que Portugal, Bélgica ou Holanda…").
5. **`index.html`: adicionar a legenda** logo após `.analogy__table` (novo elemento, ex.: `<p class="analogy__floor">↳ Todas superam Portugal (10 mi).</p>`).
6. **`analogy-table.css`:** trocar `grid-template-columns: 1.6fr 1fr 1.6fr 1fr` → `1.6fr 1fr` nas regras `.analogy__head` (linha 25) **e** `.analogy__row` (linha 39). As regras `.analogy__country`, `.analogy__country-flag`, `.analogy__pop--secondary` (58-72) ficam órfãs — remover. Adicionar estilo para `.analogy__floor` (fonte mono, opacidade ~0.6, tom do `.analogy__head`).

### A4. `assets/js/pages/ligas.js` — referência europeia por liga (páginas das ligas)
Cada liga carrega `pais`/`flag`/`paisPop` (LEAGUES, linhas 6-11), renderizados no bloco **"Equivalente europeu"** da meta-strip (`renderContent`, linhas 181-185):
```
Equivalente europeu
🇮🇹 Itália
59M habitantes — país que sustenta sua própria liga nacional.
```
Problemas: (1) o par 1:1 é o mesmo que estamos removendo da home (Paulista→Inglaterra etc. frouxos); (2) o par **Sulista→Ucrânia (32M)** vive **só aqui** e é o pior — população contestada pela guerra (32M presente vs 43M de jure).

**DECISÃO (2026-07-14): ancorar em Portugal + mostrar o múltiplo por região.** A home ficou minimalista (só "todas superam Portugal"); as **páginas das ligas** ganham o múltiplo, porque mostram uma liga por vez e há espaço. O bloco vira (exemplo Nordestina):
```
Escala europeia
5,4× a população de Portugal
País que, sozinho, sustenta uma liga nacional inteira.
```
Múltiplos por liga (= `regiaoPop` mostrado ÷ Portugal 10 mi, então fecha com os números da tela):
`Nordestina 5,4× · Paulista 4,4× · Central 3,7× · Sulista 3,0× · Rio-Capixaba 2,0× · Amazônica 1,8×`

**Redação:** usar **"5,4× a população de Portugal"** (ou "5,4× Portugal"), **nunca** "5,4× maior que Portugal" — ao pé da letra "5,4× maior" = 6,4× o tamanho.

Edições exatas:
1. **`LEAGUES` (linhas 6-11):** remover `pais`, `flag`, `paisPop`. Adicionar `multiplo` por liga (`'5,4×'`, `'4,4×'`, `'3,7×'`, `'3,0×'`, `'2,0×'`, `'1,8×'`) — ou computar de `regiaoPop`, mas string pronta é mais simples e evita reparse de "54M". Manter `regiaoPop`, `quota`, `potes`, `extras`.
2. **`renderContent` (linhas 181-185):** trocar o bloco "Equivalente europeu" por: label **"Escala europeia"**; value **`${meta.multiplo} a população de Portugal`**; hint **"País que, sozinho, sustenta uma liga nacional inteira."** Sem `meta.pais`/`meta.flag`/`meta.paisPop`.
3. **Sem mudança de CSS** — o bloco usa `.lig-meta__block` genérico; só muda texto/dados.

### A5. (bônus) `manifesto.html` linhas 642-646 — não é erro, mas tem gagueira de copy
> Inglaterra, Espanha e Itália têm o tamanho de *uma* região brasileira — **já são do tamanho de uma região.**
A segunda oração repete a primeira. Enxugar para uma frase só. (Este trecho, aliás, já usa a lógica do piso — reforça a mudança do A1.)

---

## B. Flamengo 78 → 79 (`manifesto.html`)
"Flamengo em 2025 subiu para **78**" → **79** (49V-19E-11D; o 78 exclui o amistoso FC Series). Adicionar link Wikipédia. Conferir que o "Botafogo 75" fique na mesma base de contagem. Snippet em `manifesto-fontes.md`.
**Nota de coerência:** `home.js` linha 44 rotula o Madureira "13 jogos" com detalhe "11 Campeonato Carioca + 2 Copa Rio" — esse já está certo; ver item C.

## C. Madureira (`manifesto.html`) — 2 correções de texto (números 13 e 2 estão certos)
- "eliminado nas **oitavas**" → **semifinal** (ida+volta = os 2 jogos da Copa Rio).
- "todas concentradas entre **janeiro e abril**" → reconhecer que os 2 da Copa Rio foram em **outubro** (fortalece o argumento do vácuo de calendário). Texto sugerido e links em `manifesto-fontes.md`.

## D. "revelados em" → "despontaram em" (`manifesto.html`)
Reframe que torna a lista toda defensável (Rivaldo/Mogi Mirim, Cafu/Itaquaquecetuba deixam de ser contestáveis). `home.js` `REVELATION` (linhas 114-121) usa o campo `clubeRevelador` — o dado em si está OK sob o novo enquadramento; é a **copy do manifesto** ("revelados em") que muda para "despontaram em / se destacaram em". Se quiser alinhar o código, renomear `clubeRevelador` é cosmético (não aparece na tela como palavra).

---

## Itens VISÍVEIS de aritmética (já mapeados na skill — decisão de design pendente)
Não são de texto; entram aqui só como lembrete de que seguem abertos:
- **Mata-mata "Ida e volta" vs jogo único** (`copa.js` `CC_KO`/`CB_KO` × `archetypes.js`): o teto 63 depende de jogo único; os rótulos dizem ida-e-volta. Resolver rótulos ou re-derivar totais.
- **Funil da Copa do Brasil** (`copa.js` `CB_PHASES`): 108→"55" (deveria 54); totais 151 e 75 ímpares não fecham mata-mata.
- **192 (dado) vs 216 (copy)**: latente/invisível (Série B é copy fixa), mas real no `data/season-default.json`.
