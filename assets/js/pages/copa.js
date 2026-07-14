const REG = { NE: 'Nordestina', SP: 'Paulista', CE: 'Central', SUL: 'Sulista', RJ: 'Rio-Capixaba', AM: 'Amazônica' };

const TABS = [
  { key: 'campeoes', label: 'Copa dos Campeões' },
  { key: 'brasil',   label: 'Copa do Brasil' },
  { key: 'conmebol', label: 'Vagas Conmebol' },
];

const QUOTAS = [
  { liga: 'Liga Nordestina',   vagas: 10 },
  { liga: 'Liga Paulista',     vagas: 10 },
  { liga: 'Liga Central',      vagas: 8  },
  { liga: 'Liga Sulista',      vagas: 8  },
  { liga: 'Liga Rio-Capixaba', vagas: 8  },
  { liga: 'Liga Amazônica',    vagas: 4  },
];

const POTES = [
  { id: 1, label: 'Pote 1 · Gigantes',    corte: '1 clube da Amazônica, 2 de cada demais região, e 1 extra sorteado entre Nordestina e Paulista.' },
  { id: 2, label: 'Pote 2 · Elite forte', corte: 'Mesma regra do Pote 1 — o extra é sorteado a cada ano.' },
  { id: 3, label: 'Pote 3 · Meio-alto',   corte: 'Mesma regra.' },
  { id: 4, label: 'Pote 4 · Ascendentes', corte: 'Mesma regra. Ao final dos 4 potes, Nordestina e Paulista terão 2 extras cada (10 vagas totais).' },
];

const GROUPS = [
  { id: 'A', slots: [[1, 'Amazonas FC', 'AM'], [2, 'Corinthians', 'SP'], [3, 'CRB', 'NE'], [4, 'Bangu', 'RJ']] },
  { id: 'B', slots: [[1, 'Bahia', 'NE'], [2, 'Paysandu', 'AM'], [3, 'Mirassol', 'SP'], [4, 'Athletic Club', 'CE']] },
  { id: 'C', slots: [[1, 'Palmeiras', 'SP'], [2, 'Fluminense', 'RJ'], [3, 'Remo', 'AM'], [4, 'Botafogo-PB', 'NE']] },
  { id: 'D', slots: [[1, 'Botafogo', 'RJ'], [2, 'Sport Recife', 'NE'], [3, 'América-MG', 'CE'], [4, 'Manaus FC', 'AM']] },
  { id: 'E', slots: [[1, 'Atlético-MG', 'CE'], [2, 'Internacional', 'SUL'], [3, 'ABC', 'NE'], [4, 'Guarani', 'SP']] },
  { id: 'F', slots: [[1, 'Cruzeiro', 'CE'], [2, 'Criciúma', 'SUL'], [3, 'América-RN', 'NE'], [4, 'Ituano', 'SP']] },
  { id: 'G', slots: [[1, 'Flamengo', 'RJ'], [2, 'Vitória', 'NE'], [3, 'Juventude', 'SUL'], [4, 'Ponte Preta', 'SP']] },
  { id: 'H', slots: [[1, 'Athletico-Paranaense', 'SUL'], [2, 'Atlético-GO', 'CE'], [3, 'Novorizontino', 'SP'], [4, 'Boavista', 'RJ']] },
  { id: 'I', slots: [[1, 'Grêmio', 'SUL'], [2, 'Red Bull Bragantino', 'SP'], [3, 'Nova Iguaçu', 'RJ'], [4, 'CSA', 'NE']] },
  { id: 'J', slots: [[1, 'Fortaleza', 'NE'], [2, 'Vasco da Gama', 'RJ'], [3, 'Goiás', 'CE'], [4, 'Maringá', 'SUL']] },
  { id: 'K', slots: [[1, 'São Paulo', 'SP'], [2, 'Cuiabá', 'CE'], [3, 'Volta Redonda', 'RJ'], [4, 'Avaí', 'SUL']] },
  { id: 'L', slots: [[1, 'Ceará', 'NE'], [2, 'Santos', 'SP'], [3, 'Coritiba', 'SUL'], [4, 'Vila Nova-GO', 'CE']] },
];

