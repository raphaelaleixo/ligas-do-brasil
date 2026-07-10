import { loadSeason } from '../season.js';

const ANALOGIES = [
  { liga: 'Liga Nordestina',    regiaoPop: '54M', pais: 'Itália',         flag: '🇮🇹', paisPop: '59M' },
  { liga: 'Liga Paulista',      regiaoPop: '44M', pais: 'Inglaterra',     flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', paisPop: '57M' },
  { liga: 'Liga Central',       regiaoPop: '37M', pais: 'Espanha',        flag: '🇪🇸', paisPop: '48M' },
  { liga: 'Liga Sulista',       regiaoPop: '30M', pais: 'Ucrânia',        flag: '🇺🇦', paisPop: '32M' },
  { liga: 'Liga Rio-Capixaba',  regiaoPop: '20M', pais: 'Países Baixos',  flag: '🇳🇱', paisPop: '18M' },
  { liga: 'Liga Amazônica',     regiaoPop: '18M', pais: 'Portugal',       flag: '🇵🇹', paisPop: '10M' },
];

function renderAnalogy() {
  const host = document.getElementById('analogy-rows');
  if (!host) return;
  host.innerHTML = ANALOGIES.map(a => `
    <div class="analogy__row">
      <span class="analogy__liga">${a.liga}</span>
      <span class="analogy__pop">${a.regiaoPop}</span>
      <span class="analogy__country"><span class="analogy__country-flag" aria-hidden="true">${a.flag}</span>${a.pais}</span>
      <span class="analogy__pop--secondary">${a.paisPop}</span>
    </div>
  `).join('');
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
    delta: '−16%',
    atual:   { clube: 'Botafogo 2024', jogos: 75, det: 'Carioca + Brasileirão + Copa do Brasil + Libertadores' },
    reforma: { clube: 'Ligas do Brasil', jogos: 63, det: '34 Liga Regional + 11 Copa dos Campeões + 5 Copa do Brasil + 13 Libertadores' },
  },
  {
    label: 'Base',
    delta: '+169%',
    atual:   { clube: 'Madureira 2024', jogos: 13, det: '11 Campeonato Carioca (Taça Guanabara) + 2 Copa Rio' },
    reforma: { clube: 'Ligas do Brasil', jogos: 35, det: '34 Liga Regional + 1 Preliminar Copa do Brasil, espalhados por 10 meses' },
  },
];

function renderWorkload() {
  const el = document.getElementById('workload-chart');
  if (!el) return;
  const maxVal = Math.max(
    ...WORKLOAD_COMPARISONS.flatMap(c => [c.atual.jogos, c.reforma.jogos])
  );
  el.innerHTML = WORKLOAD_COMPARISONS.map(c => `
    <div class="workload__row">
      <div class="workload__row-head">
        <span class="workload__label">${c.label}</span>
        <span class="workload__delta">${c.delta}</span>
      </div>
      <div class="workload__bars">
        <div class="workload__bar-row">
          <div class="workload__bar-line">
            <div class="workload__bar workload__bar--current" style="--w:${(c.atual.jogos / maxVal * 100).toFixed(1)}%">
              <span class="workload__bar-value">${c.atual.jogos}</span>
            </div>
            <span class="workload__bar-tag">${c.atual.clube}</span>
          </div>
          <p class="workload__bar-detail">${c.atual.det}</p>
        </div>
        <div class="workload__bar-row">
          <div class="workload__bar-line">
            <div class="workload__bar workload__bar--reform" style="--w:${(c.reforma.jogos / maxVal * 100).toFixed(1)}%">
              <span class="workload__bar-value">${c.reforma.jogos}</span>
            </div>
            <span class="workload__bar-tag">${c.reforma.clube}</span>
          </div>
          <p class="workload__bar-detail">${c.reforma.det}</p>
        </div>
      </div>
    </div>
  `).join('');
}

const SLEEPING_GIANTS = [
  { nome: 'Remo',       estado: 'PA', mediaPublico: 32000, divisaoAtual: 'Série B' },
  { nome: 'Paysandu',   estado: 'PA', mediaPublico: 30000, divisaoAtual: 'Série B' },
  { nome: 'Sport',      estado: 'PE', mediaPublico: 28000, divisaoAtual: 'Série B' },
  { nome: 'Santa Cruz', estado: 'PE', mediaPublico: 22000, divisaoAtual: 'Série D' },
  { nome: 'Coritiba',   estado: 'PR', mediaPublico: 20000, divisaoAtual: 'Série B' },
  { nome: 'Goiás',      estado: 'GO', mediaPublico: 18000, divisaoAtual: 'Série B' },
  { nome: 'Náutico',    estado: 'PE', mediaPublico: 17000, divisaoAtual: 'Série C' },
  { nome: 'Vila Nova',  estado: 'GO', mediaPublico: 14000, divisaoAtual: 'Série B' },
  { nome: 'América-RN', estado: 'RN', mediaPublico:  8000, divisaoAtual: 'Série C' },
];

// Waffle chart: 40 cells (5 rows × 8 cols), each cell = 1000 people. Max 40k.
const WAFFLE_CELLS = 40;
const WAFFLE_UNIT = 1000;

function renderSleepingGiants() {
  const el = document.getElementById('giants-row');
  if (!el) return;
  el.innerHTML = SLEEPING_GIANTS.map(g => {
    const filled = Math.round(g.mediaPublico / WAFFLE_UNIT);
    const cells = Array.from({ length: WAFFLE_CELLS }, (_, i) =>
      `<span class="giants__cell"${i < filled ? ' data-filled' : ''}></span>`
    ).join('');
    return `
      <li><figure class="giants__card">
        <figcaption>
          <span class="giants__name">${g.nome}</span>
          <span class="giants__meta">${g.estado}</span>
        </figcaption>
        <div class="giants__waffle" aria-hidden="true">${cells}</div>
        <div class="giants__foot">
          <span class="giants__attendance">${g.mediaPublico.toLocaleString('pt-BR')}<small> por jogo</small></span>
          <span class="giants__division">${g.divisaoAtual} hoje</span>
        </div>
      </figure></li>`;
  }).join('');
}

const REVELATION = [
  { jogador: 'Romário',        clubeRevelador: 'Olaria',                     estado: 'RJ', copasVencidas: [1994] },
  { jogador: 'Ronaldo',        clubeRevelador: 'São Cristóvão',              estado: 'RJ', copasVencidas: [1994, 2002] },
  { jogador: 'Rivaldo',        clubeRevelador: 'Santa Cruz',                 estado: 'CE', copasVencidas: [2002] },
  { jogador: 'Lúcio',          clubeRevelador: 'Guará',                      estado: 'DF', copasVencidas: [2002] },
  { jogador: 'Cafu',           clubeRevelador: 'Itaquaquecetuba',            estado: 'SP', copasVencidas: [1994, 2002] },
  { jogador: 'Roberto Carlos', clubeRevelador: 'União São João de Araras',   estado: 'SP', copasVencidas: [2002] },
];

function renderRevelation() {
  const el = document.getElementById('revelation-row');
  if (!el) return;
  el.innerHTML = REVELATION.map(r => `
    <li><figure class="revelation__card">
      <span class="revelation__cups">🏆 ${r.copasVencidas.join(', ')}</span>
      <span class="revelation__player">${r.jogador}</span>
      <span class="revelation__club">Revelado por ${r.clubeRevelador} <span class="revelation__club-state">(${r.estado})</span></span>
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
