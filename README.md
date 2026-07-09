# Futebol BR 2.0

A portfolio simulation + manifesto for a structural reform of Brazilian football.
Argues that the country needs a new pyramid — six Regional Leagues, a Champions-League-style
national cup — not just another calendar patch.

## Stack

Pure HTML, modern CSS (cascade layers, container queries, `light-dark()`, cross-document
view transitions), vanilla JS ES modules. No framework, no bundler. Simulator in Node.

## Structure

```
/                      # 5 static HTML pages
  index.html           # homepage: thesis + all evidence widgets
  manifesto.html       # long-read editorial
  ligas.html           # 6 regional league tables
  timeline.html        # per-club 42-week calendar
  copa.html            # Copa dos Campeões + Copa do Brasil
data/                  # baked simulation output (gitignored)
  season-default.json  # seed 740 (Botafogo double-champion)
src/                   # simulator (Node)
  sim/                 # match model, competitions, calendar, perfis
  data/                # canonical data (teams, strings, references)
scripts/
  bake-default.js      # runs sim(seed=740) → data/season-default.json
assets/
  css/                 # layer-based CSS
  js/                  # ES modules
plans/                 # implementation plans
tests/                 # Vitest suite for the simulator
```

## Local development

```sh
npm install
npm test                 # 85 tests for the simulator
npm run bake             # (re)generates data/season-default.json
npx serve -p 5173        # serves the static site
```

Open http://localhost:5173/.

## Deploy

```sh
npx vercel --prod
```

`vercel.json` handles clean URLs (`/manifesto` → `manifesto.html`) and long-lived asset caching.

## Browser support

**Baseline Newly Available + graceful degrade.** The site uses view transitions,
customizable `<select>` (Chrome/Edge 135+), `<dialog closedby>`, popovers, `:has()`,
container queries, `light-dark()`. Older browsers get a plain but functional experience.

## The default simulated season

Seed `143` (under the NFL-style cross-group format):
- Copa dos Campeões: **Botafogo 2–0 Flamengo** (Rio derby final).
- Copa do Brasil: **São Paulo 1–0 Palmeiras** (Choque-Rei).
- Libertadores 7: Botafogo, Flamengo, São Paulo, Fluminense, Palmeiras, Grêmio, Internacional.
