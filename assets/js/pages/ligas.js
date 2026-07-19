import { getAllTeams } from '../../../src/data/teams.js';

// potes = vagas fixas por pote [P1, P2, P3, P4]
// extras = vagas extras rotativas entre {P1,P3} e {P2,P4} (só Nordestina e Paulista)
const LEAGUES = [
  { nome: 'Liga Nordestina',   regiaoPop: '54M', multiplo: '5,4×', quota: 10, potes: [2, 2, 2, 2], extras: 2 },
  { nome: 'Liga Paulista',     regiaoPop: '44M', multiplo: '4,4×', quota: 10, potes: [2, 2, 2, 2], extras: 2 },
  { nome: 'Liga Central',      regiaoPop: '37M', multiplo: '3,7×', quota: 8,  potes: [2, 2, 2, 2], extras: 0 },
  { nome: 'Liga Sulista',      regiaoPop: '30M', multiplo: '3,0×', quota: 8,  potes: [2, 2, 2, 2], extras: 0 },
  { nome: 'Liga Rio-Capixaba', regiaoPop: '20M', multiplo: '2,0×', quota: 8,  potes: [2, 2, 2, 2], extras: 0 },
  { nome: 'Liga Amazônica',    regiaoPop: '17M', multiplo: '1,7×', quota: 4,  potes: [1, 1, 1, 1], extras: 0 },
];

// Cidade-sede de cada clube. Chave = nome exato do clube no data.
// Fonte: melhor esforço; alguns clubes menos conhecidos podem precisar de revisão.
const CITIES = {
  // Liga Paulista
  'Botafogo-SP': 'Ribeirão Preto',
  'Corinthians': 'São Paulo',
  'Ferroviária': 'Araraquara',
  'Guarani': 'Campinas',
  'Inter de Limeira': 'Limeira',
  'Ituano': 'Itu',
  'Mirassol': 'Mirassol',
  'Novorizontino': 'Novo Horizonte',
  'Palmeiras': 'São Paulo',
  'Ponte Preta': 'Campinas',
  'Portuguesa': 'São Paulo',
  'Red Bull Bragantino': 'Bragança Paulista',
  'Santo André': 'Santo André',
  'Santos': 'Santos',
  'São Bernardo': 'São Bernardo do Campo',
  'São Paulo': 'São Paulo',
  'XV de Piracicaba': 'Piracicaba',
  'Água Santa': 'Diadema',

  // Liga Rio-Capixaba
  'America': 'Rio de Janeiro',
  'Americano': 'Campos dos Goytacazes',
  'Audax-RJ': 'Saquarema',
  'Bangu': 'Rio de Janeiro',
  'Boavista': 'Saquarema',
  'Botafogo': 'Rio de Janeiro',
  'Desportiva Ferroviária': 'Cariacica',
  'Flamengo': 'Rio de Janeiro',
  'Fluminense': 'Rio de Janeiro',
  'Friburguense': 'Nova Friburgo',
  'Goytacaz': 'Campos dos Goytacazes',
  'Madureira': 'Rio de Janeiro',
  'Nova Iguaçu': 'Nova Iguaçu',
  'Porto Vitória': 'Vitória',
  'Real Noroeste': 'Águia Branca',
  'Rio Branco-ES': 'Vitória',
  'Vasco da Gama': 'Rio de Janeiro',
  'Volta Redonda': 'Volta Redonda',

  // Liga Nordestina
  'ABC': 'Natal',
  'América-RN': 'Natal',
  'Bahia': 'Salvador',
  'Botafogo-PB': 'João Pessoa',
  'CRB': 'Maceió',
  'CSA': 'Maceió',
  'Ceará': 'Fortaleza',
  'Confiança': 'Aracaju',
  'Fortaleza': 'Fortaleza',
  'Juazeirense': 'Juazeiro',
  'Moto Club': 'São Luís',
  'Náutico': 'Recife',
  'River-PI': 'Teresina',
  'Sampaio Corrêa': 'São Luís',
  'Santa Cruz': 'Recife',
  'Sport Recife': 'Recife',
  'Treze': 'Campina Grande',
  'Vitória': 'Salvador',

  // Liga Sulista
  'Athletico-PR': 'Curitiba',
  'Avaí': 'Florianópolis',
  'Brasil de Pelotas': 'Pelotas',
  'Brusque': 'Brusque',
  'Cascavel': 'Cascavel',
  'Caxias': 'Caxias do Sul',
  'Chapecoense': 'Chapecó',
  'Coritiba': 'Curitiba',
  'Criciúma': 'Criciúma',
  'Figueirense': 'Florianópolis',
  'Grêmio': 'Porto Alegre',
  'Internacional': 'Porto Alegre',
  'Joinville': 'Joinville',
  'Juventude': 'Caxias do Sul',
  'Londrina': 'Londrina',
  'Maringá': 'Maringá',
  'Operário-PR': 'Ponta Grossa',
  'Ypiranga de Erechim': 'Erechim',

  // Liga Central
  'América-MG': 'Belo Horizonte',
  'Anápolis': 'Anápolis',
  'Aparecidense': 'Aparecida de Goiânia',
  'Athletic Club': 'São João del-Rei',
  'Atlético-GO': 'Goiânia',
  'Atlético-MG': 'Belo Horizonte',
  'Brasiliense': 'Taguatinga',
  'Cruzeiro': 'Belo Horizonte',
  'Cuiabá': 'Cuiabá',
  'Gama': 'Brasília',
  'Goiás': 'Goiânia',
  'Ipatinga': 'Ipatinga',
  'Luverdense': 'Lucas do Rio Verde',
  'Operário-MS': 'Campo Grande',
  'Tombense': 'Tombos',
  'Uberlândia': 'Uberlândia',
  'Vila Nova-GO': 'Goiânia',
  'Villa Nova-MG': 'Nova Lima',

  // Liga Amazônica
  'Amazonas FC': 'Manaus',
  'Capital-TO': 'Palmas',
  'Castanhal': 'Castanhal',
  'Galvez': 'Rio Branco',
  'Manaus FC': 'Manaus',
  'Nacional-AM': 'Manaus',
  'Paysandu': 'Belém',
  'Porto Velho': 'Porto Velho',
  'Real Ariquemes': 'Ariquemes',
  'Remo': 'Belém',
  'Rio Branco-AC': 'Rio Branco',
  'São Raimundo-AM': 'Manaus',
  'São Raimundo-RR': 'Boa Vista',
  'Tocantinópolis': 'Tocantinópolis',
  'Trem': 'Macapá',
  'Tuna Luso': 'Belém',
  'Ypiranga-AP': 'Macapá',
  'Águia de Marabá': 'Marabá',
};

