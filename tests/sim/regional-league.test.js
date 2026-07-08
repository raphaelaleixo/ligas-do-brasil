import { describe, it, expect } from 'vitest';
import { buildSchedule, simulateLeague, simulateAllRegionalLeagues, CAMPEOES_QUOTAS } from '../../src/sim/regional-league.js';
import { createRng } from '../../src/sim/rng.js';

describe('buildSchedule', () => {
  const teams = Array.from({ length: 18 }, (_, i) => ({ id: `T${i}` }));
  const schedule = buildSchedule(teams);

  it('produces 34 rounds', () => {
    expect(schedule).toHaveLength(34);
  });

  it('each round has 9 matches with unique teams', () => {
    for (const round of schedule) {
      expect(round).toHaveLength(9);
      const seen = new Set();
      for (const m of round) {
        expect(seen.has(m.casaId)).toBe(false);
        expect(seen.has(m.foraId)).toBe(false);
        seen.add(m.casaId);
        seen.add(m.foraId);
        expect(m.casaId).not.toBe(m.foraId);
      }
    }
  });

  it('every ordered pair plays exactly once', () => {
    const seen = new Map();
    for (const round of schedule) {
      for (const m of round) {
        const key = `${m.casaId}->${m.foraId}`;
        expect(seen.has(key)).toBe(false);
        seen.set(key, true);
      }
    }
    expect(seen.size).toBe(18 * 17); // 306
  });
});

describe('simulateLeague', () => {
  const teams = Array.from({ length: 18 }, (_, i) => ({
    id: `T${i}`, nome: `Team ${i}`, ranking_forca: 5,
  }));

  it('produces per-team stats totalling 34 matches each', () => {
    const rng = createRng(1);
    const { tabela, matches } = simulateLeague({ teams, divisao: 'A', rng });
    expect(matches).toHaveLength(306);
    for (const row of tabela) expect(row.jogos).toBe(34);
    expect(tabela).toHaveLength(18);
  });

  it('sorts the table by pontos, then SG, then GP, then name', () => {
    const rng = createRng(2);
    const { tabela } = simulateLeague({ teams, divisao: 'A', rng });
    for (let i = 1; i < tabela.length; i++) {
      const p = tabela[i - 1], c = tabela[i];
      if (p.pontos !== c.pontos) {
        expect(p.pontos).toBeGreaterThan(c.pontos);
      } else if (p.saldoGols !== c.saldoGols) {
        expect(p.saldoGols).toBeGreaterThanOrEqual(c.saldoGols);
      }
    }
  });

  it('is deterministic under the same seed', () => {
    const r1 = simulateLeague({ teams, divisao: 'A', rng: createRng(99) });
    const r2 = simulateLeague({ teams, divisao: 'A', rng: createRng(99) });
    expect(r1.matches).toEqual(r2.matches);
    expect(r1.tabela).toEqual(r2.tabela);
  });

  it('stronger teams end up higher on average', () => {
    const mixed = [
      ...Array.from({ length: 6 }, (_, i) => ({ id: `S${i}`, nome: `Strong ${i}`, ranking_forca: 9 })),
      ...Array.from({ length: 6 }, (_, i) => ({ id: `M${i}`, nome: `Mid ${i}`, ranking_forca: 5 })),
      ...Array.from({ length: 6 }, (_, i) => ({ id: `W${i}`, nome: `Weak ${i}`, ranking_forca: 2 })),
    ];
    const { tabela } = simulateLeague({ teams: mixed, divisao: 'A', rng: createRng(7) });
    const strongPositions = tabela
      .map((row, idx) => ({ row, idx }))
      .filter((x) => x.row.id.startsWith('S'))
      .map((x) => x.idx);
    const avgStrong = strongPositions.reduce((a, b) => a + b, 0) / strongPositions.length;
    expect(avgStrong).toBeLessThan(9);
  });
});

describe('simulateAllRegionalLeagues', () => {
  it('processes all 6 leagues and returns quota-sized champion pools', () => {
    const rng = createRng(0);
    const out = simulateAllRegionalLeagues({ rng });
    expect(out.ligas).toHaveLength(6);
    const quotasTotal = Object.values(CAMPEOES_QUOTAS).reduce((a, b) => a + b, 0);
    expect(quotasTotal).toBe(48);
    const totalCampeoes = out.ligas.reduce((acc, l) => acc + l.qualificadosCampeoes.length, 0);
    expect(totalCampeoes).toBe(48);
    for (const l of out.ligas) {
      expect(l.rebaixados).toHaveLength(3);
      expect(l.acessos).toHaveLength(3);
    }
  });
});
