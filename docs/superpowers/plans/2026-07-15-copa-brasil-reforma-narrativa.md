# Reforma narrativa da página Copa do Brasil — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reformar a aba "Copa do Brasil" da página `copa.html` para (a) remover copy órfã da versão pré-reforma, (b) surfacear dados novos que já existem em `copas.js` (breakdown regional dos 60 Série A via `SERIE_A_FUNIL`, dreno CC→CB com viz), e (c) reordenar a narrativa bottom-up: quem entra por onde → como o funil fecha → aí a elite cai → mata-mata ida-volta.

**Architecture:** Site estático vanilla-JS sem framework. Mudança é 100% na camada editorial da aba `brasil` de `copa.js`, mais um pouco de CSS pra dois componentes novos e enriquecimento de `detalhe` em `CB_KO` em `copas.js`. Sem novos testes automatizados — os dados já são cobertos por `tests/copas-reforma.test.js`.

**Tech Stack:** ES modules, vanilla JS, HTML estático, CSS puro. Zero deps novas.

## Global Constraints

- **Fonte da verdade:** o design em `docs/superpowers/specs/2026-07-15-copa-brasil-reforma-narrativa-design.md` — leia antes de qualquer decisão de wording.
- **Escopo restrito à aba "Copa do Brasil":** `renderCampeoes` e `renderConmebol` em `copa.js` NÃO mudam. Aba "Vagas Conmebol" NÃO muda.
- **Sem novos dados:** `SERIE_A_FUNIL` e todos os campos `CB_PHASES` já existem em `copas.js` (Task 2 do plano anterior). Este plano só surface + enriquece campos `detalhe` vazios.
- **Reutiliza tokens:** `--terra` (Série B), `--green` (Série A), `--blue` (survivor), `--gold` (cc_caido), `--ink`, `--paper`. Sem cores novas.
- **Reutiliza componentes existentes:** `.cop-quotas`/`.cop-quota` (mesmo layout usado na aba CC) para o breakdown regional; `.cb-square--*` para os quadradinhos do dreno. Só 2 blocos CSS novos: `.cb-entry-bar` (barra empilhada 108:60) e `.cb-drain` (wrapper das 3 linhas + setas).
- **Faxina explícita:** a seção `.cop-byes` "A Série B tem entradas premiadas" tem que sair (mecanismo `star` removido no Task 2 do plano anterior).
- **Nenhum polyfill.** Baseline Newly Available + degradação graciosa (memória `browser_support_policy`).
- **Suite atual:** 98/98 passando. Este plano não deve derrubar nenhum teste. Também não adiciona teste novo — a lógica é 100% visual.

---

## File Structure / decomposição

- **Modificar** `assets/js/data/copas.js` — enriquecer os 4 campos `detalhe` vazios de `CB_KO` (16-avos, Oitavas, Quartas, Semis).
- **Modificar** `assets/js/pages/copa.js` — importar `SERIE_A_FUNIL`; reescrever o corpo do template de `renderBrasil` conforme a nova estrutura bottom-up. `KIND_LABEL` e a lógica de `phasesHtml` e `koHtml` permanecem — só a estrutura HTML acima e abaixo do funil muda.
- **Modificar** `assets/css/copa.css` — adicionar `.cb-entry-bar` (barra empilhada) e `.cb-drain` (wrapper do dreno com setas verticais).
- **Modificar** `copa.html:77` — 1 linha da intro do `<h1>Copas Nacionais</h1>` header (era "aberta aos 216 clubes profissionais"; passa a mencionar coexistência funil + elite).

---

## Task 1: Enriquecer `CB_KO` detalhes + ajustar intro em `copa.html`

**Files:**
- Modify: `assets/js/data/copas.js:46-52` (linhas do array `CB_KO`)
- Modify: `copa.html:77` (linha da intro)

**Interfaces:**
- Consumes: nada novo.
- Produces: `CB_KO[i].detalhe` preenchido para todas as 5 linhas (não só `Final`). Consumido pelo template existente `${r.detalhe}` de `renderBrasil` sem mudança na template.

- [ ] **Step 1: Editar `CB_KO` em `copas.js`**

Localizar o bloco `export const CB_KO = [ ... ]` (linhas ~46-52). Substituir os 4 campos `detalhe: ''` da seguinte forma. O array inteiro fica:

