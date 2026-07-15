# Scroll-driven reveals — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add CSS-only scroll-driven entrance animations to five widgets on the homepage, plus a section-level fade+lift for every non-hero `.act--*` across all pages, gated behind `@supports` and `prefers-reduced-motion` for progressive enhancement.

**Architecture:** One new stylesheet, `assets/css/motion.css`, loaded on every page. All rules wrapped in `@supports ((animation-timeline: view()) and (animation-range: entry))` + `@media (prefers-reduced-motion: no-preference)`. Zero animation JavaScript — three render functions in `assets/js/pages/home.js` gain one-line inline-style additions to expose stagger indices (`--i`) and count-up targets (`--n-final`). Browsers without full scroll-driven-animation support (notably Firefox) show today's static site verbatim.

**Tech Stack:** Vanilla HTML + CSS (layers, `@property`, `animation-timeline: view()`), ES-module JS, `npx serve -p 5173` as dev server, Vitest for the (separate) simulator suite. No bundler, no framework.

**Spec:** `docs/superpowers/specs/2026-07-15-scroll-driven-reveals-design.md`

## Global Constraints

- **CSS-first.** No JS for animation control (no IntersectionObserver, no scroll listeners). JS touches limited to inline CSS variables emitted at render time.
- **Progressive enhancement.** Firefox and any browser without full support see the site exactly as it renders today — final numbers, full-width bars, visible cards. No hidden states, no missing content.
- **`prefers-reduced-motion: reduce`** must produce the same static fallback as unsupported browsers.
- **Browser policy:** Baseline Newly Available + graceful degrade, no polyfills.
- **All animation start-states declared inside the `@supports` gate.** No `opacity: 0`, `scaleX(0)`, or hidden-count-up state may leak outside `@supports ((animation-timeline: view()) and (animation-range: entry)) { @media (prefers-reduced-motion: no-preference) { ... } }`.
- **`animation-fill-mode: both`** on every animation so the revealed state persists after the exit range.
- **`animation-timing-function: linear`** on every animation (scroll is the easing).
- **Perf discipline:** animate only `opacity`, `transform`, and typed custom properties. No `width` / `height` / `top` / `left`.
- **Declaration order:** `animation-timeline` MUST appear *after* the `animation` shorthand so the shorthand doesn't reset it.
- **`content: counter(...)` count-up value must be announced by screen readers exactly once, and always the final value** — never `0`, never a running count.

---

## File Structure

**Create:**
- `assets/css/motion.css` — sole owner of all animation rules. Structure:
  1. Top-level `@property --n { syntax: '<integer>'; initial-value: 0; inherits: false; }` (cannot live inside `@layer`).
  2. Single `@supports ((animation-timeline: view()) and (animation-range: entry))` block.
  3. Inside that, `@media (prefers-reduced-motion: no-preference)` block.
  4. Inside that, a `@layer components` containing `@keyframes` at top then one selector section per widget in page-flow order (section-level → metric cards → workload → giants → revelation).

**Modify:**
- `index.html` — add `<link rel="stylesheet" href="assets/css/motion.css">` in `<head>` after `view-transitions.css`.
- `manifesto.html`, `ligas.html`, `copa.html`, `timeline.html` — same one-line addition each.
- `assets/js/pages/home.js`:
  - `renderMetrics` (~line 23) — add `el.style.setProperty('--n-final', value)` alongside `textContent = value`.
  - `renderWorkload` (~line 47) — add `style="--i:0"` and `style="--i:1"` to the two `.workload__bar-row` divs per comparison.
  - `renderSleepingGiants` (~line 89) — add `style="--i:${cardIdx}"` on the `<li>` wrapper of each card, and `style="--i:${i}"` on each `<span class="giants__cell">`.
  - `renderRevelation` (~line 121) — add `style="--i:${i}"` on the `<li>` wrapper of each card.

**No other files touched.** The existing `assets/css/reset.css` `prefers-reduced-motion` block stays as a safety net for pre-existing transitions.

---

## Task 1: Scaffold `motion.css`, register `@property --n`, wire into all pages

**Files:**
- Create: `assets/css/motion.css`
- Modify: `index.html:35` (after view-transitions.css `<link>`)
- Modify: `manifesto.html`, `ligas.html`, `copa.html`, `timeline.html` — same insertion point

**Interfaces:**
- Produces: an empty-but-loaded `motion.css` with `@property --n` registered and an empty `@supports` gate. Later tasks add rules inside the gate.

