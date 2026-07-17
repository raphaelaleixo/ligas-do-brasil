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
src/
  sim/               # match model, ligas regionais, copas, calendário, seeding
  data/              # dados canônicos (times, atributos, referências históricas)
scripts/
  dev-server.py      # replica o rewrite do vercel.json pra dev local
assets/
  css/               # cascade layers, container queries, light-dark(), view transitions
  js/                # ES modules, sem bundler
tests/               # Vitest — 98 testes cobrindo simulador + camada de dados
worker/              # Cloudflare Worker que recebe /feedback e abre issue no GitHub
```

## O simulador

`src/sim/` roda uma temporada inteira — 216 clubes distribuídos em seis ligas
regionais, Copa dos Campeões em quatro potes com sorteio FIFA-style + geo-lock,
Copa do Brasil como funil de acesso. É invocado direto do browser pela página
`/simulador`, com seed vindo da URL (`?seed=N`).

O simulador existe pra provar duas coisas:

1. **A reforma é calendaricamente viável.** 47 semanas úteis absorvem
   tudo com teto de 64 jogos por clube e zero mês desempregado.
2. **A distribuição de vagas Libertadores/Sul-Am fecha** sob a nova
   arquitetura, amarrada aos campeões e cabeças-de-chave da CC.

Cada visita à página `/simulador` gera uma temporada nova (ou reproduz uma
temporada compartilhada via URL). O site não carrega uma temporada pré-baked —
cada visitante roda a sua.

## Rodar local

```sh
npm install
npm test              # 98 testes do simulador
npx serve -p 5173     # serve os HTMLs estáticos
```

Abra <http://localhost:5173>.

## Deploy

- **Site:** GitHub Pages, servido de `main:/`. Push pra `main` publica —
  não tem workflow customizado, é o Pages Jekyll padrão. URLs sem
  extensão (`/manifesto`) funcionam pelo comportamento default do Jekyll.
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
