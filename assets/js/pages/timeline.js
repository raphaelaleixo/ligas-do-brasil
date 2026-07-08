import { loadSeason, clubById, calendarFor } from '../season.js';
import { populateClubes } from '../components/club-picker.js';
import { openMatchDialog } from '../components/match-dialog.js';

const season = await loadSeason();
const selectEl = document.getElementById('clube-select');
populateClubes(selectEl, season.clubes);

const params = new URLSearchParams(location.search);
const initialId = params.get('clube') ?? 'BOT';
selectEl.value = initialId;

function selectClub(id) {
  const club = clubById(season, id);
  if (!club) return;
  const url = new URL(location.href); url.searchParams.set('clube', club.id);
  history.replaceState(null, '', url);
  render(club.id);
}

selectEl.addEventListener('change', () => selectClub(selectEl.value));
document.getElementById('club-picker-form').addEventListener('submit', (e) => {
  e.preventDefault();
  selectClub(selectEl.value);
});

function render(id) {
  const club = clubById(season, id);
  document.getElementById('club-header').innerHTML = `
    <h2>${club.nome}</h2>
    <p class="meta">${club.liga_regional} · Série ${club.divisao} · Posição ${club.estatisticas_temporada?.posicaoLiga ?? '—'}</p>`;

  const cal = calendarFor(season, id);
  const grid = document.getElementById('timeline-grid');
  const rows = ['<div class="tl-week"></div><div class="tl-week__hdr">Fim-de-semana</div><div class="tl-week__hdr">Meio-de-semana</div>']
    .concat(cal.map((w, i) => {
      const wnum = i + 1;
      const slot = (entry, kind) => {
        if (!entry) return `<button type="button" class="tl-slot" data-comp="" aria-label="Sem jogo"></button>`;
        // Conmebol slots: reserved dates, no simulated opponent/score
        if (entry.competicao === 'conmebol_libertadores') {
          return `<button type="button" class="tl-slot" data-comp="conmebol_libertadores" data-week="${wnum}" data-kind="${kind}" aria-label="Libertadores">🌎 Libertadores</button>`;
        }
        if (entry.competicao === 'conmebol_sul_americana') {
          return `<button type="button" class="tl-slot" data-comp="conmebol_sul_americana" data-week="${wnum}" data-kind="${kind}" aria-label="Sul-Americana">🏆 Sul-Americana</button>`;
        }
        const adv = clubById(season, entry.adversarioId);
        return `<button type="button" class="tl-slot" data-comp="${entry.competicao}" data-week="${wnum}" data-kind="${kind}" aria-label="${adv?.nome ?? entry.adversarioId} ${entry.golsPro}-${entry.golsContra}">
          ${adv?.nome ?? entry.adversarioId} <strong>${entry.golsPro}–${entry.golsContra}</strong>
        </button>`;
      };
      return `<div class="tl-week"><span class="tl-week__num">S${wnum}</span></div>${slot(w.fimDeSemana, 'fds')}${slot(w.meioDeSemana, 'mds')}`;
    }));
  grid.innerHTML = rows.join('');

  grid.querySelectorAll('.tl-slot[data-week]').forEach(btn => {
    btn.addEventListener('click', () => {
      const week = parseInt(btn.dataset.week, 10);
      const kind = btn.dataset.kind;
      const entry = kind === 'fds' ? cal[week - 1].fimDeSemana : cal[week - 1].meioDeSemana;
      const adv = entry.adversarioId ? clubById(season, entry.adversarioId) : null;
      openMatchDialog({ semana: week, entry, ownerClub: club, adversario: adv });
    });
  });

  const stats = club.estatisticas_temporada;
  document.getElementById('timeline-stats').innerHTML = stats ? `
    <table class="liga-tabela">
      <tr><td>Jogos</td><td>${stats.jogos}</td></tr>
      <tr><td>Vitórias / Empates / Derrotas</td><td>${stats.vitorias} / ${stats.empates} / ${stats.derrotas}</td></tr>
      <tr><td>Gols Pró / Contra</td><td>${stats.golsPro} / ${stats.golsContra}</td></tr>
      <tr><td>Pontos</td><td><strong>${stats.pontos}</strong></td></tr>
    </table>` : '';
}

render(initialId);
