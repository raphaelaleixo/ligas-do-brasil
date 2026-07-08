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

function renderMetrics(season) {
  for (const el of document.querySelectorAll('[data-metric]')) {
    const key = el.getAttribute('data-metric');
    el.textContent = season.meta[key];
  }
}

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

const ELITE_ID = 'BOT';
const BASE_ID_HINT = { liga: 'Liga Norte', divisao: 'B' };

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
      <div class="contrast__label">${club.nome} <span class="contrast__sub">${club.liga_regional}</span></div>
      <div class="contrast__strip">${cells}</div>
    </div>`;
  }).join('');
}

const SLEEPING_GIANTS = [
  { nome: 'Sport',      estado: 'PE', liga: 'Liga Nordeste',              mediaPublico: 28000, divisaoAtual: 'Série B' },
  { nome: 'Náutico',    estado: 'PE', liga: 'Liga Nordeste',              mediaPublico: 17000, divisaoAtual: 'Série C' },
  { nome: 'Santa Cruz', estado: 'PE', liga: 'Liga Nordeste',              mediaPublico: 22000, divisaoAtual: 'Série D' },
  { nome: 'Vitória',    estado: 'BA', liga: 'Liga Nordeste',              mediaPublico: 25000, divisaoAtual: 'Série A' },
  { nome: 'América-RN', estado: 'RN', liga: 'Liga Nordeste',              mediaPublico: 8000,  divisaoAtual: 'Série C' },
  { nome: 'Remo',       estado: 'PA', liga: 'Liga Norte',                 mediaPublico: 32000, divisaoAtual: 'Série B' },
  { nome: 'Paysandu',   estado: 'PA', liga: 'Liga Norte',                 mediaPublico: 30000, divisaoAtual: 'Série B' },
  { nome: 'Goiás',      estado: 'GO', liga: 'Liga Mineira/Centro-Oeste',  mediaPublico: 18000, divisaoAtual: 'Série B' },
  { nome: 'Vila Nova',  estado: 'GO', liga: 'Liga Mineira/Centro-Oeste',  mediaPublico: 14000, divisaoAtual: 'Série B' },
  { nome: 'Coritiba',   estado: 'PR', liga: 'Liga Sulista',               mediaPublico: 20000, divisaoAtual: 'Série B' },
  { nome: 'Paraná',     estado: 'PR', liga: 'Liga Sulista',               mediaPublico: 6000,  divisaoAtual: 'Série D' },
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

renderAnalogy();
renderSleepingGiants();
loadSeason().then((season) => {
  window.__season = season;
  renderMetrics(season);
  renderWorkload(season);
  renderContrast(season);
});
