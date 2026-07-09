import { wireTabs } from '../components/tabs.js';

// Structural view — describes the FORMAT of the two national cups and the
// Conmebol slot allocation. No simulation results, no specific clubs.

const CC_QUOTAS = [
  { liga: 'Liga Nordestina',    vagas: 10, flag: '🇮🇹' },
  { liga: 'Liga Paulista',      vagas: 10, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { liga: 'Liga Central',       vagas:  8, flag: '🇪🇸' },
  { liga: 'Liga Sulista',       vagas:  8, flag: '🇺🇦' },
  { liga: 'Liga Rio-Capixaba',  vagas:  8, flag: '🇳🇱' },
  { liga: 'Liga Amazônica',     vagas:  4, flag: '🇵🇹' },
];

const CC_POTES = [
  { pote: 1, label: 'Pote 1 · Gigantes',    corte: '12 clubes mais bem colocados no ranking regional.'    },
  { pote: 2, label: 'Pote 2 · Elite forte', corte: '12 clubes seguintes, ainda historicamente competitivos.' },
  { pote: 3, label: 'Pote 3 · Meio-alto',   corte: '12 clubes de campanha mediana no ano anterior.'       },
  { pote: 4, label: 'Pote 4 · Ascendentes', corte: '12 clubes que acabaram de garantir a vaga regional.'  },
];

const CC_KO = [
  { rodada: '16-avos', clubes: 32, formato: 'Ida e volta',   detalhe: '2 melhores de cada grupo + 8 melhores 3ºs colocados.' },
  { rodada: 'Oitavas', clubes: 16, formato: 'Ida e volta',   detalhe: '' },
  { rodada: 'Quartas', clubes:  8, formato: 'Ida e volta',   detalhe: '' },
  { rodada: 'Semis',   clubes:  4, formato: 'Ida e volta',   detalhe: '' },
  { rodada: 'Final',   clubes:  2, formato: 'Jogo único',    detalhe: 'Sábado 7 dez — o último jogo da temporada brasileira.' },
];

const CB_FUNIL = [
  { fase: 'Preliminar',  entram: 26,  saem: 13,  origem: 'Clubes da Série B das ligas regionais e melhores da Série C nacional.' },
  { fase: '1ª Fase',     entram: 118, saem: 59,  origem: '13 sobreviventes da Preliminar + 105 clubes de base.' },
  { fase: '2ª Fase',     entram: 60,  saem: 30,  origem: '59 sobreviventes + 1 convidado (campeão da Copa Verde ou Copa do Nordeste).' },
  { fase: '3ª Fase',     entram: 30,  saem: 15,  origem: '30 sobreviventes da 2ª Fase.' },
  { fase: 'Repescagem',  entram: 4,   saem: 4,   origem: 'Melhores desempenhos entre eliminados na 3ª Fase — mecanismo lucky-loser.' },
];

const CB_KO = [
  { rodada: '16-avos', clubes: 32, detalhe: '19 sobreviventes da base + 13 do elite bypass.' },
  { rodada: 'Oitavas', clubes: 16, detalhe: '' },
  { rodada: 'Quartas', clubes:  8, detalhe: '' },
  { rodada: 'Semis',   clubes:  4, detalhe: '' },
  { rodada: 'Final',   clubes:  2, detalhe: 'Sábado 9 nov — encerra o ciclo dos mata-matas nacionais antes das finais continentais.' },
];

const LIB_ORIGENS = [
  { pos: 1, origem: 'Campeão da Copa dos Campeões' },
  { pos: 2, origem: 'Vice-campeão da Copa dos Campeões' },
  { pos: 3, origem: 'Campeão da Copa do Brasil' },
  { pos: 4, origem: 'Semifinalista da Copa dos Campeões' },
  { pos: 5, origem: 'Semifinalista da Copa dos Campeões' },
  { pos: 6, origem: 'Vice-campeão da Copa do Brasil' },
  { pos: 7, origem: 'Melhor campanha geral (G7) — cascata quando os slots acima estão vagos.' },
];

function renderCampeoes() {
  const el = document.getElementById('copa-detalhe');
  el.innerHTML = `
    <section class="copa-section" aria-labelledby="cc-intro">
      <h2 id="cc-intro">48 clubes, 12 grupos, 4 potes</h2>
      <p class="copa__lede">
        A Copa dos Campeões Regionais é o clube-clube nacional da proposta — a
        <strong>Champions League brasileira</strong>. Reúne os melhores clubes das 6 ligas regionais,
        com quota proporcional ao tamanho de cada região.
      </p>
    </section>

    <section class="copa-section" aria-labelledby="cc-quotas">
      <h3 id="cc-quotas">Vagas por região</h3>
      <table class="quota-table">
        <thead>
          <tr><th scope="col">Liga regional</th><th scope="col" class="quota-table__num">Vagas</th></tr>
        </thead>
        <tbody>
          ${CC_QUOTAS.map(q => `
            <tr>
              <td><span class="analogy__flag" aria-hidden="true">${q.flag}</span> ${q.liga}</td>
              <td class="quota-table__num">${q.vagas}</td>
            </tr>`).join('')}
          <tr class="quota-table__total">
            <td>Total</td>
            <td class="quota-table__num">48</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="copa-section" aria-labelledby="cc-potes">
      <h3 id="cc-potes">Sorteio em 4 potes (formato FIFA)</h3>
      <p class="copa__body">
        Os 48 clubes vão a 4 potes de 12 com base no ranking regional do ano anterior. O sorteio distribui
        1 clube de cada pote em cada um dos 12 grupos.
      </p>
      <p class="copa__body">
        <strong>Geo-lock:</strong> nenhum grupo pode ter mais de um clube da mesma região. Cada grupo é
        obrigatoriamente uma mini-Copa do Brasil — 4 clubes, 4 regiões diferentes.
      </p>
      <div class="pots">
        ${CC_POTES.map(p => `
          <article class="pot" data-pote="${p.pote}">
            <h4 class="pot__label">${p.label}</h4>
            <p class="pot__corte">${p.corte}</p>
          </article>`).join('')}
      </div>
    </section>

    <section class="copa-section" aria-labelledby="cc-grupos">
      <h3 id="cc-grupos">Fase de grupos: 6 jogos cross-pot</h3>
      <p class="copa__body">
        Cada clube joga <strong>6 partidas</strong>: 3 contra os adversários do próprio grupo e
        <strong>3 partidas cruzadas</strong> contra clubes do mesmo pote em outros grupos.
        Todas contam para a classificação do grupo.
      </p>
      <details class="copa__format-why">
        <summary>Por que as cruzadas são intra-pote?</summary>
        <div class="copa__format-why__body">
          <p>
            Assim, cada pote joga um mini-torneio balanceado contra clubes de força equivalente — Pote 1 tem seus
            clássicos entre gigantes, Pote 4 tem sua liga entre iguais. A expectativa em qualquer pote é
            <strong>~4,5 pontos em 3 jogos cruzados</strong> (empate estatístico entre pares), então as cruzadas
            são neutras para todos.
          </p>
          <p>
            A diferença de nível entre os potes fica reservada aos <strong>jogos do próprio grupo</strong>, onde
            a semeadura da temporada anterior efetivamente pesa.
          </p>
        </div>
      </details>
    </section>

    <section class="copa-section" aria-labelledby="cc-mata-mata">
      <h3 id="cc-mata-mata">Mata-mata: 32 → 1</h3>
      <ol class="rounds">
        ${CC_KO.map(r => `
          <li class="round">
            <span class="round__label">${r.rodada}</span>
            <span class="round__clubes">${r.clubes} clubes</span>
            <span class="round__formato">${r.formato}</span>
            ${r.detalhe ? `<span class="round__detalhe">${r.detalhe}</span>` : ''}
          </li>`).join('')}
      </ol>
    </section>
  `;
}

function renderBrasil() {
  const el = document.getElementById('copa-detalhe');
  el.innerHTML = `
    <section class="copa-section" aria-labelledby="cb-intro">
      <h2 id="cb-intro">144 clubes, da base ao topo</h2>
      <p class="copa__lede">
        A FA Cup brasileira: todo clube profissional pode disputar, do interior da Série D
        ao finalista da Copa dos Campeões. É o único torneio em que Palmeiras e um clube da base
        podem se cruzar oficialmente.
      </p>
    </section>

    <section class="copa-section" aria-labelledby="cb-funil">
      <h3 id="cb-funil">O funil da base</h3>
      <p class="copa__body">
        Os clubes de base entram pela Preliminar e vão sendo eliminados até restar um pequeno grupo
        que se funde com o elite bypass no 16-avos.
      </p>
      <ol class="funil">
        ${CB_FUNIL.map(s => `
          <li class="funil__stage">
            <span class="funil__stage__label">${s.fase}</span>
            <span class="funil__stage__count">${s.entram} → ${s.saem}</span>
            <span class="funil__stage__bar" style="--w:${(s.saem / s.entram * 100).toFixed(0)}"></span>
            <span class="funil__stage__origem">${s.origem}</span>
          </li>`).join('')}
      </ol>
    </section>

    <section class="copa-section" aria-labelledby="cb-bypass">
      <h3 id="cb-bypass">Elite bypass: 13 clubes direto ao 16-avos</h3>
      <p class="copa__body">
        Os clubes já garantidos na Copa dos Campeões (potes 1 e 2 principalmente) entram
        diretamente no <strong>16-avos</strong>. Isso evita que gigantes atropelem clubes da base
        nas fases iniciais e reserva o suspense do mata-mata para quando as diferenças de nível
        importarem.
      </p>
      <p class="copa__body">
        Na 3ª Fase, uma <strong>repescagem técnica</strong> devolve 4 eliminados de melhor campanha
        ao torneio — o mecanismo <em>lucky loser</em> que reduz a variância cruel do jogo único.
      </p>
    </section>

    <section class="copa-section" aria-labelledby="cb-mata-mata">
      <h3 id="cb-mata-mata">Mata-mata: 32 → 1</h3>
      <ol class="rounds">
        ${CB_KO.map(r => `
          <li class="round">
            <span class="round__label">${r.rodada}</span>
            <span class="round__clubes">${r.clubes} clubes</span>
            <span class="round__formato">Ida e volta</span>
            ${r.detalhe ? `<span class="round__detalhe">${r.detalhe}</span>` : ''}
          </li>`).join('')}
      </ol>
    </section>
  `;
}

function renderConmebol() {
  const libListEl = document.getElementById('lib-list');
  libListEl.innerHTML = LIB_ORIGENS.map(o => `
    <li class="conmebol__item">
      <span class="conmebol__item__num">${o.pos}</span>
      <span class="conmebol__item__origem">${o.origem}</span>
    </li>`).join('');

  const sulListEl = document.getElementById('sul-list');
  sulListEl.innerHTML = CC_QUOTAS.map((q, i) => `
    <li class="conmebol__item">
      <span class="conmebol__item__num">${i + 1}</span>
      <span class="conmebol__item__origem">
        <span class="analogy__flag" aria-hidden="true">${q.flag}</span>
        Melhor clube da ${q.liga} não classificado à Libertadores
      </span>
    </li>`).join('');
}

const tabsEl = document.getElementById('copa-tabs');
tabsEl.addEventListener('tab-change', (e) => {
  if (e.detail.key === 'campeoes') renderCampeoes();
  else renderBrasil();
});
wireTabs(tabsEl, { defaultKey: 'campeoes' });
renderConmebol();