- [ ] **Step 1.1: Create `assets/css/motion.css` with the scaffold**

```css
/* Scroll-driven entrance animations for editorial widgets.
   Spec: docs/superpowers/specs/2026-07-15-scroll-driven-reveals-design.md
   Gated behind @supports + prefers-reduced-motion — Firefox and users
   who opt out of motion see the site's static baseline unchanged. */

/* @property must be at top level, not inside @layer. */
@property --n {
  syntax: '<integer>';
  initial-value: 0;
  inherits: false;
}

@supports ((animation-timeline: view()) and (animation-range: entry)) {
  @media (prefers-reduced-motion: no-preference) {
    @layer components {
      /* Keyframes and per-widget rules added in later tasks. */
    }
  }
}
```

- [ ] **Step 1.2: Add `<link>` to `index.html` after view-transitions.css**

Insert after the existing `view-transitions.css` line (currently `index.html:34`):

```html
  <link rel="stylesheet" href="assets/css/motion.css">
```

- [ ] **Step 1.3: Repeat the `<link>` insertion in the other four HTML pages**

Files: `manifesto.html`, `ligas.html`, `copa.html`, `timeline.html`. Same one-line insertion in `<head>`, immediately after each page's `view-transitions.css` line.

- [ ] **Step 1.4: Manual verification — no visual change on any page**

Run:
```sh
npx serve -p 5173
```

Open `http://localhost:5173/` in Chrome, then in Firefox. Both should render **identically** to before this change. Also open `/manifesto`, `/ligas`, `/copa`, `/timeline` — no visual difference. In DevTools → Sources, confirm `motion.css` loads with no errors.

Expected: zero visual regression.

- [ ] **Step 1.5: Commit**

```sh
git add assets/css/motion.css index.html manifesto.html ligas.html copa.html timeline.html
git commit -m "feat(motion): scaffold motion.css with @property --n and feature gate"
```

---

## Task 2: Section-level entrance for every `.act:not(.hero)`

**Files:**
- Modify: `assets/css/motion.css` (add first keyframe + rule set inside the gate)

**Interfaces:**
- Consumes: the `@supports` + `@media` + `@layer components` scaffold from Task 1.
- Produces: every non-hero `.act` fades and lifts 24px into place as it enters the viewport. Behavior visible on all 5 pages.

- [ ] **Step 2.1: Add the section-reveal rules inside `@layer components`**

Inside `motion.css`, replace the empty `@layer components { /* … */ }` body with:

```css
@keyframes act-reveal {
  from { opacity: 0; translate: 0 24px; }
  to   { opacity: 1; translate: 0 0; }
}

.act:not(.hero) {
  animation: act-reveal linear both;
  animation-range: entry 0% cover 20%;
  animation-timeline: view();
}
```

Note: `animation-timeline` declared *after* the `animation` shorthand (constraint).

- [ ] **Step 2.2: Manual verification — Chrome**

Reload `http://localhost:5173/` in Chrome (or Safari 26+). Scroll from top to bottom slowly. Each `.act--*` section after the hero (Escala, Analogia, Impacto, Jogos, Gigantes, Ídolos, Manifesto teaser) should fade and lift ~24px into place as it enters the scrollport. Hero renders immediately with no motion.

Also navigate to `/manifesto`, `/ligas`, `/copa`, `/timeline` and scroll each. Every non-hero `.act` should reveal the same way.

- [ ] **Step 2.3: Manual verification — Firefox (fallback)**

Open the same URLs in Firefox. Every section should render **statically**, exactly like today — no fade, no translate, no delay.

- [ ] **Step 2.4: Manual verification — reduced motion**

In Chrome DevTools → three-dot menu → More tools → Rendering → "Emulate CSS media feature prefers-reduced-motion" → `reduce`. Reload. Sections should render statically like Firefox.

Reset the setting after testing.

- [ ] **Step 2.5: Commit**

```sh
git add assets/css/motion.css
git commit -m "feat(motion): fade+lift entrance for every non-hero .act"
```

---

## Task 3: Metric cards — count-up + staggered card entrance

**Files:**
- Modify: `assets/js/pages/home.js:23-28` (`renderMetrics`)
- Modify: `assets/css/motion.css` (append inside the `@layer components` block)

**Interfaces:**
- Consumes: `--n-final` set inline on each `[data-metric]` element (from JS change in this task).
- Produces: `.metric-card__value` counts up 0 → final value as its card enters view. Cards themselves stagger fade+lift left-to-right.

