# Futebol BR Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 5-page portfolio site that consumes `data/season-default.json` (produced by Plan 1's simulator), tells the reform thesis through data + editorial, and ships on Vercel as pure static HTML + modern CSS + vanilla JS with cross-document view transitions.

**Architecture:** Multi-page static site (real `.html` files, no framework, no bundler). Every page reads the pre-baked season JSON once via Cache Storage, then renders itself. Cross-document view transitions between pages (`@view-transition { navigation: auto }`). Editorial layout (long-read *The Athletic* vibe) but bare CSS at first — a later polish pass adds the aesthetic. Sticky top nav across all pages. Deploys as-is to Vercel.

**Tech Stack:**
- Pure HTML5 + ES modules
- Modern CSS: `@layer`, `@scope`, `light-dark()`, container queries, `:has()`, `@view-transition`
- Baseline Newly Available features. **Graceful degrade only** — no polyfills, no heavy fallbacks (per `browser_support_policy` memory).
- Zero runtime dependencies
- Vercel static hosting

**Modern-web-guidance patterns baked in:**
- `<header>`/`<nav>`/`<main>`/`<aside>`/`<footer>` semantic landmarks
- `<search>` around the club combobox
- `<figure>` + `<figcaption>` for evidence cards
- `<dialog closedby="any">` for the match-details modal
- `[popover]` for the mobile nav drawer and pot-reveal
- `<details>`/`<summary>` for the Copa do Brasil funnel expand and the group card open-for-more
- Native `<input list>` + `<datalist>` for the club picker (no ARIA hand-rolling)
- `:focus-visible` for focus rings, `:user-valid`/`:user-invalid` for form states, `inert` when dialogs open
- Cascade layers: `reset, base, tokens, components, utilities`
- `:where()` inside layers to keep specificity low; `@scope` for component isolation
- `:has()` for parent-driven styling
- Logical properties (`margin-inline-start`, `padding-block`, etc.)
- `color-scheme: light dark` + `light-dark()` for automatic dark mode
- Container queries for size-aware components
- `prefers-reduced-motion` guarded animations
- `blocking="render"` + `<link rel="expect">` for consistent cross-document view transitions

**File structure this plan builds:**

```
futebol-br/
├── index.html
├── manifesto.html
├── ligas.html
├── timeline.html
├── copa.html
├── vercel.json
├── data/
│   └── season-default.json         # from Plan 1 (already exists)
├── assets/
│   ├── css/
│   │   ├── layers.css              # declares @layer order
│   │   ├── tokens.css              # design tokens, dark mode
│   │   ├── reset.css               # targeted reset
│   │   ├── base.css                # typography, body, focus, motion
│   │   ├── layout.css              # page shell + sticky nav
│   │   ├── view-transitions.css    # @view-transition + fade fallback
│   │   ├── manifesto.css           # long-read typography
│   │   ├── home/
│   │   │   ├── hero.css
│   │   │   ├── analogy-table.css
│   │   │   ├── escala.css
│   │   │   ├── metric-cards.css
│   │   │   ├── workload-chart.css
│   │   │   ├── contrast-strip.css
│   │   │   ├── estrutura-strip.css
│   │   │   ├── sleeping-giants.css
│   │   │   ├── revelation-clubs.css
│   │   │   ├── manifesto-teaser.css
│   │   │   └── nav-tiles.css
│   │   ├── ligas.css               # tabs + tables + qualification zones
│   │   ├── timeline.css            # combobox + calendar grid
│   │   ├── copa.css                # tabs + groups grid + bracket + funnel
│   │   └── match-dialog.css        # shared match-details dialog
│   └── js/
│       ├── season.js               # fetch + Cache Storage + render helpers
│       ├── strings.js              # PT strings (copy of src/data/strings.js)
│       ├── nav.js                  # sticky nav + mobile drawer
│       ├── pages/
│       │   ├── home.js
│       │   ├── ligas.js
│       │   ├── timeline.js
│       │   └── copa.js
│       └── components/
│           ├── club-picker.js
│           ├── match-dialog.js
│           └── tabs.js
```

**Data contract from Plan 1** (see `plans/2026-07-08-futebol-br-simulator.md` for full schema):

```
season = {
  seed, meta, ligasRegionais[], copaCampeoes{potes, grupos, matamata},
  copaBrasil{eliteBypass, convidadoId, funil, matamata},
  conmebol{libertadores, sulAmericana},
  perfisDashboard{elite, media, base},
  calendariosPorClube{[id]: WeekEntry[42]},
  matchesGeral[],
  clubes[192],
}
```

---

## Section A — Bootstrap

### Task 1: Vercel configuration

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Write `vercel.json`**

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/data/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

`cleanUrls: true` lets `/manifesto` resolve to `/manifesto.html` — nicer URLs for view transitions.

- [ ] **Step 2: Commit**

```bash
git add vercel.json
git commit -m "chore(site): vercel config with clean URLs and asset caching"
```

---

## Section B — Shared CSS Foundations

### Task 2: Cascade layer declaration + design tokens

**Files:**
- Create: `assets/css/layers.css`
- Create: `assets/css/tokens.css`

- [ ] **Step 1: Write `layers.css`**

```css
/* Declared in explicit order. Later layers win. */
@layer reset, base, tokens, layout, components, utilities;
```

- [ ] **Step 2: Write `tokens.css`**

```css
@layer tokens {
  :root {
    color-scheme: light dark;

    /* Type scale (fluid — clamp for graceful scaling) */
    --step--1: clamp(0.83rem, 0.79rem + 0.20cqi, 0.94rem);
    --step-0:  clamp(1.00rem, 0.94rem + 0.30cqi, 1.13rem);
    --step-1:  clamp(1.20rem, 1.10rem + 0.50cqi, 1.35rem);
    --step-2:  clamp(1.44rem, 1.29rem + 0.75cqi, 1.62rem);
    --step-3:  clamp(1.73rem, 1.52rem + 1.05cqi, 1.94rem);
    --step-4:  clamp(2.07rem, 1.77rem + 1.50cqi, 2.32rem);
    --step-5:  clamp(2.49rem, 2.06rem + 2.15cqi, 2.79rem);

    /* Spacing scale */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.5rem;
    --space-6: 2rem;
    --space-7: 3rem;
    --space-8: 4rem;

    /* Fonts */
    --font-serif: "Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif;
    --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
    --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;

    /* Semantic colors — resolve per color-scheme via light-dark() */
    --color-bg:       light-dark(#faf8f4, #0e0f10);
    --color-fg:       light-dark(#1a1b1c, #eae7e0);
    --color-muted:    light-dark(#5b5b58, #a3a09a);
    --color-hairline: light-dark(#e5e2da, #2a2b2c);
    --color-accent:   light-dark(#0a5f38, #2fa07b);   /* Brasil green tuned for AA */
    --color-warn:     light-dark(#8a1c1c, #d97a7a);
    --color-badge-campeoes:    light-dark(#c9a24a, #d4b26a);
    --color-badge-sulamericana: light-dark(#4f7cac, #6a97c9);
    --color-badge-rebaixamento: light-dark(#8a1c1c, #d97a7a);

    /* Competition palette (calendar) */
    --comp-liga:        light-dark(#0a5f38, #2fa07b);
    --comp-campeoes:    light-dark(#c9a24a, #d4b26a);
    --comp-brasil:      light-dark(#3d6b9c, #6a97c9);
    --comp-conmebol:    light-dark(#7a7a7a, #b0b0b0);
    --comp-fifa-pause:  light-dark(#e5e2da, #2a2b2c);

    /* Layout */
    --measure: 65ch;
    --nav-h: 3.5rem;
    --radius: 4px;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add assets/css/layers.css assets/css/tokens.css
git commit -m "feat(site): cascade layers and design tokens"
```

---

### Task 3: Reset + base typography

**Files:**
- Create: `assets/css/reset.css`
- Create: `assets/css/base.css`

- [ ] **Step 1: Write `reset.css`**

```css
@layer reset {
  /* Targeted reset — no global * selector so cascade layers stay in control */
  html { box-sizing: border-box; }
  *, *::before, *::after { box-sizing: inherit; }

  body, h1, h2, h3, h4, p, figure, blockquote, dl, dd, ul, ol { margin: 0; }
  ul[role="list"], ol[role="list"] { list-style: none; padding: 0; }
  img, picture, svg, video { display: block; max-inline-size: 100%; }

  :where(input, button, textarea, select) { font: inherit; }

  /* Reduced motion — everything transitions instantly */
  @media (prefers-reduced-motion: reduce) {
    :where(*, *::before, *::after) {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
```

- [ ] **Step 2: Write `base.css`**

```css
@layer base {
  html {
    font-family: var(--font-serif);
    font-size: 100%;
    line-height: 1.55;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  body {
    background: var(--color-bg);
    color: var(--color-fg);
    min-block-size: 100dvb;
    font-size: var(--step-0);
  }

  :where(h1, h2, h3, h4) {
    font-family: var(--font-serif);
    line-height: 1.15;
    text-wrap: balance;
    letter-spacing: -0.01em;
  }
  h1 { font-size: var(--step-5); }
  h2 { font-size: var(--step-3); }
  h3 { font-size: var(--step-2); }
  h4 { font-size: var(--step-1); }

  p { text-wrap: pretty; max-inline-size: var(--measure); }

  a {
    color: inherit;
    text-underline-offset: 0.15em;
    text-decoration-thickness: from-font;
  }

  :where(a, button):focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 3px;
    border-radius: 2px;
  }

  /* Interactive touch target minimum */
  :where(a, button, [role="button"]) {
    min-block-size: 24px;
    min-inline-size: 24px;
  }
  @media (pointer: coarse) {
    :where(a, button, [role="button"]) {
      min-block-size: 44px;
      min-inline-size: 44px;
    }
  }

  /* Forced Colors Mode: preserve borders/badges via system colors */
  @media (forced-colors: active) {
    :root {
      --color-accent: LinkText;
      --color-hairline: CanvasText;
    }
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add assets/css/reset.css assets/css/base.css
git commit -m "feat(site): targeted reset and base typography"
```

---

### Task 4: Page shell + sticky nav CSS

**Files:**
- Create: `assets/css/layout.css`

- [ ] **Step 1: Write `layout.css`**

```css
@layer layout {
  .page {
    display: grid;
    grid-template-rows: var(--nav-h) 1fr auto;
    min-block-size: 100dvb;
  }

  /* Sticky top nav — real position:sticky, not fixed, so no scroll-jump */
  .site-nav {
    position: sticky;
    inset-block-start: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding-inline: var(--space-5);
    background: color-mix(in oklab, var(--color-bg) 92%, transparent);
    backdrop-filter: blur(8px);
    border-block-end: 1px solid var(--color-hairline);
  }
  /* Graceful degrade: when backdrop-filter is unsupported, background stays opaque */
  @supports not (backdrop-filter: blur(8px)) {
    .site-nav { background: var(--color-bg); }
  }

  .site-nav__brand {
    font-family: var(--font-sans);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .site-nav__links {
    display: flex;
    gap: var(--space-5);
    font-family: var(--font-sans);
    font-size: var(--step--1);
  }

  /* Highlight the current page — driven by [aria-current="page"] */
  .site-nav__links a[aria-current="page"] {
    color: var(--color-accent);
    text-decoration: underline;
  }

  /* Mobile drawer via [popover] — no JS required for open/close */
  .site-nav__toggle {
    display: none;
    background: none;
    border: 0;
    padding: var(--space-2);
    cursor: pointer;
  }
  @container (inline-size < 640px) {
    .site-nav__toggle { display: inline-flex; }
    .site-nav__links {
      position: absolute;
      inset-block-start: var(--nav-h);
      inset-inline: 0;
      flex-direction: column;
      padding: var(--space-5);
      background: var(--color-bg);
      border-block-end: 1px solid var(--color-hairline);
    }
    .site-nav__links[popover]:not(:popover-open) { display: none; }
  }

  main {
    padding-inline: var(--space-5);
    padding-block: var(--space-6);
    display: grid;
    gap: var(--space-8);
    max-inline-size: 72rem;
    margin-inline: auto;
    inline-size: 100%;
  }

  footer {
    padding: var(--space-6) var(--space-5);
    color: var(--color-muted);
    font-size: var(--step--1);
    border-block-start: 1px solid var(--color-hairline);
    text-align: center;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/css/layout.css
git commit -m "feat(site): page shell and sticky nav"
```

