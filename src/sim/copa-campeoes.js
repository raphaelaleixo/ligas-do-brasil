import { simulateMatch } from './match.js';
import { getTeamById } from '../data/teams.js';
import { playCupPairing } from './knockout-pairing.js';

function idAtPos(liga, pos) {
  return liga.tabelaA[pos - 1].id;
}

// Semeadura geo-balanceada dos 48 em 4 potes de 12. Cada pote reúne uma "faixa"
// de mérito de cada região, de modo que toda região apareça em todo pote na medida
// das suas vagas: Amazônica (4) manda 1 por pote; as regiões de 8 vagas mandam 2;
// Nordestina e Paulista (10) mandam 2 de base mais 1 "extra" sorteado entre elas.
export function buildPots(ligas, rng) {
  const byName = new Map(ligas.map((l) => [l.nome, l]));
  const NE = byName.get('Liga Nordestina');
  const SP = byName.get('Liga Paulista');
  const GC = byName.get('Liga Rio-Capixaba');
  const SUL = byName.get('Liga Sulista');
  const MG = byName.get('Liga Central');
  const N = byName.get('Liga Amazônica');

  const pots = [[], [], [], []];

  // Amazônica (4 vagas): 1 clube por pote — campeão no Pote 1, 4º no Pote 4.
  for (let p = 0; p < 4; p++) pots[p].push(idAtPos(N, p + 1));

  // Regiões de 8 vagas: 2 por pote, por faixa de ranking (posições 2p+1 e 2p+2).
  for (const l of [GC, SUL, MG]) {
    for (let p = 0; p < 4; p++) {
      pots[p].push(idAtPos(l, 2 * p + 1), idAtPos(l, 2 * p + 2));
    }
  }

  // Nordestina e Paulista (10 vagas cada): base de 2 por pote + 1 "extra" sorteado
  // entre NE e SP, de modo que cada pote receba exatamente 1 extra e cada região
  // termine com 10 (dois potes com 3, dois com 2). Quais potes levam o extra-NE vs
  // o extra-SP é sorteado a cada temporada (RNG com seed).
  const order = shuffle([0, 1, 2, 3], rng);
  const neExtra = new Set(order.slice(0, 2)); // 2 potes onde a NE leva 3
  fillBigRegion(NE, pots, (p) => neExtra.has(p));
  fillBigRegion(SP, pots, (p) => !neExtra.has(p));

  return pots;
}

// Distribui uma região de 10 vagas pelos 4 potes em ordem de ranking: os potes
// marcados recebem 3 clubes consecutivos; os demais, 2 (3 + 3 + 2 + 2 = 10).
function fillBigRegion(liga, pots, hasExtra) {
  let pos = 1;
  for (let p = 0; p < 4; p++) {
    const count = hasExtra(p) ? 3 : 2;
    for (let i = 0; i < count; i++) pots[p].push(idAtPos(liga, pos++));
  }
}

function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function drawGroups(pots, ligaLookup, rng) {
  const MAX_ATTEMPTS = 200;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const groups = Array.from({ length: 12 }, () => []);
    const shuffledPots = pots.map((pot) => shuffle(pot, rng));
    let ok = true;
    for (let p = 0; p < 4 && ok; p++) {
      const pot = shuffledPots[p];
      const remaining = pot.slice();
      const groupOrder = shuffle(
        Array.from({ length: 12 }, (_, i) => i),
        rng
      );
      const placed = new Array(12).fill(false);
      for (const clubId of remaining) {
        let placedThis = false;
        for (const gi of groupOrder) {
          if (placed[gi]) continue;
          const region = ligaLookup.get(clubId);
          const conflict = groups[gi].some((c) => ligaLookup.get(c.id) === region);
          if (conflict) continue;
          groups[gi].push({ id: clubId, pot: p + 1 });
          placed[gi] = true;
          placedThis = true;
          break;
        }
        if (!placedThis) { ok = false; break; }
      }
    }
    if (ok) return groups;
  }
  throw new Error('drawGroups: could not satisfy geo-lock after retries');
}

function emptyGroupRow(id) {
  const t = getTeamById(id);
  return {
    id, nome: t?.nome ?? id,
    jogos: 0, vitorias: 0, empates: 0, derrotas: 0,
    golsPro: 0, golsContra: 0, saldoGols: 0, pontos: 0,
  };
}

