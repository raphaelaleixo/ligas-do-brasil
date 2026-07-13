import { ARCHETYPES, calendarFor } from '../data/archetypes.js';

const tabsEl     = document.getElementById('archetype-tabs');
const labelEl    = document.getElementById('arch-label');
const subEl      = document.getElementById('arch-subtitle');
const gamesEl    = document.getElementById('arch-games');
const atualEl    = document.getElementById('arch-atual');
const deltaEl    = document.getElementById('arch-delta');
const exampleEl  = document.getElementById('arch-example');
const legendEl   = document.getElementById('cal-legend');
const gridEl     = document.getElementById('cal-grid');

const ARCH_ORDER = ['copas-nacionais-e-internacionais', 'ligas-e-copas-nacionais', 'calendario-regional'];

const LEGEND = [
  { key: 'liga_regional',          label: 'Liga Regional' },
  { key: 'copa_campeoes',          label: 'Copa dos Campeões' },
  { key: 'copa_brasil',            label: 'Copa do Brasil' },
  { key: 'conmebol_libertadores',  label: 'Libertadores' },
  { key: 'conmebol_sul_americana', label: 'Sul-Americana' },
  { key: 'fifa_pause',             label: 'Data FIFA' },
];

let sel = 'copas-nacionais-e-internacionais';

function renderTabs() {
  tabsEl.innerHTML = ARCH_ORDER.map((k) => `
    <button type="button" role="tab" data-key="${k}"
      class="cal-tab" aria-selected="${k === sel}">${ARCHETYPES[k].label}</button>
  `).join('');
}

function renderLegend() {
  legendEl.innerHTML = LEGEND.map((l) => `
    <span class="cal-legend__item">
      <span class="cal-legend__swatch" data-comp="${l.key}"></span>${l.label}
    </span>
  `).join('') + `
    <span class="cal-legend__item">
      <span class="cal-legend__swatch" data-comp="final"></span>Final (destaque)
    </span>
    <p class="cal-legend__note">
      Na <strong>Copa dos Campeões</strong>, cada clube joga 3 rodadas de grupo + 3 rodadas cruzadas (contra clubes do mesmo pote em outros grupos) antes do 16-avos.
      A <strong>Copa do Brasil</strong> começa pela Preliminar, disputada só pela Série B; a Série A entra na 1ª Fase.
    </p>
  `;
  // Apply the same background rules as the grid slots to the legend swatches
  for (const s of legendEl.querySelectorAll('.cal-legend__swatch')) {
    const c = s.dataset.comp;
    if (c === 'liga_regional')          s.style.background = 'var(--green)';
    else if (c === 'copa_campeoes')     s.style.background = 'var(--gold)';
    else if (c === 'copa_brasil')       s.style.background = 'var(--blue)';
    else if (c === 'conmebol_libertadores') s.style.background = 'var(--green-deep)';
    else if (c === 'conmebol_sul_americana') s.style.background = 'var(--terra)';
    else if (c === 'fifa_pause')        s.style.background = 'rgba(12,14,10,0.06)';
    else if (c === 'final')             { s.style.background = 'transparent'; s.style.border = '3px solid var(--ink)'; }
  }
}

function isFinal(cell) {
  return !!(cell && cell.label && cell.label.includes('final'));
}

function renderArchetype() {
  const arch = ARCHETYPES[sel];
  labelEl.textContent = arch.label;
  subEl.textContent = arch.subtitle;
  gamesEl.innerHTML = `${arch.totalGames} <small>jogos</small>`;
  atualEl.innerHTML = `${arch.comparacao.atual} <small>jogos</small>`;
  deltaEl.textContent = arch.comparacao.delta;
  exampleEl.textContent = arch.exemplos;

  const weeks = calendarFor(sel);

  const cells = [
    `<div class="cal-grid__head">Semana</div>`,
    `<div class="cal-grid__head">Fim-de-semana</div>`,
    `<div class="cal-grid__head">Meio-de-semana</div>`,
  ];
  for (const w of weeks) {
    const num = 'S' + String(w.n).padStart(2, '0');
    cells.push(`
      <div class="cal-grid__week-cell">
        <span class="cal-grid__week-num">${num}</span>
        <span class="cal-grid__week-date">${w.sat}</span>
      </div>
      <div class="cal-grid__slot" data-comp="${w.fds?.key ?? ''}" data-final="${isFinal(w.fds)}">${w.fds?.label ?? '—'}</div>
      <div class="cal-grid__slot" data-comp="${w.mds?.key ?? ''}" data-final="${isFinal(w.mds)}">${w.mds?.label ?? '—'}</div>
    `);
  }
  gridEl.innerHTML = cells.join('');

  const url = new URL(location.href);
  url.searchParams.set('arquetipo', sel);
  history.replaceState(null, '', url);
}

tabsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.cal-tab');
  if (!btn) return;
  sel = btn.dataset.key;
  renderTabs();
  renderArchetype();
});

const params = new URLSearchParams(location.search);
const initial = params.get('arquetipo');
if (initial && ARCHETYPES[initial]) sel = initial;

renderTabs();
renderLegend();
renderArchetype();
