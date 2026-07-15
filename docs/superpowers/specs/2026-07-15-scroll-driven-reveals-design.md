# Scroll-driven reveals for editorial widgets

**Date:** 2026-07-15
**Scope:** Homepage (`index.html`) — five widgets + section-level entrance
**Non-goals:** Hero animation, cross-page view-transition upgrades, sub-page choreography

---

## Purpose

The site's evidence widgets are numbers, bars, and grids. Animating them *is* the argument — a bar growing, a counter climbing, a waffle filling up all reinforce the narrative claim of that section. Today the only motion on the site is a 250ms cross-fade between pages; the widgets themselves are static.

This design adds a single, consistent motion idiom — **fade + short translateY, scrubbed by the element's own view timeline** — to five widgets on the homepage. The idiom is CSS-only, gated behind `@supports` for progressive enhancement, and gated behind `prefers-reduced-motion: no-preference` for accessibility. Zero animation JavaScript is added; existing render functions gain one-line inline-style tweaks to expose stagger indices and count-up targets.

## Constraints (locked)

- **CSS-first.** No JS for animation control (no IntersectionObserver, no scroll listeners). JS touches limited to inline CSS variables emitted at render time.
- **Progressive enhancement.** Firefox and other browsers without full support see the site exactly as it renders today — final numbers, full-width bars, visible cards.
- **`prefers-reduced-motion` respected.** Same fallback behavior as unsupported browsers: static final state.
- **Browser policy:** Baseline Newly Available + graceful degrade, no polyfills. Scroll-driven animations shipped Chrome 115 (Jul 2023), Safari 26 (Sep 2025). Firefox: static fallback.
- **Perf discipline.** Animate only `opacity` and `transform` (or typed custom properties). No `width`/`height` animation.

---

## Choreography

Five widgets. One shared idiom (fade + translateY, scrubbed via `view()`), with variations earning their complexity.

### 1. Section-level entrance — `.act--*`

Every non-hero `.act--*` section fades and rises 24px as it enters. Sections lead their contents by a beat, so the widget-level animations layer *on top of* the section's own reveal without collision.

- **Property:** `opacity: 0 → 1`, `translate: 0 24px → 0 0`
- **Range:** `entry 0% cover 20%`
- **Selector scope:** `.act:not(.hero)` — the hero is above the fold on load and must render immediately.

### 2. Metric cards — `.metric-card__value` (×5)

The five numbers count up from 0 to their final value as they enter view. The card container itself does the shared fade+translateY, staggered left-to-right.

**Card container:**
- Fade + translateY, staggered by `:nth-child()` (only 5 cards; no need for `--i`).
- Stagger implemented by shifting `animation-range` start per child: `entry calc(0% + 5% * <n>) cover 30%`.

**Value count-up:**
- Register `--n` as `@property` typed `<integer>`.
- JS sets `--n-final:<value>` inline on the value element (in addition to `textContent` for the no-support fallback).
- Keyframes: `from { --n: 0 } to { --n: var(--n-final) }`.
- Rendered via `content: counter(num)` on a pseudo-element, with `counter-reset: num var(--n)`.
- `font-variant-numeric: tabular-nums` is already set — no jitter during count.
- **Range:** narrow, `entry 20% cover 30%` — number settles as the card comes comfortably into view.

**Accessibility contract for count-up:** the metric's final value must be announced **exactly once** by screen readers, and must always be the *final* value (never `0` mid-animation, never a running count). Two mechanisms satisfy this; the plan chooses one after testing with VoiceOver:

- (A) Keep `textContent` as the accessible source (unchanged from today), wrap it in a child span, hide the child span visually via `visibility: hidden` inside the `@supports` gate (this also removes it from the AT tree), and render the animated counter on a `::before`/`::after` overlay (which most screen readers ignore as decorative when it contains only `counter()` output — but which will show visually).
- (B) Set `aria-label` on the value element to the final value and mark the `content: counter(...)` overlay's parent as `aria-hidden="true"` during animation, restoring afterward. More complex; only if (A) double-announces on VoiceOver/NVDA.

Whichever is chosen: outside the `@supports` gate the original `textContent` renders normally, matching today's behavior for AT and sighted users alike.

### 3. Workload bars — `.workload__bar` (×4, two rows × two bars)