function applyGroupResult(rowA, rowB, gA, gB) {
  rowA.jogos++; rowB.jogos++;
  rowA.golsPro += gA; rowA.golsContra += gB;
  rowB.golsPro += gB; rowB.golsContra += gA;
  rowA.saldoGols = rowA.golsPro - rowA.golsContra;
  rowB.saldoGols = rowB.golsPro - rowB.golsContra;
  if (gA > gB) { rowA.vitorias++; rowB.derrotas++; rowA.pontos += 3; }
  else if (gA < gB) { rowB.vitorias++; rowA.derrotas++; rowB.pontos += 3; }
  else { rowA.empates++; rowB.empates++; rowA.pontos++; rowB.pontos++; }
}

function sortGroupTable(a, b) {
  if (b.pontos !== a.pontos) return b.pontos - a.pontos;
  if (b.saldoGols !== a.saldoGols) return b.saldoGols - a.saldoGols;
  if (b.golsPro !== a.golsPro) return b.golsPro - a.golsPro;
  if (a.nome < b.nome) return -1;
  if (a.nome > b.nome) return 1;
  return 0;
}

const GROUP_LABELS = 'ABCDEFGHIJKL';

// Proper round-robin for 4 teams (3 rounds × 2 matches).
const GROUP_ROUNDS = [
  [[0, 1], [2, 3]],
  [[0, 2], [3, 1]],
  [[0, 3], [1, 2]],
];

// Cross-group sub-tournament rounds — sub-group of 4 = 3 rounds × 2 matches, same
// pairing pattern as GROUP_ROUNDS above (round-robin).
const CROSS_ROUNDS = GROUP_ROUNDS;

export function simulateGroupStage(groups, rng) {
  // rowMap is shared across in-group and cross-group phases so a club's tabela
  // accumulates points from all 6 of its matches.
  const rowMap = new Map();
  for (const g of groups) for (const c of g) rowMap.set(c.id, emptyGroupRow(c.id));

  // 1) In-group round-robin — 3 rounds, 2 matches per group per round.
  const grupos = groups.map((g, gi) => {
    const jogos = [];
    GROUP_ROUNDS.forEach((round, rIdx) => {
      for (const [hi, ai] of round) {
        const home = g[hi], away = g[ai];
        const homeTeam = getTeamById(home.id);
        const awayTeam = getTeamById(away.id);
        const { golsCasa, golsFora } = simulateMatch(
          { rankingHome: homeTeam.ranking_forca, rankingAway: awayTeam.ranking_forca },
          rng
        );
        applyGroupResult(rowMap.get(home.id), rowMap.get(away.id), golsCasa, golsFora);
        jogos.push({
          rodada: `grupos-${rIdx + 1}`,
          casaId: home.id, foraId: away.id,
          golsCasa, golsFora,
        });
      }
    });
    return {
      id: GROUP_LABELS[gi],
      clubes: g.map((c) => c.id),
      pots: Object.fromEntries(g.map((c) => [c.id, c.pot])),
      jogos,
    };
  });

  // 2) Cross-group series — per pot, split 12 clubs by group letter into 3
  //    sub-tournaments (A-D, E-H, I-L), each a round-robin of 4. Each club plays
  //    3 more games, all counting toward its group tabela.
  const crossGroupMatches = [];
  for (let potNum = 1; potNum <= 4; potNum++) {
    // Collect this pot's clubs in group-letter order (0..11).
    const potClubIds = groups.map((g) => g.find((c) => c.pot === potNum)?.id).filter(Boolean);
    if (potClubIds.length !== 12) continue;
    const subs = [potClubIds.slice(0, 4), potClubIds.slice(4, 8), potClubIds.slice(8, 12)];
    for (const sub of subs) {
      CROSS_ROUNDS.forEach((round, rIdx) => {
        for (const [hi, ai] of round) {
          const homeId = sub[hi], awayId = sub[ai];
          const home = getTeamById(homeId);
          const away = getTeamById(awayId);
          const { golsCasa, golsFora } = simulateMatch(
            { rankingHome: home.ranking_forca, rankingAway: away.ranking_forca },
            rng
          );
          applyGroupResult(rowMap.get(homeId), rowMap.get(awayId), golsCasa, golsFora);
          crossGroupMatches.push({
            rodada: `cross-${rIdx + 1}`,
            pot: potNum,
            casaId: homeId, foraId: awayId,
            golsCasa, golsFora,
          });
        }
      });
    }
  }

  // 3) Finalize tabelas per group (all 6 games counted).
  for (const g of grupos) {
    g.tabela = g.clubes
      .map((id) => rowMap.get(id))
      .sort(sortGroupTable)
      .map((r, i) => ({ posicao: i + 1, ...r }));
  }
  return { grupos, crossGroupMatches };
}