---

### Task 5: Cross-document view transitions

**Files:**
- Create: `assets/css/view-transitions.css`

**Design notes:**
- `@view-transition { navigation: auto }` enables cross-document transitions.
- Use `blocking="render"` + `<link rel="expect">` on the JSON-hydrated content so transitions run only when critical DOM is stable. This prevents the "flash of unstyled/empty content" during transitions.
- Graceful degrade: browsers without cross-document transitions get normal navigations (no animation). No JS fallback needed.

- [ ] **Step 1: Write `view-transitions.css`**

```css
@layer base {
  @view-transition {
    navigation: auto;
  }

  /* Cross-fade for the whole viewport (default) */
  :where(::view-transition-old(root), ::view-transition-new(root)) {
    animation-duration: 250ms;
    animation-timing-function: ease;
  }

  /* Persist the sticky nav visually across navigations */
  .site-nav {
    view-transition-name: site-nav;
  }
  :where(::view-transition-old(site-nav), ::view-transition-new(site-nav)) {
    animation: none;
  }

  /* Persist the site brand across navigations */
  .site-nav__brand {
    view-transition-name: brand;
  }

  @media (prefers-reduced-motion: reduce) {
    @view-transition { navigation: none; }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/css/view-transitions.css
git commit -m "feat(site): cross-document view transitions with sticky nav persistence"
```

---

## Section C — Shared JS

### Task 6: Season data loader (fetch + Cache Storage)

**Files:**
- Create: `assets/js/season.js`

**Design:**
- Every page calls `loadSeason()` to get the season JSON.
- First visit: fetch `/data/season-default.json`, store in Cache Storage, parse.
- Subsequent visits/pages: served from Cache Storage — no network round trip.
- `<link rel="expect">` in HTML ensures the transition doesn't run before content is rendered.

- [ ] **Step 1: Write `season.js`**

```js
const CACHE_NAME = 'futebol-br-v1';
const SEASON_URL = '/data/season-default.json';

let cached = null;

async function fetchAndCache() {
  if ('caches' in window) {
    const cache = await caches.open(CACHE_NAME);
    const stored = await cache.match(SEASON_URL);
    if (stored) return stored.clone().json();
    const res = await fetch(SEASON_URL);
    // Only cache successful responses
    if (res.ok) cache.put(SEASON_URL, res.clone());
    return res.json();
  }
  // Graceful degrade: no Cache Storage → fetch every time
  const res = await fetch(SEASON_URL);
  return res.json();
}

export async function loadSeason() {
  if (cached) return cached;
  cached = await fetchAndCache();
  return cached;
}

/** Handy lookup helpers for pages. */
export function clubById(season, id) {
  return season.clubes.find((c) => c.id === id);
}

export function calendarFor(season, id) {
  return season.calendariosPorClube[id] ?? [];
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/js/season.js
git commit -m "feat(site): season loader with Cache Storage"
```

---

### Task 7: Strings module (copy from Plan 1 source)

**Files:**
- Create: `assets/js/strings.js`

**Design:**
Copy the content of `src/data/strings.js` into `assets/js/strings.js`. Duplication is intentional — the sim doesn't need to be loaded in the browser, and the frontend doesn't need Node imports.

- [ ] **Step 1: Copy content**

Copy the entire contents of `src/data/strings.js` into `assets/js/strings.js`. It exports `default { pt }`.

- [ ] **Step 2: Commit**

```bash
git add assets/js/strings.js
git commit -m "feat(site): PT strings module (browser copy)"
```

---

### Task 8: Sticky nav interactions

**Files:**
- Create: `assets/js/nav.js`

**Design:**
- Highlight the current page link via `aria-current="page"` based on `location.pathname`.
- The mobile drawer uses `[popover]` — no JS needed for open/close, only for `inert`-ing the main content when open.

- [ ] **Step 1: Write `nav.js`**

```js
export function markCurrentNav() {
  const links = document.querySelectorAll('.site-nav__links a[href]');
  const path = location.pathname.replace(/\.html$/, '') || '/';
  for (const a of links) {
    const href = a.getAttribute('href').replace(/\.html$/, '');
    if (href === path || (href === '/' && path === '/index')) {
      a.setAttribute('aria-current', 'page');
    }
  }
}

/**
 * When the mobile [popover] drawer is open, mark the <main> inert so background
 * links and controls are removed from tab flow and AT tree.
 */
export function wireDrawerInert() {
  const drawer = document.getElementById('primary-nav');
  const main = document.querySelector('main');
  if (!drawer || !main) return;
  const sync = () => main.toggleAttribute('inert', drawer.matches(':popover-open'));
  drawer.addEventListener('toggle', sync);
}

document.addEventListener('DOMContentLoaded', () => {
  markCurrentNav();
  wireDrawerInert();
});
```

- [ ] **Step 2: Commit**

```bash
git add assets/js/nav.js
git commit -m "feat(site): sticky nav aria-current and drawer inert wiring"
```

---

### Task 9: Reusable page shell HTML template

**Design:** every one of the 5 HTML pages shares the same skeleton — different `<main>` contents. Rather than copy-paste, this task documents the skeleton so subsequent page tasks reference it.

