import { simulateSeason } from '../../../src/sim/run.js';
import { getAllTeams } from '../../../src/data/teams.js';
import { renderRegionalLeaguesTab } from '../render/regional-leagues-tab.js';
import { renderCcGroups } from '../render/cc-groups.js';
import { renderCcBracket } from '../render/cc-bracket.js';
import { renderCbBracket } from '../render/cb-bracket.js';
import { renderConmebolTab } from '../render/conmebol-tab.js';

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
  const clubesById = new Map(season.clubes.map((c) => [c.id, c]));
  if (name === 'ligas') {
    panel.appendChild(renderRegionalLeaguesTab({ ligasRegionais: season.ligasRegionais }));
  } else if (name === 'cc') {
    panel.appendChild(renderCcGroups({
      grupos: season.copaCampeoes.grupos,
      koRound16: season.copaCampeoes.matamata['16avos'],
    }));
    panel.appendChild(renderCcBracket({
      matamata: season.copaCampeoes.matamata,
      clubesById,
    }));
  } else if (name === 'cb') {
    panel.appendChild(renderCbBracket({
      matamata: season.copaBrasil.matamata,
      serieBIds: getSerieBIds(),
      ccEliminadosIds: new Set(season.copaBrasil.ccEliminadosNos16avos ?? []),
      clubesById,
    }));
  } else if (name === 'conmebol') {
    panel.appendChild(renderConmebolTab({ conmebol: season.conmebol, clubesById }));
  }
}

function showResult(seed, season) {
  $('.sim-result').hidden = false;
  const copyLink = $('[data-role="copy-link"]');
  if (copyLink) copyLink.hidden = false;
  renderTab('ligas', season);
  renderTab('cc', season);
  renderTab('cb', season);
  renderTab('conmebol', season);
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
const COPY_LINK_DEFAULT = 'copiar link';
let copyLinkResetTimer = null;
function onCopyLinkClick(e) {
  const btn = e.currentTarget;
  const scheduleReset = () => {
    if (copyLinkResetTimer) clearTimeout(copyLinkResetTimer);
    copyLinkResetTimer = setTimeout(() => {
      btn.textContent = COPY_LINK_DEFAULT;
      copyLinkResetTimer = null;
    }, 2000);
  };
  if (!navigator.clipboard) {
    btn.textContent = 'copie a URL';
    scheduleReset();
    return;
  }
  navigator.clipboard.writeText(location.href).then(
    () => { btn.textContent = 'link copiado ✓'; },
    () => { btn.textContent = 'copie a URL'; }
  ).finally(scheduleReset);
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
      const copyLink = document.querySelector('[data-role="copy-link"]');
      if (copyLink) copyLink.hidden = true;
    }
  });

  const seed = readSeedFromUrl();
  if (seed !== null) runSim(seed);
}

if (typeof document !== 'undefined' && document.readyState !== 'loading') init();
else document?.addEventListener?.('DOMContentLoaded', init);

export const _test = { readSeedFromUrl, randomSeed, runSim, navigateToSeed, selectTab };