Each bar's final width is already set via `--w`. Animation tweens `transform: scaleX(0 → 1)` from the left edge, so the pre-computed width stays authoritative.

- **Property:** `transform: scaleX(0) → scaleX(1)`, `transform-origin: left`
- **Bar interior** (`.workload__bar-value` — the number and "jogos" label): fades in over the last 30% of the bar's range, so the number *arrives* as the bar completes.
- **Row stagger:** `--i` on `.workload__bar-row` (0 or 1 within its `.workload__row`), shifting range start by 8% per row.
- **Row-level stagger between the two comparisons** (Botafogo row vs Madureira row): applied via `:nth-child()` on `.workload__row` — the second row's contents start 15% later.
- **Range:** `entry 15% cover 40%`

### 4. Sleeping giants waffle — `.giants__cell[data-filled]`

Each filled cell (each = 1000 people) fades and scales in, cascading left-to-right, top-to-bottom within its card's 40-cell waffle. The card scaffold (name, meta, attendance number, "Série B em 2024" label) does the shared card-level fade+translateY a beat earlier so the waffle "fills into" an already-established card.

**Card container** (`.giants__card`):
- Fade + translateY, staggered by card `--i` (0–3 across the 4 cards).
- Range: `entry 10% cover 25%`

**Filled cells** (`.giants__cell[data-filled]`):
- Each cell has `--i` (0–39) set inline at render time (its index within the waffle grid, not just its filled position — this gives left-to-right/top-to-bottom fill order regardless of how many are filled).
- Property: `opacity: 0 → 1`, `scale: 0.6 → 1`
- Range: `entry calc(20% + 0.6% * var(--i)) cover 40%` — 40 × 0.6% = 24% span, so the last cell finishes as the card is well into view.
- Unfilled cells (`.giants__cell` without `[data-filled]`) do not animate; they remain in their neutral background state.

### 5. Revelation cards — `.revelation__card` (×6)

Six cards, staggered left-to-right cascade.

- **Property:** fade + translateY 20px → 0
- **Stagger:** `--i` (0–5) set inline at render time
- **Range:** `entry calc(10% + 5% * var(--i)) cover 30%`

---

## What is explicitly *not* touched

- **Hero** (`.hero`) — visible on load; animating it would delay perceived paint.
- **Escala** section — two country columns; a fade would add nothing.
- **Analogy table rows** — six liga rows. Consider for a follow-up if the pattern earns its keep; deliberately held back for a "less is more" first pass.
- **Manifesto teaser** — final section, all-text; a section-level reveal only.
- **Sub-pages** (`ligas.html`, `copa.html`, `manifesto.html`, `timeline.html`) — out of scope for this pass. The `motion.css` file loads on every page but only affects `.act:not(.hero)` universally.

---

## Timing & feel

- **Easing:** `linear` for every animation. With a scrubbed scroll timeline, non-linear easing fights the scroll and reads as jitter.
- **Section reveal:** `entry 0% cover 20%` (leads content)
- **Widget reveals:** `entry 10–20% cover 25–40%` (follows section by design)
- **Stagger unit:** 5% of the timeline per index step (approximate equivalent of a 30–40ms delay at typical scroll velocity, but scroll-velocity-independent)
- **translateY distances:** scaled to element size — sections travel 24px, cards 20px, waffle cells 0 (scale only). Reason: larger elements need proportionally larger travel to read as motion; smaller ones look twitchy if pushed too far.
- **Scroll-up behavior:** since `view()` scrubs, elements reverse if the user scrolls back up past the range. Ranges are placed so this only happens on deliberate backwards scrolling; casual viewport shifts leave revealed elements in their final state.

---

## Progressive-enhancement contract

Every animation lives inside this gate:

```css
@supports ((animation-timeline: view()) and (animation-range: entry)) {
  @media (prefers-reduced-motion: no-preference) {
    /* animation rules — including all initial "hidden" states */
  }
}
```

**Critical invariant:** *no* start-state (`opacity: 0`, `scale-x: 0`, count-up-hidden text) may leak outside the gate. If it does, unsupported browsers get stuck at the hidden state. All start states are declared inside `@supports` blocks — the animation itself sets them via `from {}` in keyframes with **`animation-fill-mode: both`** (so both the pre-entry hidden state and the post-range visible state are held).