- [ ] **Step 3.1: Update `renderMetrics` in `assets/js/pages/home.js`**

Replace the current function body (lines 23–28) with:

```js
function renderMetrics(season) {
  for (const el of document.querySelectorAll('[data-metric]')) {
    const key = el.getAttribute('data-metric');
    const value = season.meta[key];
    el.textContent = value;
    el.style.setProperty('--n-final', value);
  }
}
```

- [ ] **Step 3.2: Add card-container reveal + count-up rules to `motion.css`**

Append inside the `@layer components` block (after the section-reveal rules):

```css
/* Metric cards: card fades+lifts, value counts up 0 → final. */
@keyframes card-lift {
  from { opacity: 0; translate: 0 16px; }
  to   { opacity: 1; translate: 0 0; }
}

@keyframes count-up {
  from { --n: 0; }
  to   { --n: var(--n-final); }
}

.metrics .metric-card {
  animation: card-lift linear both;
  animation-timeline: view();
}
/* Stagger the 5 cards by shifting the animation-range start.
   :nth-child works because the cards are static in index.html. */
.metrics .metric-card:nth-child(1) { animation-range: entry 0%  cover 25%; }
.metrics .metric-card:nth-child(2) { animation-range: entry 5%  cover 25%; }
.metrics .metric-card:nth-child(3) { animation-range: entry 10% cover 25%; }
.metrics .metric-card:nth-child(4) { animation-range: entry 15% cover 25%; }
.metrics .metric-card:nth-child(5) { animation-range: entry 20% cover 25%; }

.metrics .metric-card__value {
  position: relative;
  color: transparent;                          /* hide underlying text */
  counter-reset: num var(--n);
  animation: count-up linear both;
  animation-range: entry 20% cover 30%;
  animation-timeline: view();
}
.metrics .metric-card__value::after {
  content: counter(num);
  position: absolute;
  inset: 0;
  color: var(--green-bright);                  /* the color the text used to have */
}
```

- [ ] **Step 3.3: Manual verification — Chrome, count-up correctness**

Reload `http://localhost:5173/`. Scroll to the "Impacto" section. Each of the 5 metric cards should stagger-lift into place, and its number should count from 0 up to its final value (`216`, `88`, `12`, `1`, `48`). Cards' `font-variant-numeric: tabular-nums` should keep the digits from jittering horizontally during the count.

Open DevTools → Elements → select any `.metric-card__value`. Confirm the inline `--n-final` style is present and equals the final displayed number.

- [ ] **Step 3.4: Manual verification — screen reader (VoiceOver on macOS)**

Enable VoiceOver: `⌘F5`. Navigate to the "Impacto" section using `VO+→`. As VoiceOver reads through the 5 metric cards, each value should be announced **exactly once**, and always the final value — never `0`, never a running count.

**If double-announcement occurs** (e.g., "216, 216"): switch to AT strategy (B) from the spec. Apply this patch instead:

```html
<!-- in index.html for each .metric-card, wrap the value span. Skip if VoiceOver only announces once. -->
```

Concretely, if (A) fails on VoiceOver: change the CSS block so the `.metric-card__value` element itself gets `aria-hidden="true"` via JS in `renderMetrics` (`el.setAttribute('aria-hidden', 'true')`), and add `aria-label="${value}"` to the parent `.metric-card` — so screen readers read the label and the final value from the card as a whole, ignoring both the transparent text and the `::after` overlay.

Document whichever strategy is chosen in a one-line comment above the CSS block.

- [ ] **Step 3.5: Manual verification — Firefox + reduced-motion fallback**

Firefox: values render as plain text via `textContent`, in the site's normal `--green-bright` color, no count-up. `::after` is not shown because the parent `color: transparent` and `content: counter(num)` overlay only apply inside the `@supports` gate.

Reduced-motion (Chrome DevTools emulation): same — plain text, no count.

- [ ] **Step 3.6: Commit**

```sh
git add assets/css/motion.css assets/js/pages/home.js
git commit -m "feat(motion): count-up + staggered lift for metric cards"
```

---

## Task 4: Workload bars — `scaleX` grow + inner value fade

**Files:**
- Modify: `assets/js/pages/home.js:47-76` (`renderWorkload`)
- Modify: `assets/css/motion.css` (append)