```js
export const CB_KO = [
  { rodada: '16-avos', clubes: 32, formato: 'Ida e volta', detalhe: '16 sobreviventes do funil encontram 16 clubes eliminados nos 16-avos da Copa dos Campeões.' },
  { rodada: 'Oitavas', clubes: 16, formato: 'Ida e volta', detalhe: '8 duelos, decididos pelo placar agregado.' },
  { rodada: 'Quartas', clubes: 8,  formato: 'Ida e volta', detalhe: '4 duelos, decididos pelo placar agregado.' },
  { rodada: 'Semis',   clubes: 4,  formato: 'Ida e volta', detalhe: '2 duelos, decididos pelo placar agregado.' },
  { rodada: 'Final',   clubes: 2,  formato: 'Jogo único',  detalhe: 'Sábado 9 nov — encerra o ciclo dos mata-matas nacionais antes das finais continentais.' },
];
```

- [ ] **Step 2: Rodar teste focado — CB_KO ainda satisfaz os invariantes**

Run: `npx vitest run tests/copas-reforma.test.js`
Expected: PASS (o teste `describe('formato dos mata-matas', ...)` valida só o campo `formato`, não `detalhe`; enriquecer strings não deve quebrar nada).

- [ ] **Step 3: Ajustar `copa.html:77`**

Substituir a linha atual:
```html
          e a Copa do Brasil, aberta aos 216 clubes profissionais.
```
Por:
```html
          e a Copa do Brasil, aberta aos 216 clubes profissionais — 168 pelo funil, e a elite entrando pelo dreno do 16-avos.
```

- [ ] **Step 4: Suite completa**

Run: `npx vitest run`
Expected: 98/98 passando.

- [ ] **Step 5: Commit**

```bash
git add assets/js/data/copas.js copa.html
git commit -m "content(cb): enriquecer detalhes do mata-mata + intro reflete coexistência funil+dreno"
```

---

## Task 2: Reforma do `renderBrasil` (JS + CSS)

**Files:**
- Modify: `assets/js/pages/copa.js` (import na linha 1; `renderBrasil` em ~linhas 253-341)
- Modify: `assets/css/copa.css` (adicionar 2 blocos após o bloco `.cb-square` na linha ~420)

**Interfaces:**
- Consumes: `SERIE_A_FUNIL` de `../data/copas.js` (already exported by Task 2 do plano anterior — array `[{ liga, vagas }, ...]` somando 60).
- Produces: nova estrutura HTML na aba `brasil` (5 seções na ordem: lede → "Quem entra por onde" → "O funil fecha 100%" → "E aí a elite cai" → "Mata-mata ida-e-volta"). Nada estrutural exportado.

- [ ] **Step 1: Atualizar o import em `copa.js`**

Na linha atual (topo do arquivo):
```js
import { QUOTAS, POTES, GROUPS, CROSS_ROUNDS, CC_KO, CB_KO, CB_PHASES, LIBERTADORES } from '../data/copas.js';
```
Adicionar `SERIE_A_FUNIL`:
```js
import { QUOTAS, POTES, GROUPS, CROSS_ROUNDS, CC_KO, CB_KO, CB_PHASES, LIBERTADORES, SERIE_A_FUNIL } from '../data/copas.js';
```

- [ ] **Step 2: Adicionar CSS em `copa.css`**

Localizar o final do bloco `.cb-square` (linha 419 — `.cb-legend__item .cb-square { ... }`). Adicionar imediatamente após, ANTES do bloco `.cop-byes`:

```css
    /* Copa do Brasil — barra empilhada "Quem entra por onde" */
    .cb-entry-bar {
      display: flex;
      block-size: 44px;
      border: 1px solid rgba(12, 14, 10, 0.14);
      margin-block-end: 0.85rem;
    }
    .cb-entry-bar__seg {
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.05em;
      color: var(--paper);
      text-transform: uppercase;
      padding-inline: 0.6rem;
    }
    .cb-entry-bar__seg--serieb { background: var(--terra); }
    .cb-entry-bar__seg--seriea { background: var(--green); }

    /* Copa do Brasil — dreno CC→CB: 3 linhas de quadradinhos + setas convergentes */
    .cb-drain {
      display: grid;
      gap: 0.6rem;
      justify-items: start;
      margin-block-end: 1rem;
    }
    .cb-drain__row {
      display: grid;
      grid-template-columns: repeat(auto-fill, 16px);
      gap: 4px;
    }
    .cb-drain__row--mixed {
      grid-template-columns: repeat(auto-fill, 16px);
    }
    .cb-drain__label {
      font-family: var(--font-mono);
      font-size: 0.66rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: rgba(12, 14, 10, 0.72);
    }
    .cb-drain__arrow {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      color: rgba(12, 14, 10, 0.4);
      letter-spacing: 3px;
    }
```