**Behavior matrix:**

| Environment | Behavior |
|---|---|
| Chrome 115+, Edge 115+, Safari 26+ with motion allowed | Full animation choreography |
| Any of the above with `prefers-reduced-motion: reduce` | Static final state; site reads exactly as today |
| Firefox (any version) | Static final state; site reads exactly as today |
| Any older browser without `animation-timeline: view()` | Static final state |
| Any browser where `@supports` returns false on the compound query | Static final state |

The existing `prefers-reduced-motion` block in `assets/css/reset.css` remains as a belt-and-braces safety net for any legacy transitions in `layout.css`, `manifesto.css`, etc.

---

## Render-side changes (JS)

Small additions inside functions that already build innerHTML in `assets/js/pages/home.js`. No new files, no observer setup, no motion library.

### `renderMetrics(season)`

```js
for (const el of document.querySelectorAll('[data-metric]')) {
  const key = el.getAttribute('data-metric');
  const value = season.meta[key];
  el.textContent = value;                      // unchanged — fallback text
  el.style.setProperty('--n-final', value);    // NEW — count-up target
}
```

The metric card `<li>` elements are static in `index.html`; card-level stagger uses `:nth-child()` in CSS, no JS needed.

### `renderWorkload()`

Each `.workload__bar-row` gets `style="--i:${i}"` where `i` is 0 for the current-model row and 1 for the reform row (within its `.workload__row`). Two rows total per comparison, four bar-rows in the whole chart.

### `renderSleepingGiants()`

Each `<span class="giants__cell">` gets `style="--i:${i}"` where `i` is 0–39 (grid index). Applied to *all* cells, not just filled ones — this is safe because CSS only animates cells with `[data-filled]`.

Each `.giants__card`'s wrapping `<li>` gets `style="--i:${cardIdx}"` where `cardIdx` is 0–3.

### `renderRevelation()`

Each `<li>` wrapping a `.revelation__card` gets `style="--i:${i}"` where `i` is 0–5.

---

## CSS architecture

**New file:** `assets/css/motion.css`

- Loaded from every HTML page (via `<link rel="stylesheet">`).
- Uses `@layer components` to match the site's existing layer scheme.
- Structure:
  1. `@property --n` registration (top-level; cannot live inside `@layer`).
  2. Single `@supports ((animation-timeline: view()) and (animation-range: entry))` block.
  3. Inside that, `@media (prefers-reduced-motion: no-preference)` block.
  4. Inside that, `@keyframes` for each animation, followed by one section per widget in page-flow order.

Rules apply per-page automatically because selectors target existing class names (`.metric-card`, `.workload__bar-row`, `.giants__cell[data-filled]`, `.revelation__card`, `.act:not(.hero)`). Pages without those widgets are silently unaffected.

**Existing files** (`assets/css/home/*.css`) are not modified. This keeps motion in one auditable place and preserves the existing separation between layout/typography and motion.

---

## Verification checklist (for implementation)

- [ ] Chrome / Edge / Safari 26+: all five widgets animate as designed on first scroll into each section.
- [ ] Firefox: site renders identically to today; final numbers, full-width bars, all cells visible, cards visible.
- [ ] `prefers-reduced-motion: reduce` (via DevTools emulation): same as Firefox — no motion, no hidden state.
- [ ] Count-up numbers land on exact final values (no floating-point drift, `<integer>` type guarantees this).
- [ ] Screen reader (VoiceOver + NVDA) announces each final metric value **exactly once**, and always the final value — never `0`, never a running count. Test decides between AT strategy (A) and (B) above.
- [ ] With animations disabled (Firefox or `prefers-reduced-motion: reduce`), all metric values render as plain text via `textContent` — same as today.
- [ ] Scroll-up past a revealed widget: elements reverse but recover; no stuck states.
- [ ] Lighthouse mobile perf: no regression (CSS-only animations run on compositor).

---

## Open questions

None locked. If any of these should be revisited during implementation, note in the plan:

- Whether `.act--paper` sections need a color-shift on entry (currently just fade+translateY like the rest). Held to "no" for consistency.
- Whether workload bars should ease in the *number*'s color from paper→ink for extra polish. Held to "no" for scope.
