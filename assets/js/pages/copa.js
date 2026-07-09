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
  { pote: 1, label: 'Pote 1 · Gigantes',       corte: '1 clube da Amazônica, 2 de cada demais região, e 1 extra sorteado entre Nordestina e Paulista.' },
  { pote: 2, label: 'Pote 2 · Elite forte',    corte: 'Mesma regra do Pote 1 — o extra é sorteado a cada ano.' },
  { pote: 3, label: 'Pote 3 · Meio-alto',      corte: 'Mesma regra.' },
  { pote: 4, label: 'Pote 4 · Ascendentes',    corte: 'Mesma regra. Ao final dos 4 potes, Nordestina e Paulista terão 2 extras cada (10 vagas totais).' },
];

// Illustrative draw. Pot rule (per proposta):
//   Amazônica contribui 1 clube por pote (4 clubes / 4 potes = 1-1-1-1).
//   Central, Sulista, Rio-Capixaba: 2 por pote (8 = 2-2-2-2).
//   Nordestina e Paulista têm 10 vagas cada — 2 clubes na base + 1 extra
//     sorteado por pote a cada ano. Ao final, cada uma recebe 2 extras
//     (2 extras × 2 regiões = 4 = número de potes) e totaliza 10 vagas.
// Este exemplo mostra UM sorteio possível: NE teve o extra nos Potes 1 e 3;
// Paulista, nos Potes 2 e 4. Outros anos podem sortear diferente.
// Cada grupo tem 1 clube por pote E 4 regiões diferentes (geo-lock).
const REG = { NE: 'Nordestina', SP: 'Paulista', CE: 'Central', SUL: 'Sulista', RJ: 'Rio-Capixaba', AM: 'Amazônica' };
const CC_EXAMPLE_GROUPS = [
  { id: 'A', slots: [
    { pote: 1, clube: 'Amazonas FC',          reg: 'AM' },
    { pote: 2, clube: 'Corinthians',          reg: 'SP' },
    { pote: 3, clube: 'CRB',                  reg: 'NE' },
    { pote: 4, clube: 'Bangu',                reg: 'RJ' },
  ]},
  { id: 'B', slots: [
    { pote: 1, clube: 'Bahia',                reg: 'NE' },
    { pote: 2, clube: 'Paysandu',             reg: 'AM' },
    { pote: 3, clube: 'Mirassol',             reg: 'SP' },
    { pote: 4, clube: 'Athletic Club',        reg: 'CE' },
  ]},
  { id: 'C', slots: [
    { pote: 1, clube: 'Palmeiras',            reg: 'SP' },
    { pote: 2, clube: 'Fluminense',           reg: 'RJ' },
    { pote: 3, clube: 'Remo',                 reg: 'AM' },
    { pote: 4, clube: 'Botafogo-PB',          reg: 'NE' },
  ]},
  { id: 'D', slots: [
    { pote: 1, clube: 'Botafogo',             reg: 'RJ' },
    { pote: 2, clube: 'Sport Recife',         reg: 'NE' },
    { pote: 3, clube: 'América-MG',           reg: 'CE' },
    { pote: 4, clube: 'Manaus FC',            reg: 'AM' },
  ]},
  { id: 'E', slots: [
    { pote: 1, clube: 'Atlético-MG',          reg: 'CE' },
    { pote: 2, clube: 'Internacional',        reg: 'SUL' },
    { pote: 3, clube: 'ABC',                  reg: 'NE' },
    { pote: 4, clube: 'Guarani',              reg: 'SP' },
  ]},
  { id: 'F', slots: [
    { pote: 1, clube: 'Cruzeiro',             reg: 'CE' },
    { pote: 2, clube: 'Criciúma',             reg: 'SUL' },
    { pote: 3, clube: 'América-RN',           reg: 'NE' },
    { pote: 4, clube: 'Ituano',               reg: 'SP' },
  ]},
  { id: 'G', slots: [
    { pote: 1, clube: 'Flamengo',             reg: 'RJ' },
    { pote: 2, clube: 'Vitória',              reg: 'NE' },
    { pote: 3, clube: 'Juventude',            reg: 'SUL' },
    { pote: 4, clube: 'Ponte Preta',          reg: 'SP' },
  ]},
  { id: 'H', slots: [
    { pote: 1, clube: 'Athletico-Paranaense', reg: 'SUL' },
    { pote: 2, clube: 'Atlético-GO',          reg: 'CE' },
    { pote: 3, clube: 'Novorizontino',        reg: 'SP' },
    { pote: 4, clube: 'Boavista',             reg: 'RJ' },
  ]},
  { id: 'I', slots: [
    { pote: 1, clube: 'Grêmio',               reg: 'SUL' },
    { pote: 2, clube: 'Red Bull Bragantino',  reg: 'SP' },
    { pote: 3, clube: 'Nova Iguaçu',          reg: 'RJ' },
    { pote: 4, clube: 'CSA',                  reg: 'NE' },
  ]},
  { id: 'J', slots: [
    { pote: 1, clube: 'Fortaleza',            reg: 'NE' },
    { pote: 2, clube: 'Vasco da Gama',        reg: 'RJ' },
    { pote: 3, clube: 'Goiás',                reg: 'CE' },
    { pote: 4, clube: 'Maringá',              reg: 'SUL' },
  ]},
  { id: 'K', slots: [
    { pote: 1, clube: 'São Paulo',            reg: 'SP' },
    { pote: 2, clube: 'Cuiabá',               reg: 'CE' },
    { pote: 3, clube: 'Volta Redonda',        reg: 'RJ' },
    { pote: 4, clube: 'Avaí',                 reg: 'SUL' },
  ]},
  { id: 'L', slots: [
    { pote: 1, clube: 'Ceará',                reg: 'NE' },
    { pote: 2, clube: 'Santos',               reg: 'SP' },
    { pote: 3, clube: 'Coritiba',             reg: 'SUL' },
    { pote: 4, clube: 'Vila Nova-GO',         reg: 'CE' },
  ]},
];

