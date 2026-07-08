import { loadSeason, clubById } from '../season.js';
import { wireTabs } from '../components/tabs.js';

const season = await loadSeason();

function nome(id) { return clubById(season, id)?.nome ?? id; }

function renderCampeoes() {
  const cc = season.copaCampeoes;
  const el = document.getElementById('copa-detalhe');
  const groupsHtml = `<section aria-labelledby="grupos-h"><h2 id="grupos-h">Fase de grupos</h2>
    <div class="grupos">${cc.grupos.map(g => `
      <article class="grupo">
        <div class="grupo__id">Grupo ${g.id}</div>
        <div class="grupo__tabela">${g.tabela.map(r => `
          <div class="grupo__row" data-classificado="${r.posicao <= 2}">
            <span>${r.posicao}</span><span>${r.nome}</span>
            <span>${r.jogos}</span><span>${r.saldoGols}</span><span>${r.golsPro}</span><strong>${r.pontos}</strong>
          </div>`).join('')}
        </div>
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

const tabsEl = document.getElementById('copa-tabs');
tabsEl.addEventListener('tab-change', (e) => {
  if (e.detail.key === 'campeoes') renderCampeoes();
  else renderBrasil();
});
wireTabs(tabsEl, { defaultKey: 'campeoes' });