**Shell template (do NOT commit this file — it's a reference):**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><!-- PAGE TITLE --> | Futebol BR 2.0</title>
  <meta name="description" content="<!-- PAGE DESCRIPTION -->">

  <!-- Cascade layer order -->
  <link rel="stylesheet" href="/assets/css/layers.css">
  <link rel="stylesheet" href="/assets/css/tokens.css">
  <link rel="stylesheet" href="/assets/css/reset.css">
  <link rel="stylesheet" href="/assets/css/base.css">
  <link rel="stylesheet" href="/assets/css/layout.css">
  <link rel="stylesheet" href="/assets/css/view-transitions.css">
  <!-- Page-specific stylesheets appended here -->

  <!-- Preload the season JSON on pages that need it -->
  <link rel="preload" as="fetch" href="/data/season-default.json" crossorigin>

  <!-- Hold the transition until critical content is in the DOM -->
  <link rel="expect" href="#page-ready" blocking="render">
</head>
<body>
  <header class="site-nav">
    <a class="site-nav__brand" href="/">Futebol BR <span aria-hidden="true">2.0</span></a>
    <button class="site-nav__toggle" popovertarget="primary-nav" aria-label="Abrir menu">☰</button>
    <nav>
      <ul id="primary-nav" popover="auto" class="site-nav__links" role="list">
        <li><a href="/">Início</a></li>
        <li><a href="/manifesto">Manifesto</a></li>
        <li><a href="/ligas">Ligas Regionais</a></li>
        <li><a href="/timeline">Calendário</a></li>
        <li><a href="/copa">Copas Nacionais</a></li>
      </ul>
    </nav>
  </header>

  <main id="page-ready">
    <!-- PAGE CONTENT -->
  </main>

  <footer>
    <p>Simulação seed 740 · Botafogo campeão · <a href="/manifesto">Leia o manifesto</a></p>
  </footer>

  <script type="module" src="/assets/js/nav.js"></script>
  <!-- Page-specific script tags appended here -->
</body>
</html>
```

- [ ] **Step 1: Nothing to commit** — this task is documentation for subsequent tasks. Move to Task 10.

---

## Section D — Homepage (`index.html`)

The homepage has 9 sections plus header/footer. Each subtask builds one section's HTML + CSS + (where needed) JS.

### Task 10: index.html skeleton + Hero + Analogy table

**Files:**
- Create: `index.html`
- Create: `assets/css/home/hero.css`
- Create: `assets/css/home/analogy-table.css`
- Create: `assets/js/pages/home.js`

- [ ] **Step 1: Write `index.html` using the shell from Task 9**

Insert Home page-specific stylesheets after `view-transitions.css`:

```html
<link rel="stylesheet" href="/assets/css/home/hero.css">
<link rel="stylesheet" href="/assets/css/home/analogy-table.css">
<link rel="stylesheet" href="/assets/css/home/escala.css">
<link rel="stylesheet" href="/assets/css/home/metric-cards.css">
<link rel="stylesheet" href="/assets/css/home/workload-chart.css">
<link rel="stylesheet" href="/assets/css/home/contrast-strip.css">
<link rel="stylesheet" href="/assets/css/home/estrutura-strip.css">
<link rel="stylesheet" href="/assets/css/home/sleeping-giants.css">
<link rel="stylesheet" href="/assets/css/home/revelation-clubs.css">
<link rel="stylesheet" href="/assets/css/home/manifesto-teaser.css">
<link rel="stylesheet" href="/assets/css/home/nav-tiles.css">
```

Page title: `Futebol BR 2.0 · O problema não é o calendário. É a escala.`
Page description: `Simulação da reforma estrutural do futebol brasileiro: 192 clubes, 6 ligas regionais, Copa dos Campeões.`

Inside `<main id="page-ready">`, add sections one per following task (Hero first):

```html
<section class="hero">
  <p class="hero__pullquote">
    O problema não é o calendário. É a escala.
  </p>
  <p class="hero__thesis">
    O Brasil, com dimensões continentais, promove menos clubes ao topo do futebol nacional do que Portugal.
    A Reforma 2.0 corrige a pirâmide antes de tocar no calendário.
  </p>

  <section class="analogy" aria-labelledby="analogy-heading">
    <h2 id="analogy-heading">Cada região é uma liga europeia</h2>
    <table class="analogy__table">
      <thead>
        <tr><th scope="col">Reforma 2.0</th><th scope="col">Análogo europeu</th><th scope="col">Pop.</th></tr>
      </thead>
      <tbody id="analogy-rows"></tbody>
    </table>
  </section>
</section>
```

- [ ] **Step 2: Write `hero.css`**

```css
@layer components {
  .hero {
    display: grid;
    gap: var(--space-6);
    grid-template-columns: minmax(0, 1fr);
  }
  @container (inline-size >= 900px) {
    .hero { grid-template-columns: 1fr 1fr; align-items: center; }
  }
  .hero__pullquote {
    font-family: var(--font-serif);
    font-size: var(--step-5);
    line-height: 1.05;
    text-wrap: balance;
    max-inline-size: 18ch;
    color: var(--color-accent);
    font-weight: 600;
    letter-spacing: -0.02em;
  }
  .hero__thesis {
    font-size: var(--step-1);
    color: var(--color-muted);
  }
}
```

- [ ] **Step 3: Write `analogy-table.css`**

```css
@layer components {
  @scope (.analogy) {
    :scope { border-block-start: 1px solid var(--color-hairline); padding-block-start: var(--space-5); }
    h2 { font-size: var(--step-2); margin-block-end: var(--space-4); }
    .analogy__table { border-collapse: collapse; inline-size: 100%; font-family: var(--font-sans); font-size: var(--step-0); }
    th, td { text-align: start; padding: var(--space-3) var(--space-2); border-block-end: 1px solid var(--color-hairline); }
    th { font-weight: 600; color: var(--color-muted); font-size: var(--step--1); text-transform: uppercase; letter-spacing: 0.05em; }
    tbody tr:hover { background: color-mix(in oklab, var(--color-accent) 6%, transparent); }
    tbody tr:has(td.analogy__pop) td.analogy__pop { color: var(--color-muted); font-variant-numeric: tabular-nums; text-align: end; }
  }
}
```

- [ ] **Step 4: Write `home.js` (analogy renderer only for now)**

```js
import { loadSeason } from '../season.js';

const ANALOGIES = [
  { liga: 'Liga Paulista', europ: 'Premier League', pop: '46M' },
  { liga: 'Liga Nordeste', europ: 'Serie A (Itália)', pop: '54M' },
  { liga: 'Liga Mineira/Centro-Oeste', europ: 'La Liga', pop: '28M' },
  { liga: 'Liga Guanabara-Capixaba', europ: 'Primeira Liga (Portugal)', pop: '19M' },
  { liga: 'Liga Sulista', europ: 'Bundesliga', pop: '30M' },
  { liga: 'Liga Norte', europ: 'Eredivisie', pop: '18M' },
];

function renderAnalogy() {
  const tbody = document.getElementById('analogy-rows');
  if (!tbody) return;
  tbody.innerHTML = ANALOGIES.map(a =>
    `<tr><td>${a.liga}</td><td>${a.europ}</td><td class="analogy__pop">${a.pop}</td></tr>`
  ).join('');
}

renderAnalogy();
loadSeason().then((season) => {
  window.__season = season; // convenience for later widgets
  // additional widgets wired in later tasks
});
```

- [ ] **Step 5: Verify in browser**

Run: `npx serve -p 5173` (or any static server)
Open: `http://localhost:5173/`
Expected: Hero pull-quote renders, analogy table shows 6 rows, sticky nav visible, no console errors.

- [ ] **Step 6: Commit**

```bash
git add index.html assets/css/home/hero.css assets/css/home/analogy-table.css assets/js/pages/home.js
git commit -m "feat(home): hero, european analogy table, and page skeleton"
```

---

### Task 11: Escala continental callout

**Files:**
- Create: `assets/css/home/escala.css`
- Modify: `index.html` (append section)

- [ ] **Step 1: Append to `index.html` after the hero section**

```html
<section class="escala" aria-labelledby="escala-heading">
  <h2 id="escala-heading" class="visually-hidden">Escala continental</h2>
  <div class="escala__row">
    <figure class="escala__country">
      <figcaption>🇧🇷 Brasil</figcaption>
      <dl>
        <div><dt>Área</dt><dd>8,5M km²</dd></div>
        <div><dt>População</dt><dd>214M</dd></div>
        <div><dt>Clubes na elite</dt><dd>20</dd></div>
      </dl>
    </figure>
    <figure class="escala__country">
      <figcaption>🇵🇹 Portugal</figcaption>
      <dl>
        <div><dt>Área</dt><dd>92k km²</dd></div>
        <div><dt>População</dt><dd>10M</dd></div>
        <div><dt>Clubes na elite</dt><dd>18</dd></div>
      </dl>
    </figure>
  </div>
  <p class="escala__punchline">
    Brasil promove <strong>2 clubes a mais</strong> que Portugal.
    Em um país <strong>92× maior</strong> em área e <strong>21× maior</strong> em população.
  </p>
</section>
```

- [ ] **Step 2: Write `escala.css`**

```css
@layer components {
  @scope (.escala) {
    :scope { display: grid; gap: var(--space-5); padding-block: var(--space-6); border-block: 1px solid var(--color-hairline); }
    .escala__row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-5); }
    .escala__country { display: grid; gap: var(--space-3); font-family: var(--font-sans); }
    .escala__country figcaption { font-size: var(--step-2); font-weight: 700; }
    dl { display: grid; gap: var(--space-2); }
    dl > div { display: flex; justify-content: space-between; border-block-end: 1px solid var(--color-hairline); padding-block: var(--space-2); }
    dt { color: var(--color-muted); }
    dd { font-variant-numeric: tabular-nums; }
    .escala__punchline { font-size: var(--step-2); text-align: center; text-wrap: balance; max-inline-size: 35ch; margin-inline: auto; }
    .escala__punchline strong { color: var(--color-accent); }
  }

  .visually-hidden {
    position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden;
    clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap;
  }
}
```

- [ ] **Step 3: Verify** — reload; two country cards side-by-side with punchline below.

- [ ] **Step 4: Commit**

```bash
git add index.html assets/css/home/escala.css
git commit -m "feat(home): escala continental Brazil-vs-Portugal callout"
```

---

### Task 12: Metric cards

**Files:**
- Create: `assets/css/home/metric-cards.css`
- Modify: `index.html` (append section)
- Modify: `assets/js/pages/home.js` (populate cards)

- [ ] **Step 1: Append to `index.html`**

```html
<section class="metrics" aria-labelledby="metrics-heading">
  <h2 id="metrics-heading">O impacto da pirâmide</h2>
  <ul class="metric-cards" role="list">
    <li class="metric-card"><span class="metric-card__value" data-metric="totalClubes"></span><span class="metric-card__label">Clubes ativos</span></li>
    <li class="metric-card"><span class="metric-card__value" data-metric="tetoJogos"></span><span class="metric-card__label">Teto de jogos por temporada</span></li>
    <li class="metric-card"><span class="metric-card__value" data-metric="mesesGarantidos"></span><span class="metric-card__label">Meses de calendário garantido</span></li>
    <li class="metric-card"><span class="metric-card__value" data-metric="desempregadosEmAbril"></span><span class="metric-card__label">Clubes desempregados em abril</span></li>
    <li class="metric-card"><span class="metric-card__value" data-metric="reducaoVoos"></span><span class="metric-card__label">Redução de voos na fase regular</span></li>
  </ul>
</section>
```

- [ ] **Step 2: Write `metric-cards.css`**

```css
@layer components {
  @scope (.metrics) {
    .metric-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr)); gap: var(--space-4); font-family: var(--font-sans); }
    .metric-card { display: grid; gap: var(--space-2); padding: var(--space-4); border: 1px solid var(--color-hairline); border-radius: var(--radius); }
    .metric-card__value { font-size: var(--step-4); font-weight: 700; color: var(--color-accent); font-variant-numeric: tabular-nums; }
    .metric-card__label { color: var(--color-muted); font-size: var(--step--1); text-transform: uppercase; letter-spacing: 0.03em; }
  }
}
```

- [ ] **Step 3: Extend `home.js`** (append near the `loadSeason().then` block)

```js
function renderMetrics(season) {
  for (const el of document.querySelectorAll('[data-metric]')) {
    const key = el.getAttribute('data-metric');
    el.textContent = season.meta[key];
  }
}
```

And call `renderMetrics(season)` inside the `.then(...)`.

- [ ] **Step 4: Verify** — 5 cards render with numbers from the JSON.

- [ ] **Step 5: Commit**

```bash
git add index.html assets/css/home/metric-cards.css assets/js/pages/home.js
git commit -m "feat(home): metric cards populated from season meta"
```

---

### Task 13: Workload comparison chart (SVG-free, pure CSS)

**Files:**
- Create: `assets/css/home/workload-chart.css`
- Modify: `index.html` (append section)
- Modify: `assets/js/pages/home.js`

**Design:** horizontal bars driven by `--w` custom property. Two rows per bucket (current 2024 vs reform).

- [ ] **Step 1: Append to `index.html`**

```html
<section class="workload" aria-labelledby="workload-heading">
  <h2 id="workload-heading">Jogos por temporada</h2>
  <p class="workload__caption">Modelo atual (2024, estimativa) vs Reforma 2.0 — média por bucket.</p>
  <div class="workload__chart" id="workload-chart"></div>
  <p class="workload__legend"><span class="dot dot--current"></span> Modelo atual · <span class="dot dot--reform"></span> Reforma 2.0</p>
</section>
```

- [ ] **Step 2: Write `workload-chart.css`**

```css
@layer components {
  @scope (.workload) {
    :scope { container-type: inline-size; }
    .workload__chart { display: grid; gap: var(--space-4); font-family: var(--font-sans); }
    .workload__row { display: grid; grid-template-columns: 8rem 1fr; align-items: center; gap: var(--space-3); }
    .workload__label { font-weight: 600; text-transform: uppercase; font-size: var(--step--1); letter-spacing: 0.05em; }
    .workload__bars { display: grid; gap: var(--space-1); }
    .workload__bar {
      display: grid; grid-template-columns: 1fr auto; align-items: center; gap: var(--space-2);
      block-size: 1.75rem;
    }
    .workload__bar::before {
      content: ""; grid-area: 1 / 1;
      background: var(--bar-color, var(--color-muted));
      inline-size: calc(var(--w, 0) * 1%); block-size: 100%; border-radius: 2px;
    }
    .workload__bar[data-set="current"] { --bar-color: color-mix(in oklab, var(--color-muted) 65%, transparent); }
    .workload__bar[data-set="reform"]  { --bar-color: var(--color-accent); }
    .workload__value { grid-area: 1 / 2; font-variant-numeric: tabular-nums; }
    .dot { display: inline-block; inline-size: 0.75em; block-size: 0.75em; border-radius: 50%; margin-inline-end: 0.25em; }
    .dot--current { background: color-mix(in oklab, var(--color-muted) 65%, transparent); }
    .dot--reform  { background: var(--color-accent); }
  }
}
```

- [ ] **Step 3: Extend `home.js`**

```js
const CURRENT_REFERENCE = { elite: 75, media: 54, base: 14 };

function renderWorkload(season) {
  const el = document.getElementById('workload-chart');
  if (!el) return;
  const buckets = ['elite', 'media', 'base'];
  const labels = { elite: 'Elite', media: 'Classe Média', base: 'Base' };
  const maxVal = Math.max(...buckets.map(b => Math.max(CURRENT_REFERENCE[b], season.perfisDashboard[b].mediaJogos)));
  el.innerHTML = buckets.map((b) => {
    const cur = CURRENT_REFERENCE[b];
    const ref = season.perfisDashboard[b].mediaJogos;
    return `<div class="workload__row">
      <div class="workload__label">${labels[b]}</div>
      <div class="workload__bars">
        <div class="workload__bar" data-set="current" style="--w:${(cur / maxVal * 100).toFixed(1)}"><span class="workload__value">${cur} jogos</span></div>
        <div class="workload__bar" data-set="reform"  style="--w:${(ref / maxVal * 100).toFixed(1)}"><span class="workload__value">${ref} jogos</span></div>
      </div>
    </div>`;
  }).join('');
}
```

Call `renderWorkload(season)` in the `.then(...)`.

- [ ] **Step 4: Verify** — bars render, reform bar is longer than current for base, shorter for elite.

- [ ] **Step 5: Commit**

```bash
git add index.html assets/css/home/workload-chart.css assets/js/pages/home.js
git commit -m "feat(home): workload comparison chart"
```

---

### Task 14: Contrast strip (two 42-week rows)

**Files:**
- Create: `assets/css/home/contrast-strip.css`
- Modify: `index.html`
- Modify: `assets/js/pages/home.js`

**Design:** two rows of 42 tiny cells. Each cell colored by the competition of that week's match, or muted if idle. One row = elite club (Botafogo, given seed 740), one = base club (a Serie B example).

- [ ] **Step 1: Append to `index.html`**

```html
<section class="contrast" aria-labelledby="contrast-heading">
  <h2 id="contrast-heading">A mesma temporada, dois clubes</h2>
  <p class="contrast__caption">Todos os jogos de dois clubes ao longo de 42 semanas.</p>
  <div class="contrast__rows" id="contrast-rows"></div>
  <p class="contrast__legend">
    <span class="dot" style="background:var(--comp-liga)"></span> Liga Regional ·
    <span class="dot" style="background:var(--comp-campeoes)"></span> Copa dos Campeões ·
    <span class="dot" style="background:var(--comp-brasil)"></span> Copa do Brasil ·
    <span class="dot" style="background:var(--comp-fifa-pause)"></span> Livre
  </p>
</section>
```

- [ ] **Step 2: Write `contrast-strip.css`**

```css
@layer components {
  @scope (.contrast) {
    .contrast__rows { display: grid; gap: var(--space-3); font-family: var(--font-sans); }
    .contrast__row { display: grid; grid-template-columns: 10rem 1fr; align-items: center; gap: var(--space-3); }
    .contrast__label { font-size: var(--step--1); font-weight: 600; }
    .contrast__strip { display: grid; grid-template-columns: repeat(42, 1fr); gap: 2px; }
    .contrast__cell { block-size: 1.25rem; background: var(--cell, var(--comp-fifa-pause)); border-radius: 1px; }
    .contrast__cell[data-comp="liga_regional"] { --cell: var(--comp-liga); }
    .contrast__cell[data-comp="copa_campeoes"] { --cell: var(--comp-campeoes); }
    .contrast__cell[data-comp="copa_brasil"]   { --cell: var(--comp-brasil); }
  }
}
```

- [ ] **Step 3: Extend `home.js`**

```js
const ELITE_ID = 'BOT'; // Botafogo
const BASE_ID_HINT = { liga: 'Liga Norte', divisao: 'B' }; // pick first Norte B club

function pickBaseClub(season) {
  return season.clubes.find(c => c.liga_regional === BASE_ID_HINT.liga && c.divisao === BASE_ID_HINT.divisao);
}

function renderContrast(season) {
  const el = document.getElementById('contrast-rows');
  if (!el) return;
  const elite = season.clubes.find(c => c.id === ELITE_ID);
  const base = pickBaseClub(season);
  el.innerHTML = [elite, base].map(club => {
    const cal = season.calendariosPorClube[club.id] ?? [];
    const cells = cal.map(w => {
      const comp = w.fimDeSemana?.competicao ?? w.meioDeSemana?.competicao ?? '';
      return `<div class="contrast__cell" data-comp="${comp}"></div>`;
    }).join('');
    return `<div class="contrast__row">
      <div class="contrast__label">${club.nome} <span class="contrast__sub">(${club.liga_regional})</span></div>
      <div class="contrast__strip">${cells}</div>
    </div>`;
  }).join('');
}
```

Call `renderContrast(season)`.

- [ ] **Step 4: Verify** — two 42-cell strips render; Botafogo's is dense with colors, base club's is sparser but still evenly distributed.

- [ ] **Step 5: Commit**

```bash
git add index.html assets/css/home/contrast-strip.css assets/js/pages/home.js
git commit -m "feat(home): contrast strip comparing elite vs base calendars"
```

---

### Task 15: Estrutura da temporada strip

**Files:**
- Create: `assets/css/home/estrutura-strip.css`
- Modify: `index.html`

**Design:** a single 42-week row showing the system's weekly type: weekend-only, weekend+midweek, FIFA pause. Static — describes the calendar structure, not a specific club.

- [ ] **Step 1: Append to `index.html`**

```html
<section class="estrutura" aria-labelledby="estrutura-heading">
  <h2 id="estrutura-heading">42 semanas, 21+21</h2>
  <p class="estrutura__caption">21 semanas de rodada dupla (fim-de-semana + meio-de-semana) e 21 semanas de rodada simples, com pausas FIFA.</p>
  <div class="estrutura__strip" aria-hidden="true"></div>
  <p class="estrutura__legend">
    <span class="dot" style="background:var(--color-accent)"></span> Rodada dupla ·
    <span class="dot" style="background:color-mix(in oklab, var(--color-accent) 40%, transparent)"></span> Rodada simples ·
    <span class="dot" style="background:var(--comp-fifa-pause)"></span> Pausa FIFA
  </p>
</section>
```

- [ ] **Step 2: Write `estrutura-strip.css`**

```css
@layer components {
  @scope (.estrutura) {
    .estrutura__strip { display: grid; grid-template-columns: repeat(42, 1fr); gap: 2px; }
    .estrutura__strip::before { content: ""; }
    /* Cell classes generated in a small inline script inside the section */
  }
}
```

- [ ] **Step 3: Extend `index.html` — inline structure script inside the section for simplicity**

Replace the empty `<div class="estrutura__strip">` with:

```html
<div class="estrutura__strip" aria-hidden="true" id="estrutura-strip"></div>
<script type="module">
  const FIFA = new Set([14, 24, 34]);
  const DUPLE = new Set([3, 5, 6, 8, 9, 11, 12, 20, 21, 25, 26, 30, 31, 35, 36, 40, 41]);
  const s = document.getElementById('estrutura-strip');
  const cells = Array.from({ length: 42 }, (_, i) => {
    const w = i + 1;
    const kind = FIFA.has(w) ? 'fifa' : (DUPLE.has(w) ? 'dupla' : 'simples');
    const bg = kind === 'fifa' ? 'var(--comp-fifa-pause)' :
               kind === 'dupla' ? 'var(--color-accent)' :
               'color-mix(in oklab, var(--color-accent) 40%, transparent)';
    return `<span style="block-size:1.25rem;background:${bg};border-radius:1px;"></span>`;
  }).join('');
  s.innerHTML = cells;
</script>
```

- [ ] **Step 4: Verify** — strip renders with three color states.

- [ ] **Step 5: Commit**

```bash
git add index.html assets/css/home/estrutura-strip.css
git commit -m "feat(home): 42-week season structure strip"
```

---

### Task 16: Sleeping Giants scroll-snap card row

**Files:**
- Create: `assets/css/home/sleeping-giants.css`
- Modify: `index.html`
- Modify: `assets/js/pages/home.js`

**Design:** horizontal scroll-snap row of `<figure>` cards. Uses container query for card sizing. Data comes from a small static array — copy the club list from `src/data/attendance.js`.

- [ ] **Step 1: Append to `index.html`**

```html
<section class="giants" aria-labelledby="giants-heading">
  <h2 id="giants-heading">Gigantes adormecidos</h2>
  <p class="giants__tagline">A torcida já sustenta esses clubes. Falta o palco.</p>
  <ul class="giants__row" role="list" id="giants-row"></ul>
  <p class="giants__caveat">Média de público — estimativa 2024.</p>
</section>
```

- [ ] **Step 2: Write `sleeping-giants.css`**

```css
@layer components {
  @scope (.giants) {
    .giants__row {
      display: grid; grid-auto-flow: column; grid-auto-columns: min(60vw, 16rem);
      gap: var(--space-3); overflow-x: auto; padding-block-end: var(--space-3);
      scroll-snap-type: inline mandatory; scroll-padding-inline: var(--space-5);
      overscroll-behavior-inline: contain;
      scrollbar-width: thin;
    }
    .giants__card {
      scroll-snap-align: start;
      display: grid; gap: var(--space-2);
      padding: var(--space-4); border: 1px solid var(--color-hairline); border-radius: var(--radius);
      font-family: var(--font-sans);
    }
    .giants__card figcaption { font-size: var(--step-1); font-weight: 700; }
    .giants__attendance { font-size: var(--step-3); font-variant-numeric: tabular-nums; color: var(--color-accent); }
    .giants__meta { color: var(--color-muted); font-size: var(--step--1); }
  }
}
```

- [ ] **Step 3: Extend `home.js`**

Add the Sleeping Giants list (paste the array from `src/data/attendance.js`), then render:

```js
const SLEEPING_GIANTS = [
  /* copy from src/data/attendance.js */
];

function renderSleepingGiants() {
  const el = document.getElementById('giants-row');
  if (!el) return;
  el.innerHTML = SLEEPING_GIANTS.map(g => `
    <li><figure class="giants__card">
      <figcaption>${g.nome} <span class="giants__meta">${g.estado}</span></figcaption>
      <div class="giants__attendance">${g.mediaPublico.toLocaleString('pt-BR')} <small>por jogo</small></div>
      <div class="giants__meta">${g.divisaoAtual} · ${g.liga}</div>
    </figure></li>
  `).join('');
}
```

Call `renderSleepingGiants()` on load (no season data needed).

- [ ] **Step 4: Verify** — 11 cards, horizontal scroll snaps, first card fully visible.

- [ ] **Step 5: Commit**

```bash
git add index.html assets/css/home/sleeping-giants.css assets/js/pages/home.js
git commit -m "feat(home): sleeping giants scroll-snap row"
```

---

### Task 17: Revelation Clubs card row

**Files:**
- Create: `assets/css/home/revelation-clubs.css`
- Modify: `index.html`
- Modify: `assets/js/pages/home.js`

Similar shape to Sleeping Giants. Data: 6 WC-winner players from `src/data/revelations.js`.

- [ ] **Step 1: Append to `index.html`**

```html
<section class="revelation" aria-labelledby="revelation-heading">
  <h2 id="revelation-heading">De onde vieram os ídolos</h2>
  <p class="revelation__tagline">Fortalecer o interior não é nostalgia; é ampliar a rede de captação.</p>
  <p class="revelation__subtagline">Os últimos ídolos vieram daqui. Há quantos anos revelamos um novo Ronaldo?</p>
  <ul class="revelation__row" role="list" id="revelation-row"></ul>
</section>
```

- [ ] **Step 2: Write `revelation-clubs.css`**

```css
@layer components {
  @scope (.revelation) {
    .revelation__row {
      display: grid; grid-auto-flow: column; grid-auto-columns: min(60vw, 16rem);
      gap: var(--space-3); overflow-x: auto; padding-block-end: var(--space-3);
      scroll-snap-type: inline mandatory; scroll-padding-inline: var(--space-5);
      scrollbar-width: thin;
    }
    .revelation__card {
      scroll-snap-align: start;
      display: grid; gap: var(--space-2);
      padding: var(--space-4); border: 1px solid var(--color-hairline); border-radius: var(--radius);
      font-family: var(--font-sans);
    }
    .revelation__player { font-size: var(--step-1); font-weight: 700; }
    .revelation__club { color: var(--color-muted); font-size: var(--step--1); }
    .revelation__cups { font-family: var(--font-serif); font-size: var(--step-2); color: var(--color-accent); font-variant-numeric: tabular-nums; }
  }
}
```

- [ ] **Step 3: Extend `home.js`**

```js
const REVELATION = [
  /* copy from src/data/revelations.js */
];

function renderRevelation() {
  const el = document.getElementById('revelation-row');
  if (!el) return;
  el.innerHTML = REVELATION.map(r => `
    <li><figure class="revelation__card">
      <div class="revelation__player">${r.jogador}</div>
      <div class="revelation__club">Revelado por ${r.clubeRevelador} (${r.estado})</div>
      <div class="revelation__club">${r.liga}</div>
      <div class="revelation__cups">🏆 ${r.copasVencidas.join(', ')}</div>
    </figure></li>
  `).join('');
}
```

Call `renderRevelation()`.

- [ ] **Step 4: Verify** — 6 cards render.

- [ ] **Step 5: Commit**

```bash
git add index.html assets/css/home/revelation-clubs.css assets/js/pages/home.js
git commit -m "feat(home): revelation clubs card row"
```

---

### Task 18: Manifesto teaser + Nav tiles

**Files:**
- Create: `assets/css/home/manifesto-teaser.css`
- Create: `assets/css/home/nav-tiles.css`
- Modify: `index.html`

- [ ] **Step 1: Append to `index.html`**

```html
<section class="teaser" aria-labelledby="teaser-heading">
  <h2 id="teaser-heading">O manifesto</h2>
  <p class="teaser__body">
    Este site é uma simulação. É também um argumento. Se você chegou até aqui,
    vale ler o manifesto inteiro — a história de por que a próxima reforma tem
    que ser de escala, não de calendário.
  </p>
  <p><a class="teaser__cta" href="/manifesto">Leia o manifesto completo →</a></p>
</section>

<nav aria-label="Explorar" class="tiles">
  <a class="tile" href="/ligas"><span class="tile__label">Ligas Regionais</span><span class="tile__sub">6 ligas, 192 clubes</span></a>
  <a class="tile" href="/timeline"><span class="tile__label">Calendário</span><span class="tile__sub">42 semanas por clube</span></a>
  <a class="tile" href="/copa"><span class="tile__label">Copas Nacionais</span><span class="tile__sub">Campeões + Brasil</span></a>
</nav>
```

- [ ] **Step 2: Write `manifesto-teaser.css`**

```css
@layer components {
  @scope (.teaser) {
    :scope { border-block: 1px solid var(--color-hairline); padding-block: var(--space-6); }
    .teaser__body { font-size: var(--step-1); max-inline-size: 55ch; }
    .teaser__cta { font-family: var(--font-sans); font-weight: 700; color: var(--color-accent); font-size: var(--step-1); text-decoration: none; }
    .teaser__cta:hover { text-decoration: underline; }
  }
}
```

- [ ] **Step 3: Write `nav-tiles.css`**

```css
@layer components {
  .tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: var(--space-4); }
  .tile {
    display: grid; gap: var(--space-2); padding: var(--space-6) var(--space-5);
    border: 1px solid var(--color-hairline); border-radius: var(--radius);
    text-decoration: none; color: inherit; font-family: var(--font-sans);
    transition: transform 150ms ease, border-color 150ms ease;
  }
  .tile:hover { border-color: var(--color-accent); transform: translateY(-2px); }
  .tile__label { font-size: var(--step-2); font-weight: 700; }
  .tile__sub { color: var(--color-muted); font-size: var(--step--1); }
}
```

- [ ] **Step 4: Verify** — teaser + 3 nav tiles at bottom. Click one — view transition happens (or graceful fallback if not supported).

- [ ] **Step 5: Commit**

```bash
git add index.html assets/css/home/manifesto-teaser.css assets/css/home/nav-tiles.css
git commit -m "feat(home): manifesto teaser and navigation tiles"
```

---

## Section E — Manifesto Page

### Task 19: manifesto.html long-read

**Files:**
- Create: `manifesto.html`
- Create: `assets/css/manifesto.css`

**Content note:** the manifesto text is the user's Medium article, with the season calendar aligned to "late-Jan → início-dez" (see `project_scope_decisions` memory). Use PT verbatim from the article's key rhetorical anchors.

- [ ] **Step 1: Write `manifesto.html`**

Use the shell from Task 9. Title: `O Manifesto | Futebol BR 2.0`. Description: `Manifesto: por que a próxima reforma do futebol brasileiro tem que ser de escala, não de calendário.`

Insert `<link rel="stylesheet" href="/assets/css/manifesto.css">` after the base sheets. No page-specific JS needed.

Inside `<main id="page-ready">`:

```html
<article class="manifesto">
  <header class="manifesto__header">
    <p class="manifesto__eyebrow">Manifesto · 2026</p>
    <h1>O futebol brasileiro precisa de uma nova pirâmide, não apenas de um novo calendário.</h1>
    <p class="manifesto__lede">
      O problema não é o calendário. É a escala.
    </p>
  </header>

  <section aria-labelledby="m-1">
    <h2 id="m-1">Um funil excessivamente estreito</h2>
    <p>
      O Brasil promove apenas 20 clubes à sua elite nacional — o mesmo número que Portugal,
      um país 92 vezes menor. Em uma potência futebolística de dimensão continental, isso
      é um desperdício estrutural.
    </p>
    <p>
      A cada temporada, dezenas de clubes do interior encerram suas atividades após os estaduais
      e passam o resto do ano sem calendário. Sem calendário regular, eles perdem patrocínios,
      fecham estádios, reduzem a base e demitem profissionais. Esse processo enfraquece todo o
      ecossistema que forma atletas e sustenta os mercados locais.
    </p>
  </section>

  <section aria-labelledby="m-2">
    <h2 id="m-2">Uma nova pirâmide</h2>
    <p>
      A Reforma 2.0 substitui os Campeonatos Estaduais e o Brasileirão por <strong>seis Ligas
      Regionais</strong> — cada uma com 18 clubes na Série A e 14 na Série B, disputadas em
      pontos corridos ao longo de 10 meses.
    </p>
    <ul>
      <li>Liga Paulista</li>
      <li>Liga Nordeste</li>
      <li>Liga Sulista (RS, SC, PR)</li>
      <li>Liga Mineira/Centro-Oeste</li>
      <li>Liga Guanabara-Capixaba</li>
      <li>Liga Norte</li>
    </ul>
    <p>
      Cada região é uma liga europeia em escala: Paulista ≈ Premier League, Nordeste ≈ Serie A,
      Sul ≈ Bundesliga. A Copa dos Campeões Regionais — 48 clubes, 12 grupos, mata-mata em
      jogo único — torna-se a Champions League brasileira. A Copa do Brasil, com 144 clubes
      da base ao topo, é a FA Cup.
    </p>
  </section>

  <section aria-labelledby="m-3">
    <h2 id="m-3">Um laboratório que oxigenava o futebol nacional</h2>
    <p>
      Fortalecer o interior não é nostalgia; é ampliar a rede de captação. Romário veio do Olaria,
      Ronaldo do São Cristóvão, Rivaldo do Santa Cruz, Lúcio do Guará. As últimas duas Copas do Mundo
      que o Brasil ganhou foram jogadas por talentos revelados em clubes que hoje mal existem no
      calendário nacional.
    </p>
    <p>
      A escassez de novos craques e a perda de identidade da Amarelinha são reflexos de uma pirâmide
      que deixou de irrigar sua base. Não é coincidência.
    </p>
  </section>

  <section aria-labelledby="m-4">
    <h2 id="m-4">Menos jogos, menos voos, mais futebol</h2>
    <p>
      Um clube da elite hoje joga cerca de 75 partidas por temporada. Na reforma, o teto é
      <strong>60 jogos</strong> — mesmo para um finalista que dispute todas as competições.
      A fase regular reduz em <strong>mais de 50%</strong> os voos interestaduais, porque as
      Ligas Regionais são intra-região.
    </p>
    <p>
      Um clube da base hoje joga 12 a 15 partidas concentradas em janeiro a abril, e passa
      o resto do ano parado. Na reforma, ele joga 34 partidas <strong>espalhadas ao longo
      de 10 meses</strong>. Zero clubes desempregados em abril.
    </p>
  </section>

  <section aria-labelledby="m-5">
    <h2 id="m-5">Uma reforma de escala, não de calendário</h2>
    <p>
      Toda tentativa de reforma nos últimos anos girou em torno do calendário: mover o
      Brasileirão para o padrão europeu, comprimir os estaduais, achatar a Copa do Brasil.
      Nenhuma delas ataca o problema real, que é a arquitetura da pirâmide.
    </p>
    <p>
      A Reforma 2.0 não muda datas. Ela muda a forma. E aí, o calendário se resolve sozinho.
    </p>
  </section>
</article>
```

- [ ] **Step 2: Write `manifesto.css`**

```css
@layer components {
  @scope (.manifesto) {
    :scope { max-inline-size: var(--measure); margin-inline: auto; display: grid; gap: var(--space-7); }
    .manifesto__header { display: grid; gap: var(--space-3); text-align: center; padding-block-end: var(--space-6); border-block-end: 1px solid var(--color-hairline); }
    .manifesto__eyebrow { color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.1em; font-family: var(--font-sans); font-size: var(--step--1); }
    .manifesto__header h1 { max-inline-size: 20ch; margin-inline: auto; font-size: var(--step-5); }
    .manifesto__lede { font-size: var(--step-2); font-style: italic; color: var(--color-accent); max-inline-size: 30ch; margin-inline: auto; }
    h2 { font-size: var(--step-2); margin-block-end: var(--space-4); }
    p { font-size: var(--step-0); line-height: 1.65; margin-block-end: var(--space-4); }
    p:last-child { margin-block-end: 0; }
    strong { font-weight: 700; color: var(--color-accent); }
    ul { padding-inline-start: var(--space-6); display: grid; gap: var(--space-1); }
    ::selection { background: color-mix(in oklab, var(--color-accent) 30%, transparent); }
  }
}
```

- [ ] **Step 3: Verify** — reads like a long-form article. Comfortable line-length, generous whitespace, nav sticky at top, brand persists across nav.

- [ ] **Step 4: Commit**

```bash
git add manifesto.html assets/css/manifesto.css
git commit -m "feat(manifesto): long-read editorial manifesto page"
```

---

## Section F — Ligas Page

### Task 20: ligas.html with tabs + tables

**Files:**
- Create: `ligas.html`
- Create: `assets/css/ligas.css`
- Create: `assets/js/pages/ligas.js`
- Create: `assets/js/components/tabs.js`

**Design:**
- Tab bar for the 6 leagues using `<nav>` with buttons; on click, updates URL hash (`#/liga=paulista`) so state is bookmarkable and view-transition-eligible.
- Selected league renders Série A + Série B tables, with qualification zones highlighted via `data-zona` attributes and `:has()` selectors.
- Uses `:has()` to swap card content when a tab is active.

- [ ] **Step 1: Write `ligas.html` (shell from Task 9)**

Title: `Ligas Regionais | Futebol BR 2.0`. Description: `Seis ligas regionais, 192 clubes: Paulista, Nordeste, Sulista, Mineira/CO, Guanabara-Capixaba, Norte.`

Inside `<main id="page-ready">`:

```html
<section class="ligas">
  <h1>Ligas Regionais</h1>
  <nav aria-label="Escolher liga" class="ligas__tabs">
    <ul role="list" id="ligas-tabs"></ul>
  </nav>
  <section aria-live="polite" id="liga-detalhe"></section>
</section>
```

- [ ] **Step 2: Write `ligas.css`**

```css
@layer components {
  @scope (.ligas) {
    .ligas__tabs ul { display: flex; gap: var(--space-4); flex-wrap: wrap; padding-block-end: var(--space-4); border-block-end: 1px solid var(--color-hairline); font-family: var(--font-sans); }
    .ligas__tab {
      background: none; border: 0; padding: var(--space-2) var(--space-3); cursor: pointer;
      font-size: var(--step-0); font-family: inherit; color: inherit;
      border-block-end: 2px solid transparent;
    }
    .ligas__tab[aria-selected="true"] { color: var(--color-accent); border-block-end-color: var(--color-accent); font-weight: 700; }
    .ligas__tab-sub { display: block; color: var(--color-muted); font-size: var(--step--1); }

    .liga-detalhe { display: grid; gap: var(--space-6); padding-block-start: var(--space-5); }
    .liga-tabela { border-collapse: collapse; inline-size: 100%; font-family: var(--font-sans); font-variant-numeric: tabular-nums; }
    .liga-tabela th, .liga-tabela td { padding: var(--space-2) var(--space-3); border-block-end: 1px solid var(--color-hairline); text-align: end; }
    .liga-tabela th:first-child, .liga-tabela td:nth-child(2) { text-align: start; }
    .liga-tabela th { font-size: var(--step--1); text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-muted); }
    .liga-tabela tr[data-zona="campeoes"] td:first-child { box-shadow: inset 3px 0 0 var(--color-badge-campeoes); }
    .liga-tabela tr[data-zona="sulamericana"] td:first-child { box-shadow: inset 3px 0 0 var(--color-badge-sulamericana); }
    .liga-tabela tr[data-zona="rebaixamento"] td:first-child { box-shadow: inset 3px 0 0 var(--color-badge-rebaixamento); }

    .liga-context { padding: var(--space-4); border: 1px solid var(--color-hairline); border-radius: var(--radius); font-family: var(--font-sans); display: grid; gap: var(--space-2); }
    .liga-context__analog { color: var(--color-muted); }
    .liga-context__quota { font-size: var(--step-2); font-weight: 700; color: var(--color-accent); }
  }
}
```

- [ ] **Step 3: Write `tabs.js` (reusable)**

```js
/**
 * Wire up a tab bar. Tabs are buttons with data-key attributes.
 * Emits a 'tab-change' custom event on the tablist element with { detail: { key } }.
 */
export function wireTabs(tablistEl, { defaultKey } = {}) {
  const tabs = () => Array.from(tablistEl.querySelectorAll('[role="tab"]'));
  const select = (key) => {
    for (const t of tabs()) {
      const isSelected = t.dataset.key === key;
      t.setAttribute('aria-selected', isSelected);
      t.tabIndex = isSelected ? 0 : -1;
    }
    tablistEl.dispatchEvent(new CustomEvent('tab-change', { detail: { key } }));
  };

  tablistEl.addEventListener('click', (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (tab) select(tab.dataset.key);
  });

  tablistEl.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    const t = tabs();
    const currentIndex = t.findIndex((x) => x.getAttribute('aria-selected') === 'true');
    let next = currentIndex;
    if (e.key === 'ArrowLeft')  next = (currentIndex - 1 + t.length) % t.length;
    if (e.key === 'ArrowRight') next = (currentIndex + 1) % t.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = t.length - 1;
    select(t[next].dataset.key);
    t[next].focus();
    e.preventDefault();
  });

  if (defaultKey) select(defaultKey);
}
```

- [ ] **Step 4: Write `ligas.js`**

```js
import { loadSeason } from '../season.js';
import { wireTabs } from '../components/tabs.js';

const ANALOG = {
  'Liga Paulista': 'Premier League',
  'Liga Nordeste': 'Serie A (Itália)',
  'Liga Mineira/Centro-Oeste': 'La Liga',
  'Liga Guanabara-Capixaba': 'Primeira Liga (Portugal)',
  'Liga Sulista': 'Bundesliga',
  'Liga Norte': 'Eredivisie',
};

const CAMPEOES_QUOTAS = {
  'Liga Nordeste': 10, 'Liga Paulista': 10,
  'Liga Guanabara-Capixaba': 8, 'Liga Sulista': 8, 'Liga Mineira/Centro-Oeste': 8, 'Liga Norte': 4,
};

function slug(nome) { return nome.toLowerCase().replace(/\W+/g, '-').replace(/^-|-$/g, ''); }

function renderTabs(season) {
  const tabsEl = document.getElementById('ligas-tabs');
  tabsEl.innerHTML = season.ligasRegionais.map((l) =>
    `<li><button role="tab" data-key="${slug(l.nome)}" aria-selected="false" tabindex="-1"
      class="ligas__tab">${l.nome}<span class="ligas__tab-sub">${ANALOG[l.nome]}</span></button></li>`
  ).join('');
  tabsEl.setAttribute('role', 'tablist');
}

function renderTable(rows, quota) {
  return `<table class="liga-tabela">
    <caption class="visually-hidden">Classificação da Série ${rows[0].divisao}</caption>
    <thead><tr>
      <th scope="col">#</th><th scope="col">Clube</th>
      <th scope="col">J</th><th scope="col">V</th><th scope="col">E</th><th scope="col">D</th>
      <th scope="col">GP</th><th scope="col">GC</th><th scope="col">SG</th><th scope="col">Pts</th>
    </tr></thead>
    <tbody>
      ${rows.map((r) => {
        let zona = '';
        if (rows[0].divisao === 'A') {
          if (r.posicao <= quota) zona = 'campeoes';
          else if (r.posicao >= rows.length - 2) zona = 'rebaixamento';
        } else {
          if (r.posicao <= 3) zona = 'acesso';
        }
        return `<tr data-zona="${zona}">
          <td>${r.posicao}</td><td><a href="/timeline?clube=${r.id}">${r.nome}</a></td>
          <td>${r.jogos}</td><td>${r.vitorias}</td><td>${r.empates}</td><td>${r.derrotas}</td>
          <td>${r.golsPro}</td><td>${r.golsContra}</td><td>${r.saldoGols}</td><td><strong>${r.pontos}</strong></td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>`;
}

function renderLiga(season, key) {
  const liga = season.ligasRegionais.find((l) => slug(l.nome) === key);
  const el = document.getElementById('liga-detalhe');
  el.className = 'liga-detalhe';
  el.innerHTML = `
    <div class="liga-context">
      <div class="liga-context__analog">Análogo: <strong>${ANALOG[liga.nome]}</strong></div>
      <div class="liga-context__quota">${CAMPEOES_QUOTAS[liga.nome]} vagas na Copa dos Campeões</div>
    </div>
    <section aria-labelledby="serieA-heading">
      <h2 id="serieA-heading">Série A</h2>
      ${renderTable(liga.tabelaA, CAMPEOES_QUOTAS[liga.nome])}
    </section>
    <section aria-labelledby="serieB-heading">
      <h2 id="serieB-heading">Série B</h2>
      ${renderTable(liga.tabelaB)}
    </section>
  `;
  // Update URL hash for bookmarkability
  const url = new URL(location.href); url.hash = `liga=${key}`; history.replaceState(null, '', url);
}

const season = await loadSeason();
renderTabs(season);
const tabsEl = document.getElementById('ligas-tabs');
tabsEl.addEventListener('tab-change', (e) => renderLiga(season, e.detail.key));
const hashKey = new URLSearchParams(location.hash.slice(1)).get('liga');
const defaultKey = hashKey ?? slug(season.ligasRegionais[0].nome);
wireTabs(tabsEl, { defaultKey });
```

- [ ] **Step 5: Add `<script type="module" src="/assets/js/pages/ligas.js">` to ligas.html**

- [ ] **Step 6: Verify** — 6 tabs render, clicking each shows Série A + Série B tables with qualification-zone left borders in gold (Campeões), blue (Sul-Am), red (rebaixamento). Keyboard arrow keys move between tabs.

- [ ] **Step 7: Commit**

```bash
git add ligas.html assets/css/ligas.css assets/js/pages/ligas.js assets/js/components/tabs.js
git commit -m "feat(ligas): 6-tab regional leagues with qualification zones"
```

---

## Section G — Timeline Page

### Task 21: timeline.html — combobox + calendar grid + match dialog

**Files:**
- Create: `timeline.html`
- Create: `assets/css/timeline.css`
- Create: `assets/css/match-dialog.css`
- Create: `assets/js/pages/timeline.js`
- Create: `assets/js/components/club-picker.js`
- Create: `assets/js/components/match-dialog.js`

**Design:**
- **Customizable `<select>`** (`appearance: base-select`, Baseline Newly Available in Chrome/Edge 135+) as the club picker. Rich `<option>` content (club name + liga as subtitle). Grouped by `<optgroup>` per Liga Regional. Graceful degrade: browsers without support get a normal native `<select>` — still works, just less styled.
- URL param `?clube=BOT` selects the initial club.
- 42-week grid using CSS Grid, cells colored by competition. Hover shows an interest-invoker tooltip (`popover="hint"`).
- Click a cell → opens a `<dialog closedby="any">` with full match details.

- [ ] **Step 1: Write `timeline.html`**

Title: `Calendário | Futebol BR 2.0`. Description: `Calendário anual completo de qualquer um dos 192 clubes.`

Inside `<main id="page-ready">`:

```html
<section class="timeline">
  <header class="timeline__header">
    <h1>Calendário</h1>
    <search>
      <form class="timeline__picker" id="club-picker-form">
        <label for="clube-select">Clube:</label>
        <!-- Customizable <select>. Rich options + optgroups per liga.
             Populated by JS in Task 21 Step 6. Degrades to native <select> where unsupported. -->
        <select id="clube-select" name="clube" class="club-picker" required>
          <button>
            <selectedcontent></selectedcontent>
          </button>
          <!-- optgroups + options injected by JS -->
        </select>
        <button type="submit">Ver</button>
      </form>
    </search>
    <div id="club-header"></div>
  </header>

  <div class="timeline__grid" id="timeline-grid"></div>

  <div id="timeline-stats"></div>
</section>

<dialog id="match-dialog" closedby="any" class="match-dialog">
  <form method="dialog">
    <header><h2 id="match-title"></h2><button type="submit" aria-label="Fechar">✕</button></header>
    <div id="match-body"></div>
  </form>
</dialog>
```

- [ ] **Step 2: Write `timeline.css`**

```css
@layer components {
  @scope (.timeline) {
    .timeline__header { display: grid; gap: var(--space-4); padding-block-end: var(--space-5); border-block-end: 1px solid var(--color-hairline); }
    .timeline__picker { display: flex; gap: var(--space-2); align-items: center; font-family: var(--font-sans); }
    .timeline__picker > button[type="submit"] { padding: var(--space-2) var(--space-4); background: var(--color-accent); color: white; border: 0; border-radius: var(--radius); cursor: pointer; }
  }

  /* Customizable <select>: activates rich styling in Chrome/Edge 135+.
     In unsupported browsers, these rules simply do nothing and the native OS
     dropdown is used. See modern-web-guidance / custom-select-picker-layouts. */
  .club-picker,
  .club-picker::picker(select) {
    appearance: base-select;
  }
  .club-picker {
    min-inline-size: 22rem;
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-hairline);
    border-radius: var(--radius);
    background: var(--color-bg);
    color: inherit;
    font: inherit;
    cursor: pointer;
  }
  .club-picker::picker(select) {
    max-block-size: 24rem;
    inline-size: min(28rem, 90vw);
    padding: var(--space-3);
    background: var(--color-bg);
    border: 1px solid var(--color-hairline);
    border-radius: var(--radius);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    overflow-y: auto;
    scrollbar-width: thin;
  }
  .club-picker optgroup {
    font-weight: 700;
    color: var(--color-muted);
    font-size: var(--step--1);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding-block: var(--space-3) var(--space-2);
  }
  .club-picker option {
    padding: var(--space-2) var(--space-3);
    display: grid;
    gap: 2px;
    border-radius: var(--radius);
  }
  .club-picker option .club-picker__nome { font-weight: 600; }
  .club-picker option .club-picker__meta {
    color: var(--color-muted);
    font-size: var(--step--1);
  }
  .club-picker option:checked {
    background: color-mix(in oklab, var(--color-accent) 12%, transparent);
    /* Multiple visual indicators — not color-only — per modern-web-guidance guidance */
    outline: 2px solid var(--color-accent);
    font-weight: 700;
  }
  .club-picker option:hover {
    background: color-mix(in oklab, var(--color-fg) 5%, transparent);
  }

    #club-header { font-family: var(--font-sans); }
    #club-header h2 { font-size: var(--step-3); }
    #club-header .meta { color: var(--color-muted); font-size: var(--step-0); }

    .timeline__grid { display: grid; grid-template-columns: 4rem repeat(2, 1fr); gap: var(--space-1) var(--space-2); font-family: var(--font-sans); font-size: var(--step--1); container-type: inline-size; }
    .tl-week { padding-block: var(--space-2); }
    .tl-week__num { color: var(--color-muted); }
    .tl-slot { padding: var(--space-2) var(--space-3); background: color-mix(in oklab, var(--slot-color, var(--comp-fifa-pause)) 15%, transparent); border-inline-start: 3px solid var(--slot-color, var(--comp-fifa-pause)); border-radius: var(--radius); cursor: pointer; text-align: start; font: inherit; color: inherit; }
    .tl-slot[data-comp="liga_regional"] { --slot-color: var(--comp-liga); }
    .tl-slot[data-comp="copa_campeoes"] { --slot-color: var(--comp-campeoes); }
    .tl-slot[data-comp="copa_brasil"]   { --slot-color: var(--comp-brasil); }
    .tl-slot:empty { opacity: 0.4; cursor: default; }
  }
}
```

- [ ] **Step 3: Write `match-dialog.css`**

```css
@layer components {
  .match-dialog { padding: 0; border: 0; border-radius: var(--radius); max-inline-size: 30rem; inline-size: 90vw; background: var(--color-bg); color: var(--color-fg); }
  .match-dialog::backdrop { background: color-mix(in oklab, black 60%, transparent); backdrop-filter: blur(4px); }
  .match-dialog form { display: grid; gap: var(--space-4); padding: var(--space-5); }
  .match-dialog header { display: flex; justify-content: space-between; align-items: center; font-family: var(--font-sans); }
  .match-dialog header button { background: none; border: 0; font-size: var(--step-2); cursor: pointer; color: inherit; }
}
```

- [ ] **Step 4: Write `club-picker.js`**

```js
/**
 * Populate the customizable <select> with grouped, rich <option>s.
 * Rich HTML inside <option> is rendered in Chrome/Edge 135+ (appearance: base-select).
 * Older browsers strip the tags and render just the text content — still functional.
 */
export function populateClubes(selectEl, clubes) {
  const byLiga = new Map();
  for (const c of clubes) {
    if (!byLiga.has(c.liga_regional)) byLiga.set(c.liga_regional, []);
    byLiga.get(c.liga_regional).push(c);
  }
  // Preserve the trigger <button><selectedcontent></selectedcontent></button>.
  const trigger = selectEl.querySelector('button');
  selectEl.innerHTML = '';
  if (trigger) selectEl.appendChild(trigger);

  for (const [liga, list] of byLiga) {
    const group = document.createElement('optgroup');
    group.label = liga;
    for (const c of list) {
      const opt = document.createElement('option');
      opt.value = c.id;
      // Rich HTML for capable browsers; text-only fallback for others.
      opt.innerHTML = `<span class="club-picker__nome">${c.nome}</span>
                      <span class="club-picker__meta">${c.liga_regional} · Série ${c.divisao}</span>`;
      // A plain text label used by browsers that ignore inner HTML.
      opt.textContent = opt.textContent; // no-op that ensures the fallback text is set
      opt.setAttribute('label', `${c.nome} — ${c.liga_regional}`);
      group.appendChild(opt);
    }
    selectEl.appendChild(group);
  }
}
```

**Note:** the `label` attribute on `<option>` is what unsupported browsers display in the closed picker. In Chrome/Edge with `appearance: base-select` active, the `<selectedcontent>` renders the rich HTML from the selected option.

- [ ] **Step 5: Write `match-dialog.js`**

```js
export function openMatchDialog({ semana, entry, ownerClub, adversario }) {
  const dlg = document.getElementById('match-dialog');
  const title = document.getElementById('match-title');
  const body = document.getElementById('match-body');
  const compLabel = {
    liga_regional: 'Liga Regional',
    copa_campeoes: 'Copa dos Campeões',
    copa_brasil: 'Copa do Brasil',
  }[entry.competicao] ?? entry.competicao;
  title.textContent = `Semana ${semana} · ${compLabel}${entry.rodada ? ' · ' + entry.rodada : ''}`;
  body.innerHTML = `
    <p style="font-size:var(--step-2);text-align:center;font-family:var(--font-sans);font-variant-numeric:tabular-nums;">
      ${ownerClub.nome} <strong>${entry.golsPro} – ${entry.golsContra}</strong> ${adversario.nome}
    </p>
    <p style="text-align:center;color:var(--color-muted);font-family:var(--font-sans);">
      ${entry.casa ? 'em casa' : 'fora'}
    </p>`;
  dlg.showModal();
}
```

- [ ] **Step 6: Write `timeline.js`**

```js
import { loadSeason, clubById, calendarFor } from '../season.js';
import { populateClubes, findClubByInputValue } from '../components/club-picker.js';
import { openMatchDialog } from '../components/match-dialog.js';

const season = await loadSeason();
const selectEl = document.getElementById('clube-select');
populateClubes(selectEl, season.clubes);

const params = new URLSearchParams(location.search);
const initialId = params.get('clube') ?? 'BOT';
selectEl.value = initialId;

// Submit on form submit OR immediately on selection change (customizable <select>
// with rich options is a click-to-select interaction — no form submit needed).
function selectClub(id) {
  const club = clubById(season, id);
  if (!club) return;
  const url = new URL(location.href); url.searchParams.set('clube', club.id);
  history.replaceState(null, '', url);
  render(club.id);
}

selectEl.addEventListener('change', () => selectClub(selectEl.value));
document.getElementById('club-picker-form').addEventListener('submit', (e) => {
  e.preventDefault();
  selectClub(selectEl.value);
});

function render(id) {
  const club = clubById(season, id);
  document.getElementById('club-header').innerHTML = `
    <h2>${club.nome}</h2>
    <p class="meta">${club.liga_regional} · Série ${club.divisao} · Posição ${club.estatisticas_temporada?.posicaoLiga ?? '—'}</p>`;

  const cal = calendarFor(season, id);
  const grid = document.getElementById('timeline-grid');
  grid.innerHTML = ['<div class="tl-week"></div><div class="tl-week__hdr">Fim-de-semana</div><div class="tl-week__hdr">Meio-de-semana</div>']
    .concat(cal.map((w, i) => {
      const wnum = i + 1;
      const slot = (entry, kind) => {
        if (!entry) return `<button type="button" class="tl-slot" data-comp="" aria-label="Sem jogo"></button>`;
        const adv = clubById(season, entry.adversarioId);
        return `<button type="button" class="tl-slot" data-comp="${entry.competicao}" data-week="${wnum}" data-kind="${kind}" aria-label="${adv?.nome ?? entry.adversarioId} ${entry.golsPro}-${entry.golsContra}">
          ${adv?.nome ?? entry.adversarioId} <strong>${entry.golsPro}–${entry.golsContra}</strong>
        </button>`;
      };
      return `<div class="tl-week"><span class="tl-week__num">S${wnum}</span></div>${slot(w.fimDeSemana, 'fds')}${slot(w.meioDeSemana, 'mds')}`;
    })).join('');

  grid.querySelectorAll('.tl-slot[data-week]').forEach(btn => {
    btn.addEventListener('click', () => {
      const week = parseInt(btn.dataset.week, 10);
      const kind = btn.dataset.kind;
      const entry = kind === 'fds' ? cal[week - 1].fimDeSemana : cal[week - 1].meioDeSemana;
      const adv = clubById(season, entry.adversarioId);
      openMatchDialog({ semana: week, entry, ownerClub: club, adversario: adv });
    });
  });

  const stats = club.estatisticas_temporada;
  document.getElementById('timeline-stats').innerHTML = stats ? `
    <table class="liga-tabela">
      <tr><td>Jogos</td><td>${stats.jogos}</td></tr>
      <tr><td>Vitórias / Empates / Derrotas</td><td>${stats.vitorias} / ${stats.empates} / ${stats.derrotas}</td></tr>
      <tr><td>Gols Pró / Contra</td><td>${stats.golsPro} / ${stats.golsContra}</td></tr>
      <tr><td>Pontos</td><td><strong>${stats.pontos}</strong></td></tr>
    </table>` : '';
}

render(initialId);
```

- [ ] **Step 7: Add `<script type="module" src="/assets/js/pages/timeline.js">` and page-specific stylesheet links to timeline.html**

- [ ] **Step 8: Verify** — combobox suggests all 192 clubs; picking one renders the 42-week grid; clicking a match opens the dialog with details; ESC or backdrop click closes it.

- [ ] **Step 9: Commit**

```bash
git add timeline.html assets/css/timeline.css assets/css/match-dialog.css assets/js/pages/timeline.js assets/js/components/club-picker.js assets/js/components/match-dialog.js
git commit -m "feat(timeline): club picker + 42-week calendar + match dialog"
```

---

## Section H — Copa Page

### Task 22: copa.html — two tabs, groups + KO bracket for Copa dos Campeões

**Files:**
- Create: `copa.html`
- Create: `assets/css/copa.css`
- Create: `assets/js/pages/copa.js`

- [ ] **Step 1: Write `copa.html`**

Title: `Copas Nacionais | Futebol BR 2.0`. Description: `Copa dos Campeões e Copa do Brasil da Reforma 2.0.`

Inside `<main id="page-ready">`:

```html
<section class="copa">
  <h1>Copas Nacionais</h1>
  <nav aria-label="Escolher copa" class="copa__tabs">
    <ul role="list" role="tablist" id="copa-tabs">
      <li><button role="tab" data-key="campeoes" aria-selected="true"  tabindex="0"  class="ligas__tab">Copa dos Campeões</button></li>
      <li><button role="tab" data-key="brasil"   aria-selected="false" tabindex="-1" class="ligas__tab">Copa do Brasil</button></li>
    </ul>
  </nav>
  <section id="copa-detalhe" aria-live="polite"></section>
</section>
```

- [ ] **Step 2: Write `copa.css`**

```css
@layer components {
  @scope (.copa) {
    .copa__tabs ul { display: flex; gap: var(--space-4); padding-block-end: var(--space-4); border-block-end: 1px solid var(--color-hairline); font-family: var(--font-sans); }

    .grupos { display: grid; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); gap: var(--space-4); font-family: var(--font-sans); }
    .grupo { border: 1px solid var(--color-hairline); border-radius: var(--radius); padding: var(--space-4); display: grid; gap: var(--space-3); }
    .grupo__id { font-size: var(--step-2); font-weight: 700; }
    .grupo__tabela { display: grid; gap: var(--space-1); font-size: var(--step--1); font-variant-numeric: tabular-nums; }
    .grupo__row { display: grid; grid-template-columns: 1.5rem 1fr auto auto auto auto; gap: var(--space-2); }
    .grupo__row[data-classificado="true"] { color: var(--color-accent); font-weight: 600; }

    .bracket { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(11rem, 1fr); gap: var(--space-3); overflow-x: auto; font-family: var(--font-sans); font-size: var(--step--1); }
    .bracket__round { display: grid; gap: var(--space-3); align-content: space-around; }
    .bracket__match { border: 1px solid var(--color-hairline); border-radius: var(--radius); padding: var(--space-2) var(--space-3); }
    .bracket__match__team { display: flex; justify-content: space-between; }
    .bracket__match__team[data-vencedor="true"] { font-weight: 700; color: var(--color-accent); }

    .funil { display: grid; gap: var(--space-3); font-family: var(--font-sans); font-variant-numeric: tabular-nums; }
    .funil__stage { display: grid; grid-template-columns: 10rem 1fr auto; gap: var(--space-3); align-items: center; padding: var(--space-3); border: 1px solid var(--color-hairline); border-radius: var(--radius); }
    .funil__stage__bar { block-size: 0.5rem; background: color-mix(in oklab, var(--color-accent) 20%, transparent); border-radius: 4px; overflow: hidden; }
    .funil__stage__bar::before { content: ""; display: block; block-size: 100%; inline-size: calc(var(--w, 100) * 1%); background: var(--color-accent); }
  }
}
```

- [ ] **Step 3: Write `copa.js`**

```js
import { loadSeason, clubById } from '../season.js';
import { wireTabs } from '../components/tabs.js';

