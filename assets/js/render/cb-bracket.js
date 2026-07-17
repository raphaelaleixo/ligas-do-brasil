// Renderiza o mata-mata da Copa do Brasil — bracket horizontal com 5 colunas
// (16avos → oitavas → quartas → semis → final). Confrontos são cards brancos
// com nomes completos + placares por perna; times Série B ganham a classe
// placeholder (itálico + tracejado + tom apagado); campeão com halo dourado.

const ROUND_LABELS = [
  ['16avos', '16-avos'],
  ['oitavas', 'Oitavas'],
  ['quartas', 'Quartas'],
  ['semis', 'Semis'],
  ['final', 'Final'],
];

function nameOf(id, clubesById) {
  return clubesById?.get(id)?.nome ?? id;
}

function legsFor(pairing) {
  if (Array.isArray(pairing.legs)) return pairing.legs;
  return [{
    casaId: pairing.casaId,
    foraId: pairing.foraId,
    golsCasa: pairing.golsCasa,
    golsFora: pairing.golsFora,
  }];
}

function renderMatch(pairing, { roundKey, campeao, serieBIds, ccEliminadosIds, clubesById }) {
  const isFinal = roundKey === 'final';
  const isRound32 = roundKey === '16avos';
  const el = document.createElement('div');
  el.className = 'cb-match';
  if (isFinal) el.classList.add('cb-match--final');
  if (isFinal && pairing.vencedorId === campeao) el.classList.add('cb-match--campeao');
  el.dataset.vencedor = pairing.vencedorId ?? '';

  const legs = legsFor(pairing);

  for (const side of ['casa', 'fora']) {
    const row = document.createElement('div');
    row.className = `cb-match__row cb-match__row--${side}`;
    const teamId = pairing[`${side}Id`];
    if (pairing.vencedorId === teamId) row.classList.add('cb-match__row--vencedor');
    if (isRound32 && ccEliminadosIds?.has(teamId)) row.classList.add('cb-match__row--from-cc');

    const nameEl = document.createElement('span');
    nameEl.className = 'cb-match__team';
    if (serieBIds.has(teamId)) nameEl.classList.add('cb-match__team--placeholder');
    nameEl.textContent = nameOf(teamId, clubesById);
    row.appendChild(nameEl);

    const scoresWrap = document.createElement('span');
    scoresWrap.className = 'cb-match__scores';
    for (const leg of legs) {
      const scoreEl = document.createElement('span');
      scoreEl.className = 'cb-match__score';
      const teamGoals = teamId === leg.casaId ? leg.golsCasa : leg.golsFora;
      scoreEl.textContent = String(teamGoals);
      scoresWrap.appendChild(scoreEl);
    }
    row.appendChild(scoresWrap);

    el.appendChild(row);
  }
  return el;
}

export function renderCbBracket({ matamata, serieBIds, ccEliminadosIds, clubesById }) {
  const frag = document.createDocumentFragment();

  const bracket = document.createElement('div');
  bracket.className = 'cb-bracket';
  for (const [key, label] of ROUND_LABELS) {
    const round = document.createElement('div');
    round.className = 'cb-bracket__round';
    const h = document.createElement('h3');
    h.className = 'cb-bracket__round-title';
    h.textContent = label;
    round.appendChild(h);
    const matches = key === 'final' ? [matamata.final] : matamata[key];
    for (const m of matches) {
      round.appendChild(renderMatch(m, {
        roundKey: key,
        campeao: matamata.campeao,
        serieBIds,
        ccEliminadosIds,
        clubesById,
      }));
    }
    bracket.appendChild(round);
  }
  frag.appendChild(bracket);

  const legend = document.createElement('div');
  legend.className = 'cb-legend';
  const items = document.createElement('ul');
  items.className = 'cb-legend__items';
  for (const [modifier, label] of [
    ['from-cc',  'Vem eliminado do 16-avos da Copa dos Campeões'],
    ['serie-b',  'Clube da Série B'],
  ]) {
    const li = document.createElement('li');
    const swatch = document.createElement('span');
    swatch.className = `cb-legend__swatch cb-legend__swatch--${modifier}`;
    li.appendChild(swatch);
    li.appendChild(document.createTextNode(label));
    items.appendChild(li);
  }
  legend.appendChild(items);
  const foot = document.createElement('div');
  foot.className = 'cb-legend__foot';
  const note = document.createElement('p');
  note.className = 'cb-legend__note';
  note.textContent = 'Simulamos apenas do 16-avos em diante.';
  foot.appendChild(note);
  const link = document.createElement('a');
  link.className = 'cb-legend__link';
  link.href = 'copa';
  link.textContent = 'ver detalhes em /copa ↗';
  foot.appendChild(link);
  legend.appendChild(foot);
  frag.appendChild(legend);

  return frag;
}
