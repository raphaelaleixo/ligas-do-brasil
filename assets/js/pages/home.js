import { loadSeason } from '../season.js';

// Population figures: IBGE 2022 Census (Brazil regions) / UN 2023 (Europe).
// Each Brazilian regional league is roughly the size of a European country.
const ANALOGIES = [
  { liga: 'Liga Nordestina',    regiaoPop: '54M', pais: 'Itália',         flag: '🇮🇹', paisPop: '59M' },
  { liga: 'Liga Paulista',      regiaoPop: '44M', pais: 'Inglaterra',     flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', paisPop: '57M' },
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
    reforma:     { clube: 'Ligas do Brasil',    jogos: 63, det: '34 Liga Regional + 11 Copa dos Campeões + 5 Copa do Brasil + 13 Libertadores' },
    delta: '−16%',
  },
  {
    label: 'Base',
    modeloAtual: { clube: 'Madureira 2024', jogos: 13, det: '11 Campeonato Carioca (Taça Guanabara) + 2 Copa Rio' },
    reforma:     { clube: 'Ligas do Brasil',    jogos: 35, det: '34 Liga Regional + 1 Preliminar Copa do Brasil, espalhados por 10 meses' },
    delta: '+169%',
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
        <p class="workload__breakdown">${c.modeloAtual.det}</p>
        <div class="workload__bar" data-set="reform"  style="--w:${(c.reforma.jogos / maxVal * 100).toFixed(1)}">
          <span class="workload__value"><strong>${c.reforma.jogos}</strong> ${c.reforma.clube}</span>
        </div>
        <p class="workload__breakdown">${c.reforma.det}</p>
      </div>
    </div>`).join('');
}

// Cores por clube (mantel principal — a segunda cor eventualmente vai virar acento).
// Vitória removido (está na Série A hoje); Paraná removido (média de 6k não sustenta o argumento).
const SLEEPING_GIANTS = [
  { nome: 'Remo',       estado: 'PA', mediaPublico: 32000, divisaoAtual: 'Série B', cor: '#003c72' },
  { nome: 'Paysandu',   estado: 'PA', mediaPublico: 30000, divisaoAtual: 'Série B', cor: '#0a5aa8' },
  { nome: 'Sport',      estado: 'PE', mediaPublico: 28000, divisaoAtual: 'Série B', cor: '#c8102e' },
  { nome: 'Santa Cruz', estado: 'PE', mediaPublico: 22000, divisaoAtual: 'Série D', cor: '#e21f26' },
  { nome: 'Coritiba',   estado: 'PR', mediaPublico: 20000, divisaoAtual: 'Série B', cor: '#006747' },
  { nome: 'Goiás',      estado: 'GO', mediaPublico: 18000, divisaoAtual: 'Série B', cor: '#00743f' },
  { nome: 'Náutico',    estado: 'PE', mediaPublico: 17000, divisaoAtual: 'Série C', cor: '#d81e26' },
  { nome: 'Vila Nova',  estado: 'GO', mediaPublico: 14000, divisaoAtual: 'Série B', cor: '#d51e1e' },
  { nome: 'América-RN', estado: 'RN', mediaPublico:  8000, divisaoAtual: 'Série C', cor: '#106e46' },
];

// Waffle chart: max = 40k, grid 5×8 = 40 células. Cada célula = 1k pessoas.
const WAFFLE_MAX = 40000;
const WAFFLE_CELLS = 40;

function renderSleepingGiants() {
  const el = document.getElementById('giants-row');
  if (!el) return;
  el.innerHTML = SLEEPING_GIANTS.map(g => {
    const filled = Math.round(g.mediaPublico / (WAFFLE_MAX / WAFFLE_CELLS));
    const cells = Array.from({ length: WAFFLE_CELLS }, (_, i) =>
      `<span class="giants__cell"${i < filled ? ' data-filled' : ''}></span>`
    ).join('');
    return `
    <li><figure class="giants__card" style="--club-color: ${g.cor};">
      <figcaption>${g.nome} <span class="giants__meta">${g.estado}</span></figcaption>
      <div class="giants__waffle" aria-hidden="true">${cells}</div>
      <div class="giants__attendance">${g.mediaPublico.toLocaleString('pt-BR')} <small>por jogo</small></div>
      <div class="giants__meta">${g.divisaoAtual} hoje</div>
    </figure></li>`;
  }).join('');
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
});