- [ ] **Step 3: Reescrever o corpo do template `renderBrasil`**

Localizar a função `renderBrasil` em `copa.js` (~linha 253). Manter as declarações internas de `KIND_LABEL`, `phasesHtml`, `koHtml` — só o `contentEl.innerHTML = \`...\`` no final muda.

Substituir a atribuição `contentEl.innerHTML = \`...\`` completa (do `<div class="cop-panel">` até seu `</div>`) por:

```js
  const serieAHtml = SERIE_A_FUNIL.map((r) => `
    <div class="cop-quota">
      <div class="cop-quota__label">${r.liga}</div>
      <div class="cop-quota__value">${r.vagas}</div>
    </div>
  `).join('');

  const drainSurvivorSquares = Array.from({ length: 16 },
    () => `<span class="cb-square cb-square--survivor" aria-hidden="true"></span>`).join('');
  const drainCaidoSquares = Array.from({ length: 16 },
    () => `<span class="cb-square cb-square--cc_caido" aria-hidden="true"></span>`).join('');
  const drainMixedSquares = Array.from({ length: 32 }, (_, i) =>
    `<span class="cb-square cb-square--${i < 16 ? 'survivor' : 'cc_caido'}" aria-hidden="true"></span>`
  ).join('');

  contentEl.innerHTML = `
    <div class="cop-panel">
      <div>
        <h2 class="cop-h2">A copa aberta a todos</h2>
        <p class="cop-lede">
          Os <strong>216 clubes profissionais</strong> são elegíveis — <strong>168 entram pelo funil</strong>, e a <strong>elite entra caindo</strong>. É o único torneio em que um gigante que tropeçou cruza com um clube da base.
        </p>
      </div>

      <div>
        <h3 class="cop-h3">Quem entra por onde</h3>
        <p class="cop-p" style="margin-block-end:1.5rem;">
          Dos 168 que entram pelo funil, <strong>108 são de Série B</strong> (todos os clubes) e <strong>60 são de Série A</strong> — os que não subiram à Copa dos Campeões, distribuídos por região.
        </p>
        <div class="cb-entry-bar" aria-label="108 Série B + 60 Série A somam 168 clubes no funil">
          <div class="cb-entry-bar__seg cb-entry-bar__seg--serieb" style="flex-basis: ${(108 / 168 * 100).toFixed(2)}%;">108 Série B</div>
          <div class="cb-entry-bar__seg cb-entry-bar__seg--seriea" style="flex-basis: ${(60 / 168 * 100).toFixed(2)}%;">60 Série A</div>
        </div>
        <p class="cop-eyebrow">Os 60 Série A por região</p>
        <div class="cop-quotas">
          ${serieAHtml}
          <div class="cop-quota cop-quota--total">
            <div class="cop-quota__label">Total</div>
            <div class="cop-quota__value">60</div>
          </div>
        </div>
      </div>

      <div>
        <h3 class="cop-h3">O funil fecha 100%</h3>
        <p class="cop-p" style="margin-block-end:1.75rem;">
          Cada quadrado é um clube. A Série B abre sozinha na Preliminar; a Série A que não subiu entra na 1ª Fase. Nenhuma fase tem número ímpar — o funil fecha sem sobra.
        </p>
        <div class="cb-phases">${phasesHtml}</div>
      </div>

      <div>
        <h3 class="cop-h3">E aí a elite cai</h3>
        <p class="cop-p" style="margin-block-end:1.5rem;">
          Perdeu os 16-avos da Copa dos Campeões? Você não acabou a temporada nacional — desce pra cá. <strong>Champions → Europa, versão brasileira</strong>: os 16 clubes eliminados no 16-avos da CC encontram os 16 sobreviventes do funil no 16-avos da Copa do Brasil.
        </p>
        <div class="cb-drain">
          <div class="cb-drain__label">16 sobreviventes do funil</div>
          <div class="cb-drain__row">${drainSurvivorSquares}</div>
          <div class="cb-drain__arrow" aria-hidden="true">▼ ▼ ▼ ▼</div>
          <div class="cb-drain__label">16-avos · 32 clubes</div>
          <div class="cb-drain__row cb-drain__row--mixed">${drainMixedSquares}</div>
          <div class="cb-drain__arrow" aria-hidden="true">▲ ▲ ▲ ▲</div>
          <div class="cb-drain__label">16 caídos da Copa dos Campeões</div>
          <div class="cb-drain__row">${drainCaidoSquares}</div>
        </div>
      </div>

      <div>
        <h3 class="cop-h3">Mata-mata ida-e-volta</h3>
        <p class="cop-p" style="margin-block-end:1.5rem;">
          Do 16-avos até as semis, todo confronto é <strong>ida e volta</strong>, decidido pelo placar agregado. Só a <strong>final é jogo único</strong>.
        </p>
        <div class="cop-ko">${koHtml}</div>
      </div>
    </div>
  `;
```

