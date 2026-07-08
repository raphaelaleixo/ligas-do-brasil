import { describe, it, expect } from 'vitest';
import { seedYearZero } from '../../src/sim/seeding.js';
import { getLeagues } from '../../src/data/teams.js';

describe('seedYearZero', () => {
  const seeded = seedYearZero();

  it('returns 6 phantom league tables, each with 18 Série A entries', () => {
    expect(seeded.ligas).toHaveLength(6);
    for (const l of seeded.ligas) {
      expect(l.tabelaA).toHaveLength(18);
      expect(l.tabelaB).toHaveLength(14);
    }
  });

  it('sorts each league by ranking_forca desc, tiebreak by name asc', () => {
    for (const l of seeded.ligas) {
      for (let i = 1; i < l.tabelaA.length; i++) {
        const prev = l.tabelaA[i - 1];
        const cur = l.tabelaA[i];
        expect(prev.ranking_forca).toBeGreaterThanOrEqual(cur.ranking_forca);
        if (prev.ranking_forca === cur.ranking_forca) {
          expect(prev.nome <= cur.nome).toBe(true);
        }
      }
    }
  });

  it('elite bypass has exactly 13 clubs, the highest ranked overall', () => {
    expect(seeded.eliteBypass).toHaveLength(13);
    const allRanks = getLeagues().flatMap((l) => l.clubes).map((c) => c.ranking_forca);
    const thirteenth = allRanks.sort((a, b) => b - a)[12];
    for (const b of seeded.eliteBypass) {
      expect(b.ranking_forca).toBeGreaterThanOrEqual(thirteenth);
    }
  });
});
