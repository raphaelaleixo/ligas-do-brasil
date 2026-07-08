import { simulateMatch } from './match.js';
import { getTeamById } from '../data/teams.js';

export function buildParticipantPool(seeded) {
  const eliteIds = new Set(seeded.eliteBypass.map((c) => c.id));
  const eliteBypass = seeded.eliteBypass.map((c) => c.id);

  const naoEliteSerieA = seeded.ligas
    .flatMap((l) => l.tabelaA)
    .filter((c) => !eliteIds.has(c.id))
    .map((c) => c.id);

  const top6PerRegion = seeded.ligas.flatMap((l) => l.tabelaB.slice(0, 6));
  const dropped = top6PerRegion
    .slice()
    .sort((a, b) => {
      if (a.ranking_forca !== b.ranking_forca) return a.ranking_forca - b.ranking_forca;
      if (a.nome < b.nome) return -1;
      if (a.nome > b.nome) return 1;
      return 0;
    })[0];
  const topSerieBIds = top6PerRegion
    .filter((c) => c.id !== dropped.id)
    .map((c) => c.id);

  const excludedSerieB = seeded.ligas.flatMap((l) => l.tabelaB.slice(6));
  const convidado = excludedSerieB
    .slice()
    .sort((a, b) => {
      if (b.ranking_forca !== a.ranking_forca) return b.ranking_forca - a.ranking_forca;
      if (a.nome < b.nome) return -1;
      if (a.nome > b.nome) return 1;
      return 0;
    })[0];
  const convidadoId = convidado.id;

  const base = [...naoEliteSerieA, ...topSerieBIds, convidadoId];
  return {
    eliteBypass, base,
    convidadoId,
    composicao: {
      naoEliteSerieA: naoEliteSerieA.length,
      topSerieB: topSerieBIds.length,
      convidado: 1,
    },
  };
}

function playCupMatch(homeId, awayId, rng, competicao = 'copa_brasil', rodada) {
  const home = getTeamById(homeId);
  const away = getTeamById(awayId);
  let { golsCasa, golsFora } = simulateMatch(
    { rankingHome: home.ranking_forca, rankingAway: away.ranking_forca },
    rng
  );
  if (golsCasa === golsFora) {
    const extra = simulateMatch(
      { rankingHome: home.ranking_forca, rankingAway: away.ranking_forca },
      rng
    );
    golsCasa += extra.golsCasa;
    golsFora += extra.golsFora;
  }
  let vencedorId;
  if (golsCasa > golsFora) vencedorId = homeId;
  else if (golsCasa < golsFora) vencedorId = awayId;
  else vencedorId = rng() < 0.5 ? homeId : awayId;
  return { competicao, rodada, casaId: homeId, foraId: awayId, golsCasa, golsFora, vencedorId };
}

