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

// Conmebol calendar budget — spread across the season, avoiding weeks already
// occupied by Copa dos Campeões / Copa do Brasil / FIFA. Collision-avoiding
// placement below shifts forward if a specific week is already taken for a club.
// Libertadores: 13 games (group stage + all KO rounds), matching the 60-game
// cap arithmetic in the reform's metadata.
const LIBERTADORES_MIDWEEKS = [2, 4, 7, 10, 13, 15, 17, 19, 22, 27, 32, 37, 42];
// Sul-Americana: 8 games for a finalist (group + KO).
const SUL_AMERICANA_MIDWEEKS = [4, 15, 19, 27, 32, 37, 39, 42];

function emptyWeek() {
  return { fimDeSemana: null, meioDeSemana: null };
}

export function assignCalendar(simResult) {
  const {
    regionalLeagueMatches, copaCampeoesMatches, copaBrasilMatches,
    conmebolLibertadores = [], conmebolSulAmericana = [],
    clubIds,
  } = simResult;
  const calendariosPorClube = new Map();
  for (const id of clubIds) {
    calendariosPorClube.set(id, Array.from({ length: TOTAL_WEEKS }, () => emptyWeek()));
  }

  const matchesGeral = [];

  function placeConmebolSlot(clubId, semana, competicao) {
    const cal = calendariosPorClube.get(clubId);
    if (!cal) return;
    const entry = { competicao, rodada: null, casa: null, adversarioId: null, golsPro: null, golsContra: null };
    let attempt = semana;
    while (attempt <= TOTAL_WEEKS) {
      if (FIFA_MIDWEEKS.has(attempt)) { attempt++; continue; }
      if (cal[attempt - 1].meioDeSemana === null) {
        cal[attempt - 1].meioDeSemana = entry;
        matchesGeral.push({ competicao, rodada: null, casaId: clubId, foraId: null, golsCasa: null, golsFora: null, semana: attempt });
        return;
      }
      attempt++;
    }
  }

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

  // Conmebol slots — placed last so Copa dos Campeões / Copa do Brasil weeks
  // take priority; if a club's Conmebol week is already busy, walks forward.
  for (const clubId of conmebolLibertadores) {
    for (const week of LIBERTADORES_MIDWEEKS) {
      placeConmebolSlot(clubId, week, 'conmebol_libertadores');
    }
  }
  for (const clubId of conmebolSulAmericana) {
    for (const week of SUL_AMERICANA_MIDWEEKS) {
      placeConmebolSlot(clubId, week, 'conmebol_sul_americana');
    }
  }

  const calendariosPorClubeObj = Object.fromEntries(calendariosPorClube);
  return { calendariosPorClube: calendariosPorClubeObj, matchesGeral };
}
