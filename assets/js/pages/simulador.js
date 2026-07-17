import { simulateSeason } from '../../../src/sim/run.js';
import { getAllTeams } from '../../../src/data/teams.js';
import { renderRegionalLeaguesTab } from '../render/regional-leagues-tab.js';
import { renderCcGroups } from '../render/cc-groups.js';
import { renderCcBracket } from '../render/cc-bracket.js';
import { renderCbBracket } from '../render/cb-bracket.js';

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const MAX_SEED = 1e9;

function readSeedFromUrl() {
  const raw = new URLSearchParams(location.search).get('seed');
  if (raw === null) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0 || n > MAX_SEED) return null;
  return Math.floor(n);
}

function randomSeed() {
  return Math.floor(Math.random() * MAX_SEED);
}

let serieBIds = null;
function getSerieBIds() {
  if (serieBIds) return serieBIds;
  serieBIds = new Set(getAllTeams().filter((t) => t.divisao !== 'A').map((t) => t.id));
  return serieBIds;
}

function renderTab(name, season) {
  const panel = $(`[role="tabpanel"][data-tab="${name}"]`);
  panel.replaceChildren(); // clear
  if (name === 'ligas') {
    panel.appendChild(renderRegionalLeaguesTab({ ligasRegionais: season.ligasRegionais }));
  } else if (name === 'cc') {
    panel.appendChild(renderCcGroups({
      grupos: season.copaCampeoes.grupos,
      koRound16: season.copaCampeoes.matamata['16avos'],
    }));
    panel.appendChild(renderCcBracket({ matamata: season.copaCampeoes.matamata }));
  } else if (name === 'cb') {
    panel.appendChild(renderCbBracket({
      matamata: season.copaBrasil.matamata,
      serieBIds: getSerieBIds(),
    }));
  }
}

function showResult(seed, season) {
  $('[data-role="seed"]').textContent = String(seed);
  $('.sim-result').hidden = false;
  $('.sim-title .btn').textContent = 'Nova simulação';
  renderTab('ligas', season);
  renderTab('cc', season);
  renderTab('cb', season);
}

function showError(msg) {
  const host = $('.sim-title .act__inner') ?? $('.sim-title');
  let el = $('.sim-error', host.parentElement ?? host);
  if (!el) {
    el = document.createElement('p');
    el.className = 'sim-error';
    host.appendChild(el);
  }
  el.textContent = msg;
}

function clearError() { $$('.sim-error').forEach((el) => el.remove()); }

function setBusy(busy) {
  $$('[data-role="new-sim"]').forEach((btn) => {
    if (busy) btn.setAttribute('aria-busy', 'true');
    else btn.removeAttribute('aria-busy');
  });
}

function runSim(seed) {
  clearError();
  setBusy(true);
  return new Promise((resolve) => setTimeout(resolve, 0))
    .then(() => {
      const season = simulateSeason(seed);
      showResult(seed, season);
      return season;
    })
    .catch((err) => {
      console.error(err);
      showError('Não consegui rodar essa temporada. Tente de novo.');
    })
    .finally(() => setBusy(false));
}

function navigateToSeed(seed) {
  history.pushState({}, '', `?seed=${seed}`);
  return runSim(seed);
}

function selectTab(name) {
  for (const btn of $$('.sim-tabs [role="tab"]')) {
    const active = btn.dataset.tab === name;
    btn.setAttribute('aria-selected', String(active));
  }
  for (const panel of $$('[role="tabpanel"]')) {
    panel.hidden = panel.dataset.tab !== name;
  }
}

function onNewSimClick() { navigateToSeed(randomSeed()); }
function onCopyLinkClick(e) {
  const btn = e.currentTarget;
  const original = btn.textContent;
  if (!navigator.clipboard) {
    btn.textContent = 'copie a URL';
    setTimeout(() => { btn.textContent = original; }, 1500);
    return;
  }
  navigator.clipboard.writeText(location.href).then(
    () => { btn.textContent = 'copiado ✓'; },
    () => { btn.textContent = 'copie a URL'; }
  ).finally(() => {
    setTimeout(() => { btn.textContent = original; }, 1500);
  });
}
function onTabClick(e) {
  const tab = e.target.closest('[role="tab"]');
  if (!tab) return;
  selectTab(tab.dataset.tab);
}

function init() {
  $$('[data-role="new-sim"]').forEach((btn) => btn.addEventListener('click', onNewSimClick));
  $('[data-role="copy-link"]')?.addEventListener('click', onCopyLinkClick);
  $('.sim-tabs')?.addEventListener('click', onTabClick);
  window.addEventListener('popstate', () => {
    const seed = readSeedFromUrl();
    if (seed !== null) {
      runSim(seed);
    } else {
      const result = document.querySelector('.sim-result');
      if (result) result.hidden = true;
    }
  });

  const seed = readSeedFromUrl();
  if (seed !== null) runSim(seed);
}

if (typeof document !== 'undefined' && document.readyState !== 'loading') init();
else document?.addEventListener?.('DOMContentLoaded', init);

export const _test = { readSeedFromUrl, randomSeed, runSim, navigateToSeed, selectTab };
