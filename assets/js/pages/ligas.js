import { loadSeason } from '../season.js';

const LEAGUES = [
  { nome: 'Liga Nordestina',   regiaoPop: '54M', pais: 'Itália',        flag: '🇮🇹', paisPop: '59M', quota: 10 },
  { nome: 'Liga Paulista',     regiaoPop: '44M', pais: 'Inglaterra',    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', paisPop: '57M', quota: 10 },
  { nome: 'Liga Central',      regiaoPop: '37M', pais: 'Espanha',       flag: '🇪🇸', paisPop: '48M', quota: 8 },
  { nome: 'Liga Sulista',      regiaoPop: '30M', pais: 'Ucrânia',       flag: '🇺🇦', paisPop: '32M', quota: 8 },
  { nome: 'Liga Rio-Capixaba', regiaoPop: '20M', pais: 'Países Baixos', flag: '🇳🇱', paisPop: '18M', quota: 8 },
  { nome: 'Liga Amazônica',    regiaoPop: '18M', pais: 'Portugal',      flag: '🇵🇹', paisPop: '10M', quota: 4 },
];

function slug(nome) {
  return nome.toLowerCase().replace(/\W+/g, '-').replace(/^-|-$/g, '');
}

const tabsEl    = document.getElementById('ligas-tabs');
const nameEl    = document.getElementById('lig-name');
const rowsEl    = document.getElementById('lig-rows');
const tableEl   = document.getElementById('lig-table');
const loadingEl = document.getElementById('lig-loading');
const metaEl    = document.getElementById('lig-meta');
const seedEl    = document.getElementById('lig-seed');

let sel = 0;
let season = null;

function renderTabs() {
  tabsEl.innerHTML = LEAGUES.map((l, i) => `
    <button type="button" role="tab" data-idx="${i}"
      class="lig-tab" aria-selected="${i === sel}">${l.nome.replace('Liga ', '')}</button>
  `).join('');
}

tabsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.lig-tab');
  if (!btn) return;
  sel = Number(btn.dataset.idx);
  renderTabs();
  renderContent();
  const url = new URL(location.href);
  url.hash = `liga=${slug(LEAGUES[sel].nome)}`;
  history.replaceState(null, '', url);
});

function renderContent() {
  const meta = LEAGUES[sel];
  nameEl.textContent = meta.nome;

  // Meta strip
  metaEl.innerHTML = `
    <div class="lig-meta__block">
      <div class="lig-meta__label">População da região</div>
      <div class="lig-meta__value">${meta.regiaoPop} <span class="lig-meta__unit">habitantes</span></div>
    </div>
    <div class="lig-meta__block">
      <div class="lig-meta__label">Equivalente europeu</div>
      <div class="lig-meta__value"><span aria-hidden="true">${meta.flag}</span>${meta.pais}</div>
      <div class="lig-meta__hint">${meta.paisPop} habitantes — país que sustenta sua própria liga nacional.</div>
    </div>
    <div class="lig-meta__block lig-meta__block--accent">
      <div class="lig-meta__label">Vagas na Copa dos Campeões</div>
      <div class="lig-meta__value">${meta.quota}</div>
    </div>
    <div class="lig-meta__block">
      <div class="lig-meta__label">Vaga na Sul-Americana</div>
      <div class="lig-meta__value">1</div>
      <div class="lig-meta__hint">para o melhor clube não classificado à Libertadores.</div>
    </div>
    <div class="lig-meta__block">
      <div class="lig-meta__label">Série B</div>
      <div class="lig-meta__value">18 <span class="lig-meta__unit">clubes</span></div>
      <div class="lig-meta__hint">Também disputam 34 rodadas em pontos corridos, nos mesmos 10 meses. Um lugar no calendário para cada um.</div>
    </div>
  `;

  if (!season) return;
  const liga = season.ligasRegionais.find((l) => l.nome === meta.nome);
  if (!liga) return;

  const cc  = new Set(liga.qualificadosCampeoes || []);
  const reb = new Set(liga.rebaixados || []);

  rowsEl.innerHTML = liga.tabelaA.map((t) => {
    const zone = cc.has(t.id) ? 'cc' : reb.has(t.id) ? 'reb' : '';
    const sg  = (t.saldoGols > 0 ? '+' : '') + t.saldoGols;
    return `
      <tr class="lig-row" data-zone="${zone}">
        <td class="lig-td--pos"><span>${t.posicao}</span></td>
        <td class="lig-td--name">${t.nome}</td>
        <td class="lig-td--num">${t.jogos}</td>
        <td class="lig-td--num">${t.vitorias}</td>
        <td class="lig-td--num">${t.empates}</td>
        <td class="lig-td--num">${t.derrotas}</td>
        <td class="lig-td--num">${t.golsPro}</td>
        <td class="lig-td--num">${t.golsContra}</td>
        <td class="lig-td--num-strong">${sg}</td>
        <td class="lig-td--pts">${t.pontos}</td>
      </tr>
    `;
  }).join('');

  loadingEl.hidden = true;
  tableEl.hidden = false;
}

// Initial hash → tab
const hashLiga = new URLSearchParams(location.hash.slice(1)).get('liga');
if (hashLiga) {
  const idx = LEAGUES.findIndex((l) => slug(l.nome) === hashLiga);
  if (idx >= 0) sel = idx;
}

renderTabs();
renderContent();

loadSeason().then((s) => {
  season = s;
  if (seedEl) seedEl.textContent = s.seed;
  renderContent();
});
