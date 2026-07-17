import { renderStandingsTable } from './standings-table.js';

// Ordem canônica dos blocos na aba, conforme spec (memory: page-structure).
const CANONICAL_ORDER = [
  'Liga Paulista',
  'Liga Rio-Capixaba',
  'Liga Central',
  'Liga Sulista',
  'Liga Nordestina',
  'Liga Amazônica',
];

function sortCanonical(ligas) {
  const idx = new Map(CANONICAL_ORDER.map((n, i) => [n, i]));
  return ligas.slice().sort((a, b) => (idx.get(a.nome) ?? 99) - (idx.get(b.nome) ?? 99));
}

export function renderRegionalLeaguesTab({ ligasRegionais }) {
  const frag = document.createDocumentFragment();
  for (const liga of sortCanonical(ligasRegionais)) {
    const block = document.createElement('details');
    block.className = 'lig-block';
    block.open = true;

    const summary = document.createElement('summary');
    summary.className = 'lig-block__summary';
    const title = document.createElement('span');
    title.className = 'lig-block__title';
    title.textContent = liga.nome;
    summary.appendChild(title);
    block.appendChild(summary);

    const grid = document.createElement('div');
    grid.className = 'lig-block__grid';

    for (const divisao of ['A', 'B']) {
      const col = document.createElement('div');
      col.className = 'lig-block__col';
      const h = document.createElement('h3');
      h.className = 'lig-block__col-title';
      h.textContent = `Série ${divisao}`;
      col.appendChild(h);
      col.appendChild(renderStandingsTable({
        tabela: divisao === 'A' ? liga.tabelaA : liga.tabelaB,
        qualificadosCampeoes: liga.qualificadosCampeoes,
        rebaixados: liga.rebaixados,
        acessos: liga.acessos,
        divisao,
      }));
      grid.appendChild(col);
    }

    block.appendChild(grid);
    frag.appendChild(block);
  }
  return frag;
}
