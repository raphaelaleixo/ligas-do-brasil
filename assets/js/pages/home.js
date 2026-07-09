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

const WORKLOAD_COMPARISONS = [
  {
    label: 'Elite finalista',
    modeloAtual: { clube: 'Botafogo 2024', jogos: 75, det: 'Carioca + Brasileirão + Copa do Brasil + Libertadores' },
    reforma:     { clube: 'Reforma 2.0',    jogos: 63, det: '34 Liga Regional + 11 Copa dos Campeões + 5 Copa do Brasil + 13 Libertadores' },
    delta: '−16%',
  },
  {
    label: 'Base',
    modeloAtual: { clube: 'Madureira 2024', jogos: 13, det: '11 Campeonato Carioca (Taça Guanabara) + 2 Copa Rio' },
    reforma:     { clube: 'Reforma 2.0',    jogos: 34, det: '34 Liga Regional espalhados por 10 meses' },
    delta: '+162%',
  },
];

function renderWorkload() {
  const el = document.getElementById('workload-chart');
  if (!el) return;
  const maxVal = Math.max(...WORKLOAD_COMPARISONS.flatMap(c => [c.modeloAtual.jogos, c.reforma.jogos]));
  el.innerHTML = WORKLOAD_COMPARISONS.map((c) => `
    <div class="workload__row">
      <div class="workload__label">
        ${c.label}
        <span class="workload__delta" data-sign="${c.delta.startsWith('+') ? 'plus' : 'minus'}">${c.delta}</span>
      </div>
      <div class="workload__bars">
        <div class="workload__bar" data-set="current" style="--w:${(c.modeloAtual.jogos / maxVal * 100).toFixed(1)}">
          <span class="workload__value"><strong>${c.modeloAtual.jogos}</strong> ${c.modeloAtual.clube}</span>
        </div>
        <div class="workload__bar" data-set="reform"  style="--w:${(c.reforma.jogos / maxVal * 100).toFixed(1)}">
          <span class="workload__value"><strong>${c.reforma.jogos}</strong> ${c.reforma.clube}</span>
        </div>
      </div>
    </div>`).join('');
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
      const fds = w.fimDeSemana?.competicao ?? '';
      const mds = w.meioDeSemana?.competicao ?? '';
      // Each week = two stacked mini-cells: fim-de-semana on top, meio-de-semana below.
      // Otherwise weekend games mask midweek Conmebol slots and the strip looks flat.
      return `<div class="contrast__cell">
        <span class="contrast__cell__half" data-comp="${fds}"></span>
        <span class="contrast__cell__half" data-comp="${mds}"></span>
      </div>`;
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

const REVELATION = [
  { jogador: 'Romário',        clubeRevelador: 'Olaria',                     estado: 'RJ', liga: 'Liga Guanabara-Capixaba',    copasVencidas: [1994] },
  { jogador: 'Ronaldo',        clubeRevelador: 'São Cristóvão',              estado: 'RJ', liga: 'Liga Guanabara-Capixaba',    copasVencidas: [1994, 2002] },
  { jogador: 'Rivaldo',        clubeRevelador: 'Santa Cruz',                 estado: 'CE', liga: 'Liga Nordeste',              copasVencidas: [2002] },
  { jogador: 'Lúcio',          clubeRevelador: 'Guará',                      estado: 'DF', liga: 'Liga Mineira/Centro-Oeste',  copasVencidas: [2002] },
  { jogador: 'Cafu',           clubeRevelador: 'Itaquaquecetuba',            estado: 'SP', liga: 'Liga Paulista',              copasVencidas: [1994, 2002] },
  { jogador: 'Roberto Carlos', clubeRevelador: 'União São João de Araras',   estado: 'SP', liga: 'Liga Paulista',              copasVencidas: [2002] },
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

renderAnalogy();
renderSleepingGiants();
renderRevelation();
renderWorkload();
loadSeason().then((season) => {
  window.__season = season;
  renderMetrics(season);
  renderContrast(season);
});
