import { describe, it, expect } from 'vitest';
import { buildParticipantPool, simulateFunnel, simulateMataMata } from '../../src/sim/copa-brasil.js';
import { seedYearZero } from '../../src/sim/seeding.js';
import { simulateAllRegionalLeagues } from '../../src/sim/regional-league.js';
import { createRng } from '../../src/sim/rng.js';

describe('buildParticipantPool', () => {
  const seeded = seedYearZero();
  const regional = simulateAllRegionalLeagues({ rng: createRng(1) });
  const pool = buildParticipantPool({ seeded, regional });

  it('splits Série B: 80 preliminar + 28 top = 108 total', () => {
    expect(pool.preliminarBIds).toHaveLength(80);
    expect(pool.topBIds).toHaveLength(28);
  });

  it('has 60 non-elite Série A (108 A − 48 CC quota)', () => {
    expect(pool.naoEliteAIds).toHaveLength(60);
  });

  it('composicao mirrors pool counts', () => {
    expect(pool.composicao.preliminarB).toBe(80);
    expect(pool.composicao.topB).toBe(28);
    expect(pool.composicao.naoEliteA).toBe(60);
  });

  it('all pool ids are distinct across preliminar-B / top-B / non-elite-A', () => {
    const all = new Set([...pool.preliminarBIds, ...pool.topBIds, ...pool.naoEliteAIds]);
    expect(all.size).toBe(168);
  });
});

describe('simulateFunnel', () => {
  const seeded = seedYearZero();
  const regional = simulateAllRegionalLeagues({ rng: createRng(1) });
  const pool = buildParticipantPool({ seeded, regional });
  const funnel = simulateFunnel(pool, createRng(1));

  it('processes each phase with the expected survivor counts', () => {
    expect(funnel.preliminar.survivors).toHaveLength(40);
    expect(funnel.primeira.survivors).toHaveLength(64);
    expect(funnel.segunda.survivors).toHaveLength(32);
    expect(funnel.terceira.survivors).toHaveLength(16);
    expect(funnel.qualificadosParaMataMata).toHaveLength(16);
  });

  it('preliminar pairings cover all 80 clubes', () => {
    const ids = funnel.preliminar.matches.flatMap((m) => [m.casaId, m.foraId]);
    expect(new Set(ids).size).toBe(80);
  });

  it('every funnel pairing has 2 legs (two-legged confrontation)', () => {
    for (const p of funnel.preliminar.matches) expect(p.legs).toHaveLength(2);
    for (const p of funnel.primeira.matches) expect(p.legs).toHaveLength(2);
    for (const p of funnel.segunda.matches) expect(p.legs).toHaveLength(2);
    for (const p of funnel.terceira.matches) expect(p.legs).toHaveLength(2);
  });
});

describe('simulateMataMata', () => {
  it('produces 5 rounds ending in a champion, only the final is one-legged', () => {
    const seeded = seedYearZero();
    const regional = simulateAllRegionalLeagues({ rng: createRng(1) });
    const pool = buildParticipantPool({ seeded, regional });
    const funnel = simulateFunnel(pool, createRng(1));
    const ccEliminados = regional.ligas[0].tabelaA.slice(0, 16).map((r) => r.id);
    const mm = simulateMataMata(ccEliminados, funnel.qualificadosParaMataMata, createRng(1));
    expect(mm['16avos']).toHaveLength(16);
    expect(mm.oitavas).toHaveLength(8);
    expect(mm.quartas).toHaveLength(4);
    expect(mm.semis).toHaveLength(2);
    expect(mm.campeao).toBeDefined();
    expect(mm.vice).toBeDefined();
    for (const p of mm['16avos']) expect(p.legs).toHaveLength(2);
    for (const p of mm.oitavas)   expect(p.legs).toHaveLength(2);
    for (const p of mm.quartas)   expect(p.legs).toHaveLength(2);
    for (const p of mm.semis)     expect(p.legs).toHaveLength(2);
    expect(mm.final.legs).toHaveLength(1);
  });
});