const season = await loadSeason();

function nome(id) { return clubById(season, id)?.nome ?? id; }

function renderCampeoes() {
  const cc = season.copaCampeoes;
  const el = document.getElementById('copa-detalhe');
  const groupsHtml = `<section aria-labelledby="grupos-h"><h2 id="grupos-h">Fase de grupos</h2>
    <div class="grupos">${cc.grupos.map(g => `
      <article class="grupo">
        <div class="grupo__id">Grupo ${g.id}</div>
        <div class="grupo__tabela">${g.tabela.map(r => `
          <div class="grupo__row" data-classificado="${r.posicao <= 2}">
            <span>${r.posicao}</span><span>${r.nome}</span>
            <span>${r.jogos}</span><span>${r.saldoGols}</span><span>${r.golsPro}</span><strong>${r.pontos}</strong>
          </div>`).join('')}
        </div>
      </article>`).join('')}
    </div></section>`;

  const rounds = [
    { key: '16avos', label: '16 avos' },
    { key: 'oitavas', label: 'Oitavas' },
    { key: 'quartas', label: 'Quartas' },
    { key: 'semis', label: 'Semis' },
    { key: 'final', label: 'Final' },
  ];
  const bracketHtml = `<section aria-labelledby="bracket-h"><h2 id="bracket-h">Mata-mata</h2>
    <div class="bracket">${rounds.map(({ key, label }) => {
      const matches = key === 'final' ? [cc.matamata.final] : cc.matamata[key];
      return `<div class="bracket__round"><h3 style="font-size:var(--step--1);text-transform:uppercase;letter-spacing:0.05em;color:var(--color-muted);">${label}</h3>
        ${matches.map(m => `
          <div class="bracket__match">
            <div class="bracket__match__team" data-vencedor="${m.vencedorId === m.casaId}"><span>${nome(m.casaId)}</span><span>${m.golsCasa}</span></div>
            <div class="bracket__match__team" data-vencedor="${m.vencedorId === m.foraId}"><span>${nome(m.foraId)}</span><span>${m.golsFora}</span></div>
          </div>`).join('')}
      </div>`;
    }).join('')}
    </div>
    <p style="font-family:var(--font-sans);margin-block-start:var(--space-4);">Campeão: <strong style="color:var(--color-accent);font-size:var(--step-2);">${nome(cc.matamata.campeao)}</strong></p>
  </section>`;

  el.innerHTML = groupsHtml + bracketHtml;
}

