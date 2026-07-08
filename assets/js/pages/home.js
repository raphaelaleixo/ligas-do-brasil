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

renderAnalogy();
loadSeason().then((season) => {
  window.__season = season;
  renderMetrics(season);
  renderWorkload(season);
});
