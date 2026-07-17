import { simulateSeason } from '../../../src/sim/run.js';

const $ = (sel, ctx = document) => ctx.querySelector(sel);
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

function showResult(seed, _season) {
  $('[data-role="seed"]').textContent = String(seed);
  $('.sim-result').hidden = false;
  $('.sim-title .btn').textContent = 'Nova simulação';
}

function showError(msg) {
  const host = $('.sim-title');
  let el = $('.sim-error', host);
  if (!el) {
    el = document.createElement('p');
    el.className = 'sim-error';
    host.querySelector('.act__inner')?.appendChild(el);
  }
  el.textContent = msg;
}

function clearError() {
  $$('.sim-error').forEach((el) => el.remove());
}

function setBusy(busy) {
  $$('[data-role="new-sim"]').forEach((btn) => {
    if (busy) btn.setAttribute('aria-busy', 'true');
    else btn.removeAttribute('aria-busy');
  });
}

function runSim(seed) {
  clearError();
  setBusy(true);
  // Yield para o browser pintar o estado busy antes de bloquear o thread.
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

function onNewSimClick() {
  const seed = randomSeed();
  return navigateToSeed(seed);
}

function onCopyLinkClick() {
  navigator.clipboard?.writeText(location.href);
}

function init() {
  $$('[data-role="new-sim"]').forEach((btn) => btn.addEventListener('click', onNewSimClick));
  $('[data-role="copy-link"]')?.addEventListener('click', onCopyLinkClick);
  window.addEventListener('popstate', () => {
    const seed = readSeedFromUrl();
    if (seed !== null) runSim(seed);
  });

  const seed = readSeedFromUrl();
  if (seed !== null) runSim(seed);
}

if (typeof document !== 'undefined' && document.readyState !== 'loading') init();
else document?.addEventListener?.('DOMContentLoaded', init);

// Exporta apenas para testes; nunca importado por outros módulos do site.
export const _test = { readSeedFromUrl, randomSeed, runSim, navigateToSeed };