function renderBrasil() {
  const cb = season.copaBrasil;
  const el = document.getElementById('copa-detalhe');
  const funil = cb.funil;
  const stages = [
    { label: 'Preliminar', clubes: 26, sobrev: funil.preliminar.survivors.length },
    { label: '1ª Fase',    clubes: 118, sobrev: funil.primeira.survivors.length },
    { label: '2ª Fase',    clubes: 60, sobrev: funil.segunda.survivors.length },
    { label: '3ª Fase',    clubes: 30, sobrev: funil.terceira.survivors.length },
    { label: 'Repescagem técnica', clubes: 4, sobrev: funil.luckyLosers.length },
  ];
  const funilHtml = `<section aria-labelledby="funil-h"><h2 id="funil-h">O funil</h2>
    <div class="funil">${stages.map(s => `
      <div class="funil__stage">
        <span>${s.label}</span>
        <div class="funil__stage__bar" style="--w:${(s.sobrev / s.clubes * 100).toFixed(0)}"></div>
        <span>${s.sobrev}/${s.clubes}</span>
      </div>`).join('')}
    </div>
    <p style="font-family:var(--font-sans);margin-block-start:var(--space-4);">
      Da base emergem <strong>19 sobreviventes</strong> que se juntam aos <strong>13 clubes do bypass</strong> nos 16 avos.
    </p>
  </section>`;

  const rounds = ['16avos', 'oitavas', 'quartas', 'semis'];
  const bracketHtml = `<section aria-labelledby="brasil-bracket-h"><h2 id="brasil-bracket-h">Mata-mata</h2>
    <div class="bracket">${rounds.map(k => `
      <div class="bracket__round"><h3 style="font-size:var(--step--1);text-transform:uppercase;letter-spacing:0.05em;color:var(--color-muted);">${k}</h3>
        ${cb.matamata[k].map(m => `
          <div class="bracket__match">
            <div class="bracket__match__team" data-vencedor="${m.vencedorId === m.casaId}"><span>${nome(m.casaId)}</span><span>${m.golsCasa}</span></div>
            <div class="bracket__match__team" data-vencedor="${m.vencedorId === m.foraId}"><span>${nome(m.foraId)}</span><span>${m.golsFora}</span></div>
          </div>`).join('')}
      </div>`).join('')}
      <div class="bracket__round"><h3 style="font-size:var(--step--1);text-transform:uppercase;letter-spacing:0.05em;color:var(--color-muted);">Final</h3>
        <div class="bracket__match">
          <div class="bracket__match__team" data-vencedor="${cb.matamata.final.vencedorId === cb.matamata.final.casaId}"><span>${nome(cb.matamata.final.casaId)}</span><span>${cb.matamata.final.golsCasa}</span></div>
          <div class="bracket__match__team" data-vencedor="${cb.matamata.final.vencedorId === cb.matamata.final.foraId}"><span>${nome(cb.matamata.final.foraId)}</span><span>${cb.matamata.final.golsFora}</span></div>
        </div>
      </div>
    </div>
    <p style="font-family:var(--font-sans);margin-block-start:var(--space-4);">Campeão: <strong style="color:var(--color-accent);font-size:var(--step-2);">${nome(cb.matamata.campeao)}</strong></p>
  </section>`;

  el.innerHTML = funilHtml + bracketHtml;
}

