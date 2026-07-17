// Renderiza a fase de grupos da Copa dos Campeões — 12 cards, cada um com
// a tabela final. Marca top-2 como direto (verde ✓), 3º dentre os 8 melhores
// como terceiro classificado (verde ⏱), 3º restante como neutro, 4º como
// eliminado.

function idsIn16avos(koRound16) {
  const ids = new Set();
  for (const m of koRound16) {
    ids.add(m.casaId);
    ids.add(m.foraId);
  }
  return ids;
}

export function renderCcGroups({ grupos, koRound16 }) {
  const advanced = idsIn16avos(koRound16);
  const frag = document.createDocumentFragment();
  const grid = document.createElement('div');
  grid.className = 'cc-groups__grid';

  for (const g of grupos) {
    const card = document.createElement('div');
    card.className = 'cc-group';
    card.dataset.id = g.id;

    const h = document.createElement('h3');
    h.className = 'cc-group__title';
    h.textContent = `Grupo ${g.id}`;
    card.appendChild(h);

    const table = document.createElement('table');
    table.className = 'cc-group__table';
    const tbody = document.createElement('tbody');
    for (const [i, row] of g.tabela.entries()) {
      const tr = document.createElement('tr');
      tr.className = 'cc-group__row';
      tr.dataset.id = row.id;

      let zoneClass = '';
      let icon = '';
      if (i < 2) {
        zoneClass = 'cc-group__row--classificado-direto';
        icon = '✓';
      } else if (i === 2 && advanced.has(row.id)) {
        zoneClass = 'cc-group__row--classificado-terceiro';
        icon = '⏱';
      } else if (i === 3) {
        zoneClass = 'cc-group__row--eliminado';
      }
      if (zoneClass) tr.classList.add(zoneClass);

      const cells = [String(i + 1), row.id, row.nome, String(row.pontos), icon];
      for (const text of cells) {
        const td = document.createElement('td');
        td.textContent = text;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    card.appendChild(table);
    grid.appendChild(card);
  }
  frag.appendChild(grid);
  return frag;
}