**Notas para o implementer:**
- A ordem dos elementos dentro de `.cb-drain` (label → row → arrow → label → row → arrow → label → row) é a que o CSS espera; não reorganize.
- A seção `.cop-byes` "A Série B tem entradas premiadas" desapareceu — não estava em nenhum lugar do novo template. Isso é a faxina explícita.
- Nada em `.cb-phase__legend` foi mudado — os quadradinhos com `star` que sumiram das legendas da fase são consequência do Task 2 do plano anterior (onde `CB_PHASES` deixou de ter `star`), não deste plano.

- [ ] **Step 4: Rodar suite completa**

Run: `npx vitest run`
Expected: 98/98 passando (nenhum teste toca copy do HTML).

- [ ] **Step 5: Grep de sanidade**

Run: `grep -n "entradas premiadas\|vice-líder\|entrada direta" assets/js/pages/copa.js copa.html`
Expected: zero hits. Se aparecer algum, significa que sobrou copy órfã.

Run: `grep -n "SERIE_A_FUNIL" assets/js/pages/copa.js`
Expected: 2 hits (o import + o uso em `.map`).

- [ ] **Step 6: Commit**

```bash
git add assets/js/pages/copa.js assets/css/copa.css
git commit -m "feat(cb): reforma narrativa bottom-up — quem entra, funil, dreno, mata-mata"
```

---

## Task 3: Verificação end-to-end

**Files:** nenhum modificado nesta task — só verificação.

- [ ] **Step 1: Suite completa**

Run: `npx vitest run`
Expected: 20 files / 98 tests, all pass.

- [ ] **Step 2: Grep de resíduos**

Run:
```bash
grep -rn -e "entradas premiadas" -e "vice-líder" -e "13 Conmebol" -e "star.*entrada direta" assets/ copa.html
```
Expected: zero hits.

Run:
```bash
grep -n "SERIE_A_FUNIL\|cb-entry-bar\|cb-drain" assets/js/pages/copa.js assets/css/copa.css
```
Expected: `copa.js` mostra o import + uso; `copa.css` mostra as regras `.cb-entry-bar*` e `.cb-drain*`.

- [ ] **Step 3: Nota final**

O plano não tem step de commit próprio (Tasks 1 e 2 já cobrem todas as mudanças). Se a verificação achar algo divergente da spec, retornar ao Task 2 e ajustar. Caso contrário, o plano está completo em 2 commits.

---

## Self-Review (autor do plano)

**Cobertura da spec:**
- Faxina de "A Série B tem entradas premiadas" → Task 2 (removido implicitamente no rewrite do template). ✔
- Faxina do texto redundante entre lede e "A elite entra caindo" → Task 2 (a nova lede é curta; a seção "E aí a elite cai" tem viz + copy nova sem duplicar). ✔
- Novo componente: barra empilhada 108:60 → Task 2 (CSS `.cb-entry-bar` + template). ✔
- Novo componente: breakdown regional dos 60 SA → Task 2 (reusa `.cop-quotas`). ✔
- Novo componente: viz do dreno (3 linhas de quadradinhos + setas) → Task 2 (CSS `.cb-drain` + template). ✔
- Ordem bottom-up (lede → quem entra → funil → dreno → mata-mata) → Task 2. ✔
- Preenchimento dos `detalhe` do `CB_KO` → Task 1. ✔
- Ajuste na intro de `copa.html:77` → Task 1. ✔

**Placeholders:** nenhum "TODO" ou "TBD" no plano. Todos os snippets de código são executáveis; todos os comandos têm output esperado.

**Consistência de tipos:** `SERIE_A_FUNIL` é `[{ liga: string, vagas: number }]` — usado em `.map((r) => ...)` acessando `r.liga` e `r.vagas`. O import em Task 2 Step 1 casa com a exportação em `copas.js` de Task 2 do plano anterior.

**Riscos:**
- (Baixo) Media query para responsivo <480px não incluída — se a barra empilhada ou o grid do dreno ficarem estranhos em mobile, adicionar em iteração pós-implementação. Fora do escopo mínimo.
- (Baixo) Setas ASCII (`▼ ▼ ▼ ▼`) podem parecer amateur em alguns temas de tipografia. Se necessário, trocar por um SVG inline. Fora do escopo mínimo.
