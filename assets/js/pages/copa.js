import { loadSeason, clubById } from '../season.js';
import { wireTabs } from '../components/tabs.js';

const season = await loadSeason();

function nome(id) { return clubById(season, id)?.nome ?? id; }

function renderCampeoes() {
  const cc = season.copaCampeoes;
  const el = document.getElementById('copa-detalhe');

  // Build a lookup: clubId → group id
  const groupOfClub = new Map();
  for (const g of cc.grupos) for (const clubId of g.clubes) groupOfClub.set(clubId, g.id);

  // Collect cross-group matches per group (each match indexed once per participating group)
  const crossByGroup = new Map();
  for (const g of cc.grupos) crossByGroup.set(g.id, []);
  for (const m of season.matchesGeral) {
    if (m.competicao !== 'copa_campeoes') continue;
    if (!m.rodada?.startsWith('cross-')) continue;
    const gA = groupOfClub.get(m.casaId);
    const gB = groupOfClub.get(m.foraId);
    crossByGroup.get(gA)?.push({
      rodada: m.rodada, ownId: m.casaId, otherId: m.foraId,
      otherGroup: gB, ownScore: m.golsCasa, otherScore: m.golsFora,
    });
    crossByGroup.get(gB)?.push({
      rodada: m.rodada, ownId: m.foraId, otherId: m.casaId,
      otherGroup: gA, ownScore: m.golsFora, otherScore: m.golsCasa,
    });
  }

  const rodadaLabel = (r) => {
    const [kind, n] = r.split('-');
    return kind === 'grupos' ? `Grupo R${n}` : `Cruz. R${n}`;
  };

  const groupsHtml = `<section aria-labelledby="grupos-h">
    <h2 id="grupos-h">Fase de grupos</h2>
    <p class="copa__format-intro">
      Cada clube joga <strong>6 partidas</strong> na fase de grupos: <strong>3 contra os adversários do próprio grupo</strong>
      e <strong>3 partidas cruzadas</strong> contra clubes do mesmo pote em outros grupos.
      Todas contam para a classificação.
    </p>
    <div class="grupos">${cc.grupos.map(g => `
      <article class="grupo">
        <div class="grupo__id">Grupo ${g.id}</div>
        <div class="grupo__tabela">${g.tabela.map(r => `
          <div class="grupo__row" data-classificado="${r.posicao <= 2}">
            <span>${r.posicao}</span><span>${r.nome}</span>
            <span>${r.jogos}</span><span>${r.saldoGols}</span><span>${r.golsPro}</span><strong>${r.pontos}</strong>
          </div>`).join('')}
        </div>
        <details class="grupo__partidas">
          <summary>Ver partidas</summary>
          <div class="grupo__partidas__section">
            <h4>Rodadas do grupo</h4>
            <ul>${g.jogos.map(j => `
              <li class="grupo__partida">
                <span class="grupo__partida__rodada">${rodadaLabel(j.rodada)}</span>
                <span class="grupo__partida__casa">${nome(j.casaId)}</span>
                <strong class="grupo__partida__placar">${j.golsCasa}–${j.golsFora}</strong>
                <span class="grupo__partida__fora">${nome(j.foraId)}</span>
              </li>`).join('')}</ul>
          </div>
          <div class="grupo__partidas__section">
            <h4>Rodadas cruzadas</h4>
            <ul>${crossByGroup.get(g.id)
              .slice()
              .sort((a, b) => a.rodada.localeCompare(b.rodada))
              .map(c => `
              <li class="grupo__partida grupo__partida--cross">
                <span class="grupo__partida__rodada">${rodadaLabel(c.rodada)}</span>
                <span class="grupo__partida__casa">${nome(c.ownId)}</span>
                <strong class="grupo__partida__placar">${c.ownScore}–${c.otherScore}</strong>
                <span class="grupo__partida__fora">${nome(c.otherId)} <span class="grupo__partida__badge">Grupo ${c.otherGroup}</span></span>
              </li>`).join('')}</ul>
          </div>
        </details>
      </article>`).join('')}
    </div></section>`;

  const rounds = [
    { key: '16avos', label: '16 avos' },
    { key: 'oitavas', label: 'Oitavas' },
    { key: 'quartas', label: 'Quartas' },
    { key: 'semis', label: 'Semis' },
    { key: 'final', label: 'Final' },
  ];
  const bracketHtml = `<section aria-labelledby="bracket-h"><h2 id="bracket-h">Mata-mata</h2>
    <div class="bracket">${rounds.map(({ key, label }) => {
      const matches = key === 'final' ? [cc.matamata.final] : cc.matamata[key];
      return `<div class="bracket__round"><h3>${label}</h3>
        ${matches.map(m => `
          <div class="bracket__match">
            <div class="bracket__match__team" data-vencedor="${m.vencedorId === m.casaId}"><span>${nome(m.casaId)}</span><span>${m.golsCasa}</span></div>
            <div class="bracket__match__team" data-vencedor="${m.vencedorId === m.foraId}"><span>${nome(m.foraId)}</span><span>${m.golsFora}</span></div>
          </div>`).join('')}
      </div>`;
    }).join('')}
    </div>
    <p style="font-family:var(--font-sans);margin-block-start:var(--space-4);">Campeão: <strong style="color:var(--color-accent);font-size:var(--step-2);">${nome(cc.matamata.campeao)}</strong></p>
  </section>`;

  el.innerHTML = groupsHtml + bracketHtml;
}

