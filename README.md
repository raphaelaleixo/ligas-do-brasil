# Ligas do Brasil

Um manifesto (e um simulador que o sustenta) por uma reforma estrutural
do futebol brasileiro: **seis Ligas Regionais** + **uma Copa dos Campeões**
no estilo Champions League. A tese: o problema não é o calendário — é a
escala.

**Site:** <https://raphaelaleixo.github.io/ligas-do-brasil/>

## A tese em uma frase

O Brasil, com dimensões continentais (8,5 milhões de km², 214 milhões de
habitantes), promove menos clubes ao topo do futebol nacional (~20) do
que Portugal (18). A proposta corrige a arquitetura antes de mexer no
calendário.

- [Manifesto completo](https://raphaelaleixo.github.io/ligas-do-brasil/manifesto)
- [Ligas regionais](https://raphaelaleixo.github.io/ligas-do-brasil/ligas)
- [Copa dos Campeões + Copa do Brasil](https://raphaelaleixo.github.io/ligas-do-brasil/copa)
- [Calendário por clube](https://raphaelaleixo.github.io/ligas-do-brasil/timeline)

## O que tem neste repositório

```
/                    # páginas HTML estáticas (index, manifesto, ligas, copa, timeline, feedback)
og.html              # template do card OG (aberto no browser → screenshot em assets/img/og.png)
data/
  season-default.json  # output do simulador, servido no site
src/
  sim/               # match model, ligas regionais, copas, calendário, seeding
  data/              # dados canônicos (times, atributos, referências históricas)
scripts/
  bake-default.js    # roda o simulador end-to-end → data/season-default.json
  dev-server.py      # replica o rewrite do vercel.json pra dev local
assets/
  css/               # cascade layers, container queries, light-dark(), view transitions
  js/                # ES modules, sem bundler
tests/               # Vitest — 98 testes cobrindo simulador + camada de dados
worker/              # Cloudflare Worker que recebe /feedback e abre issue no GitHub
```

## O simulador

`npm run bake` roda o simulador end-to-end — 216 clubes distribuídos em
seis ligas regionais, Copa dos Campeões em quatro potes com sorteio
FIFA-style + geo-lock, Copa do Brasil como funil de acesso — e produz
`data/season-default.json`.

Ele existe pra provar duas coisas:

1. **A reforma é calendaricamente viável.** 47 semanas úteis absorvem
   tudo com teto de 64 jogos por clube e zero mês desempregado.
2. **A distribuição de vagas Libertadores/Sul-Am fecha** sob a nova
   arquitetura, amarrada aos campeões e cabeças-de-chave da CC.

Nota honesta: o site consome uma fração pequena desse output (`meta` +
`clubes`, ~5% do payload). O resto existe pros testes e pra sustentar o
argumento; ainda não é renderizado.

## Rodar local

```sh
npm install
npm test              # 98 testes do simulador
npx serve -p 5173     # serve os HTMLs estáticos
```

Abra <http://localhost:5173>.

O comando `npm run bake` depende de `initial-data/teams.json`, que fica
fora do repo público (dados canônicos de trabalho). Rodá-lo requer o
working set local do autor.

## Deploy

- **Site:** Vercel. `npx vercel --prod`. `vercel.json` reescreve
  `/manifesto` → `manifesto.html` e cacheia assets com hash de conteúdo.
- **Worker:** Cloudflare Workers. Ver `worker/README.md`.

## Suporte de browser

**Baseline Newly Available + graceful degrade.** O site usa view
transitions, `<select>` customizável (Chrome/Edge 135+), popovers,
`:has()`, container queries, `light-dark()`. Browsers mais antigos
recebem uma versão sem animação, mas funcional.

## Como participar

O caminho é o formulário em
[/feedback](https://raphaelaleixo.github.io/ligas-do-brasil/feedback) —
cada envio vira uma issue neste repositório. Não precisa ter conta no
GitHub pra escrever.