export function selectKnockoutQualifiers(grupos) {
  const top2 = grupos.flatMap((g) => g.tabela.slice(0, 2).map((row) => ({ ...row, grupo: g.id })));
  const terceiros = grupos.map((g) => ({ ...g.tabela[2], grupo: g.id }));
  const melhoresTerceiros = terceiros
    .slice()
    .sort((a, b) => {
      if (b.pontos !== a.pontos) return b.pontos - a.pontos;
      if (b.saldoGols !== a.saldoGols) return b.saldoGols - a.saldoGols;
      if (b.golsPro !== a.golsPro) return b.golsPro - a.golsPro;
      if (a.nome < b.nome) return -1;
      if (a.nome > b.nome) return 1;
      return 0;
    })
    .slice(0, 8);
  return { top2, melhoresTerceiros };
}


// Rank clubs by group-stage campaign quality — used to split the 32 qualifiers
// into a seeded pot (top 16) and an unseeded pot (bottom 16) for the round of 32.
function rankByCampaign(clubes) {
  return clubes.slice().sort((a, b) => {
    if (a.posicao !== b.posicao) return a.posicao - b.posicao;
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    if (b.saldoGols !== a.saldoGols) return b.saldoGols - a.saldoGols;
    if (b.golsPro !== a.golsPro) return b.golsPro - a.golsPro;
    if (a.nome < b.nome) return -1;
    if (a.nome > b.nome) return 1;
    return 0;
  });
}

// Champions-League-style draw for the round of 32: pair each seeded team with
// a random unseeded team, avoiding same-group whenever possible. Falls back to
// a straight seeded-vs-unseeded pairing if the same-group constraint can't be
// satisfied within the attempt budget.
function drawSeededPairings(seeded, unseeded, rng) {
  const MAX_ATTEMPTS = 200;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const remaining = shuffle(unseeded, rng);
    const pairings = [];
    let ok = true;
    for (const s of seeded) {
      const idx = remaining.findIndex((u) => u.grupo !== s.grupo);
      if (idx === -1) { ok = false; break; }
      const [u] = remaining.splice(idx, 1);
      pairings.push([s, u]);
    }
    if (ok) return pairings;
  }
  const shuffled = shuffle(unseeded, rng);
  return seeded.map((s, i) => [s, shuffled[i]]);
}

export function simulateKnockout(clubes32, rng) {
  const ranked = rankByCampaign(clubes32);
  const seeded = ranked.slice(0, 16);
  const unseeded = ranked.slice(16);
  const pairings = drawSeededPairings(seeded, unseeded, rng);

  const rounds = { '16avos': [], oitavas: [], quartas: [], semis: [], final: null };

  // Round of 32 uses the seeded draw. Seeded team is home in leg 1. Two-legged.
  const winners16 = [];
  for (const [s, u] of pairings) {
    const p = playCupPairing(s.id, u.id, rng, { competicao: 'copa_campeoes', rodada: '16avos', twoLegs: true });
    rounds['16avos'].push(p);
    winners16.push(p.vencedorId);
  }

  // Subsequent rounds: sequential bracket. Two-legged except the final.
  let current = winners16;
  for (const key of ['oitavas', 'quartas', 'semis']) {
    const next = [];
    for (let i = 0; i < current.length; i += 2) {
      const p = playCupPairing(current[i], current[i + 1], rng, { competicao: 'copa_campeoes', rodada: key, twoLegs: true });
      rounds[key].push(p);
      next.push(p.vencedorId);
    }
    current = next;
  }
  const finalMatch = playCupPairing(current[0], current[1], rng, { competicao: 'copa_campeoes', rodada: 'final', twoLegs: false });
  rounds.final = finalMatch;
  rounds.campeao = finalMatch.vencedorId;
  rounds.vice = finalMatch.vencedorId === finalMatch.casaId ? finalMatch.foraId : finalMatch.casaId;
  const semisLosers = rounds.semis.map((m) => (m.vencedorId === m.casaId ? m.foraId : m.casaId));
  rounds.semifinalistas = semisLosers;
  return rounds;
}
