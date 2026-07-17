import { getTeamById } from '../data/teams.js';
import { playCupPairing } from './knockout-pairing.js';

// Top-B qualifying spots per liga (advance directly to 1ª Fase without going
// through Preliminar). 5 for the five larger ligas, 3 for Amazônica.
// Sum = 5*5 + 3 = 28. The remaining Série B clubs (bottom-13 per liga except
// Amazônica bottom-15) fill Preliminar: 5*13 + 15 = 80.
const TOP_B_PER_LIGA = {
  'Liga Nordestina':   5,
  'Liga Paulista':     5,
  'Liga Central':      5,
  'Liga Sulista':      5,
  'Liga Rio-Capixaba': 5,
  'Liga Amazônica':    3,
};

export function buildParticipantPool({ seeded, regional }) {
  // Serie B split per liga by Year Zero ranking_forca (seeded.tabelaB is
  // already sorted desc → asc-by-name).
  const topBIds = [];
  const preliminarBIds = [];
  for (const l of seeded.ligas) {
    const n = TOP_B_PER_LIGA[l.nome] ?? 5;
    for (const c of l.tabelaB.slice(0, n)) topBIds.push(c.id);
    for (const c of l.tabelaB.slice(n)) preliminarBIds.push(c.id);
  }

  // Serie A non-elite: those in regional tabelaA whose ids are NOT in
  // qualificadosCampeoes (the per-liga CC quota qualifiers).
  const ccSet = new Set(regional.ligas.flatMap((l) => l.qualificadosCampeoes));
  const naoEliteAIds = regional.ligas.flatMap((l) =>
    l.tabelaA.filter((row) => !ccSet.has(row.id)).map((row) => row.id)
  );

  return {
    preliminarBIds,
    topBIds,
    naoEliteAIds,
    composicao: {
      preliminarB: preliminarBIds.length,
      topB: topBIds.length,
      naoEliteA: naoEliteAIds.length,
    },
  };
}


function seededPair(ids, rng, competicao, rodada, { twoLegs } = { twoLegs: true }) {
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
    const p = playCupPairing(homeId, awayId, rng, { competicao, rodada, twoLegs });
    matches.push(p);
    survivors.push(p.vencedorId);
  }
  return { matches, survivors };
}

export function simulateFunnel(pool, rng) {
  // Preliminar: 80 B (bottom-ranked) → 40 winners.
  if (pool.preliminarBIds.length !== 80) {
    throw new Error(`Preliminar expected 80, got ${pool.preliminarBIds.length}`);
  }
  const preliminar = seededPair(pool.preliminarBIds, rng, 'copa_brasil', 'preliminar', { twoLegs: true });

  // 1ª Fase: 40 preliminar-survivors + 28 top-B + 60 non-elite Serie A = 128 → 64.
  const primeiraClubes = [...preliminar.survivors, ...pool.topBIds, ...pool.naoEliteAIds];
  if (primeiraClubes.length !== 128) {
    throw new Error(`1ª Fase expected 128, got ${primeiraClubes.length}`);
  }
  const primeira = seededPair(primeiraClubes, rng, 'copa_brasil', 'primeira', { twoLegs: true });

  // 2ª Fase: 64 → 32.
  const segunda = seededPair(primeira.survivors, rng, 'copa_brasil', 'segunda', { twoLegs: true });

  // 3ª Fase: 32 → 16.
  const terceira = seededPair(segunda.survivors, rng, 'copa_brasil', 'terceira', { twoLegs: true });

  return {
    preliminar,
    primeira,
    segunda,
    terceira,
    qualificadosParaMataMata: terceira.survivors, // 16
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

// Copa do Brasil mata-mata: 16 clubs eliminated at CC 16-avos + 16 funnel
// survivors = 32. Round of 32 always pairs a CC drop-out against a funnel
// survivor (each pot shuffled independently, then zipped). Subsequent rounds
// are sequential bracket. All rounds two-legged EXCEPT the final.
export function simulateMataMata(ccEliminadosNos16avos, funnelQualified, rng) {
  if (ccEliminadosNos16avos.length !== 16) {
    throw new Error(`Expected 16 CC drop-outs, got ${ccEliminadosNos16avos.length}`);
  }
  if (funnelQualified.length !== 16) {
    throw new Error(`Expected 16 funnel qualifiers, got ${funnelQualified.length}`);
  }
  const ccPot = shuffle(ccEliminadosNos16avos, rng);
  const funnelPot = shuffle(funnelQualified, rng);
  const rounds = { '16avos': [], oitavas: [], quartas: [], semis: [], final: null };

  // Round of 32: CC drop-out (home in leg 1) vs funnel survivor.
  const winners16 = [];
  for (let i = 0; i < 16; i++) {
    const p = playCupPairing(ccPot[i], funnelPot[i], rng, { competicao: 'copa_brasil', rodada: '16avos', twoLegs: true });
    rounds['16avos'].push(p);
    winners16.push(p.vencedorId);
  }

  // Subsequent rounds: sequential bracket.
  let current = winners16;
  for (const key of ['oitavas', 'quartas', 'semis']) {
    const next = [];
    for (let i = 0; i < current.length; i += 2) {
      const p = playCupPairing(current[i], current[i + 1], rng, { competicao: 'copa_brasil', rodada: key, twoLegs: true });
      rounds[key].push(p);
      next.push(p.vencedorId);
    }
    current = next;
  }
  const final = playCupPairing(current[0], current[1], rng, { competicao: 'copa_brasil', rodada: 'final', twoLegs: false });
  rounds.final = final;
  rounds.campeao = final.vencedorId;
  rounds.vice = final.vencedorId === final.casaId ? final.foraId : final.casaId;
  return rounds;
}
