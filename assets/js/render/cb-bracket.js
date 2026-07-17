// Renderiza o mata-mata da Copa do Brasil — bracket horizontal com 5 colunas
// (16avos → oitavas → quartas → semis → final). Cada confronto mostra placar;
// times Série B ganham classe placeholder com itálico/tracejado/tom apagado;
// campeão destacado com halo.

const ROUND_LABELS = [
  ['16avos', '16-avos'],
  ['oitavas', 'Oitavas'],
  ['quartas', 'Quartas'],
  ['semis', 'Semis'],
  ['final', 'Final'],
];

const CONTEXT_LINE =
  '16 clubes vêm da elite (bypass); 16 clubes emergem do funil de 168 clubes ' +
  'Série B + 1 convidado. Chaveamento a partir daqui.';

function renderMatch(m, { isFinal, campeao, serieBIds }) {
  const el = document.createElement('div');
  el.className = 'cb-match';
  if (isFinal) el.classList.add('cb-match--final');
  if (isFinal && m.vencedorId === campeao) el.classList.add('cb-match--campeao');
  el.dataset.vencedor = m.vencedorId ?? '';

  for (const side of ['casa', 'fora']) {
    const sideEl = document.createElement('div');
    sideEl.className = `cb-match__side cb-match__side--${side}`;
    if (m.vencedorId === m[`${side}Id`]) sideEl.classList.add('cb-match__side--vencedor');

    const nameEl = document.createElement('span');
    nameEl.className = 'cb-match__team';
    if (serieBIds.has(m[`${side}Id`])) nameEl.classList.add('cb-match__team--placeholder');
    nameEl.textContent = m[`${side}Id`];

    const scoreEl = document.createElement('span');
    scoreEl.className = 'cb-match__score';
    scoreEl.textContent = String(m[`gols${side === 'casa' ? 'Casa' : 'Fora'}`]);

    sideEl.appendChild(nameEl);
    sideEl.appendChild(scoreEl);
    el.appendChild(sideEl);
  }
  return el;
}

export function renderCbBracket({ matamata, serieBIds }) {
  const frag = document.createDocumentFragment();

  const ctx = document.createElement('p');
  ctx.className = 'cb-bracket__context';
  ctx.textContent = CONTEXT_LINE;
  frag.appendChild(ctx);

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
        isFinal: key === 'final',
        campeao: matamata.campeao,
        serieBIds,
      }));
    }
    bracket.appendChild(round);
  }
  frag.appendChild(bracket);
  return frag;
}
