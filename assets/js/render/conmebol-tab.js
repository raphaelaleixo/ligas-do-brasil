import { LIBERTADORES } from '../data/copas.js';

function nameOf(id, clubesById) {
  return clubesById?.get(id)?.nome ?? id;
}

function ligaOf(id, clubesById) {
  return clubesById?.get(id)?.liga_regional ?? '';
}

function renderSection(titleText, rows) {
  const section = document.createElement('section');
  section.className = 'cbl-section';
  const head = document.createElement('h3');
  head.className = 'cbl-section__head';
  head.textContent = titleText;
  section.appendChild(head);
  const list = document.createElement('ol');
  list.className = 'cbl-section__list';
  for (const row of rows) {
    const li = document.createElement('li');
    li.className = 'cbl-slot';
    const name = document.createElement('span');
    name.className = 'cbl-slot__name';
    name.textContent = row.nome;
    const origem = document.createElement('span');
    origem.className = 'cbl-slot__origem';
    origem.textContent = row.origem;
    li.appendChild(name);
    li.appendChild(origem);
    list.appendChild(li);
  }
  section.appendChild(list);
  return section;
}

export function renderConmebolTab({ conmebol, clubesById }) {
  const frag = document.createDocumentFragment();
  const wrap = document.createElement('div');
  wrap.className = 'cbl-grid';

  const libRows = conmebol.libertadores.map((id, i) => ({
    nome: nameOf(id, clubesById),
    origem: LIBERTADORES[i]?.origem ?? 'Próximo melhor colocado na Copa dos Campeões.',
  }));
  wrap.appendChild(renderSection('Libertadores', libRows));

  const sulRows = conmebol.sulAmericana.map((id) => ({
    nome: nameOf(id, clubesById),
    origem: `Melhor não-classificado de ${ligaOf(id, clubesById)}`,
  }));
  wrap.appendChild(renderSection('Sul-Americana', sulRows));

  frag.appendChild(wrap);
  return frag;
}
