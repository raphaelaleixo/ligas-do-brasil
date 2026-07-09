import { ARCHETYPES, calendarFor } from '../data/archetypes.js';
import { wireTabs } from '../components/tabs.js';

function renderTabs() {
  const tabsEl = document.getElementById('archetype-tabs');
  tabsEl.innerHTML = Object.values(ARCHETYPES).map((a) =>
    `<li><button role="tab" data-key="${a.slug}" aria-selected="false" tabindex="-1" class="tabs__tab">${a.label}</button></li>`
  ).join('');
}

function renderArchetype(key) {
  const arch = ARCHETYPES[key];
  if (!arch) return;
  const weeks = calendarFor(key);
  const el = document.getElementById('archetype-detail');

  el.innerHTML = `
    <header class="archetype-header">
      <p class="archetype-header__eyebrow">Arquétipo</p>
      <h2 class="archetype-header__title">${arch.label}</h2>
      <p class="archetype-header__subtitle">${arch.subtitle}</p>
      <div class="archetype-header__counters">
        <div class="counter">
          <div class="counter__label">Reforma</div>
          <div class="counter__value">${arch.totalGames} jogos</div>
        </div>
        <div class="counter">
          <div class="counter__label">Modelo atual</div>
          <div class="counter__value counter__value--muted">${arch.comparacao.atual} jogos</div>
        </div>
        <div class="counter">
          <div class="counter__label">Diferença</div>
          <div class="counter__value" data-sign="${arch.comparacao.delta.startsWith('+') ? 'plus' : 'minus'}">${arch.comparacao.delta}</div>
        </div>
      </div>
      <p class="archetype-header__example">${arch.exemplos}</p>
    </header>

    <div class="archetype-grid">
      <div class="archetype-grid__col-header">Semana</div>
      <div class="archetype-grid__col-header">Fim-de-semana</div>
      <div class="archetype-grid__col-header">Meio-de-semana</div>
      ${weeks.map((w) => `
        <div class="archetype-grid__week">
          <span class="archetype-grid__week-num">S${String(w.n).padStart(2, '0')}</span>
          <span class="archetype-grid__week-date">${w.sat}</span>
        </div>
        <div class="archetype-grid__slot" data-comp="${w.fds?.key ?? ''}">${w.fds?.label ?? ''}</div>
        <div class="archetype-grid__slot" data-comp="${w.mds?.key ?? ''}">${w.mds?.label ?? ''}</div>
      `).join('')}
    </div>
  `;

  const url = new URL(location.href);
  url.searchParams.set('arquetipo', key);
  history.replaceState(null, '', url);
}

renderTabs();
const tabsEl = document.getElementById('archetype-tabs');
tabsEl.addEventListener('tab-change', (e) => renderArchetype(e.detail.key));
const params = new URLSearchParams(location.search);
const defaultKey = params.get('arquetipo') ?? 'elite-finalista';
wireTabs(tabsEl, { defaultKey });