**Interfaces:**
- Consumes: existing `--w` on each `.workload__bar`, new `--i` on each `.workload__bar-row`.
- Produces: bars grow from left; number inside arrives near the end of the bar's growth.

- [ ] **Step 4.1: Add `--i` to each `.workload__bar-row` in `renderWorkload`**

Locate the two `.workload__bar-row` divs (lines ~61 and ~67 of `home.js`) and add `style="--i:0"` and `style="--i:1"` respectively. Full replacement of the two `<div class="workload__bar-row">` lines:

```js
        <div class="workload__bar-row" style="--i:0">
          <div class="workload__bar workload__bar--current" style="--w:${(c.atual.jogos / maxVal * 100).toFixed(1)}%">
            <span class="workload__bar-value"><span class="visually-hidden">Modelo atual: </span>${c.atual.jogos}<small> jogos</small></span>
          </div>
          <p class="workload__bar-detail">${c.atual.det}</p>
        </div>
        <div class="workload__bar-row" style="--i:1">
          <div class="workload__bar workload__bar--reform" style="--w:${(c.reforma.jogos / maxVal * 100).toFixed(1)}%">
            <span class="workload__bar-value"><span class="visually-hidden">Ligas do Brasil: </span>${c.reforma.jogos}<small> jogos</small></span>
          </div>
          <p class="workload__bar-detail">${c.reforma.det}</p>
        </div>
```

- [ ] **Step 4.2: Add workload rules to `motion.css`**

Append inside `@layer components`:

```css
/* Workload bars: scaleX from left; value fades in at ~70% of the bar's growth. */
@keyframes bar-grow {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes bar-value-appear {
  0%, 60% { opacity: 0; }
  100%    { opacity: 1; }
}

.workload__bar {
  transform-origin: left;
  animation: bar-grow linear both;
  animation-timeline: view();
  /* Row 0 (current) starts sooner than row 1 (reform); second comparison
     also starts a beat later than the first via :nth-child on .workload__row. */
  animation-range: entry calc(15% + 5% * var(--i, 0)) cover 40%;
}
.workload__row:nth-child(2) .workload__bar {
  animation-range: entry calc(30% + 5% * var(--i, 0)) cover 40%;
}

.workload__bar-value {
  animation: bar-value-appear linear both;
  animation-timeline: view();
  animation-range: entry calc(15% + 5% * var(--i, 0)) cover 40%;
}
.workload__row:nth-child(2) .workload__bar-value {
  animation-range: entry calc(30% + 5% * var(--i, 0)) cover 40%;
}
```

The `.workload__bar-value` uses the same range as its bar so its 0%–60% "hidden" portion aligns with the bar's 0%–60% growth; it fades in only after the bar is mostly there.

- [ ] **Step 4.3: Manual verification — Chrome**

Reload `http://localhost:5173/`. Scroll to the "Jogos" section. Each of the 4 bars (2 rows × 2 bars) should grow from its left edge to its final width. The number and "jogos" label inside each bar should be invisible until the bar is ~60% grown, then fade in. First comparison's bars finish before the second's start growing.

Open DevTools → Animations tab. Confirm the animations are labeled `bar-grow` and `bar-value-appear`, and their timeline reads `view()`.

- [ ] **Step 4.4: Manual verification — Firefox + reduced-motion**

Firefox: bars render at full width, values visible — exactly as today.
Reduced-motion emulation in Chrome: same.

- [ ] **Step 4.5: Commit**

```sh
git add assets/css/motion.css assets/js/pages/home.js
git commit -m "feat(motion): workload bars grow left-to-right with staggered value fade"
```

---

## Task 5: Sleeping-giants waffle — cell cascade + card entrance

**Files:**
- Modify: `assets/js/pages/home.js:89-110` (`renderSleepingGiants`)
- Modify: `assets/css/motion.css` (append)

**Interfaces:**
- Consumes: `--i` set inline on each `.giants__card`'s wrapper `<li>` (0–3) and on each `.giants__cell` (0–39).
- Produces: cards fade+lift with a light stagger; then each card's *filled* cells cascade left-to-right, top-to-bottom.

- [ ] **Step 5.1: Update `renderSleepingGiants` to emit `--i` on cards and cells**

Replace the function body (`home.js:89-110`) with:

