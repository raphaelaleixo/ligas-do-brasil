import { describe, it, expect } from 'vitest';
import { buildParticipantPool, simulateFunnel, simulateMataMata } from '../../src/sim/copa-brasil.js';
import { seedYearZero } from '../../src/sim/seeding.js';
import { createRng } from '../../src/sim/rng.js';

describe('buildParticipantPool', () => {
  const seeded = seedYearZero();
  const pool = buildParticipantPool(seeded);

  it('has 13 elite bypass + 131 base = 144 total', () => {
    expect(pool.eliteBypass).toHaveLength(13);
    expect(pool.base).toHaveLength(131);
  });

  it('base pool composition: 95 non-elite Série A + 35 top-6-Série-B + 1 convidado', () => {
    expect(pool.composicao.naoEliteSerieA).toBe(95);
    expect(pool.composicao.topSerieB).toBe(35);
    expect(pool.composicao.convidado).toBe(1);
  });

  it('convidado técnico is defined', () => {
    expect(pool.convidadoId).toBeDefined();
  });

  it('base clubs are all distinct', () => {
    const ids = new Set(pool.base);
    expect(ids.size).toBe(131);
  });
});

describe('simulateFunnel', () => {
  const seeded = seedYearZero();
  const pool = buildParticipantPool(seeded);
  const rng = createRng(1);
  const funnel = simulateFunnel(pool, rng);

  it('processes each phase with the expected survivor counts', () => {
    expect(funnel.preliminar.survivors).toHaveLength(13);
    expect(funnel.primeira.survivors).toHaveLength(59);
    expect(funnel.segunda.survivors).toHaveLength(30);
    expect(funnel.terceira.survivors).toHaveLength(15);
    expect(funnel.luckyLosers).toHaveLength(4);
    expect(funnel.qualificadosParaMataMata).toHaveLength(19);
  });

  it('Preliminar takes 26 base clubs', () => {
    const preliminarIds = funnel.preliminar.matches.flatMap((m) => [m.casaId, m.foraId]);
    expect(new Set(preliminarIds).size).toBe(26);
  });
});

describe('simulateMataMata', () => {
  it('produces 5 rounds ending in a champion', () => {
    const seeded = seedYearZero();
    const pool = buildParticipantPool(seeded);
    const rng = createRng(1);
    const funnel = simulateFunnel(pool, rng);
    const mm = simulateMataMata(pool.eliteBypass, funnel.qualificadosParaMataMata, rng);
    expect(mm['16avos']).toHaveLength(16);
    expect(mm.oitavas).toHaveLength(8);
    expect(mm.quartas).toHaveLength(4);
    expect(mm.semis).toHaveLength(2);
    expect(mm.campeao).toBeDefined();
    expect(mm.vice).toBeDefined();
  });
});