const CROSS_ROUNDS = [
  { title: 'Rodada 1 · Grupo A × Grupo B', matches: [[1, 'Amazonas FC', 'Bahia'], [2, 'Corinthians', 'Paysandu'], [3, 'CRB', 'Mirassol'], [4, 'Bangu', 'Athletic Club']] },
  { title: 'Rodada 2 · Grupo A × Grupo C', matches: [[1, 'Amazonas FC', 'Palmeiras'], [2, 'Corinthians', 'Fluminense'], [3, 'CRB', 'Remo'], [4, 'Bangu', 'Botafogo-PB']] },
  { title: 'Rodada 3 · Grupo A × Grupo D', matches: [[1, 'Amazonas FC', 'Botafogo'], [2, 'Corinthians', 'Sport Recife'], [3, 'CRB', 'América-MG'], [4, 'Bangu', 'Manaus FC']] },
];

const CC_KO = [
  { rodada: '16-avos', clubes: 32, formato: 'Ida e volta', detalhe: '2 melhores de cada grupo + 8 melhores 3ºs colocados.' },
  { rodada: 'Oitavas', clubes: 16, formato: 'Ida e volta', detalhe: '' },
  { rodada: 'Quartas', clubes: 8,  formato: 'Ida e volta', detalhe: '' },
  { rodada: 'Semis',   clubes: 4,  formato: 'Ida e volta', detalhe: '' },
  { rodada: 'Final',   clubes: 2,  formato: 'Jogo único',  detalhe: 'Sábado 7 dez — o último jogo da temporada brasileira.' },
];

const CB_KO = [
  { rodada: '16-avos', clubes: 32, formato: 'Ida e volta', detalhe: '' },
  { rodada: 'Oitavas', clubes: 16, formato: 'Ida e volta', detalhe: '' },
  { rodada: 'Quartas', clubes: 8,  formato: 'Ida e volta', detalhe: '' },
  { rodada: 'Semis',   clubes: 4,  formato: 'Ida e volta', detalhe: '' },
  { rodada: 'Final',   clubes: 2,  formato: 'Jogo único',  detalhe: 'Sábado 9 nov — encerra o ciclo dos mata-matas nacionais antes das finais continentais.' },
];

const CB_PHASES = [
  {
    fase: 'Preliminar',
    parts: [{ kind: 'serieb', count: 108 }],
    origem: 'Todos os 108 clubes da Série B começam a caminhada.',
  },
  {
    fase: '1ª Fase',
    parts: [
      { kind: 'survivor', count: 54 },
      { kind: 'seriea',   count: 95 },
      { kind: 'serieb',   count: 1, star: true },
    ],
    origem: '54 vencedores da Preliminar + os 95 clubes da Série A que não disputam competições internacionais + o vice-líder da Série B, que entra direto.',
  },
  {
    fase: '2ª Fase',
    parts: [
      { kind: 'survivor', count: 75 },
      { kind: 'serieb',   count: 1, star: true },
    ],
    origem: '75 vencedores da 1ª Fase + o líder da Série B do ano anterior, que só estreia agora.',
  },
  {
    fase: '3ª Fase',
    parts: [{ kind: 'survivor', count: 38 }],
    origem: '38 sobreviventes da 2ª Fase. Todos jogam.',
  },
  {
    fase: '16-avos',
    parts: [
      { kind: 'survivor', count: 19 },
      { kind: 'conmebol', count: 13 },
    ],
    origem: '19 sobreviventes se encontram com os 13 clubes vindos da Libertadores e da Sul-Americana.',
  },
];

const LIBERTADORES = [
  { pos: 1, origem: 'Campeão da Copa dos Campeões' },
  { pos: 2, origem: 'Vice-campeão da Copa dos Campeões' },
  { pos: 3, origem: 'Campeão da Copa do Brasil' },
  { pos: 4, origem: 'Semifinalista da Copa dos Campeões' },
  { pos: 5, origem: 'Semifinalista da Copa dos Campeões' },
  { pos: 6, origem: 'Vice-campeão da Copa do Brasil' },
  { pos: 7, origem: 'Próximo melhor colocado na Copa dos Campeões.' },
];

const tabsEl   = document.getElementById('copa-tabs');
const contentEl = document.getElementById('copa-detalhe');
let sel = 'campeoes';

function renderTabs() {
  tabsEl.innerHTML = TABS.map((t) => `
    <button type="button" role="tab" data-key="${t.key}"
      id="copa-tab-${t.key}" aria-controls="copa-detalhe"
      tabindex="${t.key === sel ? '0' : '-1'}"
      class="cop-tab" aria-selected="${t.key === sel}">${t.label}</button>
  `).join('');
  contentEl.setAttribute('role', 'tabpanel');
  contentEl.setAttribute('tabindex', '0');
  contentEl.setAttribute('aria-labelledby', `copa-tab-${sel}`);
}