```js
function renderSleepingGiants() {
  const el = document.getElementById('giants-row');
  if (!el) return;
  el.innerHTML = SLEEPING_GIANTS.map((g, cardIdx) => {
    const filled = Math.round(g.mediaPublico / WAFFLE_UNIT);
    const cells = Array.from({ length: WAFFLE_CELLS }, (_, i) =>
      `<span class="giants__cell" style="--i:${i}"${i < filled ? ' data-filled' : ''}></span>`
    ).join('');
    return `
      <li style="--i:${cardIdx}"><figure class="giants__card">
        <figcaption>
          <span class="giants__name">${g.nome}</span>
          <span class="giants__meta">${g.estado}</span>
        </figcaption>
        <div class="giants__waffle" aria-hidden="true">${cells}</div>
        <div class="giants__foot">
          <span class="giants__attendance">${g.mediaPublico.toLocaleString('pt-BR')}<small> por jogo</small></span>
          <span class="giants__division">${g.divisaoAtual} em 2024</span>
        </div>
      </figure></li>`;
  }).join('');
}
```

- [ ] **Step 5.2: Add card + waffle-cell rules to `motion.css`**

Append inside `@layer components`:

```css
/* Sleeping giants: card fades+lifts a beat before its waffle cells cascade in. */
@keyframes cell-pop {
  from { opacity: 0; scale: 0.6; }
  to   { opacity: 1; scale: 1; }
}

.giants__row > li {
  animation: card-lift linear both;             /* reuse keyframe from Task 3 */
  animation-timeline: view();
  animation-range: entry calc(10% + 3% * var(--i, 0)) cover 25%;
}

.giants__cell[data-filled] {
  animation: cell-pop linear both;
  animation-timeline: view();
  animation-range: entry calc(20% + 0.6% * var(--i, 0)) cover 40%;
}
```

Unfilled cells (`.giants__cell` without `[data-filled]`) have no animation rule and remain at their neutral background — as today.

- [ ] **Step 5.3: Manual verification — Chrome**

Reload `http://localhost:5173/`. Scroll to the "Gigantes" section. Four cards should stagger-lift left-to-right. Once each card is in place, its gold-filled cells should pop in cascading left-to-right, top-to-bottom, ending well before the card is out of range.

Open DevTools → Elements → select any `.giants__cell`. Confirm inline `style="--i:<0-39>"` is present.

- [ ] **Step 5.4: Manual verification — Firefox + reduced-motion**

Firefox: cards and all filled cells render immediately in their final positions.
Reduced-motion emulation: same.

- [ ] **Step 5.5: Commit**

```sh
git add assets/css/motion.css assets/js/pages/home.js
git commit -m "feat(motion): giants cards lift + waffle cells cascade"
```

---

## Task 6: Revelation cards — staggered fade + lift

**Files:**
- Modify: `assets/js/pages/home.js:121-134` (`renderRevelation`)
- Modify: `assets/css/motion.css` (append)

**Interfaces:**
- Consumes: `--i` set inline on each `<li>` wrapping a `.revelation__card` (0–5).
- Produces: 6 cards cascade left-to-right, fade+lift 20px.

- [ ] **Step 6.1: Update `renderRevelation` to emit `--i`**

Replace the function body (`home.js:121-134`) with:

```js
function renderRevelation() {
  const el = document.getElementById('revelation-row');
  if (!el) return;
  el.innerHTML = REVELATION.map((r, i) => `
    <li style="--i:${i}"><figure class="revelation__card">
      <span class="revelation__cups">
        <span aria-hidden="true">🏆</span>
        <span class="visually-hidden">Copas do Mundo vencidas: </span>${r.copasVencidas.join(', ')}
      </span>
      <span class="revelation__player">${r.jogador}</span>
      <span class="revelation__club">${r.clubeRevelador} <span class="revelation__club-state">(${r.estado})</span></span>
    </figure></li>
  `).join('');
}
```

- [ ] **Step 6.2: Add revelation-card rules to `motion.css`**

Append inside `@layer components`:

```css
/* Revelation cards: staggered lift left-to-right. */
@keyframes card-lift-tall {
  from { opacity: 0; translate: 0 20px; }
  to   { opacity: 1; translate: 0 0; }
}

.revelation__row > li {
  animation: card-lift-tall linear both;
  animation-timeline: view();
  animation-range: entry calc(10% + 5% * var(--i, 0)) cover 30%;
}
```

- [ ] **Step 6.3: Manual verification — Chrome**

Reload `http://localhost:5173/`. Scroll to the "Ídolos" section. Six cards should cascade left-to-right into place, each fading and lifting 20px.

