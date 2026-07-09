import { loadSeason } from '../season.js';
import { wireTabs } from '../components/tabs.js';

// Pop figures: IBGE 2022 (regiões) / UN 2023 (países).
const ANALOG = {
  'Liga Nordestina':   { pais: 'Itália',        flag: '🇮🇹', paisPop: '59M', regiaoPop: '54M' },
  'Liga Paulista':     { pais: 'Espanha',       flag: '🇪🇸', paisPop: '48M', regiaoPop: '44M' },
  'Liga Central':      { pais: 'Polônia',       flag: '🇵🇱', paisPop: '37M', regiaoPop: '37M' },
  'Liga Sulista':      { pais: 'Ucrânia',       flag: '🇺🇦', paisPop: '32M', regiaoPop: '30M' },
  'Liga Rio-Capixaba': { pais: 'Países Baixos', flag: '🇳🇱', paisPop: '18M', regiaoPop: '20M' },
  'Liga Amazônica':    { pais: 'Bélgica',       flag: '🇧🇪', paisPop: '12M', regiaoPop: '18M' },
};

const CAMPEOES_QUOTAS = {
  'Liga Nordestina': 10, 'Liga Paulista': 10,
  'Liga Rio-Capixaba': 8, 'Liga Sulista': 8, 'Liga Central': 8,
  'Liga Amazônica': 4,
};

function slug(nome) { return nome.toLowerCase().replace(/\W+/g, '-').replace(/^-|-$/g, ''); }

function renderTabs(season) {
  const tabsEl = document.getElementById('ligas-tabs');
  tabsEl.innerHTML = season.ligasRegionais.map((l) => {
    const a = ANALOG[l.nome];
    return `<li><button role="tab" data-key="${slug(l.nome)}" aria-selected="false" tabindex="-1"
      class="ligas__tab">${l.nome}<span class="ligas__tab-sub">${a.flag} ${a.pais}</span></button></li>`;
  }).join('');
  tabsEl.setAttribute('role', 'tablist');
}

function renderLiga(season, key) {
  const liga = season.ligasRegionais.find((l) => slug(l.nome) === key);
  const el = document.getElementById('liga-detalhe');

  // Serie A clubs from this liga, ordered by prior-year ranking (Year-0 seeding
  // by ranking_forca desc, tiebreak by name). This is structural — not simulated
  // results.
  const clubes = season.clubes
    .filter((c) => c.liga_regional === liga.nome && c.divisao === 'A')
    .slice()
    .sort((a, b) => {
      if (b.ranking_forca !== a.ranking_forca) return b.ranking_forca - a.ranking_forca;
      return a.nome.localeCompare(b.nome);
    });

  const quota = CAMPEOES_QUOTAS[liga.nome];
  const analog = ANALOG[liga.nome];
  const total = clubes.length;

  const listItems = clubes.map((c, i) => {
    const pos = i + 1;
    let badge = '';
    let zona = '';
    if (pos <= quota) {
      badge = '<span class="clube__badge clube__badge--cc">🌎 Copa dos Campeões</span>';
      zona = 'campeoes';
    } else if (pos >= total - 2) {
      badge = '<span class="clube__badge clube__badge--reb">⬇️ Rebaixamento</span>';
      zona = 'rebaixamento';
    }
    return `<li class="clube" data-zona="${zona}">
      <span class="clube__pos">${pos}</span>
      <span class="clube__nome">${c.nome}</span>
      <span class="clube__estado">${c.estado ?? ''}</span>
      ${badge}
    </li>`;
  }).join('');

  el.innerHTML = `
    <div class="liga-layout">
      <section class="liga-clubs" aria-labelledby="serieA-heading">
        <h2 id="serieA-heading">Série A · ${total} clubes</h2>
        <p class="liga-clubs__caveat">
          Ordenados por ranking da temporada anterior. Cores de zona são estruturais —
          esta é a moldura da reforma, não um resultado simulado.
        </p>
        <ol class="clubes">${listItems}</ol>
      </section>

      <aside class="liga-meta">
        <div class="liga-meta__block">
          <div class="liga-meta__label">População da região</div>
          <div class="liga-meta__value">${analog.regiaoPop} habitantes</div>
        </div>
        <div class="liga-meta__block">
          <div class="liga-meta__label">Equivalente europeu</div>
          <div class="liga-meta__value">${analog.flag} ${analog.pais}</div>
          <div class="liga-meta__hint">${analog.paisPop} habitantes — país que sustenta sua própria liga nacional.</div>
        </div>
        <div class="liga-meta__block liga-meta__block--accent">
          <div class="liga-meta__label">Vagas na Copa dos Campeões</div>
          <div class="liga-meta__value">${quota}</div>
        </div>
        <div class="liga-meta__block">
          <div class="liga-meta__label">Vaga garantida na Sul-Americana</div>
          <div class="liga-meta__value">1 <span class="liga-meta__hint">para o melhor clube não classificado à Libertadores</span></div>
        </div>
        <div class="liga-meta__block">
          <div class="liga-meta__label">Série B</div>
          <div class="liga-meta__value">18 clubes</div>
          <div class="liga-meta__hint">Também disputam 34 rodadas em pontos corridos ao longo dos mesmos 10 meses. Um lugar no calendário nacional para cada um.</div>
        </div>
      </aside>
    </div>
  `;

  const url = new URL(location.href); url.hash = `liga=${key}`; history.replaceState(null, '', url);
}

const season = await loadSeason();
renderTabs(season);
const tabsEl = document.getElementById('ligas-tabs');
tabsEl.addEventListener('tab-change', (e) => renderLiga(season, e.detail.key));
const hashKey = new URLSearchParams(location.hash.slice(1)).get('liga');
const defaultKey = hashKey ?? slug(season.ligasRegionais[0].nome);
wireTabs(tabsEl, { defaultKey });