const CC_KO = [
  { rodada: '16-avos', clubes: 32, formato: 'Ida e volta',   detalhe: '2 melhores de cada grupo + 8 melhores 3ºs colocados.' },
  { rodada: 'Oitavas', clubes: 16, formato: 'Ida e volta',   detalhe: '' },
  { rodada: 'Quartas', clubes:  8, formato: 'Ida e volta',   detalhe: '' },
  { rodada: 'Semis',   clubes:  4, formato: 'Ida e volta',   detalhe: '' },
  { rodada: 'Final',   clubes:  2, formato: 'Jogo único',    detalhe: 'Sábado 7 dez — o último jogo da temporada brasileira.' },
];

// Copa do Brasil funnel: 4 byes total (2 na Preliminar + 1 na 1ª + 1 na 2ª),
// premiando os clubes mais bem ranqueados da Série B do ano anterior — mecanismo
// que torna a Série B disputada. Numerical check:
//   Preliminar: 108 in → 106 jogam → 53 vencedores + 2 byes = 55 out
//   1ª Fase:    150 in (55 + 95 Série A) → 149 jogam → 74 vencedores + 1 bye = 75 out
//   2ª Fase:    75 in → 74 jogam → 37 vencedores + 1 bye = 38 out
//   3ª Fase:    38 in → todos jogam → 19 vencedores = 19 out
//   16-avos:    19 sobreviventes + 13 elite bypass = 32
const CB_FUNIL = [
  { fase: 'Preliminar', entram: 108, byes: 2, saem: 55, origem: 'Todos os 108 clubes da Série B. Byes para o top-1 e top-2 do ranking Série B do ano anterior.' },
  { fase: '1ª Fase',    entram: 150, byes: 1, saem: 75, origem: '55 sobreviventes + 95 clubes da Série A. Bye para o top-1 Série B.' },
  { fase: '2ª Fase',    entram: 75,  byes: 1, saem: 38, origem: '75 sobreviventes. Bye para o top-1 Série B.' },
  { fase: '3ª Fase',    entram: 38,  byes: 0, saem: 19, origem: '38 sobreviventes. Sem byes — todos jogam.' },
];