const tabsEl = document.getElementById('copa-tabs');
tabsEl.addEventListener('tab-change', (e) => {
  if (e.detail.key === 'campeoes') renderCampeoes();
  else renderBrasil();
});
wireTabs(tabsEl, { defaultKey: 'campeoes' });
```

- [ ] **Step 4: Add page stylesheets and script to copa.html**

- [ ] **Step 5: Verify**
- Copa dos Campeões tab: 12 group cards + 5 knockout columns + "Campeão: Botafogo"
- Copa do Brasil tab: funnel with 5 stages + knockout bracket + "Campeão: Botafogo"

- [ ] **Step 6: Commit**

```bash
git add copa.html assets/css/copa.css assets/js/pages/copa.js
git commit -m "feat(copa): two-tab Copa dos Campeões + Copa do Brasil with groups, bracket, and funnel"
```

---

## Section I — Polish & Deploy

### Task 23: Cross-page navigation smoke test

- [ ] **Step 1: Run local server**

Run: `npx serve -p 5173` from the project root.

- [ ] **Step 2: Manual smoke tests**

Navigate through every page in this exact order and verify:
1. `/` → nav visible, all 9 sections render, no console errors.
2. Click "Ligas Regionais" nav link → view transition, `/ligas` renders, first tab (Paulista) auto-selected.
3. Click a club row in the table → view transition to `/timeline?clube=<id>` with that club preselected.
4. In Timeline, click a match cell → dialog opens with match details; ESC closes; backdrop click closes.
5. Click "Copas Nacionais" → both tabs work.
6. Click "Manifesto" → long-read renders.
7. Click "Início" from anywhere → back to homepage.

Any broken navigation, missing content, or console error = a bug in a prior task. Fix before committing.

- [ ] **Step 3: Test with reduced motion**

Enable macOS "Reduce Motion" (System Settings → Accessibility → Display). Reload. Navigations should be instant with no view-transition animation. Reduced-motion is respected.

- [ ] **Step 4: Test dark mode**

Toggle system dark mode. Colors should invert via `color-scheme` + `light-dark()` without any explicit toggle.

- [ ] **Step 5: Test keyboard**

Tab through the nav. Focus rings visible. Ligas tabs support arrow keys. Match dialog can be dismissed with ESC.

- [ ] **Step 6: Verify without JavaScript**

Disable JS in browser. Reload homepage. Semantic HTML still readable — nav visible, headings visible, text content present. Only widgets that require JS (workload chart bars, sleeping giants row) show empty containers.

If any broken behavior found: fix in the offending task's file, verify again, then commit fixes.

- [ ] **Step 7: Commit any fixes**

```bash
git commit -am "fix(site): manual QA fixes from smoke test"
```

Only commit if there are actual fixes; skip if the run was clean.

---

### Task 24: Deploy to Vercel

- [ ] **Step 1: Verify `vercel.json` is at project root**

Run: `cat vercel.json` — should match Task 1's content.

- [ ] **Step 2: Deploy** *(user runs this — requires their Vercel login)*

Instruct user to run:
```bash
npx vercel --prod
```

- [ ] **Step 3: Verify production URL**

Once deployed, open the URL in a fresh incognito window. All 5 pages should work. View transitions active. No console errors. Cache Storage populated on second navigation.

If any production-only bug (typically caused by Vercel's static routing), fix locally, re-deploy.

- [ ] **Step 4: Commit deploy notes to README** (optional)

Create `README.md`:

```markdown
# Futebol BR 2.0