function slug(nome) {
  return nome.toLowerCase().replace(/\W+/g, '-').replace(/^-|-$/g, '');
}

const tabsEl    = document.getElementById('ligas-tabs');
const nameEl    = document.getElementById('lig-name');
const rowsEl    = document.getElementById('lig-rows');
const clubsEl   = document.getElementById('lig-clubs-wrap');
const metaEl    = document.getElementById('lig-meta');

let sel = 0;

function renderTabs() {
  tabsEl.innerHTML = LEAGUES.map((l, i) => `
    <button type="button" role="tab" data-idx="${i}"
      id="lig-tab-${i}" aria-controls="lig-clubs-wrap"
      tabindex="${i === sel ? '0' : '-1'}"
      class="lig-tab" aria-selected="${i === sel}">${l.nome.replace('Liga ', '')}</button>
  `).join('');
  clubsEl.setAttribute('role', 'tabpanel');
  clubsEl.setAttribute('tabindex', '0');
  clubsEl.setAttribute('aria-labelledby', `lig-tab-${sel}`);
}

function activate(idx, { focus = false } = {}) {
  sel = idx;
  renderTabs();
  renderContent();
  const url = new URL(location.href);
  url.hash = `liga=${slug(LEAGUES[sel].nome)}`;
  history.replaceState(null, '', url);
  if (focus) tabsEl.querySelector(`[data-idx="${idx}"]`)?.focus();
}

tabsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.lig-tab');
  if (!btn) return;
  activate(Number(btn.dataset.idx));
});

tabsEl.addEventListener('keydown', (e) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
  let next = sel;
  if (e.key === 'ArrowLeft')  next = (sel - 1 + LEAGUES.length) % LEAGUES.length;
  if (e.key === 'ArrowRight') next = (sel + 1) % LEAGUES.length;
  if (e.key === 'Home')       next = 0;
  if (e.key === 'End')        next = LEAGUES.length - 1;
  e.preventDefault();
  activate(next, { focus: true });
});

