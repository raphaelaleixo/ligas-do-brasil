import { loadSeason } from '../season.js';

// Population figures: IBGE 2022 Census (Brazil regions) / UN 2023 (Europe).
// Each Brazilian regional league is roughly the size of a European country.
const ANALOGIES = [
  { liga: 'Liga Nordestina',    regiaoPop: '54M', pais: 'Inglaterra',     flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', paisPop: '57M' },
  { liga: 'Liga Paulista',      regiaoPop: '44M', pais: 'Itália',         flag: '🇮🇹', paisPop: '59M' },
  { liga: 'Liga Central',       regiaoPop: '37M', pais: 'Espanha',        flag: '🇪🇸', paisPop: '48M' },
  { liga: 'Liga Sulista',       regiaoPop: '30M', pais: 'Ucrânia',        flag: '🇺🇦', paisPop: '32M' },
  { liga: 'Liga Rio-Capixaba',  regiaoPop: '20M', pais: 'Países Baixos',  flag: '🇳🇱', paisPop: '18M' },
  { liga: 'Liga Amazônica',     regiaoPop: '18M', pais: 'Portugal',       flag: '🇵🇹', paisPop: '10M' },
];

function renderAnalogy() {
  const tbody = document.getElementById('analogy-rows');
  if (!tbody) return;
  tbody.innerHTML = ANALOGIES.map(a =>
    `<tr>
      <td>${a.liga}</td>
      <td class="analogy__pop">${a.regiaoPop}</td>
      <td><span class="analogy__flag" aria-hidden="true">${a.flag}</span> ${a.pais}</td>
      <td class="analogy__pop">${a.paisPop}</td>
    </tr>`
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
const BASE_ID_HINT = { liga: 'Liga Amazônica', divisao: 'B' };

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
  { nome: 'Sport',      estado: 'PE', liga: 'Liga Nordestina',              mediaPublico: 28000, divisaoAtual: 'Série B' },
  { nome: 'Náutico',    estado: 'PE', liga: 'Liga Nordestina',              mediaPublico: 17000, divisaoAtual: 'Série C' },
  { nome: 'Santa Cruz', estado: 'PE', liga: 'Liga Nordestina',              mediaPublico: 22000, divisaoAtual: 'Série D' },
  { nome: 'Vitória',    estado: 'BA', liga: 'Liga Nordestina',              mediaPublico: 25000, divisaoAtual: 'Série A' },
  { nome: 'América-RN', estado: 'RN', liga: 'Liga Nordestina',              mediaPublico: 8000,  divisaoAtual: 'Série C' },
  { nome: 'Remo',       estado: 'PA', liga: 'Liga Amazônica',                 mediaPublico: 32000, divisaoAtual: 'Série B' },
  { nome: 'Paysandu',   estado: 'PA', liga: 'Liga Amazônica',                 mediaPublico: 30000, divisaoAtual: 'Série B' },
  { nome: 'Goiás',      estado: 'GO', liga: 'Liga Central',  mediaPublico: 18000, divisaoAtual: 'Série B' },
  { nome: 'Vila Nova',  estado: 'GO', liga: 'Liga Central',  mediaPublico: 14000, divisaoAtual: 'Série B' },
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
  { jogador: 'Romário',        clubeRevelador: 'Olaria',                     estado: 'RJ', liga: 'Liga Rio-Capixaba',    copasVencidas: [1994] },
  { jogador: 'Ronaldo',        clubeRevelador: 'São Cristóvão',              estado: 'RJ', liga: 'Liga Rio-Capixaba',    copasVencidas: [1994, 2002] },
  { jogador: 'Rivaldo',        clubeRevelador: 'Santa Cruz',                 estado: 'CE', liga: 'Liga Nordestina',              copasVencidas: [2002] },
  { jogador: 'Lúcio',          clubeRevelador: 'Guará',                      estado: 'DF', liga: 'Liga Central',  copasVencidas: [2002] },
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