function seededPair(ids, rng, competicao, rodada) {
  const sorted = ids
    .slice()
    .sort((a, b) => {
      const A = getTeamById(a).ranking_forca;
      const B = getTeamById(b).ranking_forca;
      if (B !== A) return B - A;
      const nameA = getTeamById(a).nome;
      const nameB = getTeamById(b).nome;
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  const half = sorted.length / 2;
  const matches = [];
  const survivors = [];
  for (let i = 0; i < half; i++) {
    const homeId = sorted[i];
    const awayId = sorted[sorted.length - 1 - i];
    const m = playCupMatch(homeId, awayId, rng, competicao, rodada);
    matches.push(m);
    survivors.push(m.vencedorId);
  }
  return { matches, survivors };
}

function accumulatePerformance(perf, matchesByClub) {
  for (const [id, matches] of matchesByClub.entries()) {
    let pontos = 0, saldo = 0, gp = 0;
    for (const m of matches) {
      const home = m.casaId === id;
      const gf = home ? m.golsCasa : m.golsFora;
      const gc = home ? m.golsFora : m.golsCasa;
      gp += gf; saldo += gf - gc;
      if (m.vencedorId === id) pontos += 3;
      else if (gf === gc) pontos += 1;
    }
    perf.set(id, { pontos, saldo, gp });
  }
}

export function simulateFunnel(pool, rng) {
  const matchesByClub = new Map();
  const recordMatch = (m) => {
    for (const id of [m.casaId, m.foraId]) {
      if (!matchesByClub.has(id)) matchesByClub.set(id, []);
      matchesByClub.get(id).push(m);
    }
  };

  const convidadoId = pool.convidadoId;
  const baseSansConvidado = pool.base.filter((id) => id !== convidadoId);
  const sortedByRankAsc = baseSansConvidado.slice().sort((a, b) => {
    const A = getTeamById(a).ranking_forca;
    const B = getTeamById(b).ranking_forca;
    if (A !== B) return A - B;
    const nameA = getTeamById(a).nome;
    const nameB = getTeamById(b).nome;
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  const preliminarClubes = sortedByRankAsc.slice(0, 26);
  const naoPreliminar = sortedByRankAsc.slice(26);
  const preliminar = seededPair(preliminarClubes, rng, 'copa_brasil', 'preliminar');
  preliminar.matches.forEach(recordMatch);

  // 1ª Fase: 13 sobreviventes + 104 remaining + 1 convidado = 118 → 59
  const primeiraClubes = [...preliminar.survivors, ...naoPreliminar, convidadoId];
  if (primeiraClubes.length !== 118) throw new Error(`1ª Fase expected 118, got ${primeiraClubes.length}`);
  const primeira = seededPair(primeiraClubes, rng, 'copa_brasil', 'primeira');
  primeira.matches.forEach(recordMatch);

  // 2ª Fase: 59 → give top seed a bye, pair the other 58 → 29 + 1 bye = 30
  const segundaClubes = primeira.survivors.slice();
  if (segundaClubes.length !== 59) throw new Error(`2ª Fase expected 59, got ${segundaClubes.length}`);
  const sortedForBye = segundaClubes.slice().sort((a, b) => {
    const A = getTeamById(a).ranking_forca;
    const B = getTeamById(b).ranking_forca;
    if (B !== A) return B - A;
    const nameA = getTeamById(a).nome;
    const nameB = getTeamById(b).nome;
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
  const byeClub = sortedForBye[0];
  const paired58 = sortedForBye.slice(1);
  const segunda = seededPair(paired58, rng, 'copa_brasil', 'segunda');
  segunda.matches.forEach(recordMatch);
  segunda.survivors = [byeClub, ...segunda.survivors];

  // 3ª Fase: 30 → 15
  const terceira = seededPair(segunda.survivors, rng, 'copa_brasil', 'terceira');
  terceira.matches.forEach(recordMatch);

  // Lucky Losers: 4 best eliminated in 3ª by campaign performance
  const eliminatedIn3rd = terceira.matches.map((m) =>
    m.vencedorId === m.casaId ? m.foraId : m.casaId
  );
  const perf = new Map();
  accumulatePerformance(perf, matchesByClub);
  const luckyLosers = eliminatedIn3rd
    .slice()
    .sort((a, b) => {
      const A = perf.get(a) ?? { pontos: 0, saldo: 0, gp: 0 };
      const B = perf.get(b) ?? { pontos: 0, saldo: 0, gp: 0 };
      if (B.pontos !== A.pontos) return B.pontos - A.pontos;
      if (B.saldo !== A.saldo) return B.saldo - A.saldo;
      if (B.gp !== A.gp) return B.gp - A.gp;
      const nameA = getTeamById(a).nome;
      const nameB = getTeamById(b).nome;
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    })
    .slice(0, 4);

  const qualificadosParaMataMata = [...terceira.survivors, ...luckyLosers];

  return {
    preliminar, primeira, segunda, terceira,
    luckyLosers,
    qualificadosParaMataMata,
  };
}

function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function simulateMataMata(eliteBypass, qualificados19, rng) {
  const clubes32 = [...eliteBypass, ...qualificados19];
  if (clubes32.length !== 32) throw new Error(`Expected 32 clubs, got ${clubes32.length}`);
  const drawn = shuffle(clubes32, rng);
  const rounds = { '16avos': [], oitavas: [], quartas: [], semis: [], final: null };
  let current = drawn;
  for (const key of ['16avos', 'oitavas', 'quartas', 'semis']) {
    const next = [];
    for (let i = 0; i < current.length; i += 2) {
      const m = playCupMatch(current[i], current[i + 1], rng, 'copa_brasil', key);
      rounds[key].push(m);
      next.push(m.vencedorId);
    }
    current = next;
  }
  const finalMatch = playCupMatch(current[0], current[1], rng, 'copa_brasil', 'final');
  rounds.final = finalMatch;
  rounds.campeao = finalMatch.vencedorId;
  rounds.vice = finalMatch.vencedorId === finalMatch.casaId ? finalMatch.foraId : finalMatch.casaId;
  return rounds;
}