- [ ] **Step 6.4: Manual verification — Firefox + reduced-motion**

Firefox: all six cards render immediately in place.
Reduced-motion emulation: same.

- [ ] **Step 6.5: Commit**

```sh
git add assets/css/motion.css assets/js/pages/home.js
git commit -m "feat(motion): revelation cards cascade left-to-right"
```

---

## Task 7: Full verification sweep + spec checklist

**Files:** No code changes. Manual verification only, unless a step reveals a regression that requires a small fix.

- [ ] **Step 7.1: Run the spec's full verification checklist end-to-end**

Bring up `npx serve -p 5173`. In Chrome (or Safari 26+), reload `/` and confirm — with a slow full-page scroll from top to bottom:

- Hero renders immediately, no motion.
- Escala section fades + lifts on enter.
- Analogia section fades + lifts (no widget-level animation on its rows — deliberate).
- Impacto: 5 metric cards stagger in, values count up to `216 / 88 / 12 / 1 / 48`.
- Jogos: 4 workload bars grow left-to-right with value fade-in at ~60%; second comparison lags first.
- Gigantes: 4 cards stagger in; each waffle's filled cells cascade.
- Ídolos: 6 revelation cards cascade left-to-right.
- Manifesto teaser: section fade + lift.

Then `/manifesto`, `/ligas`, `/copa`, `/timeline`: every non-hero `.act` fades + lifts on scroll.

- [ ] **Step 7.2: Firefox pass**

Same scroll on all 5 pages in Firefox. Every widget renders statically in its final state. **Zero visual regression vs. pre-plan baseline.**

- [ ] **Step 7.3: Reduced-motion pass**

In Chrome DevTools → Rendering → Emulate CSS media feature prefers-reduced-motion = reduce. Reload each page. Same static behavior as Firefox.

Also test with the OS-level setting (macOS: System Settings → Accessibility → Display → Reduce motion). Confirm behavior matches.

- [ ] **Step 7.4: Screen reader spot-check**

Enable VoiceOver (`⌘F5` on macOS) on the homepage. Navigate through the metric cards and confirm each final value (`216`, `88`, `12`, `1`, `48`) is announced exactly once. If any card double-announces, apply the AT strategy (B) fix from Task 3 step 3.4 and re-verify.

- [ ] **Step 7.5: Performance spot-check (optional but recommended)**

Run Lighthouse on `/` in Chrome incognito mode (mobile emulation). Compare to the pre-plan baseline if available. Perf score should not regress; animations run on the compositor (transform + opacity only) so no CLS or long-task hits are expected.

If any regression appears, investigate before committing task 7's checklist result.

- [ ] **Step 7.6: Verify no leaked start-state**

In Firefox DevTools → Inspector, select a `.metric-card__value`, a `.workload__bar`, a `.giants__cell[data-filled]`, and a `.revelation__card` `<li>`. Confirm no computed `opacity: 0`, `transform: scaleX(0)`, `translate` value, or `color: transparent`. If any element shows a hidden state in Firefox, a rule leaked outside the `@supports` gate — fix by moving it inside before proceeding.

- [ ] **Step 7.7: If any regression fix was needed, commit it separately**

```sh
# Only if a fix was needed in steps 7.1–7.6
git add assets/css/motion.css assets/js/pages/home.js
git commit -m "fix(motion): <describe the regression fix>"
```

Otherwise, no commit needed for Task 7 — the previous six commits are complete.

---

## Self-review notes (for the implementer)

- **Spec coverage cross-check:** every widget listed in the spec's Choreography section has its own task (§1 Section reveal → Task 2; §2 Metric cards → Task 3; §3 Workload bars → Task 4; §4 Giants → Task 5; §5 Revelation → Task 6). The spec's PE contract, `@supports` invariant, fill-mode rule, and linear-easing rule are all encoded in Global Constraints.
- **What is deliberately *not* covered:** hero pitch, escala columns, analogy table rows, sub-page widgets. These are named as out-of-scope in the spec — do not add rules for them.
- **AT strategy for count-up** is decided at Task 3 step 3.4 based on real VoiceOver behavior. Both options (A and B) are fully specified; pick one, document choice in a CSS comment.
- **Do not touch existing CSS files.** Motion lives in `motion.css` only. If a rule you're writing would conflict with an existing rule in `home/*.css`, raise it before proceeding — the spec assumes zero conflict.
