import { describe, it, expect } from 'vitest';
import { simulateSeason } from '../../src/sim/run.js';

describe('simulateSeason', () => {
  const season = simulateSeason(0);

  it('returns all top-level sections', () => {
    for (const key of [
      'seed', 'meta', 'ligasRegionais', 'copaCampeoes', 'copaBrasil',
      'conmebol', 'perfisDashboard', 'calendariosPorClube', 'matchesGeral', 'clubes'
    ]) {
      expect(season).toHaveProperty(key);
    }
  });

  it('carries the seed', () => {
    expect(season.seed).toBe(0);
  });

  it('meta has the expected constants', () => {
    expect(season.meta.totalClubes).toBe(192);
    expect(season.meta.tetoJogos).toBe(60);
    expect(season.meta.semanasUtilizaveis).toBe(42);
  });

  it('is deterministic under the same seed', () => {
    const a = simulateSeason(0);
    const b = simulateSeason(0);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('produces exactly 192 clube entries', () => {
    expect(season.clubes).toHaveLength(192);
  });
});
