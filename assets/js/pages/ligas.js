import { loadSeason } from '../season.js';
import { wireTabs } from '../components/tabs.js';

const ANALOG = {
  'Liga Paulista': 'Premier League',
  'Liga Nordeste': 'Serie A (Itália)',
  'Liga Mineira/Centro-Oeste': 'La Liga',
  'Liga Guanabara-Capixaba': 'Primeira Liga (Portugal)',
  'Liga Sulista': 'Bundesliga',
  'Liga Norte': 'Eredivisie',
};

const CAMPEOES_QUOTAS = {
  'Liga Nordeste': 10, 'Liga Paulista': 10,
  'Liga Guanabara-Capixaba': 8, 'Liga Sulista': 8, 'Liga Mineira/Centro-Oeste': 8, 'Liga Norte': 4,
};

function slug(nome) { return nome.toLowerCase().replace(/\W+/g, '-').replace(/^-|-$/g, ''); }

function renderTabs(season) {
  const tabsEl = document.getElementById('ligas-tabs');
  tabsEl.innerHTML = season.ligasRegionais.map((l) =>
    `<li><button role="tab" data-key="${slug(l.nome)}" aria-selected="false" tabindex="-1"
      class="ligas__tab">${l.nome}<span class="ligas__tab-sub">${ANALOG[l.nome]}</span></button></li>`
  ).join('');
  tabsEl.setAttribute('role', 'tablist');
}

function renderTable(rows, quota) {
  return `<table class="liga-tabela">
    <caption class="visually-hidden">Classificação da Série ${rows[0].divisao}</caption>
    <thead><tr>
      <th scope="col">#</th><th scope="col">Clube</th>
      <th scope="col">J</th><th scope="col">V</th><th scope="col">E</th><th scope="col">D</th>
      <th scope="col">GP</th><th scope="col">GC</th><th scope="col">SG</th><th scope="col">Pts</th>
    </tr></thead>
    <tbody>
      ${rows.map((r) => {
        let zona = '';
        if (rows[0].divisao === 'A') {
          if (r.posicao <= quota) zona = 'campeoes';
          else if (r.posicao >= rows.length - 2) zona = 'rebaixamento';
        } else {
          if (r.posicao <= 3) zona = 'acesso';
        }
        return `<tr data-zona="${zona}">
          <td>${r.posicao}</td><td><a href="/timeline?clube=${r.id}">${r.nome}</a></td>
          <td>${r.jogos}</td><td>${r.vitorias}</td><td>${r.empates}</td><td>${r.derrotas}</td>
          <td>${r.golsPro}</td><td>${r.golsContra}</td><td>${r.saldoGols}</td><td><strong>${r.pontos}</strong></td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>`;
}

function renderLiga(season, key) {
  const liga = season.ligasRegionais.find((l) => slug(l.nome) === key);
  const el = document.getElementById('liga-detalhe');
  el.className = 'liga-detalhe';
  el.innerHTML = `
    <div class="liga-context">
      <div class="liga-context__analog">Análogo: <strong>${ANALOG[liga.nome]}</strong></div>
      <div class="liga-context__quota">${CAMPEOES_QUOTAS[liga.nome]} vagas na Copa dos Campeões</div>
    </div>
    <section aria-labelledby="serieA-heading">
      <h2 id="serieA-heading">Série A</h2>
      ${renderTable(liga.tabelaA, CAMPEOES_QUOTAS[liga.nome])}
    </section>
    <section aria-labelledby="serieB-heading">
      <h2 id="serieB-heading">Série B</h2>
      ${renderTable(liga.tabelaB)}
    </section>
  `;
  const url = new URL(location.href); url.hash = `liga=${key}`; history.replaceState(null, '', url);
}

const season = await loadSeason();
renderTabs(season);
const tabsEl = document.getElementById('ligas-tabs');
tabsEl.addEventListener('tab-change', (e) => renderLiga(season, e.detail.key));
const hashKey = new URLSearchParams(location.hash.slice(1)).get('liga');
const defaultKey = hashKey ?? slug(season.ligasRegionais[0].nome);
wireTabs(tabsEl, { defaultKey });
