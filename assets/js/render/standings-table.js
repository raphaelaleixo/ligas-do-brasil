// Renderiza a classificação final de uma divisão. Zonas via classes CSS —
// estilos vivem em ligas.css / simulador.css.
export function renderStandingsTable({ tabela, qualificadosCampeoes, rebaixados, acessos, divisao }) {
  const cc = new Set(qualificadosCampeoes);
  const reb = new Set(rebaixados);
  const acc = new Set(acessos);
  const frag = document.createDocumentFragment();
  const table = document.createElement('table');
  table.className = 'standings-table';

  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>#</th><th></th><th>Clube</th><th>P</th><th>V</th><th>E</th><th>D</th><th>SG</th></tr>';
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (const row of tabela) {
    const tr = document.createElement('tr');
    tr.className = 'standings-row';
    tr.dataset.id = row.id;
    if (cc.has(row.id))  tr.classList.add('standings-row--cc');
    if (reb.has(row.id)) tr.classList.add('standings-row--rebaixado');
    if (acc.has(row.id)) tr.classList.add('standings-row--acesso');

    const cells = [
      String(row.posicao),
      row.id,
      row.nome,
      String(row.pontos),
      String(row.vitorias),
      String(row.empates),
      String(row.derrotas),
      String(row.saldoGols),
    ];
    for (const text of cells) {
      const td = document.createElement('td');
      td.textContent = text;
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  frag.appendChild(table);
  return frag;
}