function renderCampeoes() {
  const groupsHtml = GROUPS.map((g) => `
    <article class="cop-group">
      <div class="cop-group__head">Grupo ${g.id}</div>
      <ul class="cop-group__list">
        ${g.slots.map(([pote, clube, reg]) => `
          <li class="cop-group__slot">
            <span class="cop-pote-badge" data-pote="${pote}">P${pote}</span>
            <span class="cop-group__club">
              <span class="cop-group__club-name">${clube}</span>
              <span class="cop-group__club-reg">${REG[reg]}</span>
            </span>
          </li>
        `).join('')}
      </ul>
    </article>
  `).join('');

  const crossHtml = CROSS_ROUNDS.map((cr) => `
    <article class="cop-cross-card">
      <div class="cop-cross-card__head">${cr.title}</div>
      <ul>
        ${cr.matches.map(([pote, a, b]) => `
          <li>
            <span class="cop-pote-badge cop-pote-badge--sm" data-pote="${pote}">P${pote}</span>
            <span><strong>${a}</strong> <span class="cop-cross-x">×</span> <strong>${b}</strong></span>
          </li>
        `).join('')}
      </ul>
    </article>
  `).join('');

  const koHtml = CC_KO.map((r, i) => `
    <div class="cop-ko-row${i === CC_KO.length - 1 ? ' cop-ko-row--final' : ''}">
      <span class="cop-ko-row__rodada">${r.rodada}</span>
      <span class="cop-ko-row__format">${r.clubes} clubes · ${r.formato}</span>
      <span class="cop-ko-row__detail">${r.detalhe}</span>
    </div>
  `).join('');

  contentEl.innerHTML = `
    <div class="cop-panel">
      <div>
        <h2 class="cop-h2">48 clubes, 12 grupos, 4 potes</h2>
        <p class="cop-lede">
          A Copa dos Campeões é o campeonato nacional da proposta — 48 clubes das 6 ligas regionais decidem o título brasileiro <strong>em formato de Libertadores</strong>. As vagas de cada região são proporcionais ao seu tamanho.
        </p>
      </div>

      <div>
        <p class="cop-eyebrow">Vagas por região</p>
        <div class="cop-quotas">
          ${QUOTAS.map((q) => `
            <div class="cop-quota">
              <div class="cop-quota__label">${q.liga}</div>
              <div class="cop-quota__value">${q.vagas}</div>
            </div>
          `).join('')}
          <div class="cop-quota cop-quota--total">
            <div class="cop-quota__label">Total</div>
            <div class="cop-quota__value">48</div>
          </div>
        </div>
      </div>

      <div>
        <h3 class="cop-h3">Sorteio em 4 potes</h3>
        <p class="cop-p">
          Os 48 clubes se dividem em 4 potes de 12, semeados pelo ranking regional do ano anterior. O sorteio distribui 1 clube de cada pote em cada um dos 12 grupos.
        </p>
        <p class="cop-p" style="margin-block-end:1.75rem;">
          <strong>Bloqueio regional:</strong> nenhum grupo pode ter mais de um clube da mesma região. Cada grupo é, por construção, um recorte do país inteiro — 4 clubes, 4 regiões diferentes.
        </p>
        <div class="cop-potes">
          ${POTES.map((p) => `
            <article class="cop-pote cop-pote--p${p.id}">
              <h4 class="cop-h4">${p.label}</h4>
              <p class="cop-pote__corte">${p.corte}</p>
            </article>
          `).join('')}
        </div>
      </div>

      <div>
        <h3 class="cop-h3">Um sorteio possível</h3>
        <p class="cop-p">
          Exemplo ilustrativo com o ranking real de 2024: 12 grupos, cada um com 1 clube por pote e <strong>4 regiões diferentes</strong>. Amazonas FC representa o Norte no Pote 1, Paysandu no Pote 2, Remo no Pote 3 e Manaus FC no Pote 4 — o Norte aparece em <strong>cada pote</strong> do torneio, não só no topo.
        </p>
        <p class="cop-p" style="margin-block-end:1.75rem;">
          Neste sorteio (um entre vários possíveis), a Nordestina recebeu o extra nos Potes 1 e 3, e a Paulista nos Potes 2 e 4. A distribuição dos extras é <strong>sorteada a cada ano</strong>, garantindo 2 extras para cada região ao longo dos 4 potes.
        </p>
        <div class="cop-groups">${groupsHtml}</div>
      </div>

      <div>
        <h3 class="cop-h3">Fase de grupos: 3 do grupo + 3 cruzados</h3>
        <p class="cop-p" style="margin-block-end:1.5rem;">
          Cada clube joga <strong>6 partidas</strong>: 3 contra os adversários do próprio grupo e <strong>3 partidas cruzadas</strong> contra clubes de outros grupos — sempre dentro do mesmo pote. Todas contam para a classificação do grupo.
        </p>
        <details class="cop-why">
          <summary>Por que as cruzadas ficam dentro do mesmo pote?</summary>
          <div class="cop-why__body">
            <p>Assim, cada pote joga um mini-torneio equilibrado entre clubes de força parecida — Pote 1 tem seus clássicos entre gigantes, Pote 4 tem sua liga entre iguais. A expectativa em qualquer pote é <strong>~4,5 pontos em 3 jogos cruzados</strong> (empate estatístico entre pares), então as cruzadas são neutras para todos.</p>
            <p>A diferença de nível entre os potes fica reservada aos <strong>jogos do próprio grupo</strong>, onde a semeadura da temporada anterior é que faz diferença.</p>
          </div>
        </details>
      </div>

      <div>
        <h3 class="cop-h3">Exemplo: as cruzadas do Grupo A</h3>
        <p class="cop-p" style="margin-block-end:1.75rem;">
          As 3 partidas cruzadas de cada clube do Grupo A. Em cada rodada, o Grupo A enfrenta outro grupo inteiro — os 4 clubes de um lado jogam contra os 4 do outro, pote contra pote.
        </p>
        <div class="cop-cross">${crossHtml}</div>
        <p class="cop-p">
          Amazonas FC (Pote 1, único clube do Norte no topo) enfrenta Bahia, Palmeiras e Botafogo — três dos maiores do país. Bangu (Pote 4) enfrenta Athletic Club, Botafogo-PB e Manaus FC — clubes de força equivalente. Cada clube cruza só com clubes do próprio pote, nunca com potes diferentes.
        </p>
      </div>

      <div>
        <h3 class="cop-h3">Mata-mata: 32 → 1</h3>
        <div class="cop-ko">${koHtml}</div>
      </div>
    </div>
  `;
}

