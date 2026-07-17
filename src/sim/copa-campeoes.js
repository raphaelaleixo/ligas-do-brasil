import { simulateMatch } from './match.js';
import { getTeamById } from '../data/teams.js';
import { playCupPairing } from './knockout-pairing.js';

function idAtPos(liga, pos) {
  return liga.tabelaA[pos - 1].id;
}

export function buildPots(ligas) {
  const byName = new Map(ligas.map((l) => [l.nome, l]));
  const NE = byName.get('Liga Nordestina');
  const SP = byName.get('Liga Paulista');
  const GC = byName.get('Liga Rio-Capixaba');
  const SUL = byName.get('Liga Sulista');
  const MG = byName.get('Liga Central');
  const N = byName.get('Liga Amazônica');

  const pot1 = [NE, SP, GC, SUL, MG, N].flatMap((l) => [idAtPos(l, 1), idAtPos(l, 2)]);
  const pot2 = [NE, SP, GC, SUL, MG, N].flatMap((l) => [idAtPos(l, 3), idAtPos(l, 4)]);
  const pot3 = [
    idAtPos(NE, 5), idAtPos(NE, 6),
    idAtPos(SP, 5), idAtPos(SP, 6),
    idAtPos(SUL, 5), idAtPos(MG, 5), idAtPos(GC, 5),
    // Option C top-up:
    idAtPos(SUL, 6), idAtPos(MG, 6), idAtPos(GC, 6),
    idAtPos(NE, 7), idAtPos(SP, 7),
  ];
  const pot4 = [
    idAtPos(NE, 8), idAtPos(NE, 9), idAtPos(NE, 10),
    idAtPos(SP, 8), idAtPos(SP, 9), idAtPos(SP, 10),
    idAtPos(SUL, 7), idAtPos(SUL, 8),
    idAtPos(MG, 7), idAtPos(MG, 8),
    idAtPos(GC, 7), idAtPos(GC, 8),
  ];
  return [pot1, pot2, pot3, pot4];
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