function renderContent() {
  const meta = LEAGUES[sel];
  nameEl.textContent = meta.nome;

  // Meta strip
  metaEl.innerHTML = `
    <div class="lig-meta__block">
      <div class="lig-meta__label">População da região</div>
      <div class="lig-meta__value">${meta.regiaoPop} <span class="lig-meta__unit">habitantes</span></div>
    </div>
    <div class="lig-meta__block">
      <div class="lig-meta__label">Escala europeia</div>
      <div class="lig-meta__value">${meta.multiplo} a população de Portugal</div>
      <div class="lig-meta__hint">País que, sozinho, sustenta uma liga nacional inteira.</div>
    </div>
    <div class="lig-meta__block lig-meta__block--accent">
      <div class="lig-meta__label">Vagas na Copa dos Campeões</div>
      <div class="lig-meta__value">${meta.quota}</div>
    </div>
    <div class="lig-meta__block">
      <div class="lig-meta__label">Vaga na Sul-Americana</div>
      <div class="lig-meta__value">1</div>
      <div class="lig-meta__hint">para o melhor clube não classificado à Libertadores.</div>
    </div>
    <div class="lig-meta__block">
      <div class="lig-meta__label">Série B</div>
      <div class="lig-meta__value">18 <span class="lig-meta__unit">clubes</span></div>
      <div class="lig-meta__hint">Também disputam 34 rodadas em pontos corridos, nos mesmos 10 meses. Um lugar no calendário para cada um.</div>
    </div>
  `;

  // Ordena pelo ranking estrutural do clube — mesma base do sorteio da Copa
  // dos Campeões (potes ordenados por força). Não usa a tabela simulada.
  const clubs = getAllTeams()
    .filter((c) => c.liga_regional === meta.nome && c.divisao === 'A')
    .slice()
    .sort((a, b) => {
      if (b.ranking_forca !== a.ranking_forca) return b.ranking_forca - a.ranking_forca;
      return a.nome.localeCompare(b.nome);
    });

  const quota = meta.quota;
  const total = clubs.length;

  // Cada posição qualificada ganha uma etiqueta de pote.
  //
  // Ligas sem extras (potes=[2,2,2,2] × 4 potes; potes=[1,1,1,1] × 4 potes):
  //   pos → pote determinístico pela ordem cumulativa.
  //
  // Ligas com extras (Nordestina/Paulista com [2,2,2,2] + 2 extras):
  //   Os 2 extras rotacionam entre {P1,P3} e {P2,P4} a cada ano. Ao ordenar
  //   por força, isso deixa duas posições ambíguas:
  //     - pos 3 pode ser P1 (3ª cabeça de chave num ano) ou P2 (1ª de P2 no outro)
  //     - pos 8 pode ser P3 (3ª de P3) ou P4 (1ª de P4)
  //   As demais são fixas: 1-2 sempre P1, 4-5 sempre P2, 6-7 sempre P3, 9-10 sempre P4.
  const potBadge = (pos) => {
    if (pos > quota) return null;
    if (meta.extras === 0) {
      let cursor = 0;
      for (let p = 0; p < 4; p++) {
        cursor += meta.potes[p];
        if (pos <= cursor) return { potes: [p + 1] };
      }
    }
    // Nordestina/Paulista pattern (10 vagas, extras=2)
    if (pos <= 2) return { potes: [1] };
    if (pos === 3) return { potes: [1, 2] };
    if (pos <= 5) return { potes: [2] };
    if (pos <= 7) return { potes: [3] };
    if (pos === 8) return { potes: [3, 4] };
    return { potes: [4] };
  };

  const badgeText = (potes) => {
    if (potes.length === 1) {
      return potes[0] === 1 ? 'Pote 1 · Cabeça de chave' : `Pote ${potes[0]}`;
    }
    return potes.map((p) => `Pote ${p}`).join(' ou ');
  };

  rowsEl.innerHTML = clubs.map((c, i) => {
    const pos = i + 1;
    const zone = pos <= quota ? 'cc' : pos > total - 3 ? 'reb' : '';
    const cidade = CITIES[c.nome];
    const loc = cidade ? `${cidade} · ${c.estado}` : c.estado;
    const badge = potBadge(pos);
    const badgeHtml = !badge ? '' :
      badge.potes.length === 1
        ? `<span class="lig-club__pote" data-pote="${badge.potes[0]}">${badgeText(badge.potes)}</span>`
        : `<span class="lig-club__pote lig-club__pote--rotativo" data-potes="${badge.potes.join('-')}" title="Extra rotativo — muda de pote a cada ano">${badgeText(badge.potes)}</span>`;
    return `
      <li class="lig-club" data-zone="${zone}">
        <span class="lig-club__pos">${pos}</span>
        <span class="lig-club__body">
          <span class="lig-club__name">${c.nome}</span>
          <span class="lig-club__loc">${loc}</span>
        </span>
        ${badgeHtml}
      </li>
    `;
  }).join('');
}

// Initial hash → tab
const hashLiga = new URLSearchParams(location.hash.slice(1)).get('liga');
if (hashLiga) {
  const idx = LEAGUES.findIndex((l) => slug(l.nome) === hashLiga);
  if (idx >= 0) sel = idx;
}

renderTabs();
renderContent();