function renderBrasil() {
  const KIND_LABEL = {
    survivor: 'Sobrevivente',
    seriea:   'Série A',
    serieb:   'Série B',
    conmebol: 'Vindo da Conmebol',
  };

  const phasesHtml = CB_PHASES.map((ph) => {
    const total = ph.parts.reduce((s, p) => s + p.count, 0);
    const legendParts = ph.parts.filter((p) => p.count > 0).map((p) => {
      const star = p.star ? ' cb-square--star' : '';
      return `
        <span class="cb-legend__item">
          <span class="cb-square cb-square--${p.kind}${star}" aria-hidden="true"></span>
          ${p.count} ${KIND_LABEL[p.kind]}${p.star ? ' · entrada direta' : ''}
        </span>
      `;
    }).join('');

    const squares = ph.parts.flatMap((p) => {
      if (!p.count) return [];
      const star = p.star ? ' cb-square--star' : '';
      return Array.from({ length: p.count }, () =>
        `<span class="cb-square cb-square--${p.kind}${star}" aria-hidden="true"></span>`
      );
    }).join('');

    return `
      <section class="cb-phase">
        <div class="cb-phase__head">
          <span class="cb-phase__label">${ph.fase}</span>
          <span class="cb-phase__meta">${total} clubes</span>
        </div>
        <div class="cb-phase__legend">${legendParts}</div>
        <div class="cb-phase__grid">${squares}</div>
        <p class="cb-phase__origem">${ph.origem}</p>
      </section>
    `;
  }).join('');

  const koHtml = CB_KO.map((r, i) => `
    <div class="cop-ko-row${i === CB_KO.length - 1 ? ' cop-ko-row--final' : ''}">
      <span class="cop-ko-row__rodada">${r.rodada}</span>
      <span class="cop-ko-row__format">${r.clubes} clubes · ${r.formato}</span>
      <span class="cop-ko-row__detail">${r.detalhe}</span>
    </div>
  `).join('');

  contentEl.innerHTML = `
    <div class="cop-panel">
      <div>
        <h2 class="cop-h2">216 clubes, da base ao topo</h2>
        <p class="cop-lede">
          A copa aberta a todos: <strong>os 216 clubes profissionais</strong> disputam — Série A e Série B das 6 ligas regionais. É o único torneio em que Palmeiras e um clube da base podem se cruzar oficialmente.
        </p>
      </div>

      <div>
        <h3 class="cop-h3">Rodada a rodada</h3>
        <p class="cop-p" style="margin-block-end:1.75rem;">
          Cada quadrado é um clube. A Série B começa sozinha, a Série A entra na 1ª Fase, e os clubes vindos da Conmebol chegam no 16-avos.
        </p>
        <div class="cb-phases">${phasesHtml}</div>
      </div>

      <div>
        <h3 class="cop-h3">Vagas Conmebol: 13 clubes direto ao 16-avos</h3>
        <p class="cop-p">
          Os <strong>13 clubes da Série A que disputaram Conmebol no ano anterior</strong> — 7 da Libertadores e 6 da Sul-Americana — entram direto no <strong>16-avos</strong>. Três razões: não atropelar clubes da base nas rodadas iniciais, reservar o mata-mata pesado para quando as diferenças de nível pesam de verdade, e aliviar o calendário de quem já teve semana dobrada por meses.
        </p>
      </div>

      <div class="cop-byes">
        <h3 class="cop-h3">A Série B tem entradas premiadas</h3>
        <p>
          Os dois melhores da Série B do ano anterior pulam rodadas iniciais. O <strong>vice-líder</strong> estreia direto na 1ª Fase; o <strong>líder</strong> só entra na 2ª Fase. As estrelas nos quadrados marcam essas entradas.
        </p>
        <p>
          É um incentivo estrutural: subir alguns lugares no ranking da Série B rende um caminho mais curto na Copa do Brasil da próxima temporada. A Série B fica disputada até o último jogo — não só pelo acesso à Série A, mas por essas entradas.
        </p>
      </div>

      <div>
        <h3 class="cop-h3">Mata-mata: 32 → 1</h3>
        <div class="cop-ko">${koHtml}</div>
      </div>
    </div>
  `;
}

