import { describe, it, expect } from 'vitest';
import { getSleepingGiants } from '../../src/data/attendance.js';

describe('sleeping giants', () => {
  it('has exactly 11 clubs', () => {
    expect(getSleepingGiants()).toHaveLength(11);
  });

  it('each entry has the required shape', () => {
    for (const g of getSleepingGiants()) {
      expect(g).toHaveProperty('nome');
      expect(g).toHaveProperty('estado');
      expect(g).toHaveProperty('liga');
      expect(g).toHaveProperty('mediaPublico');
      expect(g).toHaveProperty('divisaoAtual');
      expect(typeof g.mediaPublico).toBe('number');
      expect(g.mediaPublico).toBeGreaterThan(1000);
    }
  });

  it('skews Norte/Nordeste (>= 7 of 11 are those regions)', () => {
    const count = getSleepingGiants().filter(
      (g) => g.liga === 'Liga Norte' || g.liga === 'Liga Nordeste'
    ).length;
    expect(count).toBeGreaterThanOrEqual(7);
  });
});
