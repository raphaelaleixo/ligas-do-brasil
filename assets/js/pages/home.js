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