A portfolio simulation + manifesto for a structural reform of Brazilian football.

## Stack
Pure HTML, modern CSS, vanilla JS. No framework, no bundler.
Simulator in Node (see `plans/2026-07-08-futebol-br-simulator.md`).
Frontend in static HTML (see `plans/2026-07-08-futebol-br-site.md`).

## Local development
1. Bake the season data: `npm run bake`
2. Serve statically: `npx serve -p 5173`
3. Open http://localhost:5173/

## Testing
`npm test` runs the simulator's Vitest suite.

## Deploy
`npx vercel --prod`
```

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: project readme"
```

---

## Open items (post-MVP polish)

Intentionally deferred:
- **Editorial aesthetic pass.** The site is functional but bare; a design pass (typography detail, color refinement, illustration hooks) is v1.1.
- **Reroll button.** Client-side rerun of the sim with a random seed; requires porting `src/sim/` into the browser bundle. v2.
- **Per-region "Raízes" pages.** Deeper Revelation Clubs stories per region. v1.1.
- **Optional attendance data completion.** Fill Sleeping Giants numbers with authoritative sources rather than ballpark estimates.
- **Sparse calendar encoding.** Compress `season-default.json` from 1.4 MB to <1 MB with short field names + sparse week storage.
- **English translation.** `strings.js` already has i18n-ready shape; add `strings.en` and a language toggle.

## Notes for the executing engineer

- **Modern-web-guidance policy: Baseline Newly Available + graceful degrade.** No polyfills. Each modern feature should have a 1-3 line CSS/HTML fallback for browsers without it. When in doubt, consult the `modern-web-guidance:modern-web-guidance` skill.
- **No frameworks, no bundlers.** ES modules everywhere; browsers resolve imports natively.
- **Verify visually in a browser** after each page task, not just by reading code. UI tasks often look right in code but wrong on screen.
- **Commit after each task.** Frequent commits, per-task.
- **Semantic HTML first.** Use `<button>` for actions, `<a>` for URLs, native `<dialog>`/`[popover]`/`<details>`. Do NOT reinvent these with `<div>`s and ARIA.
- **Cascade layers over BEM.** Every component style lives inside `@layer components` scoped with `@scope`. Do not introduce class-based specificity gymnastics.
- **The plan file is the source of truth.** If you find an ambiguity, stop and flag before improvising.
