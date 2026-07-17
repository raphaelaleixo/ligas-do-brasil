// Renderiza o mata-mata da Copa dos Campeões — bracket horizontal com 5 colunas
// (16avos → oitavas → quartas → semis → final). Cada confronto mostra placar;
// campeão destacado com halo.

const ROUND_LABELS = [
  ['16avos', '16-avos'],
  ['oitavas', 'Oitavas'],
  ['quartas', 'Quartas'],
  ['semis', 'Semis'],
  ['final', 'Final'],
];

function renderMatch(m, { isFinal, campeao }) {
  const el = document.createElement('div');
  el.className = 'cc-match';
  if (isFinal) el.classList.add('cc-match--final');
  if (isFinal && m.vencedorId === campeao) el.classList.add('cc-match--campeao');
  el.dataset.vencedor = m.vencedorId ?? '';

  for (const side of ['casa', 'fora']) {
    const sideEl = document.createElement('div');
    sideEl.className = `cc-match__side cc-match__side--${side}`;
    if (m.vencedorId === m[`${side}Id`]) sideEl.classList.add('cc-match__side--vencedor');
    const nameEl = document.createElement('span');
    nameEl.className = 'cc-match__team';
    nameEl.textContent = m[`${side}Id`];
    const scoreEl = document.createElement('span');
    scoreEl.className = 'cc-match__score';
    scoreEl.textContent = String(m[`gols${side === 'casa' ? 'Casa' : 'Fora'}`]);
    sideEl.appendChild(nameEl);
    sideEl.appendChild(scoreEl);
    el.appendChild(sideEl);
  }
  return el;
}

export function renderCcBracket({ matamata }) {
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
      round.appendChild(renderMatch(m, { isFinal: key === 'final', campeao: matamata.campeao }));
    }
    bracket.appendChild(round);
  }
  frag.appendChild(bracket);
  return frag;
}
