export const TOTAL_WEEKS = 42;

const LIGA_WEEKS = Array.from({ length: 34 }, (_, i) => i + 1);
const COPA_CAMPEOES_WEEKS = {
  'grupos-1': 5, 'grupos-2': 8, 'grupos-3': 11,
  '16avos': 20, 'oitavas': 25, 'quartas': 30, 'semis': 35, 'final': 40,
};
const COPA_BRASIL_WEEKS = {
  'preliminar': 3, 'primeira': 6, 'segunda': 9, 'terceira': 12,
  '16avos': 21, 'oitavas': 26, 'quartas': 31, 'semis': 36, 'final': 41,
};
// FIFA breaks — no midweek matches these weeks
const FIFA_MIDWEEKS = new Set([14, 24, 34]);

function emptyWeek() {
  return { fimDeSemana: null, meioDeSemana: null };
}

export function assignCalendar(simResult) {
  const { regionalLeagueMatches, copaCampeoesMatches, copaBrasilMatches, clubIds } = simResult;
  const calendariosPorClube = new Map();
  for (const id of clubIds) {
    calendariosPorClube.set(id, Array.from({ length: TOTAL_WEEKS }, () => emptyWeek()));
  }

  const matchesGeral = [];

  function place(competicao, semana, slotKey, match) {
    const home = calendariosPorClube.get(match.casaId);
    const away = calendariosPorClube.get(match.foraId);
    if (!home || !away) return;
    const rodada = match.rodada ?? null;
    // Per-club entries: pre-oriented, no redundant fields.
    const entryHome = { competicao, rodada, casa: true,  adversarioId: match.foraId, golsPro: match.golsCasa, golsContra: match.golsFora };
    const entryAway = { competicao, rodada, casa: false, adversarioId: match.casaId, golsPro: match.golsFora, golsContra: match.golsCasa };
    let attempt = semana;
    while (attempt <= TOTAL_WEEKS) {
      if (slotKey === 'meioDeSemana' && FIFA_MIDWEEKS.has(attempt)) { attempt++; continue; }
      const okHome = home[attempt - 1][slotKey] === null;
      const okAway = away[attempt - 1][slotKey] === null;
      if (okHome && okAway) {
        home[attempt - 1][slotKey] = entryHome;
        away[attempt - 1][slotKey] = entryAway;
        matchesGeral.push({ competicao, rodada, casaId: match.casaId, foraId: match.foraId, golsCasa: match.golsCasa, golsFora: match.golsFora, semana: attempt });
        return;
      }
      attempt++;
    }
  }

  for (const m of regionalLeagueMatches) {
    const semana = LIGA_WEEKS[m.rodada - 1];
    place('liga_regional', semana, 'fimDeSemana', m);
  }
  for (const m of copaCampeoesMatches) {
    const semana = COPA_CAMPEOES_WEEKS[m.rodada] ?? 20;
    place('copa_campeoes', semana, 'meioDeSemana', m);
  }
  for (const m of copaBrasilMatches) {
    const semana = COPA_BRASIL_WEEKS[m.rodada] ?? 15;
    place('copa_brasil', semana, 'meioDeSemana', m);
  }

  const calendariosPorClubeObj = Object.fromEntries(calendariosPorClube);
  return { calendariosPorClube: calendariosPorClubeObj, matchesGeral };
}
