// Renderiza o mata-mata da Copa dos Campeões — bracket horizontal com 5 colunas
// (16avos → oitavas → quartas → semis → final). Cada confronto é um card branco
// com nomes completos + placares por perna; campeão destacado com halo dourado.

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
  // Backward-compat when a caller passes a bare match record without a legs array.
  return [{
    casaId: pairing.casaId,
    foraId: pairing.foraId,
    golsCasa: pairing.golsCasa,
    golsFora: pairing.golsFora,
  }];
}

function renderMatch(pairing, { roundKey, campeao, clubesById }) {
  const isFinal = roundKey === 'final';
  const isRound32 = roundKey === '16avos';
  const el = document.createElement('div');
  el.className = 'cc-match';
  if (isFinal) el.classList.add('cc-match--final');
  if (isFinal && pairing.vencedorId === campeao) el.classList.add('cc-match--campeao');
  el.dataset.vencedor = pairing.vencedorId ?? '';

  const legs = legsFor(pairing);

  for (const side of ['casa', 'fora']) {
    const row = document.createElement('div');
    row.className = `cc-match__row cc-match__row--${side}`;
    const teamId = pairing[`${side}Id`];
    if (pairing.vencedorId === teamId) row.classList.add('cc-match__row--vencedor');
    else if (isRound32) row.classList.add('cc-match__row--to-cb');

    const nameEl = document.createElement('span');
    nameEl.className = 'cc-match__team';
    nameEl.textContent = nameOf(teamId, clubesById);
    row.appendChild(nameEl);

    const scoresWrap = document.createElement('span');
    scoresWrap.className = 'cc-match__scores';
    for (const leg of legs) {
      const scoreEl = document.createElement('span');
      scoreEl.className = 'cc-match__score';
      const teamGoals = teamId === leg.casaId ? leg.golsCasa : leg.golsFora;
      scoreEl.textContent = String(teamGoals);
      scoresWrap.appendChild(scoreEl);
    }
    row.appendChild(scoresWrap);

    el.appendChild(row);
  }
  return el;
}

export function renderCcBracket({ matamata, clubesById }) {
  const frag = document.createDocumentFragment();
  const bracket = document.createElement('div');
  bracket.className = 'cc-bracket';
  for (const [key, label] of ROUND_LABELS) {
    const round = document.createElement('div');
    round.className = 'cc-bracket__round';
    const h = document.createElement('h3');
    h.className = 'cc-bracket__round-title';
    h.textContent = label;
    round.appendChild(h);
    const matches = key === 'final' ? [matamata.final] : matamata[key];
    for (const m of matches) {
      round.appendChild(renderMatch(m, { roundKey: key, campeao: matamata.campeao, clubesById }));
    }
    bracket.appendChild(round);
  }
  frag.appendChild(bracket);

  const legend = document.createElement('div');
  legend.className = 'cc-legend';
  const items = document.createElement('ul');
  items.className = 'cc-legend__items';
  for (const [modifier, label] of [
    ['advances', 'Classificado à fase eliminatória'],
    ['to-cb',    'Perde no 16-avos e cai para a Copa do Brasil'],
  ]) {
    const li = document.createElement('li');
    const swatch = document.createElement('span');
    swatch.className = `cc-legend__swatch cc-legend__swatch--${modifier}`;
    li.appendChild(swatch);
    li.appendChild(document.createTextNode(label));
    items.appendChild(li);
  }
  legend.appendChild(items);
  const link = document.createElement('a');
  link.className = 'cc-legend__link';
  link.href = 'copa';
  link.textContent = 'ver detalhes em /copa ↗';
  legend.appendChild(link);
  frag.appendChild(legend);

  return frag;
}