function renderConmebol() {
  const libHtml = LIBERTADORES.map((o) => `
    <li>
      <span class="cop-vaga-list__pos">${o.pos}</span>
      <span class="cop-vaga-list__origem">${o.origem}</span>
    </li>
  `).join('');

  const sulHtml = QUOTAS.map((q, i) => `
    <li>
      <span class="cop-vaga-list__pos">${i + 1}</span>
      <span class="cop-vaga-list__origem">Melhor clube da ${q.liga} não classificado à Libertadores</span>
    </li>
  `).join('');

  contentEl.innerHTML = `
    <div class="cop-panel">
      <div>
        <h2 class="cop-h2">Vagas Conmebol</h2>
        <p class="cop-lede">
          Onde a temporada nacional se conecta com o continental. As 7 vagas da Libertadores saem do desempenho nas copas nacionais; as 6 vagas da Sul-Americana saem das ligas regionais, uma por região.
        </p>
      </div>

      <div class="cop-conmebol">
        <section>
          <h3 class="cop-vaga-list__title">Libertadores</h3>
          <p class="cop-vaga-list__sub">Vagas pelas copas nacionais</p>
          <ol class="cop-vaga-list cop-vaga-list--lib">${libHtml}</ol>
        </section>
        <section>
          <h3 class="cop-vaga-list__title">Sul-Americana</h3>
          <p class="cop-vaga-list__sub">Vagas pelas ligas regionais</p>
          <ol class="cop-vaga-list cop-vaga-list--sul">${sulHtml}</ol>
        </section>
      </div>
    </div>
  `;
}

function render() {
  if      (sel === 'campeoes') renderCampeoes();
  else if (sel === 'brasil')   renderBrasil();
  else                          renderConmebol();
}

function activate(key, { focus = false } = {}) {
  sel = key;
  renderTabs();
  render();
  const url = new URL(location.href);
  url.searchParams.set('t', sel);
  history.replaceState(null, '', url);
  if (focus) tabsEl.querySelector(`[data-key="${key}"]`)?.focus();
}

tabsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.cop-tab');
  if (!btn) return;
  activate(btn.dataset.key);
});

tabsEl.addEventListener('keydown', (e) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
  const keys = TABS.map((t) => t.key);
  const idx = keys.indexOf(sel);
  let next = idx;
  if (e.key === 'ArrowLeft')  next = (idx - 1 + keys.length) % keys.length;
  if (e.key === 'ArrowRight') next = (idx + 1) % keys.length;
  if (e.key === 'Home')       next = 0;
  if (e.key === 'End')        next = keys.length - 1;
  e.preventDefault();
  activate(keys[next], { focus: true });
});

const initial = new URLSearchParams(location.search).get('t');
if (initial && TABS.some((t) => t.key === initial)) sel = initial;

renderTabs();
render();
