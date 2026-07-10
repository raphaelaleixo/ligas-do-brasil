const REG = { NE: 'Nordestina', SP: 'Paulista', CE: 'Central', SUL: 'Sulista', RJ: 'Rio-Capixaba', AM: 'Amazônica' };

const TABS = [
  { key: 'campeoes', label: 'Copa dos Campeões' },
  { key: 'brasil',   label: 'Copa do Brasil' },
  { key: 'conmebol', label: 'Vagas Conmebol' },
];

const QUOTAS = [
  { liga: 'Liga Nordestina',   vagas: 10, flag: '🇮🇹' },
  { liga: 'Liga Paulista',     vagas: 10, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { liga: 'Liga Central',      vagas: 8,  flag: '🇪🇸' },
  { liga: 'Liga Sulista',      vagas: 8,  flag: '🇺🇦' },
  { liga: 'Liga Rio-Capixaba', vagas: 8,  flag: '🇳🇱' },
  { liga: 'Liga Amazônica',    vagas: 4,  flag: '🇵🇹' },
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
  { rodada: '16-avos', clubes: 32, formato: 'Ida e volta', detalhe: '19 sobreviventes do funil + 13 clubes das competições Conmebol (7 Libertadores + 6 Sul-Americana).' },
  { rodada: 'Oitavas', clubes: 16, formato: 'Ida e volta', detalhe: '' },
  { rodada: 'Quartas', clubes: 8,  formato: 'Ida e volta', detalhe: '' },
  { rodada: 'Semis',   clubes: 4,  formato: 'Ida e volta', detalhe: '' },
  { rodada: 'Final',   clubes: 2,  formato: 'Ida e volta', detalhe: 'Sábado 9 nov — encerra o ciclo dos mata-matas nacionais antes das finais continentais.' },
];

const FUNNEL = [
  { fase: 'Preliminar', entram: 108, saem: 55, byes: 2, origem: 'Todos os 108 clubes da Série B. Byes para o top-1 e top-2 do ranking Série B do ano anterior.' },
  { fase: '1ª Fase',    entram: 150, saem: 75, byes: 1, origem: '55 sobreviventes + 95 clubes da Série A. Bye para o top-1 Série B.' },
  { fase: '2ª Fase',    entram: 75,  saem: 38, byes: 1, origem: '75 sobreviventes. Bye para o top-1 Série B.' },
  { fase: '3ª Fase',    entram: 38,  saem: 19, byes: 0, origem: '38 sobreviventes. Sem byes — todos jogam.' },
];

const LIBERTADORES = [
  { pos: 1, origem: 'Campeão da Copa dos Campeões' },
  { pos: 2, origem: 'Vice-campeão da Copa dos Campeões' },
  { pos: 3, origem: 'Campeão da Copa do Brasil' },
  { pos: 4, origem: 'Semifinalista da Copa dos Campeões' },
  { pos: 5, origem: 'Semifinalista da Copa dos Campeões' },
  { pos: 6, origem: 'Vice-campeão da Copa do Brasil' },
  { pos: 7, origem: 'Melhor campanha geral (G7) — cascata quando os slots acima estão vagos.' },
];

const tabsEl   = document.getElementById('copa-tabs');
const contentEl = document.getElementById('copa-detalhe');
let sel = 'campeoes';

function renderTabs() {
  tabsEl.innerHTML = TABS.map((t) => `
    <button type="button" role="tab" data-key="${t.key}"
      class="cop-tab" aria-selected="${t.key === sel}">${t.label}</button>
  `).join('');
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
          A Copa dos Campeões Regionais é o campeonato nacional da proposta — o Brasileirão <strong>em formato de Libertadores</strong>. Reúne os melhores clubes das 6 ligas regionais, com quota proporcional ao tamanho de cada região.
        </p>
      </div>

      <div>
        <p class="cop-eyebrow">Vagas por região</p>
        <div class="cop-quotas">
          ${QUOTAS.map((q) => `
            <div class="cop-quota">
              <div class="cop-quota__label"><span aria-hidden="true">${q.flag}</span>${q.liga}</div>
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
        <h3 class="cop-h3">Sorteio em 4 potes (formato FIFA)</h3>
        <p class="cop-p">
          Os 48 clubes vão a 4 potes de 12 com base no ranking regional do ano anterior. O sorteio distribui 1 clube de cada pote em cada um dos 12 grupos.
        </p>
        <p class="cop-p" style="margin-block-end:1.75rem;">
          <strong>Geo-lock:</strong> nenhum grupo pode ter mais de um clube da mesma região. Cada grupo é obrigatoriamente uma mini-Copa do Brasil — 4 clubes, 4 regiões diferentes.
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
          Exemplo ilustrativo com o ranking real de 2024: 12 grupos, cada um com 1 clube por pote e <strong>4 regiões diferentes</strong>. Amazonas FC representa o Norte no Pote 1, Paysandu no Pote 2, Remo no Pote 3 e Manaus FC no Pote 4 — o Norte aparece em <strong>cada tier</strong> do torneio, não só no topo.
        </p>
        <p class="cop-p" style="margin-block-end:1.75rem;">
          Neste sorteio (um entre vários possíveis), a Nordestina recebeu o extra nos Potes 1 e 3, e a Paulista nos Potes 2 e 4. A distribuição dos extras é <strong>sorteada a cada ano</strong>, garantindo 2 extras para cada região ao longo dos 4 potes.
        </p>
        <div class="cop-groups">${groupsHtml}</div>
      </div>

      <div>
        <h3 class="cop-h3">Fase de grupos: 6 jogos cross-pot</h3>
        <p class="cop-p" style="margin-block-end:1.5rem;">
          Cada clube joga <strong>6 partidas</strong>: 3 contra os adversários do próprio grupo e <strong>3 partidas cruzadas</strong> contra clubes do mesmo pote em outros grupos. Todas contam para a classificação do grupo.
        </p>
        <details class="cop-why">
          <summary>Por que as cruzadas são intra-pote?</summary>
          <div class="cop-why__body">
            <p>Assim, cada pote joga um mini-torneio balanceado contra clubes de força equivalente — Pote 1 tem seus clássicos entre gigantes, Pote 4 tem sua liga entre iguais. A expectativa em qualquer pote é <strong>~4,5 pontos em 3 jogos cruzados</strong> (empate estatístico entre pares), então as cruzadas são neutras para todos.</p>
            <p>A diferença de nível entre os potes fica reservada aos <strong>jogos do próprio grupo</strong>, onde a semeadura da temporada anterior efetivamente pesa.</p>
          </div>
        </details>
      </div>

      <div>
        <h3 class="cop-h3">Exemplo: cross-pot do Grupo A</h3>
        <p class="cop-p" style="margin-block-end:1.75rem;">
          As 3 partidas cruzadas de cada clube do Grupo A. Cada rodada, o Grupo A enfrenta um outro grupo inteiro — os 4 clubes do Grupo A jogam contra os 4 clubes do outro grupo, pote contra pote.
        </p>
        <div class="cop-cross">${crossHtml}</div>
        <p class="cop-p">
          Amazonas FC (Pote 1, único clube do Norte no topo) enfrenta Bahia, Palmeiras e Botafogo — três dos maiores do país. Bangu (Pote 4) enfrenta Athletic Club, Botafogo-PB e Manaus FC — clubes de força equivalente. Os potes se cruzam entre si, mas nunca entre potes diferentes.
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
  const funnelHtml = FUNNEL.map((f) => {
    const width = (f.entram / 150 * 100).toFixed(1);
    const meta = `${f.entram} → ${f.saem}  ·  −${f.entram - f.saem}`;
    const bye = f.byes ? `<span class="cop-funnel__bye">${f.byes} bye</span>` : '';
    return `
      <div class="cop-funnel__row">
        <div class="cop-funnel__row-head">
          <span class="cop-funnel__fase">${f.fase}</span>
          <span class="cop-funnel__meta">${meta}</span>
        </div>
        <div class="cop-funnel__body">
          <div class="cop-funnel__bar" style="--w:${width}%">
            <div class="cop-funnel__bar-surv" style="flex:${f.saem};"></div>
            <div class="cop-funnel__bar-elim" style="flex:${f.entram - f.saem};"></div>
          </div>
          ${bye}
        </div>
        <p class="cop-funnel__origem">${f.origem}</p>
      </div>
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
          A FA Cup brasileira: <strong>todos os 216 clubes profissionais</strong> disputam — Série A e Série B das 6 ligas regionais. É o único torneio em que Palmeiras e um clube da base podem se cruzar oficialmente.
        </p>
      </div>

      <div>
        <h3 class="cop-h3">O funil da base</h3>
        <p class="cop-p" style="margin-block-end:1.75rem;">
          A Série B começa no funil e é eliminada rodada a rodada. A Série A entra na 1ª Fase. Restam 19 sobreviventes que se fundem com os 13 clubes vindos das competições Conmebol no 16-avos.
        </p>
        <p class="cop-funnel-legend">
          <span class="cop-funnel-legend--surv">Sobreviventes</span>
          <span class="cop-funnel-legend--elim">Eliminados</span>
        </p>
        <div class="cop-funnel">
          ${funnelHtml}
          <div class="cop-funnel__final">
            <span class="cop-funnel__final-label">16-avos</span>
            <div class="cop-funnel__final-bar"></div>
            <span class="cop-funnel__final-meta">32 clubes · 19 sobreviventes + 13 Conmebol</span>
          </div>
        </div>
      </div>

      <div>
        <h3 class="cop-h3">Vagas Conmebol: 13 clubes direto ao 16-avos</h3>
        <p class="cop-p">
          Os <strong>13 clubes que disputaram Conmebol no ano anterior</strong> (7 Libertadores + 6 Sul-Americana) entram diretamente no <strong>16-avos</strong>. Isso evita que gigantes atropelem clubes da base nas fases iniciais, reserva o suspense do mata-mata para quando as diferenças de nível importarem, e alivia o calendário de quem já teve semana dobrada por 6 meses.
        </p>
      </div>

      <div class="cop-byes">
        <h3 class="cop-h3">Byes premiam a Série B</h3>
        <p>
          Os <strong>4 byes ao longo do funil</strong> vão para os clubes mais bem ranqueados da Série B do ano anterior. O top-2 dorme na Preliminar. O top-1 tem descanso em três rodadas seguintes.
        </p>
        <p>
          É um mecanismo estrutural: subir alguns lugares no ranking da Série B rende um caminho mais curto na Copa do Brasil da próxima temporada. A Série B fica disputada até o último jogo — não só pelo acesso, mas por byes.
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
      <span class="cop-vaga-list__origem"><span aria-hidden="true">${q.flag}</span>Melhor clube da ${q.liga} não classificado à Libertadores</span>
    </li>
  `).join('');

  contentEl.innerHTML = `
    <div class="cop-panel">
      <div>
        <h2 class="cop-h2">Vagas Conmebol</h2>
        <p class="cop-lede">
          Onde as duas copas nacionais desembocam. <strong>A Sul-Americana garante uma vaga por região — o mecanismo-chave da proposta.</strong>
        </p>
      </div>

      <div class="cop-conmebol">
        <section>
          <h3 class="cop-vaga-list__title">Libertadores</h3>
          <p class="cop-vaga-list__sub">7 vagas · cascata prioritária</p>
          <ol class="cop-vaga-list cop-vaga-list--lib">${libHtml}</ol>
        </section>
        <section>
          <h3 class="cop-vaga-list__title">Sul-Americana</h3>
          <p class="cop-vaga-list__sub">6 vagas · uma por região, sem cascata</p>
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

tabsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.cop-tab');
  if (!btn) return;
  sel = btn.dataset.key;
  renderTabs();
  render();
  const url = new URL(location.href);
  url.searchParams.set('t', sel);
  history.replaceState(null, '', url);
});

const initial = new URLSearchParams(location.search).get('t');
if (initial && TABS.some((t) => t.key === initial)) sel = initial;

renderTabs();
render();
