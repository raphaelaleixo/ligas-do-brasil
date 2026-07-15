import { loadSeason } from '../season.js';

const ANALOGIES = [
  { liga: 'Nordestina',    regiaoPop: '54 mi' },
  { liga: 'Paulista',      regiaoPop: '44 mi' },
  { liga: 'Central',       regiaoPop: '37 mi' },
  { liga: 'Sulista',       regiaoPop: '30 mi' },
  { liga: 'Rio-Capixaba',  regiaoPop: '20 mi' },
  { liga: 'Amazônica',     regiaoPop: '18 mi' },
];

function renderAnalogy() {
  const host = document.getElementById('analogy-rows');
  if (!host) return;
  host.innerHTML = ANALOGIES.map(a => `
    <div class="analogy__row" role="row">
      <span class="analogy__liga" role="cell">${a.liga}</span>
      <span class="analogy__pop" role="cell">${a.regiaoPop}</span>
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
    label: 'Clubes com calendário cheio',
    subtitle: 'Botafogo 2024 — campeão brasileiro e da Libertadores.',
    delta: '−15%',
    atual:   { jogos: 75, det: 'Carioca + Brasileirão + Copa do Brasil + Libertadores' },
    reforma: { jogos: 64, det: '34 Liga Regional + 8 Copa dos Campeões + 9 Copa do Brasil + 13 Libertadores' },
  },
  {
    label: 'Clubes com pouca agenda',
    subtitle: 'Números atuais baseados no Madureira 2024 — jogando apenas o estadual.',
    delta: '+177%',
    atual:   { jogos: 13, det: '11 Campeonato Carioca (Taça Guanabara) + 2 Copa Rio' },
    reforma: { jogos: 36, det: '34 Liga Regional + 2 Preliminar Copa do Brasil (ida-volta), espalhados por 10 meses' },
  },
];

function renderWorkload() {
  const el = document.getElementById('workload-chart');
  if (!el) return;
  const maxVal = Math.max(
    ...WORKLOAD_COMPARISONS.flatMap(c => [c.atual.jogos, c.reforma.jogos])
  );
  el.innerHTML = WORKLOAD_COMPARISONS.map(c => `
    <div class="workload__row" role="group" aria-label="${c.label}: ${c.delta} de jogos entre modelo atual e Ligas do Brasil">
      <div class="workload__row-head">
        <span class="workload__label">${c.label}</span>
        <span class="workload__delta" aria-hidden="true">${c.delta}</span>
      </div>
      <p class="workload__subtitle">${c.subtitle}</p>
      <div class="workload__bars">
        <div class="workload__bar-row">
          <div class="workload__bar workload__bar--current" style="--w:${(c.atual.jogos / maxVal * 100).toFixed(1)}%">
            <span class="workload__bar-value"><span class="visually-hidden">Modelo atual: </span>${c.atual.jogos}<small> jogos</small></span>
          </div>
          <p class="workload__bar-detail">${c.atual.det}</p>
        </div>
        <div class="workload__bar-row">
          <div class="workload__bar workload__bar--reform" style="--w:${(c.reforma.jogos / maxVal * 100).toFixed(1)}%">
            <span class="workload__bar-value"><span class="visually-hidden">Ligas do Brasil: </span>${c.reforma.jogos}<small> jogos</small></span>
          </div>
          <p class="workload__bar-detail">${c.reforma.det}</p>
        </div>
      </div>
    </div>
  `).join('');
}

const SLEEPING_GIANTS = [
  { nome: 'Santa Cruz', estado: 'PE', mediaPublico: 22000, divisaoAtual: 'Série D' },
  { nome: 'Sport',      estado: 'PE', mediaPublico: 16000, divisaoAtual: 'Série B' },
  { nome: 'Remo',       estado: 'PA', mediaPublico: 14000, divisaoAtual: 'Série C' },
  { nome: 'Paysandu',   estado: 'PA', mediaPublico: 10000, divisaoAtual: 'Série B' },
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
          <span class="giants__division">${g.divisaoAtual} em 2024</span>
        </div>
      </figure></li>`;
  }).join('');
}

const REVELATION = [
  { jogador: 'Romário',        clubeRevelador: 'Olaria',                     estado: 'RJ', copasVencidas: [1994] },
  { jogador: 'Ronaldo',        clubeRevelador: 'São Cristóvão',              estado: 'RJ', copasVencidas: [1994, 2002] },
  { jogador: 'Rivaldo',        clubeRevelador: 'Mogi Mirim',                 estado: 'SP', copasVencidas: [2002] },
  { jogador: 'Lúcio',          clubeRevelador: 'Guará',                      estado: 'DF', copasVencidas: [2002] },
  { jogador: 'Cafu',           clubeRevelador: 'Itaquaquecetuba',            estado: 'SP', copasVencidas: [1994, 2002] },
  { jogador: 'Roberto Carlos', clubeRevelador: 'União São João de Araras',   estado: 'SP', copasVencidas: [2002] },
];

function renderRevelation() {
  const el = document.getElementById('revelation-row');
  if (!el) return;
  el.innerHTML = REVELATION.map(r => `
    <li><figure class="revelation__card">
      <span class="revelation__cups">
        <span aria-hidden="true">🏆</span>
        <span class="visually-hidden">Copas do Mundo vencidas: </span>${r.copasVencidas.join(', ')}
      </span>
      <span class="revelation__player">${r.jogador}</span>
      <span class="revelation__club">${r.clubeRevelador} <span class="revelation__club-state">(${r.estado})</span></span>
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
