import { simulateMatch } from './match.js';
import { getLeagues } from '../data/teams.js';

// Circle method: fix team 0, rotate the rest.
export function buildSchedule(teams) {
  const n = teams.length;
  if (n % 2 !== 0) throw new Error('buildSchedule requires an even number of teams');
  const rotation = teams.slice();
  const rounds = [];
  const half = n / 2;
  for (let r = 0; r < n - 1; r++) {
    const round = [];
    for (let i = 0; i < half; i++) {
      const home = rotation[i];
      const away = rotation[n - 1 - i];
      if ((r + i) % 2 === 0) round.push({ casaId: home.id, foraId: away.id });
      else round.push({ casaId: away.id, foraId: home.id });
    }
    rounds.push(round);
    rotation.splice(1, 0, rotation.pop());
  }
  const returno = rounds.map((round) => round.map((m) => ({ casaId: m.foraId, foraId: m.casaId })));
  return [...rounds, ...returno];
}

function emptyRow(team, divisao) {
  return {
    id: team.id, nome: team.nome, divisao,
    jogos: 0, vitorias: 0, empates: 0, derrotas: 0,
    golsPro: 0, golsContra: 0, saldoGols: 0, pontos: 0,
  };
}

function applyResult(rowHome, rowAway, gc, gf) {
  rowHome.jogos++; rowAway.jogos++;
  rowHome.golsPro += gc; rowHome.golsContra += gf;
  rowAway.golsPro += gf; rowAway.golsContra += gc;
  rowHome.saldoGols = rowHome.golsPro - rowHome.golsContra;
  rowAway.saldoGols = rowAway.golsPro - rowAway.golsContra;
  if (gc > gf) { rowHome.vitorias++; rowAway.derrotas++; rowHome.pontos += 3; }
  else if (gc < gf) { rowAway.vitorias++; rowHome.derrotas++; rowAway.pontos += 3; }
  else { rowHome.empates++; rowAway.empates++; rowHome.pontos++; rowAway.pontos++; }
}

function sortTable(a, b) {
  if (b.pontos !== a.pontos) return b.pontos - a.pontos;
  if (b.saldoGols !== a.saldoGols) return b.saldoGols - a.saldoGols;
  if (b.golsPro !== a.golsPro) return b.golsPro - a.golsPro;
  if (a.nome < b.nome) return -1;
  if (a.nome > b.nome) return 1;
  return 0;
}

export function simulateLeague({ teams, divisao, rng, ligaNome = null, competicao = 'liga_regional' }) {
  const rows = new Map(teams.map((t) => [t.id, emptyRow(t, divisao)]));
  const schedule = buildSchedule(teams);
  const matches = [];
  const byId = new Map(teams.map((t) => [t.id, t]));

  schedule.forEach((round, rIdx) => {
    for (const m of round) {
      const home = byId.get(m.casaId);
      const away = byId.get(m.foraId);
      const { golsCasa, golsFora } = simulateMatch(
        { rankingHome: home.ranking_forca, rankingAway: away.ranking_forca },
        rng
      );
      applyResult(rows.get(home.id), rows.get(away.id), golsCasa, golsFora);
      matches.push({
        competicao,
        ligaNome,
        rodada: rIdx + 1,
        casaId: home.id, foraId: away.id,
        golsCasa, golsFora,
      });
    }
  });

  const tabela = Array.from(rows.values()).sort(sortTable).map((row, i) => ({ posicao: i + 1, ...row }));
  return { tabela, matches };
}

export const CAMPEOES_QUOTAS = {
  'Liga Nordestina': 10,
  'Liga Paulista': 10,
  'Liga Rio-Capixaba': 8,
  'Liga Sulista': 8,
  'Liga Central': 8,
  'Liga Amazônica': 4,
};

export function simulateAllRegionalLeagues({ rng }) {
  const ligas = getLeagues().map((liga) => {
    const teamsA = liga.clubes.filter((c) => c.divisao === 'A');
    const teamsB = liga.clubes.filter((c) => c.divisao === 'B');
    const a = simulateLeague({ teams: teamsA, divisao: 'A', rng, ligaNome: liga.nome });
    const b = simulateLeague({ teams: teamsB, divisao: 'B', rng, ligaNome: liga.nome });
    const quota = CAMPEOES_QUOTAS[liga.nome];
    if (quota === undefined) throw new Error(`Missing quota for ${liga.nome}`);
    return {
      nome: liga.nome,
      tabelaA: a.tabela, tabelaB: b.tabela,
      matches: [...a.matches, ...b.matches],
      qualificadosCampeoes: a.tabela.slice(0, quota).map((row) => row.id),
      rebaixados: a.tabela.slice(-3).map((row) => row.id),
      acessos: b.tabela.slice(0, 3).map((row) => row.id),
    };
  });
  return { ligas };
}