const CB_KO = [
  { rodada: '16-avos', clubes: 32, detalhe: '19 sobreviventes do funil + 13 clubes do elite bypass.' },
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
        A Copa dos Campeões Regionais é o campeonato nacional da proposta — o Brasileirão
        <strong>em formato de Libertadores</strong>. Reúne os melhores clubes das 6 ligas regionais,
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

    <section class="copa-section" aria-labelledby="cc-sorteio">
      <h3 id="cc-sorteio">Um sorteio possível</h3>
      <p class="copa__body">
        Exemplo ilustrativo com o ranking real de 2024: 12 grupos, cada um com 1 clube por pote e
        <strong>4 regiões diferentes</strong>. Amazonas FC representa o Norte no Pote 1, Paysandu no
        Pote 2, Remo no Pote 3 e Manaus FC no Pote 4 — o Norte aparece em <strong>cada tier</strong>
        do torneio, não só no topo.
      </p>
      <p class="copa__body">
        Neste sorteio (um entre vários possíveis), a Nordestina recebeu o extra nos Potes 1 e 3, e
        a Paulista nos Potes 2 e 4. A distribuição dos extras é <strong>sorteada a cada ano</strong>,
        garantindo 2 extras para cada região ao longo dos 4 potes.
      </p>
      <div class="cc-groups">
        ${CC_EXAMPLE_GROUPS.map(g => `
          <article class="cc-group">
            <div class="cc-group__id">Grupo ${g.id}</div>
            <ul class="cc-group__slots">
              ${g.slots.map(s => `
                <li class="cc-group__slot" data-pote="${s.pote}">
                  <span class="cc-group__pote">P${s.pote}</span>
                  <span class="cc-group__clube">
                    <span class="cc-group__nome">${s.clube}</span>
                    <span class="cc-group__reg">${REG[s.reg]}</span>
                  </span>
                </li>`).join('')}
            </ul>
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

    <section class="copa-section" aria-labelledby="cc-cross-a">
      <h3 id="cc-cross-a">Exemplo: cross-pot do Grupo A</h3>
      <p class="copa__body">
        As 3 partidas cruzadas de cada clube do Grupo A. Cada rodada, o Grupo A enfrenta um
        outro grupo inteiro — os 4 clubes do Grupo A jogam contra os 4 clubes do outro grupo,
        pote contra pote.
      </p>
      <div class="cross-rounds">
        <article class="cross-round">
          <h4 class="cross-round__title">Rodada 1 · Grupo A × Grupo B</h4>
          <ul class="cross-round__list">
            <li><span data-pote="1">P1</span> <strong>Amazonas FC</strong> × <strong>Bahia</strong></li>
            <li><span data-pote="2">P2</span> <strong>Corinthians</strong> × <strong>Paysandu</strong></li>
            <li><span data-pote="3">P3</span> <strong>CRB</strong> × <strong>Mirassol</strong></li>
            <li><span data-pote="4">P4</span> <strong>Bangu</strong> × <strong>Athletic Club</strong></li>
          </ul>
        </article>
        <article class="cross-round">
          <h4 class="cross-round__title">Rodada 2 · Grupo A × Grupo C</h4>
          <ul class="cross-round__list">
            <li><span data-pote="1">P1</span> <strong>Amazonas FC</strong> × <strong>Palmeiras</strong></li>
            <li><span data-pote="2">P2</span> <strong>Corinthians</strong> × <strong>Fluminense</strong></li>
            <li><span data-pote="3">P3</span> <strong>CRB</strong> × <strong>Remo</strong></li>
            <li><span data-pote="4">P4</span> <strong>Bangu</strong> × <strong>Botafogo-PB</strong></li>
          </ul>
        </article>
        <article class="cross-round">
          <h4 class="cross-round__title">Rodada 3 · Grupo A × Grupo D</h4>
          <ul class="cross-round__list">
            <li><span data-pote="1">P1</span> <strong>Amazonas FC</strong> × <strong>Botafogo</strong></li>
            <li><span data-pote="2">P2</span> <strong>Corinthians</strong> × <strong>Sport Recife</strong></li>
            <li><span data-pote="3">P3</span> <strong>CRB</strong> × <strong>América-MG</strong></li>
            <li><span data-pote="4">P4</span> <strong>Bangu</strong> × <strong>Manaus FC</strong></li>
          </ul>
        </article>
      </div>
      <p class="copa__body">
        Amazonas FC (Pote 1, único clube do Norte no topo) enfrenta Bahia, Palmeiras e Botafogo —
        três dos maiores do país. Bangu (Pote 4) enfrenta Athletic Club, Botafogo-PB e Manaus FC —
        clubes de força equivalente. Os potes se cruzam entre si, mas nunca entre potes diferentes.
      </p>
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
      <h2 id="cb-intro">216 clubes, da base ao topo</h2>
      <p class="copa__lede">
        A FA Cup brasileira: <strong>todos os 216 clubes profissionais</strong> disputam — Série A e
        Série B das 6 ligas regionais. É o único torneio em que Palmeiras e um clube da base
        podem se cruzar oficialmente.
      </p>
    </section>

    <section class="copa-section" aria-labelledby="cb-funil">
      <h3 id="cb-funil">O funil da base</h3>
      <p class="copa__body">
        A Série B começa no funil e é eliminada rodada a rodada. A Série A entra na 1ª Fase.
        Restam 19 sobreviventes que se fundem com o elite bypass no 16-avos.
      </p>
      <ol class="funil">
        ${CB_FUNIL.map(s => `
          <li class="funil__stage">
            <span class="funil__stage__label">${s.fase}</span>
            <span class="funil__stage__count">${s.entram} → ${s.saem}</span>
            <span class="funil__stage__bar" style="--w:${(s.saem / s.entram * 100).toFixed(0)}"></span>
            <span class="funil__stage__origem">
              ${s.origem}${s.byes > 0 ? ` <span class="funil__stage__byes">🎟️ ${s.byes} bye${s.byes > 1 ? 's' : ''}</span>` : ''}
            </span>
          </li>`).join('')}
      </ol>
    </section>

    <section class="copa-section" aria-labelledby="cb-bypass">
      <h3 id="cb-bypass">Elite bypass: 13 clubes direto ao 16-avos</h3>
      <p class="copa__body">
        Os 13 clubes com melhor campanha nacional no ano anterior entram diretamente no
        <strong>16-avos</strong>. Isso evita que gigantes atropelem clubes da base nas fases
        iniciais e reserva o suspense do mata-mata para quando as diferenças de nível importarem.
      </p>
    </section>

    <section class="copa-section" aria-labelledby="cb-byes">
      <h3 id="cb-byes">Byes premiam a Série B</h3>
      <p class="copa__body">
        Os <strong>4 byes ao longo do funil</strong> vão para os clubes mais bem ranqueados da
        Série B do ano anterior. O top-2 dorme na Preliminar. O top-1 tem descanso em três
        rodadas seguintes.
      </p>
      <p class="copa__body">
        É um mecanismo estrutural: subir alguns lugares no ranking da Série B rende um caminho
        mais curto na Copa do Brasil da próxima temporada. A Série B fica disputada até o
        último jogo — não só pelo acesso, mas por byes.
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
  const el = document.getElementById('copa-detalhe');
  el.innerHTML = `
    <section class="copa-section" aria-labelledby="conmebol-intro">
      <h2 id="conmebol-intro">Vagas Conmebol</h2>
      <p class="copa__lede">
        Onde as duas copas nacionais desembocam. <strong>A Sul-Americana garante uma vaga
        por região — o mecanismo-chave da proposta.</strong>
      </p>
    </section>

    <section class="copa-section conmebol">
      <div class="conmebol__cols">
        <section aria-labelledby="lib-heading">
          <h3 id="lib-heading">🌎 Libertadores <span class="conmebol__count">7 vagas · cascata prioritária</span></h3>
          <ol class="conmebol__list">
            ${LIB_ORIGENS.map(o => `
              <li class="conmebol__item">
                <span class="conmebol__item__num">${o.pos}</span>
                <span class="conmebol__item__origem">${o.origem}</span>
              </li>`).join('')}
          </ol>
        </section>
        <section aria-labelledby="sul-heading">
          <h3 id="sul-heading">🏆 Sul-Americana <span class="conmebol__count">6 vagas · uma por região, sem cascata</span></h3>
          <ol class="conmebol__list">
            ${CC_QUOTAS.map((q, i) => `
              <li class="conmebol__item">
                <span class="conmebol__item__num">${i + 1}</span>
                <span class="conmebol__item__origem">
                  <span class="analogy__flag" aria-hidden="true">${q.flag}</span>
                  Melhor clube da ${q.liga} não classificado à Libertadores
                </span>
              </li>`).join('')}
          </ol>
        </section>
      </div>
    </section>
  `;
}

const tabsEl = document.getElementById('copa-tabs');
tabsEl.addEventListener('tab-change', (e) => {
  if (e.detail.key === 'campeoes') renderCampeoes();
  else if (e.detail.key === 'brasil') renderBrasil();
  else if (e.detail.key === 'conmebol') renderConmebol();
});
wireTabs(tabsEl, { defaultKey: 'campeoes' });