function renderBrasil() {
  const cb = season.copaBrasil;
  const el = document.getElementById('copa-detalhe');
  const funil = cb.funil;
  const stages = [
    { label: 'Preliminar', clubes: 26, sobrev: funil.preliminar.survivors.length },
    { label: '1ª Fase',    clubes: 118, sobrev: funil.primeira.survivors.length },
    { label: '2ª Fase',    clubes: 60, sobrev: funil.segunda.survivors.length },
    { label: '3ª Fase',    clubes: 30, sobrev: funil.terceira.survivors.length },
    { label: 'Repescagem técnica', clubes: 4, sobrev: funil.luckyLosers.length },
  ];
  const funilHtml = `<section aria-labelledby="funil-h"><h2 id="funil-h">O funil</h2>
    <div class="funil">${stages.map(s => `
      <div class="funil__stage">
        <span>${s.label}</span>
        <div class="funil__stage__bar" style="--w:${(s.sobrev / s.clubes * 100).toFixed(0)}"></div>
        <span>${s.sobrev}/${s.clubes}</span>
      </div>`).join('')}
    </div>
    <p style="font-family:var(--font-sans);margin-block-start:var(--space-4);">
      Da base emergem <strong>19 sobreviventes</strong> que se juntam aos <strong>13 clubes do bypass</strong> nos 16 avos.
    </p>
  </section>`;

  const rounds = ['16avos', 'oitavas', 'quartas', 'semis'];
  const bracketHtml = `<section aria-labelledby="brasil-bracket-h"><h2 id="brasil-bracket-h">Mata-mata</h2>
    <div class="bracket">${rounds.map(k => `
      <div class="bracket__round"><h3>${k}</h3>
        ${cb.matamata[k].map(m => `
          <div class="bracket__match">
            <div class="bracket__match__team" data-vencedor="${m.vencedorId === m.casaId}"><span>${nome(m.casaId)}</span><span>${m.golsCasa}</span></div>
            <div class="bracket__match__team" data-vencedor="${m.vencedorId === m.foraId}"><span>${nome(m.foraId)}</span><span>${m.golsFora}</span></div>
          </div>`).join('')}
      </div>`).join('')}
      <div class="bracket__round"><h3>Final</h3>
        <div class="bracket__match">
          <div class="bracket__match__team" data-vencedor="${cb.matamata.final.vencedorId === cb.matamata.final.casaId}"><span>${nome(cb.matamata.final.casaId)}</span><span>${cb.matamata.final.golsCasa}</span></div>
          <div class="bracket__match__team" data-vencedor="${cb.matamata.final.vencedorId === cb.matamata.final.foraId}"><span>${nome(cb.matamata.final.foraId)}</span><span>${cb.matamata.final.golsFora}</span></div>
        </div>
      </div>
    </div>
    <p style="font-family:var(--font-sans);margin-block-start:var(--space-4);">Campeão: <strong style="color:var(--color-accent);font-size:var(--step-2);">${nome(cb.matamata.campeao)}</strong></p>
  </section>`;

  el.innerHTML = funilHtml + bracketHtml;
}

function renderConmebol() {
  const cc = season.copaCampeoes.matamata;
  const cb = season.copaBrasil.matamata;
  // Slot origin labels, in priority order (matches src/sim/conmebol.js allocation)
  const libOrigens = [
    { source: 'Campeão da Copa dos Campeões', preferId: cc.campeao },
    { source: 'Vice-campeão da Copa dos Campeões', preferId: cc.vice },
    { source: 'Campeão da Copa do Brasil', preferId: cb.campeao },
    { source: 'Semifinalista Copa dos Campeões', preferId: cc.semifinalistas?.[0] },
    { source: 'Semifinalista Copa dos Campeões', preferId: cc.semifinalistas?.[1] },
    { source: 'Vice-campeão da Copa do Brasil', preferId: cb.vice },
    { source: 'G7 · melhor campanha geral', preferId: null },
  ];

  // Walk the actual allocated list, labelling each with the priority slot's label OR "cascata"
  const libIds = season.conmebol.libertadores;
  const usedOrigens = new Set();
  const libItems = libIds.map((id, i) => {
    // Prefer matching by ID to the slot's preferred candidate
    const match = libOrigens.findIndex(
      (o, idx) => !usedOrigens.has(idx) && o.preferId === id
    );
    let origem;
    if (match >= 0) { origem = libOrigens[match].source; usedOrigens.add(match); }
    else origem = 'Cascata (slot vago)';
    return { id, origem };
  });

  const libListEl = document.getElementById('lib-list');
  libListEl.innerHTML = libItems.map((it, i) => `
    <li class="conmebol__item">
      <span class="conmebol__item__num">${i + 1}</span>
      <span class="conmebol__item__nome">${nome(it.id)}</span>
      <span class="conmebol__item__origem">${it.origem}</span>
    </li>`).join('');

  // Sul-Americana: allocated per region, in the sim's iteration order over ligasRegionais
  const ligaOrder = season.ligasRegionais.map((l) => l.nome);
  const sulListEl = document.getElementById('sul-list');
  sulListEl.innerHTML = season.conmebol.sulAmericana.map((id, i) => `
    <li class="conmebol__item">
      <span class="conmebol__item__num">${i + 1}</span>
      <span class="conmebol__item__nome">${nome(id)}</span>
      <span class="conmebol__item__origem">${ligaOrder[i] ?? ''}</span>
    </li>`).join('');
}

const tabsEl = document.getElementById('copa-tabs');
tabsEl.addEventListener('tab-change', (e) => {
  if (e.detail.key === 'campeoes') renderCampeoes();
  else renderBrasil();
});
wireTabs(tabsEl, { defaultKey: 'campeoes' });
renderConmebol();
