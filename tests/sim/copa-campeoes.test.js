import { describe, it, expect } from 'vitest';
import { buildPots, drawGroups, simulateGroupStage, selectKnockoutQualifiers, simulateKnockout } from '../../src/sim/copa-campeoes.js';
import { createRng } from '../../src/sim/rng.js';
import { getAllTeams } from '../../src/data/teams.js';

function fakeLigas() {
  const per = {
    'Liga Nordestina': 10, 'Liga Paulista': 10,
    'Liga Rio-Capixaba': 8, 'Liga Sulista': 8, 'Liga Central': 8, 'Liga Amazônica': 4,
  };
  return Object.entries(per).map(([nome, quota]) => {
    const short = { 'Liga Nordestina': 'NE', 'Liga Paulista': 'SP',
      'Liga Rio-Capixaba': 'GC', 'Liga Sulista': 'SUL', 'Liga Central': 'MG', 'Liga Amazônica': 'N' }[nome];
    const tabelaA = Array.from({ length: 18 }, (_, i) => ({ id: `${short}${i + 1}`, posicao: i + 1 }));
    return { nome, tabelaA, qualificadosCampeoes: tabelaA.slice(0, quota).map(r => r.id) };
  });
}

describe('buildPots', () => {
  const pots = buildPots(fakeLigas());

  it('has 4 pots of 12 each', () => {
    expect(pots).toHaveLength(4);
    for (const pot of pots) expect(pot).toHaveLength(12);
  });

  it('pot 1 is positions 1–2 of every league', () => {
    for (const region of ['NE', 'SP', 'GC', 'SUL', 'MG', 'N']) {
      expect(pots[0]).toContain(`${region}1`);
      expect(pots[0]).toContain(`${region}2`);
    }
  });

  it('pot 2 is positions 3–4 of every league', () => {
    for (const region of ['NE', 'SP', 'GC', 'SUL', 'MG', 'N']) {
      expect(pots[1]).toContain(`${region}3`);
      expect(pots[1]).toContain(`${region}4`);
    }
  });

  it('pot 3 explicit picks: NE5-6, SP5-6, SUL5, MG5, GC5', () => {
    for (const id of ['NE5', 'NE6', 'SP5', 'SP6', 'SUL5', 'MG5', 'GC5']) {
      expect(pots[2]).toContain(id);
    }
  });

  it('pot 3 top-up (Option C): SUL6, MG6, GC6, NE7, SP7', () => {
    for (const id of ['SUL6', 'MG6', 'GC6', 'NE7', 'SP7']) {
      expect(pots[2]).toContain(id);
    }
  });

  it('pot 4 is the remaining 12', () => {
    for (const id of ['NE8','NE9','NE10','SP8','SP9','SP10','SUL7','SUL8','MG7','MG8','GC7','GC8']) {
      expect(pots[3]).toContain(id);
    }
  });

  it('all 48 clubs distributed exactly once', () => {
    const seen = new Set();
    for (const pot of pots) for (const id of pot) {
      expect(seen.has(id)).toBe(false);
      seen.add(id);
    }
    expect(seen.size).toBe(48);
  });
});

describe('drawGroups', () => {
  function ligaLookup(ligas) {
    const map = new Map();
    for (const l of ligas) for (const c of l.qualificadosCampeoes) map.set(c, l.nome);
    return map;
  }

  const ligas = fakeLigas();
  const pots = buildPots(ligas);
  const lookup = ligaLookup(ligas);

  it('produces 12 groups of 4 with one from each pot', () => {
    const groups = drawGroups(pots, lookup, createRng(1));
    expect(groups).toHaveLength(12);
    for (const g of groups) {
      expect(g).toHaveLength(4);
      const potsInGroup = g.map((c) => c.pot);
      expect(new Set(potsInGroup)).toEqual(new Set([1, 2, 3, 4]));
    }
  });

  it('never puts two same-region clubs together', () => {
    const groups = drawGroups(pots, lookup, createRng(2));
    for (const g of groups) {
      const regions = g.map((c) => lookup.get(c.id));
      expect(new Set(regions).size).toBe(regions.length);
    }
  });

  it('is deterministic under the same seed', () => {
    const g1 = drawGroups(pots, lookup, createRng(7));
    const g2 = drawGroups(pots, lookup, createRng(7));
    expect(g1).toEqual(g2);
  });
});

describe('simulateGroupStage', () => {
  it('plays 6 matches per group in 3 rounds of 2, updating standings', () => {
    const anyIds = ['PAL', 'FLA', 'FOR', 'GRE'];
    const fakeGroups = [anyIds.map((id, i) => ({ id, pot: i + 1 }))];
    const rng = createRng(1);
    const { grupos } = simulateGroupStage(fakeGroups, rng);
    expect(grupos).toHaveLength(1);
    expect(grupos[0].jogos).toHaveLength(6);
    expect(grupos[0].tabela).toHaveLength(4);
    for (const row of grupos[0].tabela) expect(row.jogos).toBe(3);
    // Each round should have 2 matches
    const roundCounts = new Map();
    for (const j of grupos[0].jogos) {
      roundCounts.set(j.rodada, (roundCounts.get(j.rodada) ?? 0) + 1);
    }
    expect(roundCounts.size).toBe(3);
    for (const [, c] of roundCounts) expect(c).toBe(2);
  });
});

describe('selectKnockoutQualifiers', () => {
  it('returns exactly 32 clubs (24 top-2 + 8 best 3rds)', () => {
    const grupos = Array.from({ length: 12 }, (_, gi) => ({
      id: 'ABCDEFGHIJKL'[gi],
      tabela: [
        { posicao: 1, id: `G${gi}-1`, pontos: 7, saldoGols: 3, golsPro: 5, nome: `A${gi}` },
        { posicao: 2, id: `G${gi}-2`, pontos: 5, saldoGols: 1, golsPro: 4, nome: `B${gi}` },
        { posicao: 3, id: `G${gi}-3`, pontos: gi, saldoGols: gi - 5, golsPro: 3, nome: `C${gi}` },
        { posicao: 4, id: `G${gi}-4`, pontos: 0, saldoGols: -5, golsPro: 1, nome: `D${gi}` },
      ],
    }));
    const qual = selectKnockoutQualifiers(grupos);
    expect(qual.top2).toHaveLength(24);
    expect(qual.melhoresTerceiros).toHaveLength(8);
    for (const t of qual.melhoresTerceiros) {
      expect(t.pontos).toBeGreaterThanOrEqual(4);
    }
  });
});

describe('simulateKnockout', () => {
  const first32 = getAllTeams().slice(0, 32).map((t) => ({ id: t.id }));

  it('produces 5 rounds ending in one champion', () => {
    const rng = createRng(1);
    const ko = simulateKnockout(first32, rng);
    expect(ko).toHaveProperty('16avos');
    expect(ko).toHaveProperty('oitavas');
    expect(ko).toHaveProperty('quartas');
    expect(ko).toHaveProperty('semis');
    expect(ko).toHaveProperty('final');
    expect(ko['16avos']).toHaveLength(16);
    expect(ko.oitavas).toHaveLength(8);
    expect(ko.quartas).toHaveLength(4);
    expect(ko.semis).toHaveLength(2);
    expect(ko.campeao).toBeDefined();
  });

  it('is deterministic under the same seed', () => {
    const a = simulateKnockout(first32, createRng(9));
    const b = simulateKnockout(first32, createRng(9));
    expect(a).toEqual(b);
  });
});
